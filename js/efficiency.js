import { BTU_HP } from "./fuels.js";
import { fuelLhv, gasComp, yieldOf } from "./thermo.js";

export function heatLossFor(family, moisture, er, ideal) {
  if (ideal) return 0.02;
  let x = 0.08;
  if (family === "fema" || family === "missouri") x += 0.03;
  if (family === "updraft") x += 0.02;
  if (moisture > 20) x += 0.03;
  if (er < 0.24 || er > 0.36) x += 0.02;
  return Math.min(0.22, x);
}

export function idealFamily(endUse) {
  return endUse === "heat" ? "updraft" : "imbert";
}

function packSide(label, fuel, family, moisture, er, targetHp, endUse, ideal) {
  const gas = gasComp(fuel, moisture, er, family);
  const yld = Math.max(25, yieldOf(fuel, moisture));
  const flhv = fuelLhv(fuel);
  const wall = heatLossFor(family, moisture, er, ideal);
  const cge = ((yld * gas.LHV) / flhv) * (1 - wall);
  const tHot = ideal ? 1380 : 1200;
  const hge = Math.min(0.92, cge + (yld * 0.075 * 0.28 * Math.max(0, tHot - 70)) / flhv);
  const conv = endUse === "heat" ? (ideal ? 0.9 : 0.78) : ideal ? 0.24 : 0.22;
  const overall = (endUse === "heat" ? hge : cge) * conv;
  const scfh = (targetHp * BTU_HP / conv) / Math.max(80, gas.LHV);
  return { label, family, moisture, er, lhv: gas.LHV, tar: gas.tar, yld, feed: scfh / yld, cge, hge, overall, wall };
}

export function computeEfficiency(inp, fuel, family, fit) {
  const idealFam = idealFamily(inp.endUse);
  const real = packSide("This machine", fuel, family, inp.moisture, inp.er, inp.targetHp, inp.endUse, false);
  const ideal = packSide("Ideal machine", fuel, idealFam, 12, 0.3, inp.targetHp, inp.endUse, true);
  if (inp.endUse !== "heat" && fit === "undersized") real.overall *= 0.85;
  if (inp.endUse !== "heat" && fit === "oversized") real.overall *= 0.92;
  const ofIdeal = (real.overall / Math.max(0.04, ideal.overall)) * 100;
  const flhv = fuelLhv(fuel);
  const losses = [];
  const moistPts = (packSide("d", fuel, family, 12, inp.er, inp.targetHp, inp.endUse, false).cge - real.cge) * 100;
  if (moistPts > 0.4) {
    losses.push({ name: "Moisture", points: moistPts.toFixed(1), note: `${inp.moisture}% wb vs 12%. Steam steals hearth heat.` });
  }
  const famPts = (packSide("d", fuel, idealFam, inp.moisture, inp.er, inp.targetHp, inp.endUse, false).cge - real.cge) * 100;
  if (famPts > 0.4) {
    losses.push({ name: "Geometry", points: famPts.toFixed(1), note: `${family} vs insulated ${idealFam}.` });
  }
  const erPts = (packSide("d", fuel, family, inp.moisture, 0.3, inp.targetHp, inp.endUse, false).cge - real.cge) * 100;
  if (Math.abs(erPts) > 0.4) {
    losses.push({ name: "Equivalence ratio", points: Math.abs(erPts).toFixed(1), note: `ER ${inp.er.toFixed(2)} vs 0.30.` });
  }
  losses.push({
    name: "Walls, leaks, DIY heat loss",
    points: (real.wall * 100 - 2).toFixed(1),
    note: "Ideal ~2% wall loss. Home-built typically 8–14% unless the hot zone is insulated.",
  });
  if (inp.endUse !== "heat") {
    losses.push({
      name: "Engine conversion",
      points: ((ideal.overall - real.overall) * 100).toFixed(1),
      note: "Ideal SI ~24% thermal. Real 22% plus mismatch.",
    });
  }
  return {
    flhv,
    real,
    ideal,
    ofIdeal,
    fuelEnergy: real.feed * flhv,
    gasEnergy: real.feed * real.yld * real.lhv * (1 - real.wall),
    woodExtra: Math.max(0, real.feed - ideal.feed),
    losses: losses.filter((l) => +l.points > 0.2),
    note:
      inp.endUse === "heat"
        ? "Heat overall = hot-gas efficiency × burner. Ideal is an insulated updraft firing the tar."
        : "Cold-gas efficiency = gas energy / dry-fuel LHV. Overall = CGE × engine. Ideal is dry fuel, ER 0.30, insulated Imbert, matched engine.",
  };
}
