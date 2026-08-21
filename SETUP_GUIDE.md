# Unified Gasifier Simulator - GitHub Pages Deployment

React-based educational gasifier simulator with ideal and realistic performance modes, running on **GitHub Pages**.

## ✅ Live Demo

**https://jdnitrap.github.io/wood-gasifier/**

---

## Quick Start (Local Development)

### 1. Clone or Download
```bash
git clone https://github.com/jdnitrap/wood-gasifier.git
cd wood-gasifier
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Dev Server
```bash
npm run dev
```
Open `http://localhost:5173/wood-gasifier/` in your browser

### 4. Make Changes
Edit `unified-gasifier-simulator.jsx` and changes appear instantly

### 5. Build for Production
```bash
npm run build
```
Creates optimized files in `dist/` folder

---

## Project Structure

```
wood-gasifier/
├── unified-gasifier-simulator.jsx   # Main React component (100% of logic)
├── main.jsx                          # React entry point
├── index.html                        # HTML template
├── vite.config.js                    # Build config (base: '/wood-gasifier/')
├── package.json                      # Dependencies & scripts
├── .github/workflows/deploy.yml      # Auto-deploy on push
├── .gitignore                        # Git exclusions
├── gasifier_design_model.py          # Python validation model
├── skill/                            # Design knowledge base
└── dist/                             # Build output (auto-generated)
```

---

## Features

### Modes
- **Ideal Performance**: Energy balance without downstream losses
- **Realistic Performance**: Includes cooler efficiency, filter losses, tar cracking efficiency

### Tabs
1. **Reactor**: Geometry (height, diameter), fuel type, moisture content
2. **Operating Conditions**: Equivalence ratio, air temperature
3. **Downstream**: Cooler type/efficiency, filter type, tar cracker option
4. **Results**: All calculated outputs (mass flows, temps, efficiency, syngas composition)

### Outputs (All US Customary Units)
- Mass flows: lbm/hr, cfm
- Temperatures: °F
- Energy: Btu/hr
- Efficiency: %
- Syngas: CO, H₂, CO₂, CH₄, N₂ (% vol)
- Tar: g/Nm³
- Pressure drop: inH₂O

---

## Unit System

**All inputs and outputs use US customary units:**
- Length: inches, feet
- Weight: lbm (pounds-mass)
- Flow: lbm/hr, cfm (cubic feet per minute)
- Temperature: °F
- Energy: Btu/hr, Btu/lbm
- Pressure: inH₂O (inches of water column)

---

## Calculation Overview

### Cold Gas Efficiency (CGE)
```
CGE = (Energy_output - Losses) / Total_input × 100%
```

**Ideal mode**: Only accounts for cooler heat removal

**Realistic mode**: Subtracts:
- Tar cracker: 3% (if enabled)
- Filter losses: 2% (ceramic) or 1% (baffle/mesh)
- System losses (radiation, unburned, sensible): 4%

### Syngas Composition
Empirically modeled based on equivalence ratio (ER):
- **CO**: 18 + ER × 8 (%)
- **H₂**: 15 + ER × 5 (%)
- **CO₂**: 12 - ER × 4 (%)
- **CH₄**: 1 + ER × 0.5 (%)
- **N₂**: Balance

> **Note**: These are empirical approximations. Validate against measured gas analyzer data from your system.

### Tar Modeling
```
Tar = 50 + (ER - 0.25) × 200 g/Nm³
If cracker enabled: Tar × 0.3
```

### Temperature Calculation
```
T_reactor = 1200 + (ER - 0.25) × 400 °F
Clamped: 600–1800°F
```

---

## Validation Notes

### What's Validated
- Stoichiometry formula (STOICH_AIR = 6.2 lbm/lbm)
- Efficiency formula structure
- Temperature vs ER relationships (qualitative)
- Output ranges (75–95% CGE achievable)

### What's NOT Validated
- Syngas composition (no measured data reference)
- Tar yields (empirical model only)
- Downdraft-specific behavior (Chandra & Payne paper is updraft)
- System scale effects (assumes consistent performance across sizes)

### Recommended Next Steps
1. Collect measured syngas data (gas analyzer) from your system
2. Collect tar sample data (tar trap collection)
3. Compare simulator predictions vs measured data
4. Document accuracy range (target: ±15%)
5. Update model if systematic errors found

---

---

## Automatic Deployment (GitHub Actions)

**The simulator auto-deploys to GitHub Pages on every push to `main`.**

1. Edit files locally
2. Commit changes: `git add . && git commit -m "your message"`
3. Push to main: `git push origin main`
4. Workflow runs automatically → builds & deploys
5. Live at: **https://jdnitrap.github.io/wood-gasifier/** (1-2 min delay)

**No manual deploy commands needed.** The `.github/workflows/deploy.yml` handles everything.

---

## Troubleshooting

### `npm install` fails
```bash
node --version  # Must be 18+
npm cache clean --force
npm install
```

### `npm run dev` shows "port 5173 in use"
```bash
# Kill the process:
lsof -i :5173 | grep node | awk '{print $2}' | xargs kill -9

# Or use different port:
npm run dev -- --port 3000
```

### Website not updating after push
- GitHub Actions takes 1-2 minutes to build and deploy
- Check Actions tab in GitHub repo for build logs
- Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
- Verify `.github/workflows/deploy.yml` exists and is valid

### GitHub Actions failing
1. Go to: `https://github.com/jdnitrap/wood-gasifier/actions`
2. Click the failed workflow
3. Check "build" and "deploy" logs for errors
4. Common fixes:
   - Ensure `vite.config.js` has `base: '/wood-gasifier/'`
   - Check `package.json` has all dependencies
   - Verify Node version in workflow is 18+

---

## Customization

### Change Calculation Logic
Edit `calculatePerformance()` in `unified-gasifier-simulator.jsx`:
- Modify constants (STOICH_AIR, FUEL_LHV, GAS_YIELD, etc.)
- Change formulas for CGE, temperature, tar, etc.
- Add new output fields to the return object

### Modify UI / Styling
Styles are embedded in JSX. CSS variables at top of component:
```jsx
const styles = {
  --bg: '#f8f9fa',
  --card: '#ffffff',
  --text: '#333333',
  --accent: '#0066cc',
  // ... more
};
```

### Add New Inputs
1. Add `const [newInput, setNewInput] = useState(defaultValue);`
2. Add input control in JSX (slider, number field, etc.)
3. Use `newInput` in `calculatePerformance()` calculations
4. Add output to results display

---

## Testing Workflow

**Local Development:**
```bash
npm run dev          # Start dev server
# Edit simulator.jsx
# Changes auto-reload in browser
# Test calculations and UI
```

**Before Pushing:**
```bash
npm run build        # Verify production build works
npm run preview      # Test production build locally
```

**After Pushing:**
```bash
# Wait 1-2 minutes
# Visit: https://jdnitrap.github.io/wood-gasifier/
# Test all inputs and calculations
```

---

## References

**Technical:**
- Vite: https://vitejs.dev/
- React: https://react.dev/
- GitHub Pages: https://docs.github.com/en/pages
- GitHub Actions: https://docs.github.com/en/actions

**Gasifier Design:**
- Chandra & Payne (1986): "Turndown Ratio of a Gasifier-Combustor Predicted by a Simulation Model"
- FAO *Wood Gas as Engine Fuel* handbook
- SERI/NREL downdraft gasifier manual
