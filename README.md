# Wood Gasifier Design Tools

Home-scale **Imbert / downdraft** wood gasifier design calculator and starter kinetic model.

All calculations use **English (US customary) units**.

## Live Calculator

Open the static page:

**https://jdnitrap.github.io/wood-gasifier/**

(or open `index.html` directly after enabling GitHub Pages)

The page lets you size throat diameter, hearth, nozzles, etc. from either wood feed rate or target electric power using classic FAO / SERI hearth-load rules.

## Python Model

`gasifier_design_model.py` – integrated design sizing + 1-D reduction-zone kinetic model.

```bash
pip install numpy scipy
python gasifier_design_model.py
```

Edit the inputs at the top of the file (wood feed rate, hearth load, etc.).

## Notes

- Design rules follow FAO *Wood Gas as Engine Fuel* and SERI/NREL handbook converted to English units.
- The kinetic portion is a functional starter (directional, not fully calibrated against experiments yet).
- Intended for practical home-scale builds and virtual testing before cutting metal.

## License

Use freely for personal / educational projects.
