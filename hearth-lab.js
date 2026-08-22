const FUELS = {
  hardwood: { name:"Hardwood (oak, hickory, maple)", yield:38, tarF:0.85, C:0.50, H:0.06, O:0.44, ash:0.008, bulk:18, note:"Most stable, lower-tar gas for engines. Keep blocky and dry.", family:"imbert" },
  softwood: { name:"Softwood (pine, fir)", yield:36, tarF:1.15, C:0.51, H:0.06, O:0.43, ash:0.006, bulk:14, note:"Higher resin/tar tendency. Dry well and keep particle size uniform.", family:"imbert" },
  chips: { name:"Wood chips", yield:37, tarF:1.0, C:0.50, H:0.06, O:0.44, ash:0.01, bulk:16, note:"Good all-rounder if screened uniform. Stratified (FEMA-style) feeds well.", family:"fema" },
  charcoal: { name:"Charcoal", yield:45, tarF:0.25, C:0.85, H:0.03, O:0.12, ash:0.03, bulk:20, note:"Very clean, high LHV, low tar. Smaller hopper for the same energy.", family:"imbert" },
  corn: { name:"Corn cobs", yield:32, tarF:1.3, C:0.47, H:0.06, O:0.47, ash:0.025, bulk:12, note:"Higher ash — grate and ash pit matter. Watch clinkers.", family:"fema" },
  pellets: { name:"Wood pellets", yield:37, tarF:0.95, C:0.50, H:0.06, O:0.44, ash:0.008, bulk:40, note:"Consistent size and dense. Bridging is rare; swelling if they get wet.", family:"fema" },
  sawdust: { name:"Sawdust / fines", yield:34, tarF:1.4, C:0.49, H:0.06, O:0.45, ash:0.012, bulk:12, note:"Needs Missouri-style / open-core design. Imbert throats bridge and tar.", family:"missouri" }
};
const HEARTH = { conservative:0.7, typical:1, higher:1.35, max:1.7 };
const FAMILY_FLOW = {
  imbert: { typicalSv:1.25, minSv:0.5, maxSv:2.5, constriction:2 },
  fema: { typicalSv:0.22, minSv:0.08, maxSv:0.5, constriction:1 },
  missouri: { typicalSv:0.18, minSv:0.07, maxSv:0.4, constriction:1 },
  updraft: { typicalSv:0.12, minSv:0.05, maxSv:0.3, constriction:1 }
};
const PI = Math.PI, AIR=0.0765, BTU_HP=2545, ENG_EFF=0.22, GEN_EFF=0.85, NOZ_V=108, PIPE_V=22, SV_PER_BG=0.012192;

function clamp(n,a,b){ return Math.min(b, Math.max(a,n)); }
function rnd(n,d){ const p=10**d; return Math.round(n*p)/p; }
function $id(id){ return document.getElementById(id); }

function getInput(){
  return {
    endUse: $id("endUse").value, targetHp: +$id("targetHp").value, hours: +$id("opHours").value,
    fuel1: $id("fuel1").value, fuel2: $id("fuel2").value, blendPct: +$id("blend").value,
    moisture: +$id("moisture").value, psizeMm: +$id("psize").value, er: +$id("er").value,
    hearthBand: $id("hearthBand").value, familyOverride: $id("familyOverride").value,
    dispCi: +$id("disp").value, rpm: +$id("rpm").value, maxReactorIn: +$id("maxReactorIn").value
  };
}

function blendFuel(inp){
  const f1 = FUELS[inp.fuel1];
  const frac = inp.fuel2==="none" ? 0 : inp.blendPct/100;
  if(!frac) return Object.assign({}, f1);
  const f2 = FUELS[inp.fuel2];
  const mix=(a,b)=>a*(1-frac)+b*frac;
  return {
    name: f1.name+" + "+f2.name, yield:mix(f1.yield,f2.yield), tarF:mix(f1.tarF,f2.tarF),
    C:mix(f1.C,f2.C), H:mix(f1.H,f2.H), O:mix(f1.O,f2.O), ash:mix(f1.ash,f2.ash),
    bulk:mix(f1.bulk,f2.bulk), note:"Blended fuel. Size for the worse of the two.",
    family: f1.tarF>=f2.tarF ? f1.family : f2.family
  };
}

function pickFamily(fuel, inp){
  if(inp.familyOverride!=="auto") return { family: inp.familyOverride, reason:"You overrode the geometry family." };
  if(inp.endUse==="heat") return { family:"updraft", reason:"Heat-only duty: updraft is simpler and burns tar in the flame." };
  if(fuel.family==="missouri" || inp.psizeMm<12) return { family:"missouri", reason:"Fines / sawdust need open-core or Missouri-style geometry." };
  if(fuel.family==="fema" || (inp.psizeMm>8 && inp.psizeMm<35)) return { family:"fema", reason:"Chips and mid-size fuel feed a stratified bed more reliably." };
  return { family:"imbert", reason:"Blocky dry fuel: constricted Imbert hearth cracks tars." };
}

function gasComp(fuel, moist, ER, family, tHours, walk, startupMid){
  let H2=16+fuel.H*80-moist*0.15, CO=20+fuel.C*15-moist*0.25, CH4=2.5-(ER-0.25)*4, CO2=11+moist*0.2, N2=48;
  if(ER<0.25){ H2+=2; CO+=1; CO2-=1; }
  if(ER>0.35){ H2-=3; CO-=2; CO2+=2; N2+=2; }
  if(moist>20){ H2+=1; CO-=2; CO2+=2; }
  if(family==="updraft"){ CH4+=1.5; CO-=2; H2-=1; }
  if(family==="fema"){ CO-=1; H2-=0.5; }
  const mid = startupMid==null ? 0.28 : startupMid;
  const su = tHours===undefined ? 1 : 1/(1+Math.exp(-8*(tHours-mid)));
  H2*=0.4+0.6*su; CO*=0.45+0.55*su; CH4*=su; CO2+=(1-su)*8;
  if(walk){ H2+=walk.h2; CO+=walk.co; }
  H2=Math.max(3,H2); CO=Math.max(5,CO); CH4=Math.max(0.3,CH4); CO2=Math.max(4,CO2);
  const sum=H2+CO+CH4+CO2+N2;
  H2=H2*100/sum; CO=CO*100/sum; CH4=CH4*100/sum; CO2=CO2*100/sum; N2=100-(H2+CO+CH4+CO2);
  let LHV=(H2*275+CO*320+CH4*910)/100; if(walk) LHV+=walk.lhv;
  let tar=100*fuel.tarF;
  if(moist>20) tar*=1.5; if(moist>30) tar*=1.4;
  if(family==="updraft") tar*=3; if(family==="fema") tar*=1.4;
  if(ER<0.22||ER>0.4) tar*=1.6;
  if(tHours!==undefined){
    tar*=1+1.4*Math.exp(-tHours/0.22);
    if(walk) tar+=walk.tar;
    if(tHours>2) tar*=1+Math.min(0.12,(tHours-2)*0.008);
  }
  return { H2, CO, CH4, CO2, N2, LHV, tar: Math.round(Math.max(20,tar)) };
}

function fuelLhv(fuel){
  const hhv=14544*fuel.C+62028*(fuel.H-fuel.O/8);
  return Math.max(4000, hhv-9720*fuel.H);
}
function yieldOf(fuel, moist){ return fuel.yield*(1-Math.max(0,moist-12)*0.012); }
function heatLossFor(family, moisture, er, ideal){
  if(ideal) return 0.02;
  let x=0.08;
  if(family==="fema"||family==="missouri") x+=0.03;
  if(family==="updraft") x+=0.02;
  if(moisture>20) x+=0.03;
  if(er<0.24||er>0.36) x+=0.02;
  return Math.min(0.22,x);
}
function packSide(label, fuel, family, moisture, er, targetHp, endUse, ideal){
  const gas=gasComp(fuel, moisture, er, family);
  const yld=Math.max(25, yieldOf(fuel, moisture));
  const flhv=fuelLhv(fuel);
  const wall=heatLossFor(family, moisture, er, ideal);
  const cge=((yld*gas.LHV)/flhv)*(1-wall);
  const tHot=ideal?1380:1200;
  const hge=Math.min(0.92, cge+(yld*0.075*0.28*Math.max(0,tHot-70))/flhv);
  const conv=endUse==="heat"?(ideal?0.90:0.78):(ideal?0.24:0.22);
  const overall=(endUse==="heat"?hge:cge)*conv;
  const scfh=(targetHp*BTU_HP/conv)/Math.max(80,gas.LHV);
  return { label, family, moisture, er, lhv:gas.LHV, tar:gas.tar, yld, feed:scfh/yld, cge, hge, overall, wall };
}
function computeEfficiency(inp, fuel, family, fit){
  const idealFam=inp.endUse==="heat"?"updraft":"imbert";
  const real=packSide("This machine", fuel, family, inp.moisture, inp.er, inp.targetHp, inp.endUse, false);
  const ideal=packSide("Ideal machine", fuel, idealFam, 12, 0.30, inp.targetHp, inp.endUse, true);
  if(inp.endUse!=="heat" && fit==="undersized") real.overall*=0.85;
  if(inp.endUse!=="heat" && fit==="oversized") real.overall*=0.92;
  const ofIdeal=(real.overall/Math.max(0.04,ideal.overall))*100;
  const flhv=fuelLhv(fuel);
  const losses=[];
  const moistPts=(packSide("d",fuel,family,12,inp.er,inp.targetHp,inp.endUse,false).cge-real.cge)*100;
  if(moistPts>0.4) losses.push({name:"Moisture", points:moistPts.toFixed(1), note:inp.moisture+"% wb vs 12%. Steam steals hearth heat."});
  const famPts=(packSide("d",fuel,idealFam,inp.moisture,inp.er,inp.targetHp,inp.endUse,false).cge-real.cge)*100;
  if(famPts>0.4) losses.push({name:"Geometry", points:famPts.toFixed(1), note:family+" vs insulated "+idealFam+"."});
  const erPts=(packSide("d",fuel,family,inp.moisture,0.30,inp.targetHp,inp.endUse,false).cge-real.cge)*100;
  if(Math.abs(erPts)>0.4) losses.push({name:"Equivalence ratio", points:Math.abs(erPts).toFixed(1), note:"ER "+inp.er.toFixed(2)+" vs 0.30."});
  losses.push({name:"Walls, leaks, DIY heat loss", points:(real.wall*100-2).toFixed(1), note:"Ideal ~2% wall loss. Home-built typically 8–14% unless the hot zone is insulated."});
  if(inp.endUse!=="heat") losses.push({name:"Engine conversion", points:((ideal.overall-real.overall)*100).toFixed(1), note:"Ideal SI ~24% thermal. Real 22% plus mismatch."});
  return {
    flhv, real, ideal, ofIdeal,
    fuelEnergy: real.feed*flhv,
    gasEnergy: real.feed*real.yld*real.lhv*(1-real.wall),
    woodExtra: Math.max(0, real.feed-ideal.feed),
    losses: losses.filter(function(l){ return +l.points>0.2; }),
    note: inp.endUse==="heat"
      ? "Heat overall = hot-gas efficiency × burner. Ideal is an insulated updraft firing the tar."
      : "Cold-gas efficiency = gas energy / dry-fuel LHV. Overall = CGE × engine. Ideal is dry fuel, ER 0.30, insulated Imbert, matched engine."
  };
}

function fuelFactor(left, start){
  if(start<=0) return 0;
  const frac=left/start;
  if(frac>0.12) return 1;
  const x=frac/0.12;
  return Math.max(0, x*x*(3-2*x));
}

function compute(){
  const inp=getInput();
  const fuel=blendFuel(inp);
  const {family, reason}=pickFamily(fuel, inp);
  const gas=gasComp(fuel, inp.moisture, inp.er, family);
  const yld=Math.max(25, fuel.yield*(1-Math.max(0,inp.moisture-12)*0.012));
  const flow=FAMILY_FLOW[family];
  const targetSv=flow.typicalSv*HEARTH[inp.hearthBand];
  const Bg=targetSv/SV_PER_BG;
  const thermal= inp.endUse==="heat" ? 0.65 : ENG_EFF;
  const scfh=(inp.targetHp*BTU_HP/thermal)/Math.max(80,gas.LHV);
  const scfm=scfh/60;
  const feed=scfh/yld;
  const total=feed*inp.hours;
  let throatArea=scfh/Bg;
  let throatDia=Math.sqrt(4*throatArea/PI);
  let reactorId=Math.max(throatDia*flow.constriction, family==="imbert"?5:6);
  if(inp.maxReactorIn>0 && reactorId>inp.maxReactorIn){
    reactorId=inp.maxReactorIn;
    throatDia=Math.max(1.25, reactorId/flow.constriction);
    throatArea=PI*throatDia*throatDia/4;
  }
  const svMs=rnd((scfh/Math.max(0.5,throatArea))*SV_PER_BG,3);
  const redH=Math.max(8, throatDia*1.15);
  const oxH=Math.max(6, throatDia*0.9);
  const hopVol=(total/Math.max(8,fuel.bulk))*1.15;
  let hopDia=Math.max(reactorId+1,8);
  let hopHft=hopVol/Math.max(0.2, PI*(hopDia/24)**2);
  if(hopHft>5){
    hopDia=Math.min(36, hopDia*Math.sqrt(hopHft/4));
    hopHft=hopVol/(PI*(hopDia/24)**2);
  }
  const recH=oxH+redH+8;
  const afr=((fuel.C/12+fuel.H/4-fuel.O/32)*32)/0.232;
  const airLb=feed*afr*inp.er;
  const airCfm=airLb/AIR/60;
  let nNoz=clamp(Math.round(throatDia/1.35)+2,4,12);
  if(family==="fema"||family==="missouri"||family==="updraft") nNoz=0;
  const nArea=nNoz>0?(airCfm/60)*144/NOZ_V:0;
  const nDia=nNoz>0?Math.sqrt(4*(nArea/nNoz)/PI):0;
  const pipeId=Math.max(1.25, Math.sqrt(4*((scfm*1.15)/60)*144/PI/PIPE_V));
  const grate=Math.max(throatArea*1.1, PI*(reactorId*0.45)**2);
  const ash=Math.max(4, 2+fuel.ash*400);
  const hearthLoad=rnd(scfh/Math.max(0.5,throatArea),1);
  const sizes={
    family, reason, throatDia:rnd(throatDia,2), throatArea:rnd(throatArea,1),
    reactorId:rnd(reactorId,1), recH:rnd(recH,0), redH:rnd(redH,1),
    hopDia:rnd(hopDia,1), hopHin:rnd(hopHft*12,0), hopVol:rnd(hopVol,2),
    nNoz, nDia:rnd(nDia,3), nArea:rnd(nArea,3), grate:rnd(grate,1), ash:rnd(ash,0),
    airCfm:rnd(airCfm,2), scfm:rnd(scfm,2), scfh:rnd(scfh,0), feed:rnd(feed,2),
    total:rnd(total,1), Bg:hearthLoad, svMs, pipeId:rnd(pipeId,2)
  };
  const mixCfm=(inp.dispCi/1728)*(inp.rpm/2)*0.8;
  const gasEng=mixCfm*0.48;
  const shaft=(scfm*gas.LHV*60*ENG_EFF)/BTU_HP;
  const gaso=(inp.dispCi*inp.rpm*110)/792000;
  const derate=gaso>0?(1-shaft/gaso)*100:35;
  let fit="matched";
  if(gasEng<scfm*0.75) fit="undersized";
  if(gasEng>scfm*1.45) fit="oversized";
  const engine={
    mixCfm:rnd(mixCfm,1), gasEng:rnd(gasEng,1), shaft:rnd(shaft,1),
    elec:rnd(shaft*0.746*GEN_EFF,2), gaso:rnd(gaso,1), derate:rnd(clamp(derate,15,55),0), fit,
    note: fit==="undersized" ? "Engine cannot ingest this gas. Drop target power or raise displacement/RPM."
        : fit==="oversized" ? "Engine is larger than the gasifier — part-throttle or over-suck (tar risk)."
        : "Engine airflow and gasifier output are in the same band."
  };
  const moistFrac=clamp(inp.moisture/100,0,0.45);
  const waterFromFuel=feed*(moistFrac/Math.max(0.55,1-moistFrac));
  const cooling={
    duty:rnd(scfh*AIR*0.26*600,0),
    cond:rnd(waterFromFuel*0.65+feed*0.06,2)
  };
  const warnings=[], oks=[], guidance=[];
  if(inp.moisture>20) warnings.push("Moisture >20% wb raises tar and cuts heating value. Dry fuel first.");
  if(gas.tar>150 && inp.endUse!=="heat") warnings.push("Estimated tar is high for engines. Prefer dry hardwood/charcoal, Imbert, insulation.");
  if(inp.psizeMm<10 && family==="imbert") warnings.push("Fines in an Imbert throat bridge. Screen fuel or switch to Missouri.");
  if(inp.psizeMm>80) warnings.push("Chunks this large leave voids. Split toward 1–3 in (25–80 mm).");
  if(inp.er<0.22||inp.er>0.38) warnings.push("ER outside 0.22–0.38 usually means tar (too rich) or weak gas (too lean).");
  if(svMs<flow.minSv && inp.endUse!=="heat") warnings.push("Superficial velocity "+svMs.toFixed(2)+" m/s is low for "+family+". Raise hearth load or shrink the throat.");
  if(svMs>flow.maxSv) warnings.push("Superficial velocity "+svMs.toFixed(2)+" m/s is above "+family+" max ~"+flow.maxSv+" m/s.");
  if(inp.maxReactorIn>0 && sizes.reactorId>=inp.maxReactorIn-0.05) warnings.push("Hit max reactor diameter. Capacity is limited by that shell.");
  if(fit!=="matched" && inp.endUse!=="heat") warnings.push(engine.note);
  if(gas.tar<=120 && inp.moisture<=20) oks.push("Numbers look reasonable for a well-insulated unit on this fuel.");
  guidance.push("Narrowest hot area = required gas flow ÷ family hearth load. The duty sets the steel.");
  guidance.push(family==="imbert"
    ? "Imbert load is at the constriction (Gengas Bhmax 0.9 Nm³/h·cm² ≈ 2.5 m/s). Nozzle plane ~2× throat."
    : "Stratified / open-core load is across the whole bed (Reed ~0.1–0.3 m/s).");
  guidance.push("Expect 25–40% engine derate vs gasoline. Insulation is the cheapest tar control.");
  if(family==="imbert") guidance.push("Aim nozzles at the throat. Reduction zone ≥ 8 in. Spring lid as a relief.");
  if(family==="fema") guidance.push("Stratified bed: air from the top, no tight nozzle ring.");
  const efficiency=computeEfficiency(inp, fuel, family, fit);
  return { inp, fuel, gas, sizes, engine, cooling, efficiency, warnings, oks, guidance };
}

function metric(label, val, unit, cls){
  return '<div class="metric '+(cls||'')+'"><div class="m-label">'+label+'</div><div class="m-val">'+val+'</div><div class="m-unit">'+(unit||'')+'</div></div>';
}

function render(){
  const d=compute();
  $id("hpVal").textContent=d.inp.targetHp;
  $id("opHoursVal").textContent=d.inp.hours;
  $id("hours").value=d.inp.hours;
  $id("hoursVal").textContent=d.inp.hours;
  $id("blendVal").textContent=d.inp.blendPct;
  $id("moistVal").textContent=d.inp.moisture;
  $id("sizeVal").textContent=d.inp.psizeMm;
  $id("erVal").textContent=d.inp.er.toFixed(2);
  $id("maxDiaVal").textContent=d.inp.maxReactorIn||"—";
  $id("fuelNote").textContent=d.fuel.note;
  $id("totalFuelVal").textContent=d.sizes.total;
  $id("feedVal").textContent=d.sizes.feed;
  const g=d.gas, s=d.sizes, e=d.engine;
  $id("metrics").innerHTML=
    metric("Gas flow", s.scfm, "scfm", "accent")+
    metric("LHV", Math.round(g.LHV), "Btu/scf")+
    metric("Energy", Math.round(s.scfh*g.LHV/1000), "kBtu/h")+
    metric("Est. tar", g.tar, "mg/Nm³", g.tar>150?"red":g.tar>100?"orange":"")+
    metric("Shaft power", e.shaft, "hp", "accent")+
    metric("Electric (est.)", e.elec, "kW")+
    metric("H₂", g.H2.toFixed(1), "%")+
    metric("CO", g.CO.toFixed(1), "%")+
    metric("Cold-gas η", Math.round(d.efficiency.real.cge*100)+"%", "this machine", "accent")+
    metric("vs ideal", Math.round(d.efficiency.ofIdeal)+"%", "overall");
  $id("compBars").innerHTML='<div class="comp-bar">'+
    '<div class="comp-seg" style="width:'+g.H2+'%;background:#ece7d8">H₂</div>'+
    '<div class="comp-seg" style="width:'+g.CO+'%;background:#c9a227">CO</div>'+
    '<div class="comp-seg" style="width:'+g.CH4+'%;background:#8aaa6e">CH₄</div>'+
    '<div class="comp-seg" style="width:'+g.CO2+'%;background:#9a937f">CO₂</div>'+
    '<div class="comp-seg" style="width:'+g.N2+'%;background:#3a4030;color:#ece7d8">N₂</div></div>';
  $id("status").innerHTML=d.warnings.map(w=>'<div class="warn">'+w+'</div>').join("")+d.oks.map(w=>'<div class="ok">'+w+'</div>').join("");
  const ef=d.efficiency, R=ef.real, I=ef.ideal;
  $id("effNote").textContent=ef.note;
  $id("effBarLabel").textContent="This machine is "+Math.round(ef.ofIdeal)+"% of an ideal unit on the same fuel";
  $id("effBarVal").textContent=Math.round(ef.ofIdeal)+"%";
  $id("effBar").style.width=Math.max(4, Math.min(100, ef.ofIdeal))+"%";
  function sideMetrics(s){
    return metric("Cold-gas η", (s.cge*100).toFixed(1)+"%", "", "accent")+
      metric("Hot-gas η", (s.hge*100).toFixed(1)+"%")+
      metric("Overall η", (s.overall*100).toFixed(1)+"%", "", "accent")+
      metric("LHV", Math.round(s.lhv), "Btu/scf")+
      metric("Feed", s.feed.toFixed(1), "lb/h dry")+
      metric("Tar", s.tar, "mg/Nm³", s.tar>150?"red":"");
  }
  $id("effReal").innerHTML=sideMetrics(R);
  $id("effIdeal").innerHTML=sideMetrics(I);
  $id("effRealMeta").textContent=R.family+" · "+R.moisture+"% moisture · ER "+R.er.toFixed(2)+" · wall loss "+(R.wall*100).toFixed(0)+"%";
  $id("effIdealMeta").textContent=I.family+" · 12% moisture · ER 0.30 · insulated · matched engine";
  $id("effTotals").innerHTML=
    metric("Fuel LHV", Math.round(ef.flhv), "Btu/lb dry")+
    metric("Fuel energy", Math.round(ef.fuelEnergy/1000), "kBtu/h in")+
    metric("Gas energy", Math.round(ef.gasEnergy/1000), "kBtu/h out")+
    metric("Extra wood vs ideal", ef.woodExtra.toFixed(1), "lb/h", ef.woodExtra>2?"orange":"");
  $id("effLosses").innerHTML=ef.losses.map(function(l){
    return "<li><b>"+l.name+"</b> <span class='val'>−"+l.points+" pt</span> — "+l.note+"</li>";
  }).join("");
  $id("familyReason").textContent=s.reason;
  $id("familyName").textContent=s.family.toUpperCase();
  $id("svgHop").textContent="Hopper "+s.hopDia+'" · '+s.hopHin+'"';
  $id("svgThroat").textContent=(s.family==="imbert"?"Throat ":"Bed ")+s.throatDia+'"';
  $id("svgRed").textContent="Reduction "+s.redH+'"';
  $id("svgAsh").textContent="Grate · ash "+s.ash+'"';
  $id("svgPipe").textContent="Gas "+s.pipeId+'"';
  $id("svgShell").textContent="Shell "+s.reactorId+'" ID × '+s.recH+'"';
  let noz=s.nNoz? metric("Nozzles", s.nNoz, "× "+s.nDia+" in", "accent")+metric("Nozzle vel.", NOZ_V, "ft/s") : metric("Air entry","Open / top","no nozzle ring");
  $id("sizeMetrics").innerHTML=
    metric(s.family==="imbert"?"Throat dia":"Bed ID", s.throatDia, "in", "accent")+
    metric(s.family==="imbert"?"Throat area":"Bed area", s.throatArea, "in²")+
    metric("Reactor ID", s.reactorId, "in", "accent")+metric("Reactor height", s.recH, "in")+
    metric("Reduction", s.redH, "in")+metric("Hopper ID", s.hopDia, "in")+
    metric("Hopper height", s.hopHin, "in")+metric("Hopper vol", s.hopVol, "ft³")+
    metric("Feed rate", s.feed, "lb/h dry")+metric("Fuel for run", s.total, "lb dry")+
    metric("Air", s.airCfm, "cfm")+metric("Gas pipe ID", s.pipeId, "in")+
    noz+metric("Grate area", s.grate, "in²")+metric("Ash pit", s.ash, "in")+
    metric("Hearth load", s.Bg, "scf/h·in²")+metric("SV (Reed)", s.svMs, "m/s");
  $id("coolMetrics").innerHTML=
    metric("Cooler duty", d.cooling.duty.toLocaleString(), "Btu/h", "accent")+
    metric("Condensate", d.cooling.cond, "lb/h")+
    metric("Gas pipe", s.pipeId, "in ID @ ~22 ft/s");
  $id("coolStages").innerHTML=
    "<li><b>Cyclone / drop-out</b> — knock char dust before the cooler.</li>"+
    "<li><b>Gas cooler / radiator</b> — drop gas toward ambient so tars condense.</li>"+
    "<li><b>Condensate trap</b> — drain water and oils away from the mixer.</li>"+
    "<li><b>Fine filter</b> — cloth, foam, or packed media for engines.</li>";
  $id("engMetrics").innerHTML=
    metric("Mixture airflow", e.mixCfm, "cfm @ VE 0.8")+
    metric("Gas engine can take", e.gasEng, "cfm")+
    metric("Gasifier output", s.scfm, "scfm", "accent")+
    metric("Wood-gas shaft", e.shaft, "hp")+
    metric("Gasoline (rough)", e.gaso, "hp")+
    metric("Derate", e.derate+"%", "vs gasoline", "orange");
  $id("engNote").textContent=d.inp.dispCi+" cu in @ "+d.inp.rpm+" rpm. "+e.note;
  $id("bomList").innerHTML=
    "<li>Hot zone: stainless or thick mild with liner. Outer shell can be mild steel.</li>"+
    "<li>Insulate oxidation/reduction. Cold walls make tar.</li>"+
    "<li>Spring-loaded lid or relief — never a rigid sealed drum.</li>"+
    "<li>Target shell near "+s.reactorId+"\" ID. Hopper near "+s.hopDia+"\" ID.</li>"+
    (s.nNoz? "<li>Nozzles: "+s.nNoz+" of "+s.nDia+"\" ID, aimed at the throat, ~"+NOZ_V+" ft/s.</li>":"")+
    "<li>Seals, condensate drains with traps, CO alarm, outdoor placement.</li>"+
    "<li>Thermocouple at reduction and after cooler. U-tube manometer on the gas line.</li>";
  $id("guideList").innerHTML=d.guidance.map(function(x){ return "<li>"+x+"</li>"; }).join("");
  window._lastDesign=d;
}

const zoomOpts={ pan:{enabled:true,mode:"x"}, zoom:{wheel:{enabled:true},pinch:{enabled:true},mode:"x"} };
let trendCharts={};
let sim={ running:false, timer:null, t:0, history:[], maxT:0, stepMin:10, fuelLeft:0, fuelStart:0, feed:8, walk:{h2:0,co:0,tar:0,lhv:0} };

function makeLine(id, label, color, yTitle){
  return new Chart($id(id).getContext("2d"), {
    type:"line",
    data:{ labels:[], datasets:[{ label, data:[], borderColor:color, tension:0.25, pointRadius:0, borderWidth:2 }] },
    options:{ responsive:true, maintainAspectRatio:false,
      scales:{
        x:{ ticks:{color:"#9a937f", maxTicksLimit:8}, grid:{color:"#3a4030"}, title:{display:true,text:"Time (hours)",color:"#9a937f"} },
        y:{ ticks:{color:"#9a937f"}, grid:{color:"#3a4030"}, title:{display:true,text:yTitle,color:"#9a937f"} }
      },
      plugins:{ legend:{labels:{color:"#9a937f"}}, zoom:zoomOpts }
    }
  });
}
function destroyTrends(){ Object.keys(trendCharts).forEach(function(k){ if(trendCharts[k]){ trendCharts[k].destroy(); trendCharts[k]=null; }}); }
function initTrends(){
  destroyTrends();
  trendCharts.fuel=makeLine("trendFuel","Fuel remaining","#8aaa6e","Fuel remaining (lb dry)");
  trendCharts.lhv=makeLine("trendLHV","LHV","#c9a227","LHV (Btu/scf)");
  trendCharts.tar=makeLine("trendTar","Tar","#d08a3a","Tar (mg/Nm³)");
  trendCharts.power=makeLine("trendPower","Shaft power","#ece7d8","Shaft power (hp)");
  trendCharts.comp=new Chart($id("trendComp").getContext("2d"), {
    type:"line",
    data:{ labels:[], datasets:[
      {label:"H₂ %", data:[], borderColor:"#9a937f", tension:0.25, pointRadius:0, borderWidth:2},
      {label:"CO %", data:[], borderColor:"#c9a227", tension:0.25, pointRadius:0, borderWidth:2}
    ]},
    options:{ responsive:true, maintainAspectRatio:false,
      scales:{
        x:{ ticks:{color:"#9a937f", maxTicksLimit:8}, grid:{color:"#3a4030"}, title:{display:true,text:"Time (hours)",color:"#9a937f"} },
        y:{ ticks:{color:"#9a937f"}, grid:{color:"#3a4030"}, title:{display:true,text:"Volume %",color:"#9a937f"} }
      },
      plugins:{ legend:{labels:{color:"#9a937f"}}, zoom:zoomOpts }
    }
  });
  trendCharts.eff=new Chart($id("trendEff").getContext("2d"), {
    type:"line",
    data:{ labels:[], datasets:[
      {label:"CGE real %", data:[], borderColor:"#c9a227", tension:0.25, pointRadius:0, borderWidth:2},
      {label:"CGE ideal %", data:[], borderColor:"#8aaa6e", tension:0.25, pointRadius:0, borderWidth:2, borderDash:[6,4]},
      {label:"Overall real %", data:[], borderColor:"#ece7d8", tension:0.25, pointRadius:0, borderWidth:2},
      {label:"Overall ideal %", data:[], borderColor:"#9a937f", tension:0.25, pointRadius:0, borderWidth:2, borderDash:[6,4]}
    ]},
    options:{ responsive:true, maintainAspectRatio:false,
      scales:{
        x:{ ticks:{color:"#9a937f", maxTicksLimit:8}, grid:{color:"#3a4030"}, title:{display:true,text:"Time (hours)",color:"#9a937f"} },
        y:{ min:0, max:90, ticks:{color:"#9a937f"}, grid:{color:"#3a4030"}, title:{display:true,text:"Efficiency %",color:"#9a937f"} }
      },
      plugins:{ legend:{labels:{color:"#9a937f"}}, zoom:zoomOpts }
    }
  });
  trendCharts.combined=new Chart($id("trendCombined").getContext("2d"), {
    type:"line",
    data:{ labels:[], datasets:[
      {label:"Fuel remaining", data:[], borderColor:"#8aaa6e", tension:0.25, pointRadius:0, borderWidth:2},
      {label:"LHV", data:[], borderColor:"#c9a227", tension:0.25, pointRadius:0, borderWidth:2},
      {label:"Tar (inv)", data:[], borderColor:"#d08a3a", tension:0.25, pointRadius:0, borderWidth:2},
      {label:"Shaft power", data:[], borderColor:"#ece7d8", tension:0.25, pointRadius:0, borderWidth:2},
      {label:"H₂", data:[], borderColor:"#9a937f", tension:0.25, pointRadius:0, borderWidth:2},
      {label:"CO", data:[], borderColor:"#c45c3e", tension:0.25, pointRadius:0, borderWidth:2},
      {label:"CGE real", data:[], borderColor:"#7eb8c9", tension:0.25, pointRadius:0, borderWidth:2}
    ]},
    options:{ responsive:true, maintainAspectRatio:false,
      scales:{
        x:{ ticks:{color:"#9a937f", maxTicksLimit:10}, grid:{color:"#3a4030"}, title:{display:true,text:"Time (hours)",color:"#9a937f"} },
        y:{ min:0, max:100, ticks:{color:"#9a937f"}, grid:{color:"#3a4030"}, title:{display:true,text:"Normalized % of run max",color:"#9a937f"} }
      },
      plugins:{ legend:{labels:{color:"#9a937f"}}, zoom:zoomOpts }
    }
  });
}
function norm(arr){ const m=Math.max.apply(null, arr.concat([1e-9])); return arr.map(function(v){ return v/m*100; }); }
function updateTracker(){
  if(!sim.history.length){ $id("effTracker").innerHTML=""; return; }
  const n=sim.history.length, last=sim.history[n-1];
  const avg=function(k){ return sim.history.reduce(function(s,h){ return s+h[k]; },0)/n; };
  const ofI=last.cgeIdeal>0.1?(last.cgeReal/last.cgeIdeal)*100:0;
  $id("effTracker").innerHTML=
    metric("CGE now (real)", last.cgeReal.toFixed(1)+"%", "", "accent")+
    metric("CGE now (ideal)", last.cgeIdeal.toFixed(1)+"%")+
    metric("Run-average CGE", avg("cgeReal").toFixed(1)+"%", "", "accent")+
    metric("This step vs ideal", ofI.toFixed(0)+"%", "", "orange");
}
function updateTrendCharts(){
  const L=sim.history.map(function(h){ return h.t.toFixed(2); });
  const fuel=sim.history.map(function(h){ return h.fuelLeft; }), lhv=sim.history.map(function(h){ return h.LHV; }), tar=sim.history.map(function(h){ return h.tar; });
  const pow=sim.history.map(function(h){ return h.power; }), h2=sim.history.map(function(h){ return h.H2; }), co=sim.history.map(function(h){ return h.CO; });
  const cgeR=sim.history.map(function(h){ return h.cgeReal; }), cgeI=sim.history.map(function(h){ return h.cgeIdeal; });
  const ovR=sim.history.map(function(h){ return h.overallReal; }), ovI=sim.history.map(function(h){ return h.overallIdeal; });
  trendCharts.fuel.data.labels=L; trendCharts.fuel.data.datasets[0].data=fuel; trendCharts.fuel.update("none");
  trendCharts.lhv.data.labels=L; trendCharts.lhv.data.datasets[0].data=lhv; trendCharts.lhv.update("none");
  trendCharts.tar.data.labels=L; trendCharts.tar.data.datasets[0].data=tar; trendCharts.tar.update("none");
  trendCharts.power.data.labels=L; trendCharts.power.data.datasets[0].data=pow; trendCharts.power.update("none");
  trendCharts.comp.data.labels=L; trendCharts.comp.data.datasets[0].data=h2; trendCharts.comp.data.datasets[1].data=co; trendCharts.comp.update("none");
  trendCharts.eff.data.labels=L;
  trendCharts.eff.data.datasets[0].data=cgeR;
  trendCharts.eff.data.datasets[1].data=cgeI;
  trendCharts.eff.data.datasets[2].data=ovR;
  trendCharts.eff.data.datasets[3].data=ovI;
  trendCharts.eff.update("none");
  const tarMax=Math.max.apply(null, tar.concat([1]));
  trendCharts.combined.data.labels=L;
  trendCharts.combined.data.datasets[0].data=norm(fuel);
  trendCharts.combined.data.datasets[1].data=norm(lhv);
  trendCharts.combined.data.datasets[2].data=tar.map(function(v){ return ((tarMax-v)/tarMax)*100; });
  trendCharts.combined.data.datasets[3].data=norm(pow);
  trendCharts.combined.data.datasets[4].data=norm(h2);
  trendCharts.combined.data.datasets[5].data=norm(co);
  trendCharts.combined.data.datasets[6].data=norm(cgeR);
  trendCharts.combined.update("none");
  updateTracker();
}

function stepTrends(){
  if(!sim.running) return;
  const d=compute();
  const dt=sim.stepMin/60;
  sim.walk.h2=clamp(sim.walk.h2+(Math.random()-0.5)*0.35,-2.5,2.5);
  sim.walk.co=clamp(sim.walk.co+(Math.random()-0.5)*0.3,-2.2,2.2);
  sim.walk.tar=clamp(sim.walk.tar+(Math.random()-0.5)*2.5,-18,18);
  sim.walk.lhv=clamp(sim.walk.lhv+(Math.random()-0.5)*0.8,-6,6);
  const ff=fuelFactor(sim.fuelLeft, sim.fuelStart);
  let gas={H2:0,CO:0,CH4:0,CO2:0,N2:100,LHV:0,tar:0};
  let power=0, cgeReal=0, cgeIdeal=0, overallReal=0, overallIdeal=0;
  if(ff>0.001){
    gas=gasComp(d.fuel, d.inp.moisture, d.inp.er, d.sizes.family, sim.t, sim.walk);
    gas.H2*=ff; gas.CO*=ff; gas.CH4*=ff; gas.LHV*=ff; gas.tar=Math.round(gas.tar*(0.3+0.7*ff));
    const yld=Math.max(25, yieldOf(d.fuel, d.inp.moisture));
    const yldI=Math.max(25, yieldOf(d.fuel, 12));
    const scfm=(sim.feed*yld/60)*ff;
    power=(scfm*gas.LHV*60*ENG_EFF)/BTU_HP;
    const idealFam=d.inp.endUse==="heat"?"updraft":"imbert";
    const gasI=gasComp(d.fuel, 12, 0.30, idealFam, sim.t, {h2:sim.walk.h2*0.25, co:sim.walk.co*0.25, tar:sim.walk.tar*0.2, lhv:sim.walk.lhv*0.25}, 0.12);
    gasI.LHV*=ff;
    const flhv=fuelLhv(d.fuel);
    const wall=heatLossFor(d.sizes.family, d.inp.moisture, d.inp.er, false);
    const wallI=heatLossFor(idealFam, 12, 0.30, true);
    cgeReal=flhv>0?((yld*gas.LHV)/flhv)*(1-wall):0;
    cgeIdeal=flhv>0?((yldI*gasI.LHV)/flhv)*(1-wallI):0;
    overallReal=(d.inp.endUse==="heat"?cgeReal*0.78:cgeReal*0.22);
    overallIdeal=(d.inp.endUse==="heat"?cgeIdeal*0.90:cgeIdeal*0.24);
  }
  sim.history.push({ t:+sim.t.toFixed(2), fuelLeft:+sim.fuelLeft.toFixed(2), LHV:+gas.LHV.toFixed(1), tar:gas.tar, power:+power.toFixed(2), H2:+gas.H2.toFixed(2), CO:+gas.CO.toFixed(2), cgeReal:+(cgeReal*100).toFixed(2), cgeIdeal:+(cgeIdeal*100).toFixed(2), overallReal:+(overallReal*100).toFixed(2), overallIdeal:+(overallIdeal*100).toFixed(2) });
  if(sim.history.length>600) sim.history.shift();
  updateTrendCharts();
  $id("simStatus").textContent="Running… t = "+sim.t.toFixed(2)+" h / "+sim.maxT+" h · Fuel left "+sim.fuelLeft.toFixed(1)+" lb · "+sim.feed+" lb/h";
  sim.fuelLeft=Math.max(0, sim.fuelLeft-sim.feed*dt);
  if(sim.fuelLeft<=0.001){
    sim.history.push({ t:+(sim.t+dt).toFixed(2), fuelLeft:0, LHV:0, tar:0, power:0, H2:0, CO:0, cgeReal:0, cgeIdeal:0, overallReal:0, overallIdeal:0 });
    updateTrendCharts(); stopTrends();
    $id("simStatus").textContent="Fuel exhausted near t = "+(sim.t+dt).toFixed(2)+" h. You can save CSV.";
    return;
  }
  sim.t+=dt;
  if(sim.t>sim.maxT+0.001){
    stopTrends();
    $id("simStatus").textContent="Finished "+sim.maxT+" h. Fuel remaining "+sim.fuelLeft.toFixed(1)+" lb. You can save CSV.";
    return;
  }
  sim.timer=setTimeout(stepTrends, 90);
}

function startTrends(){
  if(sim.running) return;
  resetTrends(false); initTrends();
  const d=compute();
  sim.maxT=+$id("hours").value;
  $id("opHours").value=sim.maxT; $id("opHoursVal").textContent=sim.maxT;
  sim.stepMin=+$id("timestep").value;
  sim.feed=d.sizes.feed;
  sim.t=0; sim.fuelStart=sim.feed*sim.maxT; sim.fuelLeft=sim.fuelStart;
  sim.history=[]; sim.walk={h2:0,co:0,tar:0,lhv:0}; sim.running=true;
  $id("btnStart").disabled=true; $id("btnStop").disabled=false; $id("btnSave").disabled=true;
  $id("simStatus").textContent="Starting with "+sim.fuelLeft.toFixed(1)+" lb at "+sim.feed+" lb/h for "+sim.maxT+" h…";
  stepTrends();
}
function stopTrends(){
  sim.running=false; clearTimeout(sim.timer);
  $id("btnStart").disabled=false; $id("btnStop").disabled=true;
  $id("btnSave").disabled=!(sim.history.length && !sim.running);
  if(sim.t<sim.maxT && sim.fuelLeft>0.001)
    $id("simStatus").textContent="Paused at t = "+sim.t.toFixed(2)+" h. You can save CSV.";
}
function resetTrends(upd){
  stopTrends(); sim.t=0; sim.history=[]; sim.fuelLeft=0; sim.fuelStart=0;
  destroyTrends(); $id("btnSave").disabled=true;
  if(upd!==false) $id("simStatus").textContent="Reset. Ready to start.";
}
function resetZoom(){ Object.values(trendCharts).forEach(function(c){ if(c && c.resetZoom) c.resetZoom(); }); }
function saveData(){
  if(!sim.history.length) return;
  const header="time_h,fuel_remaining_lb,LHV_Btu_per_scf,tar_mg_per_Nm3,shaft_power_hp,H2_pct,CO_pct,cge_real_pct,cge_ideal_pct,overall_real_pct,overall_ideal_pct";
  const rows=sim.history.map(function(h){ return [h.t,h.fuelLeft,h.LHV,h.tar,h.power,h.H2,h.CO,h.cgeReal,h.cgeIdeal,h.overallReal,h.overallIdeal].join(","); });
  const csv=["# Hearth Lab trend export", header].concat(rows).join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="gasifier_trends_"+Date.now()+".csv";
  a.click(); URL.revokeObjectURL(a.href);
  $id("simStatus").textContent="CSV saved ("+sim.history.length+" points).";
}

["endUse","fuel1","fuel2","hearthBand","familyOverride","disp","rpm"].forEach(function(id){ $id(id).addEventListener("change", render); });
["targetHp","opHours","blend","moisture","psize","er","maxReactorIn"].forEach(function(id){ $id(id).addEventListener("input", render); });
$id("hours").addEventListener("input", function(){ $id("hoursVal").textContent=$id("hours").value; $id("opHours").value=$id("hours").value; $id("opHoursVal").textContent=$id("hours").value; render(); });
render();
