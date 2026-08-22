# Hearth Lab

DIY wood-gasifier **sizer + burn simulator**. You enter the job (power, fuel, hours). The lab sizes the hearth, hopper, air, cooling, and engine match, then runs a time-series burn.

**Live:** [https://jdnitrap.github.io/gasifier/](https://jdnitrap.github.io/gasifier/)

## What it does

1. **Design brief** — end use, target hp, operation hours, fuel / blend, moisture, particle size, ER, hearth-load band, geometry family, engine CID/RPM.
2. **Snapshot** — gas flow, LHV, tar, composition, cold-gas efficiency vs an ideal machine.
3. **Efficiency** — this machine vs ideal (dry fuel, ER 0.30, insulated Imbert, matched engine). Loss breakdown and extra wood vs ideal.
4. **Required sizes** — throat or bed, reactor, hopper, nozzles, grate. Duty sets the steel; you do not pick a kit first.
5. **Gas path** — cooler duty, condensate, cyclone → cooler → trap → filter.
6. **Engine match** — mixture airflow vs gasifier output, derate vs gasoline.
7. **Simulate** — start / stop / reset, 1–168 h, fuel remaining, LHV, tar, power, H₂/CO, combined overview, **real vs ideal efficiency trend**. Save CSV. Pan/zoom the charts.

Units are English (in, scfm, Btu, lb, hp).

## Physics (rules of thumb, not a certified design)

- Imbert throat load from Gengas/Reed (Bhmax 0.9 Nm³/h·cm² ≈ 2.5 m/s; typical ~1.25 m/s). Nozzle plane ≈ 2× throat.
- Stratified / FEMA load across the whole bed (Reed ~0.1–0.3 m/s).
- Gas LHV from H₂ / CO / CH₄. Air from elemental AFR × ER.
- Cold-gas efficiency = gas energy / dry-fuel LHV. Overall = CGE × engine (or hot-gas × burner for heat).

Insulation, fuel size, and how you run it still move tar more than the last decimal of LHV.

## Files

| File | Role |
|---|---|
| `index.html` | Page |
| `hearth-lab.js` | Sizer + simulator |
| `uploads/` | Reference PDFs (FEMA, handbook, Missouri, …) |

Open `index.html` locally or use GitHub Pages on `main` `/`.
