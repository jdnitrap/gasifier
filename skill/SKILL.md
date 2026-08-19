---
name: wood-gasifier
description: Use for designing, sizing, building, operating, cleaning, troubleshooting, and integrating small-scale wood or biomass gasifiers for home energy systems. Covers Imbert, stratified, FEMA-style, cross-flow, propane-tank and other DIY builds, materials and fabrication, gas cleaning, tar cracking and management, performance data, fuel requirements, biochar and activated charcoal production, safety, engine or Stirling integration, hybrid systems, and notes on syngas-to-liquids. Trigger on hearth load, throat diameter, nozzle sizing, producer gas data, DIY gasifier construction, tar issues, bridging, biochar, activated charcoal, wood gas to liquid, or home hybrid energy systems using wood gas. All measurements use the English (US customary) system.
---

# Wood Gasifier

## Table of Contents
1. [Overview](#overview)
2. [Design and Sizing](#design-and-sizing)
   - Preferred Types for Home Use
   - Core Design Procedure (Imbert-style)
   - FEMA Fire Tube Sizing Table
   - SERI / NREL Rules of Thumb
   - Homemade Build Approaches
   - Commercial Units (Reverse-Engineering)
3. [Materials and DIY Fabrication](#materials-and-diy-fabrication)
4. [Gas Cleaning / Filtration](#gas-cleaning--filtration)
5. [Performance, Fuel & Gas Data](#performance-fuel--gas-data)
6. [Tar Management & Cracking](#tar-management--cracking)
7. [Biochar & Activated Charcoal](#biochar--activated-charcoal)
8. [Syngas-to-Liquids](#syngas-to-liquids)
9. [Safety & Emissions](#safety--emissions)
10. [Engine, Stirling & Generator Integration](#engine-stirling--generator-integration)
11. [Hybrid System Integration](#hybrid-system-integration)
12. [Troubleshooting](#troubleshooting)
13. [When Answering](#when-answering)
14. [References](#references)

---

## Overview

Practical, engineering-focused guidance for **home-scale** wood and biomass gasifiers.

**Priorities**
- Proven downdraft designs (Imbert-style and stratified open-top)
- Concrete English-unit calculations and tables
- Real DIY and commercial experience
- Safety, tar control, and realistic performance expectations

**All measurements use the English (US customary) system**: inches, feet, pounds, BTU, scf, psi, etc.

Always start from the user’s target gas flow or thermal/electric power. Give explicit calculation steps and flag assumptions (moisture, wood species, chosen hearth load).

---

## Design and Sizing

### Preferred Types for Home Use

| Type                        | Tar Level   | Scale          | Moisture Tolerance | Complexity | Best For                  |
|-----------------------------|-------------|----------------|--------------------|------------|---------------------------|
| Downdraft (Imbert)          | Low         | Small–medium   | Low (<20%)         | Moderate   | Engines, clean gas        |
| Stratified / FEMA open-top  | Low–Medium  | Small–medium   | Low                | Low–Mod    | Home & emergency builds   |
| Cross-flow (simple)         | Medium–High | Very small     | Low                | Very low   | Learning / emergency      |
| Updraft                     | High        | Small–medium   | Higher             | Low        | Direct heating only       |
| Propane-tank / scrap        | Low–Medium  | Medium         | Low                | Moderate   | Medium home units         |
| Fluidized bed               | Medium      | Medium–large   | Moderate           | High       | Fuel flexibility          |
| High-temp (plasma)          | Very low    | Large          | High               | Very high  | Industrial only           |

**Recommended starting points for most home users**
- Imbert-style throated downdraft (best clean gas for engines)
- Stratified / FEMA-style open-top (simpler fabrication)

### Core Design Procedure (Imbert-style)

Rules drawn from FAO *Wood Gas as Engine Fuel* (1986) and SERI/NREL *Handbook of Biomass Downdraft Gasifier Engine Systems* (Reed & Das, 1988), converted to English units.

1. **Target gas output**  
   Approximate yield: **35–40 scf of producer gas per pound of dry wood**.

2. **Hearth load (B_g) / superficial velocity**
   - Maximum continuous: **~2.95 scf/h per in²** of throat area
   - Minimum for low tar: **1.0–1.15 scf/h per in²**
   - Typical design point: **2.3–2.6 scf/h per in²**
   - Turndown ratio usually 2.5–3

3. **Throat diameter**
   ```
   Throat area (in²) = gas flow (scf/h) ÷ B_g
   d_t (inches) = √(4 × Area / π)
   ```

4. **Geometry rules**
   - Nozzle air velocity: **100–115 ft/s**
   - Throat angle: **45–60°**
   - Hearth diameter at air inlet:
     - Single-throat: throat + ~4 in
     - Double-throat/Imbert: throat + ~8 in
   - Reduction zone height: minimum **8 in** (12–16 in common)
   - Nozzle plane above throat: start ~4 in (typically 0.9–1.6 × throat diameter)
   - Air requirement: 1.0–1.5 lb air per lb dry wood (equivalence ratio ≈ 0.25–0.35)

5. **Nozzle sizing (FAO Table 2.7 converted)**

| Throat dia (in) | Nozzle dia (in) | Number of nozzles |
|-----------------|-----------------|-------------------|
| 2.76            | 0.41            | 3                 |
| 3.15            | 0.35            | 5                 |
| 3.54            | 0.39            | 5                 |
| 3.94            | 0.43            | 5                 |
| 4.72            | 0.50            | 5                 |
| 5.12            | 0.53            | 5                 |
| 5.91            | 0.59            | 5                 |
| 6.69            | 0.56            | 7                 |
| 7.48            | 0.63            | 7                 |
| 8.66            | 0.71            | 7                 |
| 10.63           | 0.87            | 7                 |
| 11.81           | 0.94            | 7                 |

(See `references/fao-design-guidelines.md` for full details.)

### FEMA Fire Tube Sizing Table

(Stratified / open-top style – common DIY starting point. See original FEMA document for full construction details.)

### SERI / NREL Rules of Thumb

- Superficial velocity and hearth load ranges align with the FAO numbers above.
- Strong emphasis on insulation of the oxidation/reduction zone for good turndown and low tar.
- Movable grate recommended.

### Homemade Build Approaches

- Propane tank (100–500 lb) conversions
- Steel pipe / pipe-in-pipe Imbert style
- FEMA fire-tube / stratified open-top
- Scrap steel plate fabrication

### Commercial Units (Reverse-Engineering)

All Power Labs GEK / Power Pallet, Victory Gasworks, and similar fixed-bed units provide useful geometry and performance benchmarks.

---

## Materials and DIY Fabrication

- Mild steel for cooler sections; stainless or heavy mild steel for hot zones.
- High-temperature insulation (ceramic fiber, refractory cement) around the oxidation and reduction zones is critical.
- Air-tight construction and good seals matter more than exotic alloys for most home builds.
- Nozzles: mild or stainless steel pipe, sized per the table above.
- Grate: mild steel or stainless, preferably movable/shakable.

---

## Gas Cleaning / Filtration

Typical sequence for engine use:
1. Cyclone or settling chamber
2. Cooler / condenser (to drop out water and some tar)
3. Fabric or packed-bed filter (sawdust, wood chips, or commercial media)
4. Final fine filter or coalescer if needed

Keep the gas path short and cleanable. Pressure drop monitoring is useful.

---

## Performance, Fuel & Gas Data

Typical dry producer gas from a well-running downdraft wood gasifier:
- CO 17–25 %, H₂ 12–20 %, CH₄ 1–3 %, CO₂ 9–15 %, N₂ 45–55 %
- LHV roughly 120–160 BTU/scf (often 135–150)

Fuel: dry wood (<15–20 % moisture preferred), sized roughly ¾–2 in for small units.

---

## Tar Management & Cracking

- High, uniform oxidation-zone temperature is the primary tar cracker.
- Adequate reduction-zone residence time and temperature.
- Avoid light loading (low hearth load) and wet fuel.
- Good insulation improves low-load performance.

---

## Biochar & Activated Charcoal

Char from the reduction zone can be used as biochar or further processed. Activated charcoal production is possible but requires controlled activation steps.

---

## Syngas-to-Liquids

True FT or methanol synthesis at home scale is difficult (catalyst, pressure, purification). Most practical home use remains direct engine fuel, thermal, or Stirling.

---

## Safety & Emissions

- Producer gas contains CO – treat as toxic. Good ventilation, CO detectors, and careful startup/shutdown procedures are required.
- Hot surfaces and fire risk around the unit.
- Emissions: properly run downdraft units are relatively clean, but still need attention to startup and upset conditions.

---

## Engine, Stirling & Generator Integration

- Engine requires clean, cool, dry gas and proper carburetion / mixing.
- Derate engines roughly 20–40 % on producer gas vs gasoline.
- Stirling engines are more tolerant of gas quality variations.

---

## Hybrid System Integration

Combine with solar, battery storage, thermal mass, or grid-tie as needed. Controls for draft, fuel level, and temperature are important for unattended operation.

---

## Troubleshooting

| Problem              | Likely Causes                          | Fixes                                      |
|----------------------|----------------------------------------|--------------------------------------------|
| Bridging / channeling| Wet or irregular fuel, no agitation    | Better fuel prep, agitators, vibration     |
| High tar             | Too light a load, wet fuel, short reduction zone | Raise load, improve insulation, force gas through hot zone |
| Ash / clinker        | Inadequate grate shaking or high-ash fuel | Improve grate action or change fuel        |
| Overheating / melted parts | Air leaks or insufficient fuel in pyrolysis zone | Seal leaks, maintain fuel bed              |
| Poor gas quality     | Leaks, channeling, wrong air/fuel ratio, dirty filters | Systematic leak check and filter maintenance |
| High pressure drop   | Clogged filters or ash buildup         | Clean or replace filters, improve ash removal |

---

## When Answering

- Use English units as the primary system.
- Give concrete dimensions, formulas, and step-by-step calculations.
- Prefer empirical rules from historical Imbert / FAO / SERI practice and proven DIY builds.
- Recommend starting small for first home builds (roughly 7,000–50,000 BTU/h thermal).
- Distinguish clearly between heating-only and engine-quality requirements.
- Be realistic about tar challenges and the difficulty of true liquids production at home scale.

---

## References

- `references/fao-design-guidelines.md` — Core FAO design rules, hearth load, geometry, and nozzle table (English units)
- `references/design-data.md` — Quick-reference tables
- **FEMA** *Construction of a Simplified Wood Gas Generator* (1989) — Full fire-tube table, materials lists, step-by-step stratified design
- **SERI/NREL** *Handbook of Biomass Downdraft Gasifier Engine Systems* (Reed & Das, 1988) — Superficial velocity, hearth load, fabrication, engine matching
- **Missouri Wood Gasifier** (Raymond Rissler) — Sawdust-focused design with drawings
- All Power Labs (GEK / Power Pallet) commercial data
- Victory Gasworks / Wood Gasifier Builder’s Bible
- Community sources: Drive On Wood, Instructables, Northern Self Reliance, and various commercial fixed-bed units
