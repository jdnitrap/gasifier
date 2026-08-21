# Wood Gasifier Simulator

Interactive **Imbert-style downdraft** gasifier performance calculator with ideal and realistic modes.

**All units: US customary (lbm, ft, cfm, °F, Btu/hr)**

## 🚀 Live Simulator

**https://jdnitrap.github.io/wood-gasifier/**

### Features
- **Ideal Performance Mode**: Pure energy balance (theoretical max)
- **Realistic Performance Mode**: Includes downstream losses (cooler, filter, tar cracker)
- **Inputs**: Fuel type, feed rate, moisture, reactor geometry, equivalence ratio, downstream equipment
- **Outputs**: Mass flows, temperatures, efficiency (CGE), syngas composition, tar content, pressure drop
- **3D Visualization**: Optional Three.js reactor diagram

## Python Model

`gasifier_design_model.py` – integrated design sizing + 1-D reduction-zone kinetic model.

```bash
pip install numpy scipy
python gasifier_design_model.py
```

Edit the inputs at the top of the file (wood feed rate, hearth load, etc.).

## Design Skill

The full practical design knowledge base lives in the `skill/` folder:

- `skill/SKILL.md` — Main design, sizing, materials, tar control, safety, troubleshooting, and integration guidance
- `skill/references/fao-design-guidelines.md` — Classic FAO rules converted to English units (hearth load, geometry, nozzle table)
- `skill/references/design-data.md` — Quick-reference tables

## Notes

- Design rules follow FAO *Wood Gas as Engine Fuel* and SERI/NREL handbook converted to English units.
- The kinetic portion is a functional starter (directional, not fully calibrated against experiments yet).
- Intended for practical home-scale builds and virtual testing before cutting metal.

## License

Use freely for personal / educational projects.
