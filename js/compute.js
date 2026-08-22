import { AIR, BTU_HP, ENG_EFF, FAMILY_FLOW, GEN_EFF, HEARTH, NOZ_V, PIPE_V, SV_PER_BG } from "./fuels.js";
import { computeEfficiency } from "./efficiency.js";
import { blendFuel, gasComp, pickFamily, stoichAfr, yieldOf } from "./thermo.js";
import { PI, clamp, rnd } from "./util.js";

/** Size the gasifier from a design brief. Physics lives here — UI must not. */
export function computeDesign(inp) {
  const fuel = blendFuel(inp);
  const { family, reason } = pickFamily(fuel, inp);
  const gas = gasComp(fuel, inp.moisture, inp.er, family);
  const yld = Math.max(25, yieldOf(fuel, inp.moisture));
  const flow = FAMILY_FLOW[family];
  const targetSv = flow.typicalSv * HEARTH[inp.hearthBand];
  const Bg = targetSv / SV_PER_BG;
  const thermal = inp.endUse === "heat" ? 0.65 : ENG_EFF;
  const scfh = (inp.targetHp * BTU_HP / thermal) / Math.max(80, gas.LHV);
  const scfm = scfh / 60;
  const feed = scfh / yld;
  const total = feed * inp.hours;

  let throatArea = scfh / Bg;
  let throatDia = Math.sqrt((4 * throatArea) / PI);
  let reactorId = Math.max(throatDia * flow.constriction, family === "imbert" ? 5 : 6);
  if (inp.maxReactorIn > 0 && reactorId > inp.maxReactorIn) {
    reactorId = inp.maxReactorIn;
    throatDia = Math.max(1.25, reactorId / flow.constriction);
    throatArea = (PI * throatDia * throatDia) / 4;
  }

  const svMs = rnd((scfh / Math.max(0.5, throatArea)) * SV_PER_BG, 3);
  const redH = Math.max(8, throatDia * 1.15);
  const oxH = Math.max(6, throatDia * 0.9);
  const hopVol = (total / Math.max(8, fuel.bulk)) * 1.15;
  let hopDia = Math.max(reactorId + 1, 8);
  let hopHft = hopVol / Math.max(0.2, PI * (hopDia / 24) ** 2);
  if (hopHft > 5) {
    hopDia = Math.min(36, hopDia * Math.sqrt(hopHft / 4));
    hopHft = hopVol / (PI * (hopDia / 24) ** 2);
  }
  const recH = oxH + redH + 8;
  const airLb = feed * stoichAfr(fuel) * inp.er;
  const airCfm = airLb / AIR / 60;
  let nNoz = clamp(Math.round(throatDia / 1.35) + 2, 4, 12);
  if (family === "fema" || family === "missouri" || family === "updraft") nNoz = 0;
  const nArea = nNoz > 0 ? ((airCfm / 60) * 144) / NOZ_V : 0;
  const nDia = nNoz > 0 ? Math.sqrt((4 * (nArea / nNoz)) / PI) : 0;
  const pipeId = Math.max(1.25, Math.sqrt((4 * ((scfm * 1.15) / 60) * 144) / PI / PIPE_V));
  const grate = Math.max(throatArea * 1.1, PI * (reactorId * 0.45) ** 2);
  const ash = Math.max(4, 2 + fuel.ash * 400);
  const hearthLoad = rnd(scfh / Math.max(0.5, throatArea), 1);

  const sizes = {
    family, reason,
    throatDia: rnd(throatDia, 2), throatArea: rnd(throatArea, 1),
    reactorId: rnd(reactorId, 1), recH: rnd(recH, 0), redH: rnd(redH, 1),
    hopDia: rnd(hopDia, 1), hopHin: rnd(hopHft * 12, 0), hopVol: rnd(hopVol, 2),
    nNoz, nDia: rnd(nDia, 3), nArea: rnd(nArea, 3), grate: rnd(grate, 1), ash: rnd(ash, 0),
    airCfm: rnd(airCfm, 2), scfm: rnd(scfm, 2), scfh: rnd(scfh, 0), feed: rnd(feed, 2),
    total: rnd(total, 1), Bg: hearthLoad, svMs, pipeId: rnd(pipeId, 2),
  };

  const mixCfm = (inp.dispCi / 1728) * (inp.rpm / 2) * 0.8;
  const gasEng = mixCfm * 0.48;
  const shaft = (scfm * gas.LHV * 60 * ENG_EFF) / BTU_HP;
  const gaso = (inp.dispCi * inp.rpm * 110) / 792000;
  const derate = gaso > 0 ? (1 - shaft / gaso) * 100 : 35;
  let fit = "matched";
  if (gasEng < scfm * 0.75) fit = "undersized";
  if (gasEng > scfm * 1.45) fit = "oversized";
  const engine = {
    mixCfm: rnd(mixCfm, 1), gasEng: rnd(gasEng, 1), shaft: rnd(shaft, 1),
    elec: rnd(shaft * 0.746 * GEN_EFF, 2), gaso: rnd(gaso, 1),
    derate: rnd(clamp(derate, 15, 55), 0), fit,
    note:
      fit === "undersized"
        ? "Engine cannot ingest this gas. Drop target power or raise displacement/RPM."
        : fit === "oversized"
          ? "Engine is larger than the gasifier — part-throttle or over-suck (tar risk)."
          : "Engine airflow and gasifier output are in the same band.",
  };

  const moistFrac = clamp(inp.moisture / 100, 0, 0.45);
  const waterFromFuel = feed * (moistFrac / Math.max(0.55, 1 - moistFrac));
  const cooling = {
    duty: rnd(scfh * AIR * 0.26 * 600, 0),
    cond: rnd(waterFromFuel * 0.65 + feed * 0.06, 2),
  };

  const warnings = [];
  const oks = [];
  const guidance = [];
  if (inp.moisture > 20) warnings.push("Moisture >20% wb raises tar and cuts heating value. Dry fuel first.");
  if (gas.tar > 150 && inp.endUse !== "heat") warnings.push("Estimated tar is high for engines. Prefer dry hardwood/charcoal, Imbert, insulation.");
  if (inp.psizeMm < 10 && family === "imbert") warnings.push("Fines in an Imbert throat bridge. Screen fuel or switch to Missouri.");
  if (inp.psizeMm > 80) warnings.push("Chunks this large leave voids. Split toward 1–3 in (25–80 mm).");
  if (inp.er < 0.22 || inp.er > 0.38) warnings.push("ER outside 0.22–0.38 usually means tar (too rich) or weak gas (too lean).");
  if (svMs < flow.minSv && inp.endUse !== "heat") warnings.push(`Superficial velocity ${svMs.toFixed(2)} m/s is low for ${family}. Raise hearth load or shrink the throat.`);
  if (svMs > flow.maxSv) warnings.push(`Superficial velocity ${svMs.toFixed(2)} m/s is above ${family} max ~${flow.maxSv} m/s.`);
  if (inp.maxReactorIn > 0 && sizes.reactorId >= inp.maxReactorIn - 0.05) warnings.push("Hit max reactor diameter. Capacity is limited by that shell.");
  if (fit !== "matched" && inp.endUse !== "heat") warnings.push(engine.note);
  if (gas.tar <= 120 && inp.moisture <= 20) oks.push("Numbers look reasonable for a well-insulated unit on this fuel.");
  guidance.push("Narrowest hot area = required gas flow ÷ family hearth load. The duty sets the steel.");
  guidance.push(
    family === "imbert"
      ? "Imbert load is at the constriction (Gengas Bhmax 0.9 Nm³/h·cm² ≈ 2.5 m/s). Nozzle plane ~2× throat."
      : "Stratified / open-core load is across the whole bed (Reed ~0.1–0.3 m/s).",
  );
  guidance.push("Expect 25–40% engine derate vs gasoline. Insulation is the cheapest tar control.");
  if (family === "imbert") guidance.push("Aim nozzles at the throat. Reduction zone ≥ 8 in. Spring lid as a relief.");
  if (family === "fema") guidance.push("Stratified bed: air from the top, no tight nozzle ring.");

  return {
    inp, fuel, gas, sizes, engine, cooling,
    efficiency: computeEfficiency(inp, fuel, family, fit),
    warnings, oks, guidance,
  };
}
