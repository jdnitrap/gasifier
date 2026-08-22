# Wood Gasifier — Naming, Aliases & Related Processes

Companion to `SKILL.md`. Use this file when resolving commercial product names, European Holzgas branding, Stirling product labels, or searching for more aliases.

## Naming, Aliases & Related Processes

Gasifier literature and marketing use many overlapping names. Treat these as the **same core concept** unless geometry or duty clearly differs.

### Common aliases for wood / biomass gasifiers
| Name you may see | Usually means | Notes |
|------------------|---------------|-------|
| Wood gasifier / woodgas unit / wood gas generator | Downdraft or stratified gasifier | Default DIY and European marketing |
| Producer gas generator / gengas / Holzgas | WWII-era / European term | Same physics; Gengas literature |
| Imbert / constricted-throat / nozzle gasifier | Classic Imbert family | Throat + radial nozzles |
| Stratified / open-top / FEMA | Open-core stratified bed | FEMA emergency design lineage |
| Missouri / open-core / sawdust gasifier | Fines-capable open bed | Different geometry for fines |
| Cross-draft / cross-flow | Side air inlet | Often higher tar |
| Updraft / counter-flow / counter-current fixed bed | Air up, fuel down | High tar; heat-only or industrial CHP |
| GEK / GEK TOTTI / Power Pallet / CharPallet / Powertainer | All Power Labs lineage | Modular DIY-to-commercial; TOTTI = thermal integration |
| TLUD / rocket / woodgas stove / top-lit updraft | Stove-scale inverted downdraft | Cooking or biochar; not engine gas |
| Biochar reactor / retort / kiln / screw pyrolyzer / rotary kiln | Often pyrolysis-focused | May not produce engine-quality gas |
| Syngas generator / biomass gasifier / wood gas CHP | Industrial marketing | Check scale and cleanup claims |
| EnergyBlock / wood gasification container | Spanner Re² / similar modular CHP | Pre-packaged gasifier + engine + controls |
| BioMax | Community Power Corporation (historical) | Small packaged gasifier-genset branding |
| WoodRoll | Cortus process | Indirect/staged gasification to syngas + biochar |
| CHiP / CHiP50 Cogenerator | ESPE (Italy) and similar | Packaged biomass cogenerator branding |
| SyngaSmart / GAS Unit | RESET (Italy) | Containerized gasification CHP / gas-only units |
| Burkhardt wood gasifier / ECO series | Burkhardt (Germany) | Pellet/chip wood-gas CHP product line |
| Volter | Volter (Finland) | Packaged small wood-gas CHP |
| ReGaWatt / LiPRO / SynCraft / Holzenergie Wegscheid / Glock Ökoenergie / Fröling / Biotech | European fixed-bed CHP makers | Often “wood gas CHP plant” not “gasifier kit” |
| Biowatt / Woodwatt / Powermax | Chinese industrial skid gasifier-gensets | Marketing emphasizes generator + modular plant |
| Ankur / Debo / fluidized bed / fixed bed industrial | Larger industrial suppliers | Capacity and feedstock language dominates naming |

### Commercial product-line patterns
- **DIY / research kit language:** GEK, gasifier kit, experimenter’s kit  
- **Packaged power language:** Power Pallet, EnergyBlock, wood gas CHP, biomass power plant, gasifier generator, modular skid  
- **European “Holzgas” CHP:** Often sells the whole plant (gasifier + engine + heat recovery) under a brand model number, not a geometry name  
- **Industrial Asia:** “Wood gasifier generator,” “biomass gasification plant,” capacity in kW/MW, feedstock type in the title  
- **Biochar-first units:** TLUD, retort, kiln, CharPallet — gas may be secondary or burned for heat  

### Stirling and external-combustion naming
Stirling literature and products often avoid the word “Stirling”:
- Hot-air engine, external combustion engine, regenerative heat engine, free-piston engine  
- Manufacturer brands: Microgen, Qnergy, Frauscher Gen70, Sunmachine (historical), Stirling DK / Stirling Danmark (historical), Whispertech (historical), Infinia (historical)  
- System brands: BioGen / Combined Energy Technology (gasifier + Microgen-style Stirling), ÖkoFEN + Microgen/Qnergy pellet-CHP packages  
- “Waste-heat engine,” “biomass engine,” “pellet CHP,” or “mCHP” when the brochure never says Stirling  

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

### How to search the web for more aliases (for this or another AI)
Use these query patterns; then map hits back to family and duty.

**Gasifier product / brand discovery**
- `"wood gasifier" OR "wood gas CHP" OR "biomass gasifier" OR "producer gas" OR Holzgas manufacturer OR plant OR generator`
- `"Power Pallet" OR GEK OR TOTTI OR EnergyBlock OR "wood gasifier generator" OR SyngaSmart OR BioMax OR WoodRoll`
- `Burkhardt OR Volter OR Spanner Re2 OR LiPRO OR ReGaWatt OR SynCraft OR "Holzenergie Wegscheid" gasifier`
- `Ankur OR Biowatt OR Powermax OR Debo "biomass gasifier" OR "wood gasifier generator"`

**European / industrial CHP language**
- `Holzgas OR "Holzvergasung" OR "Holz-BHKW" OR "wood gas CHP" kW`
- `"fixed bed gasifier" OR "downdraft" OR "counter-current fixed bed" CHP manufacturer`

**Stirling + biomass (often unlabeled)**
- `Stirling biomass OR pellet OR "wood gas" OR gasifier Microgen OR Qnergy OR Frauscher OR BioGen OR mCHP`
- `"external combustion" OR "free piston" OR "hot air engine" biomass OR pellet CHP`
- `"waste heat engine" OR "biomass engine" Stirling OR Microgen`

**Pyrolysis / biochar units that get confused with gasifiers**
- `TLUD OR "top-lit updraft" OR retort OR "biochar kiln" OR "screw pyrolyzer" OR "rotary kiln" gasifier OR syngas`
- `"pyrolysis reactor" biomass engine OR CHP OR "producer gas"`

**What to extract from each hit**
- Brand / model name as sold  
- Geometry cues (downdraft, updraft, fluidized, staged, open-top)  
- Duty (engine gas, heat-only, biochar-first, packaged CHP)  
- Whether they call it gasifier, wood gas plant, syngas generator, CHP, kiln, or something else  

**What not to treat as a gasifier design template**
- Pure boilers, pellet stoves without a producer-gas path  
- Bio-oil / fast-pyrolysis plants aimed at liquid fuel  
- Marketing-only “syngas” claims with no cleanup or engine match data  

### When Answering
- Translate aliases into family terms so the user gets one consistent vocabulary.
- Flag when a document is pyrolysis- or stove-oriented and not engine-gas design.
- Do not force Imbert rules onto a unit that is clearly stratified, Missouri, or pyrolysis-only.
- If asked to find more commercial names, use the search patterns above (or hand them to another AI).
