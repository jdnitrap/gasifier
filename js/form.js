import { $id } from "./util.js";

export function getInput() {
  return {
    endUse: $id("endUse").value,
    targetHp: +$id("targetHp").value,
    hours: +$id("opHours").value,
    fuel1: $id("fuel1").value,
    fuel2: $id("fuel2").value,
    blendPct: +$id("blend").value,
    moisture: +$id("moisture").value,
    psizeMm: +$id("psize").value,
    er: +$id("er").value,
    hearthBand: $id("hearthBand").value,
    familyOverride: $id("familyOverride").value,
    dispCi: +$id("disp").value,
    rpm: +$id("rpm").value,
    maxReactorIn: +$id("maxReactorIn").value,
  };
}

export function bindBrief(onChange) {
  ["endUse", "fuel1", "fuel2", "hearthBand", "familyOverride", "disp", "rpm"].forEach((id) => {
    $id(id).addEventListener("change", onChange);
  });
  ["targetHp", "opHours", "blend", "moisture", "psize", "er", "maxReactorIn"].forEach((id) => {
    $id(id).addEventListener("input", onChange);
  });
}
