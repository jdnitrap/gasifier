---
name: wood-gasifier
description: Use for designing, sizing, building, operating, cleaning, troubleshooting, and integrating small-scale wood or biomass gasifiers for home energy systems. Covers Imbert, stratified, FEMA-style, Missouri open-core, cross-flow, propane-tank and other DIY builds, materials and fabrication, gas cleaning, tar cracking and management, performance data, fuel requirements, biochar and activated charcoal, safety, engine or Stirling integration, hybrid systems, efficiency (cold-gas vs ideal), turndown vs moisture and insulation, time-series burn simulation, library patterns, naming aliases (see naming-aliases.md), common DIY failure modes, model limits, fuel prep, startup shutdown, maintenance, and notes on syngas-to-liquids. Trigger on hearth load, superficial velocity, throat diameter, nozzle sizing, producer gas data, DIY gasifier construction, tar issues, bridging, biochar, activated charcoal, wood gas to liquid, Hearth Lab, or home hybrid energy systems using wood gas. All measurements use the English (US customary) system.
---

# Wood Gasifier

## Table of Contents
1. [Overview](#overview)
2. [Model Limits](#model-limits--what-this-does-not-do)
3. [Library Patterns](#library-patterns-what-the-documents-teach)
4. [Naming, Aliases & Related Processes](#naming-aliases--related-processes) — **full detail in [naming-aliases.md](naming-aliases.md)**
5. [Design and Sizing](#design-and-sizing)
6. [Materials Selection Guide](#materials-selection-guide)
7. [Fuel Prep Checklist](#fuel-prep-checklist)
8. [Gas Cleaning / Filtration](#gas-cleaning--filtration)
9. [Performance, Fuel & Gas Data](#performance-fuel--gas-data)
10. [Efficiency — Real vs Ideal](#efficiency--real-vs-ideal)
11. [Turndown, Moisture & Insulation](#turndown-moisture--insulation)
12. [Tar Management & Cracking](#tar-management--cracking)
13. [Biochar & Activated Charcoal](#biochar--activated-charcoal)
14. [Syngas-to-Liquids](#syngas-to-liquids)
15. [Safety & Emissions](#safety--emissions)
16. [Engine, Stirling & Generator Integration](#engine-stirling--generator-integration)
17. [Stirling Thermal Matching](#stirling-thermal-matching)
18. [Hybrid System Integration](#hybrid-system-integration)
19. [Time-Series / Simulator Behavior](#time-series--simulator-behavior)
20. [Startup & Shutdown Checklist](#startup--shutdown-checklist)
21. [Common DIY Failure Modes](#common-diy-failure-modes)
22. [Troubleshooting](#troubleshooting)
23. [Maintenance Schedule](#maintenance-schedule)
24. [Build Skill Level & Time Guide](#build-skill-level--time-guide)
25. [When Answering](#when-answering)
26. [User Artifacts & Tools](#user-artifacts--tools)
27. [References](#references)
28. [Skill Version / Change Log](#skill-version--change-log)

---

## Overview

Practical, engineering-focused guidance for **home-scale** wood and biomass gasifiers.

**Priorities**
- Proven downdraft designs (Imbert-style and stratified open-top)
- Family-correct superficial velocity (do **not** apply Imbert throat load to a FEMA whole bed)
- Treat the unit as a **whole system**: gasifier + cleanup + end-use (engine / Stirling / burner) — Kaupp’s framing
- Concrete English-unit calculations and tables
- Real DIY and commercial experience (Drive On Wood, FEMA, Missouri, SERI/Gengas)
- Safety, tar control, realistic efficiency (this machine vs ideal), and turndown under wet fuel / weak insulation

**All measurements use the English (US customary) system**: inches, feet, pounds, BTU, scf, psi, etc.

Always start from the user’s **target power or gas flow**, then size the hot section. Flag assumptions (moisture, wood species, hearth-load band, geometry family).

---

## Model Limits — What This Does Not Do

This skill and the Hearth Lab calculator/simulator are **practical DIY engineering tools**, not research-grade CFD or kinetic models.

**They do**
- Size throat/bed from power and family SV
- Estimate gas yield, LHV, CGE, real-vs-ideal efficiency
- Track multi-hour fuel burn, startup, fade, tar trend order-of-magnitude
- Flag wet fuel, insulation, and engine-match problems

**They do not**
- Solve full reaction kinetics or particle-scale pyrolysis
- Run CFD of the hot zone or nozzle jets
- Predict exact transient wall temperatures or metal life
- Replace prototype testing, CO monitoring, or local code/safety review
- Provide certified engineering drawings or pressure-vessel design

Use the numbers as a strong starting point; validate with a small prototype and instruments.

---

## Library Patterns (what the documents teach)

1. **Everything useful is a system, not a reactor** — gasifier + cooler + filter + engine/burner (Kaupp).
2. **Superficial velocity is the master variable** — controls rate, char, tar, power together (Reed).
3. **WWII experience is still the empirical backbone** — Gengas / Imbert practice still drives hearth and nozzle rules.
4. **Tar control is thermal, not magical** — hot zone + char bed + dry fuel; filters catch the rest.
5. **Fuel form dictates geometry** — chunk → Imbert; chips → FEMA/stratified; fines → Missouri.
6. **Vehicle and stationary are different products** — do not mix requirement sets.
7. **Research units are not DIY templates** — Viking is a clean-gas benchmark, not a weekend build.
8. **Reliability is thermal cycling + airtightness** — leaks and cracked hot parts kill units.
9. **Efficiency talk is often oversold** — prefer real-vs-ideal framing.
10. **Documentation quality tracks usefulness** — Reed, SERI, Gengas, Drive On Wood, Missouri, Kaupp high.
11. **Imbert self-regulation is real but not magic** — char level self-corrects; grate/ash still required.
12. **Turndown is a fuel + insulation problem** — wet + cold walls collapse part-load stability.
13. **Hearth Lab path matches the strong spine** — power → family SV → steel → cleanup → end-use.
14. **Scan-limited sources** — FEMA drawings, inverted-V, valve packs need manual dimension checks.

---

## Naming, Aliases & Related Processes

**Full commercial aliases, Stirling brand names, and reusable web-search patterns:**
[`naming-aliases.md`](naming-aliases.md)

Short rules:
- Map marketing names to a **family** (Imbert, stratified, Missouri, updraft, stove, pyrolysis, Stirling).
- Prefer physics (SV, moisture, cleanup) over brand labels.
- Translate aliases into family terms; flag pyrolysis/stove docs that are not engine-gas designs.
- Commercial names for the same core idea include GEK / Power Pallet / EnergyBlock / Burkhardt / Volter / European Holzgas CHP brands / Biowatt.
- Stirling products often never say “Stirling” (Microgen, Qnergy, Frauscher, BioGen, mCHP, waste-heat engine).

---

## Design and Sizing

### Preferred Types for Home Use

| Type | Tar | Scale | Moisture | Complexity | Best For |
|------|-----|-------|----------|------------|----------|
| Downdraft (Imbert) | Low | Small–medium | Low (<20%) | Moderate | Engines, clean gas |
| Stratified / FEMA | Low–Medium | Small–medium | Low | Low–Mod | Home & emergency |
| Missouri / open-core | Medium | Small–medium | Low | Moderate | Sawdust / fines |
| Cross-flow | Medium–High | Very small | Low | Very low | Learning |
| Updraft | High | Small–medium | Higher | Low | Heat only |
| Propane-tank / scrap | Low–Medium | Medium | Low | Moderate | Medium home |
| Viking two-stage | Very low | Lab | — | High | Benchmark only |

### Family-Specific Superficial Velocity (critical)

SV = gas production rate / narrowest hot cross-section (m/s). Conversion: **1 (scf/h·in²) ≈ 0.012192 m/s** at NTP.

| Family | Typical SV | Band | Area basis | Constriction |
|--------|------------|------|------------|--------------|
| Imbert | ~1.25 m/s | 0.5–2.5 | **Throat** only | ~2.0 |
| FEMA / stratified | ~0.22 m/s | 0.08–0.5 | **Whole bed** | 1.0 |
| Missouri | ~0.18 m/s | 0.07–0.4 | Whole bed / open core | 1.0 |
| Updraft | ~0.12 m/s | 0.05–0.3 | Bed | 1.0 |

### Core Design Procedure (power → steel)
1. Target gas output — yield ≈ **35–40 scf/lb dry wood** (cut for moisture).
2. Pick family from fuel size and end use.
3. Hearth-load band multiplies typical SV: conservative 0.7 · typical 1.0 · higher 1.35 · max 1.7.
4. Area (in²) = gas flow (scf/h) ÷ B_g; d (in) = √(4 × Area / π).
5. Geometry (Imbert): nozzle air velocity **~108 ft/s**; reduction ≥ 8 in; ER 0.25–0.35; nozzle plane ~0.9–1.6 × throat dia.

### FEMA Fire Tube Table
| ID (in) | Min Length (in) | Approx Engine hp |
|---------|-----------------|------------------|
| 6 | 16 | 30 |
| 8 | 20 | 50 |
| 10 | 24 | 80 |
| 12 | 28 | 120 |

Never below 6 in ID for chips/blocks. Missouri / fines = first-class open-core path.

---

## Materials Selection Guide

| Zone | Preferred | Acceptable | Avoid |
|------|-----------|------------|-------|
| Throat / nozzles / reduction | Stainless 310/316 | Thick mild steel | Thin mild steel, aluminum |
| Outer shell | Mild steel 10–12 ga or ¼ in | — | Thin warping sheet |
| Grate | Stainless or heavy high-carbon | Thick mild perforated | Light hardware cloth alone |
| Insulation | Ceramic fiber 1–2 in | Refractory over fiber | No insulation on engine units |
| Seals | High-temp fiberglass rope | Quality gaskets | Silicone at hot zones |

Airtight welds required. Prefer quality MIG.

---

## Fuel Prep Checklist
- Moisture **<20% wb** for engine gas; **<15%** preferred
- Size uniform; ~¾–2 in for Imbert/stratified; fines → Missouri only
- Hardwood preferred; no treated/painted wood
- Keep dry in covered storage

---

## Gas Cleaning / Filtration
Engine-quality train: cyclone → cooler/condenser → condensate trap → fine filter.

**Hot gas myth:** Cooler gas is denser (ideal gas law: n ∝ 1/T). Hot gas keeps tar vapor that damages engines.

---

## Performance, Fuel & Gas Data
- Yield **35–40 scf/lb dry wood**
- LHV **120–160 BTU/scf**; CGE often **60–75%** DIY
- ~2 lb dry biomass per hp-hour; ~2 scfm gas per hp

---

## Efficiency — Real vs Ideal
| Metric | Real DIY | Ideal |
|--------|----------|-------|
| CGE | ~60–70% | ~75% |
| Wall loss | ~8–14% | ~2% |
| Overall of ideal | ~75–85% | 100% |

Ideal baseline: 12% moisture, ER 0.30, insulated Imbert, matched engine.

---

## Turndown, Moisture & Insulation
Turndown falls hard as moisture rises (~8 → ~2 from ~10% → 50% wb). Insulation matters more on small units.

---

## Tar Management & Cracking
Primary: hot zone + force all gas through char (Reed SV). Secondary: cooler + filters. Engine target often **<100 mg/Nm³**.

---

## Biochar & Activated Charcoal
Normal byproduct. Useful as filter media and soil amendment.

---

## Syngas-to-Liquids
Home-scale F-T generally impractical. Prefer direct gas use.

---

## Safety & Emissions
- **CO** — primary acute hazard; outdoor or strong ventilation; CO alarms
- Air leaks into hot path — explosion risk
- Flame arrestors on engine feeds; treat tar condensate as hazardous waste

---

## Engine, Stirling & Generator Integration
- **IC engines**: clean, cool, dry gas; **20–40% derate** vs gasoline
- **Stirling**: external combustion; size from thermal input + manufacturer specs
- Kaupp: gasifier + purification + converter as **one system**

---

## Stirling Thermal Matching
1. Size gasifier for continuous thermal power the Stirling needs.
2. Prefer hot-gas efficiency path; manage tar on cold surfaces.
3. Follow manufacturer max temp / heat flux.
4. Buffer with thermal mass or battery so gasifier runs steady.
5. Plan dual-fuel / backup shutdown path.

---

## Hybrid System Integration
Battery, thermal mass, solar/grid as appropriate. Size from continuous need, not peak house load. Dual-fuel/backup required for safe offline switch.

---

## Time-Series / Simulator Behavior
Duration 1–168 h; fuel inventory depletes at feed rate; startup ramp ~30–45 min; organic noise; fade on last ~12% fuel; start/stop/reset; CSV export; CGE real vs ideal charts.

---

## Startup & Shutdown Checklist
**Startup:** inspect seals/filters; CO alarm on; dry sized fuel; establish charcoal bed; watch tar/CO.  
**Shutdown:** burn down; clear draft; close air when safe; drain condensate; log hours.

---

## Common DIY Failure Modes
Chronic tar (low SV/wet/no insulation), air leaks (flux-core), bridging, melted throat, engine damage from hot unfiltered gas, no part-load, “paperweight” units that skipped insulation.

---

## Troubleshooting
| Problem | Likely causes | Fixes |
|---------|---------------|-------|
| Bridging | Wet/irregular fuel | Prep, agitators |
| High tar | Low SV, wet, cold walls | Raise load, dry, insulate |
| Weak power | Leaks, hot gas, mismatch | Cool, seal, match engine |
| No part-load | High moisture, weak insulation | Dry fuel, insulate |

---

## Maintenance Schedule
Every run: drain condensate, CO alarm, leak check.  
10–25 h: grate, filters, ash.  
50–100 h: deep filter service, nozzle/throat inspect.  
Seasonal: seals, welds, insulation, instruments.

---

## Build Skill Level & Time Guide
| Build | Skill | First-build time |
|-------|-------|------------------|
| TLUD stove | Low | Hours–1 day |
| FEMA stratified | Low–Mod | Weekend–1 week |
| Imbert insulated | Moderate | 2–6 weeks |
| Missouri fines | Moderate | 2–4 weeks |
| Full hybrid | High | Months |

---

## When Answering
- English units; concrete dimensions and formulas.
- **Family-correct SV** — never mix Imbert throat with FEMA bed load.
- Whole system; real vs ideal efficiency; cooler gas is denser.
- Translate aliases; see [naming-aliases.md](naming-aliases.md) for commercial names and search patterns.
- Prefer no unsolicited scope creep.

---

## User Artifacts & Tools
**Hearth Lab:** https://jdnitrap.github.io/gasifier/ — repo https://github.com/jdnitrap/gasifier  
**Naming companion:** [naming-aliases.md](naming-aliases.md)  
**uploads/ spine:** Reed SV, Gengas, SERI, FEMA, Missouri, Drive On Wood, Kaupp, turndown, Viking benchmark.

---

## References
- `references/fao-design-guidelines.md`, `references/design-data.md`
- Reed SV; FEMA 1989; SERI Reed & Das 1988; Gengas; FAO 1986; Missouri; Kaupp; Drive On Wood; DTU Viking

---

## Skill Version / Change Log
- **2026-08-22** — Library patterns; family SV; real-vs-ideal; turndown; Missouri; Hearth Lab.
- **2026-08-22 (b)** — Model limits, materials, fuel prep, Stirling matching, startup/shutdown, failure modes, maintenance, build guide.
- **2026-08-22 (c–e)** — Naming aliases; commercial brands from web search; reusable search patterns for this or another AI.
- **2026-08-22 (f)** — Split full naming + search patterns to `naming-aliases.md`; SKILL.md keeps short pointer + core design rules.
