/** Fuel table and hearth-load bands. Edit fuels here — compute.js reads this. */

export const FUELS = {
  hardwood: { name: "Hardwood (oak, hickory, maple)", yield: 38, tarF: 0.85, C: 0.5, H: 0.06, O: 0.44, ash: 0.008, bulk: 18, note: "Most stable, lower-tar gas for engines. Keep blocky and dry.", family: "imbert" },
  softwood: { name: "Softwood (pine, fir)", yield: 36, tarF: 1.15, C: 0.51, H: 0.06, O: 0.43, ash: 0.006, bulk: 14, note: "Higher resin/tar tendency. Dry well and keep particle size uniform.", family: "imbert" },
  chips: { name: "Wood chips", yield: 37, tarF: 1.0, C: 0.5, H: 0.06, O: 0.44, ash: 0.01, bulk: 16, note: "Good all-rounder if screened uniform. Stratified (FEMA-style) feeds well.", family: "fema" },
  charcoal: { name: "Charcoal", yield: 45, tarF: 0.25, C: 0.85, H: 0.03, O: 0.12, ash: 0.03, bulk: 20, note: "Very clean, high LHV, low tar. Smaller hopper for the same energy.", family: "imbert" },
  corn: { name: "Corn cobs", yield: 32, tarF: 1.3, C: 0.47, H: 0.06, O: 0.47, ash: 0.025, bulk: 12, note: "Higher ash — grate and ash pit matter. Watch clinkers.", family: "fema" },
  pellets: { name: "Wood pellets", yield: 37, tarF: 0.95, C: 0.5, H: 0.06, O: 0.44, ash: 0.008, bulk: 40, note: "Consistent size and dense. Bridging is rare; swelling if they get wet.", family: "fema" },
  sawdust: { name: "Sawdust / fines", yield: 34, tarF: 1.4, C: 0.49, H: 0.06, O: 0.45, ash: 0.012, bulk: 12, note: "Needs Missouri-style / open-core design. Imbert throats bridge and tar.", family: "missouri" },
};

/** Multiplier on family-typical superficial velocity. */
export const HEARTH = { conservative: 0.7, typical: 1, higher: 1.35, max: 1.7 };

/**
 * Family-typical SV at NTP through the narrowest hot section.
 * Imbert: Gengas/Reed Bhmax 0.9 Nm³/h·cm² = 2.5 m/s; typical ~1.25 m/s.
 * FEMA/stratified: Reed 0.1–0.3 m/s across the whole bed.
 */
export const FAMILY_FLOW = {
  imbert: { typicalSv: 1.25, minSv: 0.5, maxSv: 2.5, constriction: 2 },
  fema: { typicalSv: 0.22, minSv: 0.08, maxSv: 0.5, constriction: 1 },
  missouri: { typicalSv: 0.18, minSv: 0.07, maxSv: 0.4, constriction: 1 },
  updraft: { typicalSv: 0.12, minSv: 0.05, maxSv: 0.3, constriction: 1 },
};

export const AIR = 0.0765;
export const BTU_HP = 2545;
export const ENG_EFF = 0.22;
export const GEN_EFF = 0.85;
export const NOZ_V = 108;
export const PIPE_V = 22;
/** m/s per (scf/h · in²) */
export const SV_PER_BG = 0.012192;
