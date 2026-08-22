# Hearth Lab

DIY wood-gasifier **sizer + burn simulator**. Enter the job (power, fuel, hours). The lab sizes the hearth, hopper, air, cooling, and engine match, then runs a time-series burn.

**Live:** [https://jdnitrap.github.io/gasifier/](https://jdnitrap.github.io/gasifier/)

## Edit map (modular)

Change one file. Do not dump new physics into `index.html`.

| File | What to edit |
|---|---|
| `js/fuels.js` | Fuel table, hearth-load bands, family SV, constants |
| `js/thermo.js` | Gas composition, yield, AFR, fuel LHV, family pick |
| `js/compute.js` | Throat / bed / hopper / nozzles / engine match |
| `js/efficiency.js` | Ideal vs real, CGE / HGE / overall, loss list |
| `js/simulate.js` | Trends, fuel burn, CSV |
| `js/render.js` | What the page displays |
| `js/form.js` | Reads the design-brief inputs |
| `js/main.js` | Wires events |
| `css/app.css` | Look |
| `index.html` | Page structure only |

`hearth-lab.js` is a one-line shim for old bookmarks. New entry is `js/main.js`.

## Physics (rules of thumb, not a certified design)

- Imbert throat load from Gengas/Reed (Bhmax 0.9 Nm³/h·cm² ≈ 2.5 m/s; typical ~1.25 m/s). Nozzle plane ≈ 2× throat.
- Stratified / FEMA load across the whole bed (Reed ~0.1–0.3 m/s).
- Gas LHV from H₂ / CO / CH₄. Air from elemental AFR × ER.
- Cold-gas efficiency = gas energy / dry-fuel LHV. Overall = CGE × engine (or hot-gas × burner for heat).

## Run locally

Open `index.html` from a static server (ES modules need http, not `file://`):

```bash
python3 -m http.server 8080
```

Then visit http://127.0.0.1:8080/

GitHub Pages serves `main` from `/`.
