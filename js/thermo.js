import { FUELS } from "./fuels.js";

export function blendFuel(inp) {
  const f1 = FUELS[inp.fuel1];
  const frac = inp.fuel2 === "none" ? 0 : inp.blendPct / 100;
  if (!frac) return { ...f1 };
  const f2 = FUELS[inp.fuel2];
  const mix = (a, b) => a * (1 - frac) + b * frac;
  return {
    name: `${f1.name} + ${f2.name}`,
    yield: mix(f1.yield, f2.yield),
    tarF: mix(f1.tarF, f2.tarF),
    C: mix(f1.C, f2.C),
    H: mix(f1.H, f2.H),
    O: mix(f1.O, f2.O),
    ash: mix(f1.ash, f2.ash),
    bulk: mix(f1.bulk, f2.bulk),
    note: "Blended fuel. Size for the worse of the two.",
    family: f1.tarF >= f2.tarF ? f1.family : f2.family,
  };
}

export function pickFamily(fuel, inp) {
  if (inp.familyOverride !== "auto") {
    return { family: inp.familyOverride, reason: "You overrode the geometry family." };
  }
  if (inp.endUse === "heat") {
    return { family: "updraft", reason: "Heat-only duty: updraft is simpler and burns tar in the flame." };
  }
  if (fuel.family === "missouri" || inp.psizeMm < 12) {
    return { family: "missouri", reason: "Fines / sawdust need open-core or Missouri-style geometry." };
  }
  if (fuel.family === "fema" || (inp.psizeMm > 8 && inp.psizeMm < 35)) {
    return { family: "fema", reason: "Chips and mid-size fuel feed a stratified bed more reliably." };
  }
  return { family: "imbert", reason: "Blocky dry fuel: constricted Imbert hearth cracks tars." };
}

export function gasComp(fuel, moist, ER, family, tHours, walk, startupMid) {
  let H2 = 16 + fuel.H * 80 - moist * 0.15;
  let CO = 20 + fuel.C * 15 - moist * 0.25;
  let CH4 = 2.5 - (ER - 0.25) * 4;
  let CO2 = 11 + moist * 0.2;
  let N2 = 48;
  if (ER < 0.25) { H2 += 2; CO += 1; CO2 -= 1; }
  if (ER > 0.35) { H2 -= 3; CO -= 2; CO2 += 2; N2 += 2; }
  if (moist > 20) { H2 += 1; CO -= 2; CO2 += 2; }
  if (family === "updraft") { CH4 += 1.5; CO -= 2; H2 -= 1; }
  if (family === "fema") { CO -= 1; H2 -= 0.5; }
  const mid = startupMid == null ? 0.28 : startupMid;
  const su = tHours === undefined ? 1 : 1 / (1 + Math.exp(-8 * (tHours - mid)));
  H2 *= 0.4 + 0.6 * su;
  CO *= 0.45 + 0.55 * su;
  CH4 *= su;
  CO2 += (1 - su) * 8;
  if (walk) { H2 += walk.h2; CO += walk.co; }
  H2 = Math.max(3, H2);
  CO = Math.max(5, CO);
  CH4 = Math.max(0.3, CH4);
  CO2 = Math.max(4, CO2);
  const sum = H2 + CO + CH4 + CO2 + N2;
  H2 = (H2 * 100) / sum;
  CO = (CO * 100) / sum;
  CH4 = (CH4 * 100) / sum;
  CO2 = (CO2 * 100) / sum;
  N2 = 100 - (H2 + CO + CH4 + CO2);
  let LHV = (H2 * 275 + CO * 320 + CH4 * 910) / 100;
  if (walk) LHV += walk.lhv;
  let tar = 100 * fuel.tarF;
  if (moist > 20) tar *= 1.5;
  if (moist > 30) tar *= 1.4;
  if (family === "updraft") tar *= 3;
  if (family === "fema") tar *= 1.4;
  if (ER < 0.22 || ER > 0.4) tar *= 1.6;
  if (tHours !== undefined) {
    tar *= 1 + 1.4 * Math.exp(-tHours / 0.22);
    if (walk) tar += walk.tar;
    if (tHours > 2) tar *= 1 + Math.min(0.12, (tHours - 2) * 0.008);
  }
  return { H2, CO, CH4, CO2, N2, LHV, tar: Math.round(Math.max(20, tar)) };
}

export function fuelLhv(fuel) {
  const hhv = 14544 * fuel.C + 62028 * (fuel.H - fuel.O / 8);
  return Math.max(4000, hhv - 9720 * fuel.H);
}

export function yieldOf(fuel, moist) {
  return fuel.yield * (1 - Math.max(0, moist - 12) * 0.012);
}

export function stoichAfr(fuel) {
  const o2 = (fuel.C / 12 + fuel.H / 4 - fuel.O / 32) * 32;
  return o2 / 0.232;
}
