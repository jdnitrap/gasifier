# Unified Gasifier Simulator - GitHub Pages Setup

This is a React-based gasifier simulator with ideal and realistic performance modes. It's ready to deploy to GitHub Pages for testing before publishing to homegasifier.com.

## Quick Start

### 1. Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit: unified gasifier simulator"
git branch -M main
git remote add origin https://github.com/[YOUR_USERNAME]/gasifier-simulator.git
git push -u origin main
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Local Development
```bash
npm run dev
```
Visit `http://localhost:5173` (or the URL shown in terminal)

### 4. Build for Production
```bash
npm run build
```
Creates optimized files in `dist/` folder

### 5. Deploy to GitHub Pages
```bash
npm run deploy
```

This automatically pushes the `dist` folder to the `gh-pages` branch.

### 6. Enable GitHub Pages
1. Go to your repo settings: `https://github.com/[YOUR_USERNAME]/gasifier-simulator/settings`
2. Scroll to "Pages" section
3. Select "Deploy from a branch"
4. Choose `gh-pages` branch, `/root` folder
5. Save

Your simulator will be live at: `https://[YOUR_USERNAME].github.io/gasifier-simulator/`

---

## Project Structure

```
gasifier-simulator/
├── unified-gasifier-simulator.jsx  # Main React component
├── main.jsx                         # React entry point
├── index.html                       # HTML template
├── package.json                     # Dependencies & scripts
├── vite.config.js                   # Build configuration
├── .gitignore                       # Git exclusions
└── dist/                            # Build output (generated)
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

## Troubleshooting

### `npm install` fails
- Ensure Node.js 18+ is installed: `node --version`
- Try clearing cache: `npm cache clean --force && npm install`

### `npm run dev` shows "port 5173 in use"
- Kill the process: `lsof -i :5173 | kill -9 <PID>`
- Or use a different port: `npm run dev -- --port 3000`

### Deploy fails
- Ensure `gh-pages` is installed: `npm install gh-pages --save-dev`
- Check GitHub token permissions (must have repo write access)
- Verify `homepage` in package.json matches your repo URL

### Simulator not showing on GitHub Pages
- Wait 1–2 minutes after deploy
- Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
- Check that GitHub Pages is enabled for `gh-pages` branch

---

## Customization

### Change GitHub Pages URL
In `package.json`, update `homepage`:
```json
"homepage": "https://your-username.github.io/your-repo-name/"
```

And in `vite.config.js`, update `base`:
```javascript
base: '/your-repo-name/',
```

### Add New Outputs
Edit `calculatePerformance()` function in `unified-gasifier-simulator.jsx` and add to the return object.

### Modify Calculation Logic
All calculations are in the `calculatePerformance()` function. Change constants, formulas, or loss models as needed.

### Styling
Styles are embedded in the JSX within `<style>` tags. Modify CSS variables (--bg, --card, --accent, etc.) to change theme.

---

## Next Steps

1. **Test locally**: `npm run dev`
2. **Push to GitHub**: `git push origin main`
3. **Build & deploy**: `npm run build && npm run deploy`
4. **Visit your site**: `https://[USERNAME].github.io/gasifier-simulator/`
5. **Test thoroughly** before publishing to homegasifier.com
6. **Document any bugs** found during testing
7. **Iterate** on calculation models as real-world validation data arrives

---

## Support

For issues with React, Vite, or GitHub Pages, see:
- Vite docs: https://vitejs.dev/
- React docs: https://react.dev/
- GitHub Pages: https://docs.github.com/en/pages

For gasifier-specific questions, reference:
- Chandra & Payne (1986): "Turndown Ratio of a Gasifier-Combustor Predicted by a Simulation Model"
- homegasifier.com documentation
