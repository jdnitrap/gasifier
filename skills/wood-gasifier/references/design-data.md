# Wood Gasifier Design Reference Data (English Units)

## Family Superficial Velocity (do not mix families)

SV = gas rate / narrowest hot area. Conversion: **1 (scf/h·in²) ≈ 0.012192 m/s** (NTP).

| Family              | Typical SV | Band           | Area basis        | Constriction |
|---------------------|------------|----------------|-------------------|--------------|
| Imbert              | 1.25 m/s   | 0.5–2.5 m/s    | Throat only       | ~2.0         |
| FEMA / stratified   | 0.22 m/s   | 0.08–0.5 m/s   | Whole bed         | 1.0          |
| Missouri / open-core| 0.18 m/s   | 0.07–0.4 m/s   | Bed / open core   | 1.0          |
| Updraft             | 0.12 m/s   | 0.05–0.3 m/s   | Bed               | 1.0          |

Imbert Gengas/SERI Bhmax ≈ 0.9 Nm³/h·cm² ≈ **2.5 m/s** at throat; typical DIY design ~1.25 m/s.

Hearth-load band multipliers on typical SV: conservative 0.7 · typical 1.0 · higher 1.35 · max 1.7.

**Reed qualitative (inverted test)**
- ~0.05 m/s → high char/tar, slow pyrolysis  
- ~0.26 m/s → tar toward ~300 mg/kg, less char  

## Hearth Load Guidelines (Imbert throat — scf/h·in²)

| Parameter                  | Value                          | Notes |
|---------------------------|--------------------------------|-------|
| B_g near max continuous   | ~2.0–2.5 scf/h per in²         | Approaches ~2.5 m/s |
| Typical design            | ~1.0–1.3 scf/h per in²         | ~1.25 m/s |
| Low-tar minimum region    | avoid sustained very low SV    | High tar / high char |

Gas yield approximation: **35–40 scf** of producer gas per pound of dry wood (reduce with moisture).

## Geometry Rules of Thumb

- Nozzle plane height above throat: ~0.9–1.6 × throat diameter (min ~4 inches)
- Reduction zone height: at least 8 inches (12–16 inches common)
- Hearth diameter at nozzle level (Imbert): ≈ 2 × throat
- Throat cone angle: 45–60°
- **Nozzle air velocity (primary rule): 100–115 ft/s (design ~108 ft/s)**
- FAO discrete nozzle table: secondary cross-check only
- ER design: 0.25–0.35 (0.30 typical)

## Producer Gas Typical Values (Downdraft, Wood)

| Component     | Range (vol%) | Typical |
|---------------|--------------|---------|
| CO            | 17–25        | 20      |
| H₂            | 12–20        | 16      |
| CH₄           | 1–3          | 2       |
| CO₂           | 9–15         | 12      |
| N₂            | 45–55        | 50      |
| LHV           | 120–160 BTU/scf | 135–150 BTU/scf |

## Efficiency (order of magnitude)

| Metric | Real DIY | Ideal baseline |
|--------|----------|----------------|
| CGE | ~60–70% | ~75% |
| Wall loss | ~8–14% | ~2% |
| Engine thermal | ~22% | ~24% |
| Overall of ideal | often ~75–85% | 100% by definition |

Ideal baseline: 12% moisture, ER 0.30, insulated Imbert (or updraft for heat), matched engine.

## Turndown vs Moisture & Insulation

Turndown ≈ design output / minimum stable output.

- Example study trend: turndown **~8 → ~2** as moisture **~10% → 50% wb**
- Insulation matters more on **smaller** units
- Wet fuel + cold walls → poor part-load stability and higher tar risk

## Fuel Notes

- Ideal moisture: under 15–20% (wet basis)
- Bulk density of prepared wood: roughly 9–19 lb/ft³ (pellets denser)
- Preferred particle size for small Imbert/stratified units: ¾ inch to 2 inches
- Fines / sawdust → Missouri / open-core geometry (first-class path)

## Power Rules of Thumb

- ~2 lb dry biomass per hp-hour
- ~3 lb dry biomass per kWh
- ~2 scfm gas per hp
- Commercial cluster often ~2.4–3.3 lb dry wood per kWh_e

## Quick Conversion Helpers

- 1 kg ≈ 2.2 lb
- 1 Nm³ ≈ 35.3 scf
- 1 MJ ≈ 948 BTU
- 1 kW ≈ 3,412 BTU/h
- 1 hp ≈ 2,545 BTU/h
- 1 m/s ≈ 3.28 ft/s
- 1 cm² ≈ 0.155 in²
- SV (m/s) ≈ B_g (scf/h·in²) × 0.012192
