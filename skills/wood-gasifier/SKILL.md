---
name: wood-gasifier
description: Use for designing, sizing, building, operating, cleaning, troubleshooting, and integrating small-scale wood or biomass gasifiers for home energy systems. Covers Imbert, stratified, FEMA-style, Missouri open-core, cross-flow, propane-tank and other DIY builds, materials and fabrication, gas cleaning, tar cracking and management, performance data, fuel requirements, biochar and activated charcoal, safety, engine or Stirling integration, hybrid systems, efficiency (cold-gas vs ideal), turndown vs moisture and insulation, time-series burn simulation, library patterns from Gengas SERI Reed FEMA Missouri Drive On Wood Kaupp, naming aliases and related processes (producer gas, gengas, pyrolysis vs gasification, Stirling product names), common DIY failure modes, model limits, fuel prep, startup shutdown, maintenance, and notes on syngas-to-liquids. Trigger on hearth load, superficial velocity, throat diameter, nozzle sizing, producer gas data, DIY gasifier construction, tar issues, bridging, biochar, activated charcoal, wood gas to liquid, Hearth Lab, or home hybrid energy systems using wood gas. All measurements use the English (US customary) system.
---

# Wood Gasifier

## Table of Contents
1. [Overview](#overview)
2. [Model Limits — What This Does Not Do](#model-limits--what-this-does-not-do)
3. [Library Patterns (what the documents teach)](#library-patterns-what-the-documents-teach)
4. [Naming, Aliases & Related Processes](#naming-aliases--related-processes)
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

Synthesized from the full GitHub `jdnitrap/gasifier/uploads` pass (unique non-zip docs; duplicates and zips skipped). Use these as standing rules of judgment.

1. **Everything useful is a system, not a reactor** — gasifier + cooler + filter + engine/burner (Kaupp).
2. **Superficial velocity is the master variable** — controls rate, char, tar, power together (Reed).
3. **WWII experience is still the empirical backbone** — Gengas / Imbert practice still drives hearth and nozzle rules.
4. **Tar control is thermal, not magical** — hot zone + char bed + dry fuel; filters catch the rest.
5. **Fuel form dictates geometry** — chunk → Imbert; chips → FEMA/stratified; fines → Missouri.
6. **Vehicle and stationary are different products** — do not mix requirement sets.
7. **Research units are not DIY templates** — Viking is a clean-gas benchmark, not a weekend build.
8. **Reliability is thermal cycling + airtightness** — leaks and cracked hot parts kill units.
9. **Efficiency talk is often oversold** — prefer real-vs-ideal framing.
10. **Documentation quality tracks usefulness** — Reed, SERI, Gengas, Drive On Wood, Missouri, Kaupp high; policy/survey PDFs low.
11. **Imbert self-regulation is real but not magic** — char level self-corrects; grate/ash still required.
12. **Turndown is a fuel + insulation problem** — wet + cold walls collapse part-load stability.
13. **Hearth Lab path matches the strong spine** — power → family SV → steel → cleanup → end-use.
14. **Scan-limited sources** — FEMA drawings, inverted-V, valve packs need manual dimension checks.

---

## Naming, Aliases & Related Processes

Gasifier literature and marketing use many overlapping names. Treat these as the **same core concept** unless geometry or duty clearly differs.

### Common aliases for wood / biomass gasifiers
| Name you may see | Usually means | Notes |
|------------------|---------------|-------|
| Wood gasifier / woodgas unit | Downdraft or stratified gasifier | Default DIY meaning |
| Producer gas generator / gengas | WWII-era / European term | Same physics; Gengas literature |
| Imbert / constricted-throat / nozzle gasifier | Classic Imbert family | Throat + radial nozzles |
| Stratified / open-top / FEMA | Open-core stratified bed | FEMA emergency design lineage |
| Missouri / open-core / sawdust gasifier | Fines-capable open bed | Different geometry for fines |
| Cross-draft / cross-flow | Side air inlet | Often higher tar |
| Updraft / counter-flow | Air up, fuel down | High tar; heat-only |
| GEK / Power Pallet style | Modular commercial DIY lineage | Cleanup train often modular |
| TLUD / rocket / woodgas stove | Stove-scale inverted downdraft | Cooking, not engine gas |
| Biochar reactor / retort | Often pyrolysis-focused | May not produce engine-quality gas |
| Syngas generator / biomass gasifier | Industrial marketing | Check scale and cleanup claims |

### Stirling and external-combustion naming
Stirling literature often uses different product names for the same external-combustion idea:
- Hot-air engine, external combustion engine, regenerative heat engine
- Manufacturer model names that never say “Stirling”
- “Waste-heat engine” or “biomass engine” when paired with a burner or gasifier

**Core check:** Does it run on an external heat source with a closed working gas (air, helium, hydrogen)? If yes, treat it as Stirling-class even if the brochure never uses the word.

### Pyrolysis vs gasification (do not merge blindly)
| Process | Primary goal | Typical gas quality | Relevance |
|---------|--------------|---------------------|-----------|
| **Gasification** | Continuous producer gas (CO + H₂ + N₂) with controlled air/steam | Engine-usable if cleaned | This skill’s focus |
| **Pyrolysis** | Char, bio-oil, and/or condensable vapors; little or no free oxygen | Often high-tar vapors | Related chemistry; not the same duty |
| **Combustion** | Heat only | Flue gas, not fuel gas | Different product |
| **Torrefaction** | Dry, roast biomass for fuel prep | Not a gas product | Fuel prep only |

Documents labeled “pyrolysis reactor,” “bio-oil unit,” or “char kiln” may share heat-transfer and tar chemistry with gasifiers but are **not** drop-in design templates for engine or Stirling gas.

### How to use this when reading documents or searching
1. Map the marketing name to a **family** (Imbert, stratified, Missouri, updraft, stove, pyrolysis, Stirling).
2. If the name is ambiguous, look for: throat/nozzles, open top, air direction, and whether the product is gas for an engine vs heat vs char/oil.
3. Prefer physics (SV, moisture, cleanup train) over brand labels.
4. When sources conflict, check whether they are actually describing different families or different duties (engine gas vs heat vs biochar).

### When Answering
- Translate aliases into family terms so the user gets one consistent vocabulary.
- Flag when a document is pyrolysis- or stove-oriented and not engine-gas design.
- Do not force Imbert rules onto a unit that is clearly stratified, Missouri, or pyrolysis-only.

---

## Design and Sizing

### Preferred Types for Home Use

| Type                        | Tar Level   | Scale          | Moisture Tolerance | Complexity | Best For                  |
|-----------------------------|-------------|----------------|--------------------|------------|---------------------------|
| Downdraft (Imbert)          | Low         | Small–medium   | Low (<20%)         | Moderate   | Engines, clean gas        |
| Stratified / FEMA open-top  | Low–Medium  | Small–medium   | Low                | Low–Mod    | Home & emergency builds   |
| Missouri / open-core        | Medium      | Small–medium   | Low                | Moderate   | Sawdust / fines           |
| Cross-flow (simple)         | Medium–High | Very small     | Low                | Very low   | Learning / emergency      |
| Updraft                     | High        | Small–medium   | Higher             | Low        | Direct heating only       |
| Propane-tank / scrap        | Low–Medium  | Medium         | Low                | Moderate   | Medium home units         |
| Two-stage research (Viking) | Very low    | Lab / pilot    | —                  | High       | Clean-gas benchmark only  |

### Family-Specific Superficial Velocity (critical)

SV = gas production rate / narrowest hot cross-section (m/s)

Conversion: **1 (scf/h·in²) ≈ 0.012192 m/s** at NTP.

| Family    | Typical SV | Practical band     | What the area is              | Constriction |
|-----------|------------|--------------------|-------------------------------|--------------|
| Imbert    | ~1.25 m/s  | 0.5–2.5 m/s        | **Throat** only               | ~2.0         |
| FEMA / stratified | ~0.22 m/s | 0.08–0.5 m/s | **Whole bed**                 | 1.0          |
| Missouri  | ~0.18 m/s  | 0.07–0.4 m/s       | Whole bed / open core         | 1.0          |
| Updraft   | ~0.12 m/s  | 0.05–0.3 m/s       | Bed                           | 1.0          |

### Core Design Procedure (power → steel)

1. Target gas output — yield ≈ **35–40 scf/lb dry wood** (cut for moisture).
2. Pick family from fuel size and end use.
3. Hearth-load band multiplies typical SV: conservative 0.7 · typical 1.0 · higher 1.35 · max 1.7.
4. Area (in²) = gas flow (scf/h) ÷ B_g; d (in) = √(4 × Area / π).
5. Geometry (Imbert): nozzle air velocity **~108 ft/s** (primary); reduction ≥ 8 in; ER 0.25–0.35; nozzle plane ~0.9–1.6 × throat dia.

### FEMA Fire Tube Table (Stratified)

| ID (in) | Min Length (in) | Approx Engine hp |
|---------|-----------------|------------------|
| 6       | 16              | 30               |
| 8       | 20              | 50               |
| 10      | 24              | 80               |
| 12      | 28              | 120              |

Never below 6 in ID for chips/blocks.

### Missouri / Fines Path

First-class geometry for sawdust and fines. Open-core / whole-bed SV. Do not force fines through a classic Imbert throat without redesign.

---

## Materials Selection Guide

| Zone | Preferred | Acceptable | Avoid |
|------|-----------|------------|-------|
| Throat / nozzles / reduction | Stainless 310 or 316 | Thick mild steel (sacrificial) | Thin mild steel, aluminum |
| Outer shell | Mild steel 10–12 ga or ¼ in | — | Thin sheet that warps |
| Grate | Stainless or heavy high-carbon | Thick mild perforated | Light hardware cloth alone |
| Insulation | Ceramic fiber blanket 1–2 in around hot zone | Refractory coating over fiber | No insulation on engine units |
| Seals | High-temp fiberglass rope | Quality gaskets | Silicone at hot zones |

Airtight welds required. Prefer quality MIG. Flux-core alone is a common leak source.

---

## Fuel Prep Checklist

- Moisture: **<20% wb** for engine gas; **<15%** preferred; kiln or solar dry if needed
- Size: uniform; ~¾–2 in for Imbert/stratified; fines → Missouri geometry only
- Species: hardwood preferred for energy density; softwood OK if dry and sized
- Contaminants: no painted, treated, or dirty wood (ash, clinker, toxins)
- Storage: keep dry; covered bins; avoid ground contact
- Bulk density prepared wood: roughly 9–19 lb/ft³

---

## Gas Cleaning / Filtration

Engine-quality train:
1. Cyclone / drop-out
2. Cooler / condenser (cool toward ambient — denser gas, more mass per engine stroke, tar condensed out)
3. Condensate trap with drain
4. Fine filter (char, fabric, foam, packed media)

**Hot gas myth:** Feeding hot producer gas to an engine does **not** improve efficiency. Cooler gas is denser (ideal gas law: n ∝ 1/T at fixed P,V), so the engine ingests more fuel mass per stroke. Hot gas also keeps tar vapor that condenses inside the engine.

Heating-only duty can use a lighter train.

---

## Performance, Fuel & Gas Data

- Gas yield: **35–40 scf/lb dry wood** (reduce with moisture)
- Composition: CO 17–25%, H₂ 12–20%, CO₂ 8–15%, CH₄ 1–5%, N₂ balance
- LHV: **120–160 BTU/scf**
- CGE: commonly **60–75%** decent DIY
- Power rules of thumb: ~2 lb dry biomass per hp-hour; ~3 lb per kWh; ~2 scfm gas per hp

---

## Efficiency — Real vs Ideal

**CGE** = (gas LHV × gas yield) / fuel LHV, adjusted for wall/leak loss.  
**HGE** includes sensible heat (burners / Stirling heat input).

| Metric | Real DIY | Ideal baseline |
|--------|----------|----------------|
| CGE | ~60–70% | ~75% |
| Wall loss | ~8–14% | ~2% |
| Engine thermal | ~22% | ~24% |
| Overall of ideal | often ~75–85% | 100% by definition |

Ideal baseline: 12% moisture, ER 0.30, insulated Imbert (or updraft for heat), matched engine.

---

## Turndown, Moisture & Insulation

Turndown ≈ design output / minimum stable output.

- Example: **~8 → ~2** as moisture **~10% → 50% wb**
- Insulation effect stronger on smaller units
- Wet fuel + cold walls → stable only near full load

---

## Tar Management & Cracking

Primary: high temperature; force all gas through hot char (Reed SV).  
Secondary: cooler + condensate + filters.  
Engine target often **<100 mg/Nm³**. Tar condensate is hazardous.

---

## Biochar & Activated Charcoal

Normal byproduct. Useful as filter media and soil amendment. Activation needs further treatment.

---

## Syngas-to-Liquids

Home-scale F-T generally impractical. Prefer direct gas use in engines, Stirling, or burners.

---

## Safety & Emissions

- **CO** — primary acute hazard; outdoor or strong ventilation; CO alarms required
- Air leaks into hot gas path — explosion risk
- Hot surfaces; hopper fire if air reaches fuel
- Flame arrestors on engine feeds
- Treat tar condensate as hazardous waste
- Never run an engine gasifier indoors without industrial-grade CO detection and exhaust

---

## Engine, Stirling & Generator Integration

- **IC engines**: Clean, cool, dry gas; **20–40% derate** vs gasoline; mixture airflow must match gasifier output
- **Stirling**: External combustion — more gas-quality tolerant; size from thermal input + manufacturer specs
- Optional gas bag / small buffer

Mixture estimate (rough): displacement × RPM/2 × VE; wood-gas share of mixture ~0.45–0.5 by volume.

**Kaupp:** Design gasification unit + purification + final energy converter as **one system**.

---

## Stirling Thermal Matching

Library has almost no coupled gasifier→Stirling sizing data. Practical approach:

1. Size gasifier for continuous thermal power the Stirling needs (not peak house load).
2. Prefer hot-gas efficiency path — Stirling can use sensible heat; still manage tar if any gas path contacts cold surfaces.
3. Heat exchanger / head interface: follow Stirling manufacturer max temp and heat flux limits.
4. Buffer thermal mass or battery storage so gasifier runs steady, not cycling with house load.
5. Dual-fuel / backup: plan a clean shutdown to grid or propane when gasifier is offline.

---

## Hybrid System Integration

Battery storage, thermal mass, solar/grid as appropriate. Controls: zone temps, draft, grate, low-fuel, CO. Clean shutdown and backup heat/power.

Size from continuous power need, not peak house load alone. Stationary hybrid requirements ≠ vehicle woodgas requirements.

**Dual-fuel / backup mode:** Always design a safe way to stop the gasifier and switch to grid, propane, or battery without creating CO or backfire hazards.

---

## Time-Series / Simulator Behavior

- Duration **1–168 h**
- Fuel inventory depletes at sized feed rate (lb/h)
- Startup ramp ~30–45 min
- Organic noise/drift on composition and LHV
- Gradual fade on last ~12% of fuel
- Charts: fuel remaining, LHV, tar, shaft power, H₂/CO, combined normalized, CGE real vs ideal
- Start / stop / reset; CSV after stop
- Optionally fold turndown limits from moisture/insulation into part-load behavior

---

## Startup & Shutdown Checklist

**Startup**
1. Inspect seals, grate, filters, condensate drains
2. CO alarm on and working
3. Fuel dry and correctly sized
4. Light with blower or engine suction per design; establish stable charcoal bed before loading full fuel
5. Watch for tar smell, pressure drop, and CO at start

**Shutdown**
1. Stop fuel feed / let bed burn down as designed
2. Continue draft until gas is clear and temperatures drop
3. Close air inlets only when safe per design (avoid hopper flashback)
4. Drain condensate; service filters as needed
5. Log run hours

---

## Common DIY Failure Modes

| Failure | Typical root cause | Prevention |
|---------|-------------------|------------|
| Chronic tar | Low SV, wet fuel, no insulation | Dry fuel; insulate; raise load |
| Air leaks / weak gas | Flux-core welds, bad gaskets | Quality MIG; pressure-test |
| Bridging | Oversized or wet chunks | Uniform size; agitator |
| Melted throat | Thin mild steel, air leaks | Stainless or thick sacrificial; seal |
| Engine damage | Hot unfiltered gas | Cooler + trap + filter |
| No part-load | High moisture, cold walls | Dry fuel; insulation |
| “Paperweight” unit | Skipped insulation and hot-zone materials | Treat insulation as required, not optional |

---

## Troubleshooting

| Problem              | Likely Causes                          | Fixes                                      |
|----------------------|----------------------------------------|--------------------------------------------|
| Bridging / channeling| Wet or irregular fuel, no agitation    | Better fuel prep, agitators, vibration     |
| High tar             | Low SV, wet fuel, cold walls, short reduction | Raise load, dry fuel, insulate, force gas through hot zone |
| Ash / clinker        | Poor grate action or high-ash fuel     | Improve grate; change fuel                 |
| Overheating / melt   | Air leaks or thin hot zone             | Seal; stainless; insulation                |
| Poor gas quality     | Leaks, wrong ER, dirty filters         | Leak check; filter service                 |
| High pressure drop   | Clogged filters or ash                 | Clean filters; ash removal                 |
| Undersized engine    | Gasifier scfm > engine can ingest      | Lower target power or larger CID/RPM       |
| No low-load stability| High moisture, weak insulation         | Dry fuel; add insulation; raise minimum load |
| Leaky long-term unit | Poor welds, thermal-cycle damage       | Quality MIG; inspect seals; serviceable joints |

**Decision tree (short)**  
Tar high? → Check moisture → insulation → SV/load → reduction height → cooler/filter.  
Weak power? → Check leaks → gas density (cooling) → engine match → fuel dry mass rate.

---

## Maintenance Schedule

| Interval | Actions |
|----------|--------|
| Every run | Drain condensate; check CO alarm; visual leak/seal check |
| Every 10–25 h | Shake/clean grate; inspect filter pressure drop; empty ash |
| Every 50–100 h | Deep filter service or media change; inspect nozzles/throat for erosion |
| Seasonal | Full seal inspect; weld repair; insulation check; calibrate instruments |

Tie intervals to logged run hours, not calendar alone.

---

## Build Skill Level & Time Guide

| Build type | Skill | Rough first-build time | Notes |
|------------|-------|------------------------|-------|
| Simple can / TLUD stove | Low | Hours–1 day | Learning only |
| FEMA stratified | Low–Mod | Weekend–1 week | Good first engine-capable attempt |
| Imbert DIY (insulated) | Moderate | 2–6 weeks | Welding + stainless critical |
| Missouri fines | Moderate | 2–4 weeks | Fuel prep discipline |
| Full hybrid (gasifier + Stirling + storage) | High | Months | Systems integration dominates |

First builds always take longer. Budget insulation and filtration materials; skipping them costs more in failed runs.

---

## When Answering

- English units primary.
- Concrete dimensions, formulas, step-by-step.
- **Family-correct SV** — never mix Imbert throat load with FEMA bed load.
- Prefer FAO / SERI / Reed / Gengas / FEMA / Missouri / Drive On Wood empirical rules.
- Frame as **whole system** when building for engine or Stirling.
- Distinguish heating-only vs engine-quality; vehicle vs stationary.
- State efficiency as real vs ideal; mention turndown risk when moisture high or insulation weak.
- Research units (Viking) are benchmarks, not DIY templates.
- Cooler gas is denser and better for engines (ideal gas law).
- Prefer no unsolicited scope creep; answer what was asked.
- Translate marketing/alias names into family terms; flag pyrolysis or stove docs that are not engine-gas designs.

---

## User Artifacts & Tools

**Hearth Lab** (GitHub Pages modular app)  
- Live: https://jdnitrap.github.io/gasifier/  
- Repo: https://github.com/jdnitrap/gasifier  
- Modules: `js/fuels.js`, `thermo.js`, `compute.js`, `efficiency.js`, `simulate.js`, `render.js`, `form.js`, `main.js`, `css/app.css`

**Repo `uploads/` spine** (by value; zips ignored)  
1. Reed *Superficial Velocity*  
2. Gengas (Swedish WWII)  
3. SERI handbook (Reed & Das)  
4. FEMA simplified plans  
5. Missouri gasifier (fines)  
6. Drive On Wood set  
7. Kaupp *Small Scale Gas Producer-Engine Systems*  
8. Turndown study  
9. Viking benchmark; NREL tar literature  
10. Secondary historical/survey docs  

---

## References

- `references/fao-design-guidelines.md` — FAO design rules (English units)  
- `references/design-data.md` — SV, efficiency, turndown, power rules  
- Reed et al. *Superficial Velocity — The Key to Downdraft Gasification*  
- FEMA *Construction of a Simplified Wood Gas Generator* (1989)  
- SERI/NREL *Handbook of Biomass Downdraft Gasifier Engine Systems* (Reed & Das, 1988)  
- *Gengas — Generator Gas: The Swedish Experience 1939–1945*  
- FAO *Wood Gas as Engine Fuel* (1986)  
- Missouri Wood Gasifier (Rissler / Missouri DNR)  
- Kaupp *State of the Art for Small Scale Gas Producer-Engine Systems*  
- Drive On Wood library; turndown study; DTU Viking  

---

## Skill Version / Change Log

- **2026-08-22** — Full uploads library patterns; family SV; real-vs-ideal efficiency; turndown; Missouri first-class; Hearth Lab alignment.
- **2026-08-22 (b)** — Added model limits, materials guide, fuel prep, Stirling thermal matching, startup/shutdown, common DIY failure modes, maintenance schedule, build skill/time guide, dual-fuel/backup note, cooler-gas density physics, decision-tree troubleshooting.
- **2026-08-22 (c)** — Added Naming, Aliases & Related Processes: gasifier aliases, Stirling product-name variants, pyrolysis vs gasification distinction, guidance for reading mixed-label documents.
