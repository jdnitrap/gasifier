import { computeDesign } from "./compute.js";
import { getInput } from "./form.js";
import { NOZ_V } from "./fuels.js";
import { $id } from "./util.js";

export function metric(label, val, unit, cls) {
  return `<div class="metric ${cls || ""}"><div class="m-label">${label}</div><div class="m-val">${val}</div><div class="m-unit">${unit || ""}</div></div>`;
}

export function render() {
  const d = computeDesign(getInput());
  $id("hpVal").textContent = d.inp.targetHp;
  $id("opHoursVal").textContent = d.inp.hours;
  $id("hours").value = d.inp.hours;
  $id("hoursVal").textContent = d.inp.hours;
  $id("blendVal").textContent = d.inp.blendPct;
  $id("moistVal").textContent = d.inp.moisture;
  $id("sizeVal").textContent = d.inp.psizeMm;
  $id("erVal").textContent = d.inp.er.toFixed(2);
  $id("maxDiaVal").textContent = d.inp.maxReactorIn || "—";
  $id("fuelNote").textContent = d.fuel.note;
  $id("totalFuelVal").textContent = d.sizes.total;
  $id("feedVal").textContent = d.sizes.feed;

  const g = d.gas, s = d.sizes, e = d.engine;
  $id("metrics").innerHTML =
    metric("Gas flow", s.scfm, "scfm", "accent") +
    metric("LHV", Math.round(g.LHV), "Btu/scf") +
    metric("Energy", Math.round((s.scfh * g.LHV) / 1000), "kBtu/h") +
    metric("Est. tar", g.tar, "mg/Nm³", g.tar > 150 ? "red" : g.tar > 100 ? "orange" : "") +
    metric("Shaft power", e.shaft, "hp", "accent") +
    metric("Electric (est.)", e.elec, "kW") +
    metric("H₂", g.H2.toFixed(1), "%") +
    metric("CO", g.CO.toFixed(1), "%") +
    metric("Cold-gas η", `${Math.round(d.efficiency.real.cge * 100)}%`, "this machine", "accent") +
    metric("vs ideal", `${Math.round(d.efficiency.ofIdeal)}%`, "overall");

  $id("compBars").innerHTML = `<div class="comp-bar">
    <div class="comp-seg" style="width:${g.H2}%;background:#ece7d8">H₂</div>
    <div class="comp-seg" style="width:${g.CO}%;background:#c9a227">CO</div>
    <div class="comp-seg" style="width:${g.CH4}%;background:#8aaa6e">CH₄</div>
    <div class="comp-seg" style="width:${g.CO2}%;background:#9a937f">CO₂</div>
    <div class="comp-seg" style="width:${g.N2}%;background:#3a4030;color:#ece7d8">N₂</div></div>`;
  $id("status").innerHTML =
    d.warnings.map((w) => `<div class="warn">${w}</div>`).join("") +
    d.oks.map((w) => `<div class="ok">${w}</div>`).join("");

  const ef = d.efficiency, R = ef.real, I = ef.ideal;
  $id("effNote").textContent = ef.note;
  $id("effBarLabel").textContent = `This machine is ${Math.round(ef.ofIdeal)}% of an ideal unit on the same fuel`;
  $id("effBarVal").textContent = `${Math.round(ef.ofIdeal)}%`;
  $id("effBar").style.width = `${Math.max(4, Math.min(100, ef.ofIdeal))}%`;
  const side = (x) =>
    metric("Cold-gas η", `${(x.cge * 100).toFixed(1)}%`, "", "accent") +
    metric("Hot-gas η", `${(x.hge * 100).toFixed(1)}%`) +
    metric("Overall η", `${(x.overall * 100).toFixed(1)}%`, "", "accent") +
    metric("LHV", Math.round(x.lhv), "Btu/scf") +
    metric("Feed", x.feed.toFixed(1), "lb/h dry") +
    metric("Tar", x.tar, "mg/Nm³", x.tar > 150 ? "red" : "");
  $id("effReal").innerHTML = side(R);
  $id("effIdeal").innerHTML = side(I);
  $id("effRealMeta").textContent = `${R.family} · ${R.moisture}% moisture · ER ${R.er.toFixed(2)} · wall loss ${(R.wall * 100).toFixed(0)}%`;
  $id("effIdealMeta").textContent = `${I.family} · 12% moisture · ER 0.30 · insulated · matched engine`;
  $id("effTotals").innerHTML =
    metric("Fuel LHV", Math.round(ef.flhv), "Btu/lb dry") +
    metric("Fuel energy", Math.round(ef.fuelEnergy / 1000), "kBtu/h in") +
    metric("Gas energy", Math.round(ef.gasEnergy / 1000), "kBtu/h out") +
    metric("Extra wood vs ideal", ef.woodExtra.toFixed(1), "lb/h", ef.woodExtra > 2 ? "orange" : "");
  $id("effLosses").innerHTML = ef.losses
    .map((l) => `<li><b>${l.name}</b> <span class="val">−${l.points} pt</span> — ${l.note}</li>`)
    .join("");

  $id("familyReason").textContent = s.reason;
  $id("familyName").textContent = s.family.toUpperCase();
  $id("svgHop").textContent = `Hopper ${s.hopDia}" · ${s.hopHin}"`;
  $id("svgThroat").textContent = `${s.family === "imbert" ? "Throat " : "Bed "}${s.throatDia}"`;
  $id("svgRed").textContent = `Reduction ${s.redH}"`;
  $id("svgAsh").textContent = `Grate · ash ${s.ash}"`;
  $id("svgPipe").textContent = `Gas ${s.pipeId}"`;
  $id("svgShell").textContent = `Shell ${s.reactorId}" ID × ${s.recH}"`;

  const noz = s.nNoz
    ? metric("Nozzles", s.nNoz, `× ${s.nDia} in`, "accent") + metric("Nozzle vel.", NOZ_V, "ft/s")
    : metric("Air entry", "Open / top", "no nozzle ring");
  $id("sizeMetrics").innerHTML =
    metric(s.family === "imbert" ? "Throat dia" : "Bed ID", s.throatDia, "in", "accent") +
    metric(s.family === "imbert" ? "Throat area" : "Bed area", s.throatArea, "in²") +
    metric("Reactor ID", s.reactorId, "in", "accent") + metric("Reactor height", s.recH, "in") +
    metric("Reduction", s.redH, "in") + metric("Hopper ID", s.hopDia, "in") +
    metric("Hopper height", s.hopHin, "in") + metric("Hopper vol", s.hopVol, "ft³") +
    metric("Feed rate", s.feed, "lb/h dry") + metric("Fuel for run", s.total, "lb dry") +
    metric("Air", s.airCfm, "cfm") + metric("Gas pipe ID", s.pipeId, "in") +
    noz + metric("Grate area", s.grate, "in²") + metric("Ash pit", s.ash, "in") +
    metric("Hearth load", s.Bg, "scf/h·in²") + metric("SV (Reed)", s.svMs, "m/s");

  $id("coolMetrics").innerHTML =
    metric("Cooler duty", d.cooling.duty.toLocaleString(), "Btu/h", "accent") +
    metric("Condensate", d.cooling.cond, "lb/h") +
    metric("Gas pipe", s.pipeId, "in ID @ ~22 ft/s");
  $id("coolStages").innerHTML =
    "<li><b>Cyclone / drop-out</b> — knock char dust before the cooler.</li>" +
    "<li><b>Gas cooler / radiator</b> — drop gas toward ambient so tars condense.</li>" +
    "<li><b>Condensate trap</b> — drain water and oils away from the mixer.</li>" +
    "<li><b>Fine filter</b> — cloth, foam, or packed media for engines.</li>";

  $id("engMetrics").innerHTML =
    metric("Mixture airflow", e.mixCfm, "cfm @ VE 0.8") +
    metric("Gas engine can take", e.gasEng, "cfm") +
    metric("Gasifier output", s.scfm, "scfm", "accent") +
    metric("Wood-gas shaft", e.shaft, "hp") +
    metric("Gasoline (rough)", e.gaso, "hp") +
    metric("Derate", `${e.derate}%`, "vs gasoline", "orange");
  $id("engNote").textContent = `${d.inp.dispCi} cu in @ ${d.inp.rpm} rpm. ${e.note}`;
  $id("bomList").innerHTML =
    "<li>Hot zone: stainless or thick mild with liner. Outer shell can be mild steel.</li>" +
    "<li>Insulate oxidation/reduction. Cold walls make tar.</li>" +
    "<li>Spring-loaded lid or relief — never a rigid sealed drum.</li>" +
    `<li>Target shell near ${s.reactorId}" ID. Hopper near ${s.hopDia}" ID.</li>` +
    (s.nNoz ? `<li>Nozzles: ${s.nNoz} of ${s.nDia}" ID, aimed at the throat, ~${NOZ_V} ft/s.</li>` : "") +
    "<li>Seals, condensate drains with traps, CO alarm, outdoor placement.</li>" +
    "<li>Thermocouple at reduction and after cooler. U-tube manometer on the gas line.</li>";
  $id("guideList").innerHTML = d.guidance.map((x) => `<li>${x}</li>`).join("");
  window._lastDesign = d;
  return d;
}
