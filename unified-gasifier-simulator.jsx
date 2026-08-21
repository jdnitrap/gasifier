import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const UnifiedGasifierSimulator = () => {
  // Input states - Reactor
  const [fuelType, setFuelType] = useState('woodChips');
  const [feedRateLbH, setFeedRateLbH] = useState(50);
  const [moisturePercent, setMoisturePercent] = useState(15);
  const [reactorHeight, setReactorHeight] = useState(48);
  const [reactorDiameter, setReactorDiameter] = useState(12);
  
  // Input states - Operating
  const [equivalenceRatio, setEquivalenceRatio] = useState(0.28);
  const [airTempF, setAirTempF] = useState(70);
  const [grate, setGrate] = useState('fixed');
  
  // Input states - Downstream
  const [coolerType, setCoolerType] = useState('shell');
  const [coolerEfficiency, setCoolerEfficiency] = useState(0.85);
  const [filterType, setFilterType] = useState('ceramic');
  const [crackerEnabled, setCrackerEnabled] = useState(false);
  
  // Mode
  const [mode, setMode] = useState('realistic'); // 'ideal' or 'realistic'
  const [activeTab, setActiveTab] = useState('reactor');
  const [showVisualizer, setShowVisualizer] = useState(false);
  
  // 3D Visualization
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  // Constants (US customary units)
  const STOICH_AIR = 6.2; // lb air per lb fuel (dry basis)
  const FUEL_LHV = 8000; // Btu/lbm (dry wood basis)
  const GAS_YIELD = 37; // scf/lb dry wood (FAO standard)
  const AIR_DENSITY = 0.075; // lbm/scf @ 70°F
  const SYNGAS_CP = 0.26; // Btu/lbm·°F (avg for producer gas)
  const AIR_CP = 0.24; // Btu/lbm·°F
  const STEFAN_B = 1.714e-9; // Btu/hr·ft²·°R⁴

  // ==================== CALCULATION ENGINE ====================
  const calculatePerformance = () => {
    // Fuel properties
    const dryFuel = feedRateLbH / (1 + moisturePercent / 100);
    const waterIn = feedRateLbH - dryFuel;
    
    // Stoichiometric air requirement
    const stoichAir = dryFuel * STOICH_AIR;
    const actualAir = stoichAir * equivalenceRatio;
    const airCfm = (actualAir / AIR_DENSITY) / 60; // Convert to cfm

    // Gas production (from gasification)
    const gasScfh = dryFuel * GAS_YIELD; // scf/hr
    const gasCfm = gasScfh / 60; // cfm
    const gasLbH = (gasScfh * AIR_DENSITY); // lbm/hr (syngas mass)

    // Combustion energy
    const fuelEnergy = dryFuel * FUEL_LHV;
    const airEnergy = actualAir * AIR_CP * (airTempF - 70);
    const totalInput = fuelEnergy + airEnergy;

    // Reactor calculations
    const reactorArea = Math.PI * Math.pow(reactorDiameter / 12, 2) / 4; // ft²
    const hearthLoad = feedRateLbH / reactorArea; // lbm/ft²/hr
    
    // Temperature calculation (simplified energy balance)
    let reactorTemp = 1200 + (equivalenceRatio - 0.25) * 400;
    reactorTemp = Math.max(600, Math.min(1800, reactorTemp));
    
    // Moisture penalty (empirical from Chandra & Payne)
    const moisturePenalty = Math.max(0, (30 - moisturePercent) * 0.003);
    
    // Exit temperature (cooler model)
    const coolerDelta = (reactorTemp - 70) * coolerEfficiency;
    const gasExitTemp = reactorTemp - coolerDelta;

    // Heat removal (based on syngas mass and properties)
    const heatRemoved = gasLbH * SYNGAS_CP * coolerDelta;
    
    // Cold gas efficiency (ideal vs realistic)
    let cgeBase = (totalInput - heatRemoved) / totalInput * 100;
    cgeBase = Math.max(40, Math.min(95, cgeBase + moisturePenalty * 100));
    
    // Realistic mode: additional losses
    let cgeRealistic = cgeBase;
    if (mode === 'realistic') {
      const crackingLoss = crackerEnabled ? 3 : 0;
      const filterLoss = filterType === 'ceramic' ? 2 : 1;
      const systemLoss = 4; // Radiation, unburned, sensible
      cgeRealistic = cgeBase - crackingLoss - filterLoss - systemLoss;
    }
    
    const cge = mode === 'ideal' ? cgeBase : cgeRealistic;
    
    // Tar modeling (empirical)
    const baseTar = 50 + (equivalenceRatio - 0.25) * 200; // g/Nm³
    const tarAfterCracker = crackerEnabled ? baseTar * 0.3 : baseTar;
    
    // Syngas composition (simplified)
    const co = 18 + equivalenceRatio * 8; // %
    const h2 = 15 + equivalenceRatio * 5; // %
    const co2 = 12 - equivalenceRatio * 4; // %
    const ch4 = 1 + equivalenceRatio * 0.5; // %
    const n2 = 100 - co - h2 - co2 - ch4; // balance
    
    // Gas energy (LHV calculation based on composition)
    // Btu values per scf: CO=321, H2=325, CH4=1010, CO2=0, N2=0
    const gasLHV = (co * 321 + h2 * 325 + ch4 * 1010) / 100; // Btu/scf (dry basis)
    const energyOut = gasScfh * gasLHV; // Btu/hr output in syngas
    
    // System pressure drop (estimated)
    const velocityFtS = (airCfm * 12) / (reactorArea * 144);
    const pressureDrop = 0.02 + velocityFtS * 0.01; // inH2O
    
    return {
      // Mass flows
      feedRateLbH,
      dryFuel,
      waterIn,
      actualAir,
      airCfm,
      gasRate: gasCfm,
      
      // Temperatures
      reactorTemp: Math.round(reactorTemp),
      gasExitTemp: Math.round(gasExitTemp),
      
      // Energy
      fuelEnergy: Math.round(fuelEnergy),
      totalInput: Math.round(totalInput),
      energyOut: Math.round(energyOut),
      heatRemoved: Math.round(heatRemoved),
      cge: Math.round(cge * 10) / 10,
      
      // Gas composition
      co: Math.round(co * 10) / 10,
      h2: Math.round(h2 * 10) / 10,
      co2: Math.round(co2 * 10) / 10,
      ch4: Math.round(ch4 * 10) / 10,
      n2: Math.round(n2 * 10) / 10,
      gasLHV: Math.round(gasLHV),
      
      // Downstream
      tarGNm3: Math.round(tarAfterCracker),
      pressureDrop: Math.round(pressureDrop * 100) / 100,
      
      // Geometry
      reactorArea: Math.round(reactorArea * 100) / 100,
      hearthLoad: Math.round(hearthLoad * 10) / 10,
      velocity: Math.round(velocityFtS * 10) / 10,
    };
  };

  const results = calculatePerformance();

  // ==================== 3D VISUALIZATION ====================
  useEffect(() => {
    if (!showVisualizer || !containerRef.current) return;

    // Scene setup
    const width = containerRef.current.clientWidth;
    const height = 500;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f1419);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 15, 20);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Reactor (cylinder)
    const reactorRadius = reactorDiameter / 24; // convert inches to ft, then to 3D units
    const reactorHeightUnits = reactorHeight / 12; // convert inches to ft
    const reactorGeom = new THREE.CylinderGeometry(reactorRadius, reactorRadius, reactorHeightUnits, 32);
    const reactorMat = new THREE.MeshStandardMaterial({ 
      color: 0x10b981,
      metalness: 0.3,
      roughness: 0.6,
    });
    const reactor = new THREE.Mesh(reactorGeom, reactorMat);
    reactor.castShadow = true;
    reactor.receiveShadow = true;
    scene.add(reactor);

    // Grate
    const grateGeom = new THREE.CylinderGeometry(reactorRadius * 0.95, reactorRadius * 0.95, 0.2, 32);
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
    const grate_mesh = new THREE.Mesh(grateGeom, grateMat);
    grate_mesh.position.y = -reactorHeightUnits / 2 + 0.5;
    grate_mesh.castShadow = true;
    scene.add(grate_mesh);

    // Cooler (downstream)
    const coolerGeom = new THREE.BoxGeometry(reactorRadius * 2, 2, reactorRadius * 2);
    const coolerMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6 });
    const cooler_mesh = new THREE.Mesh(coolerGeom, coolerMat);
    cooler_mesh.position.set(0, -8, 0);
    cooler_mesh.castShadow = true;
    scene.add(cooler_mesh);

    // Filter
    const filterGeom = new THREE.BoxGeometry(reactorRadius * 1.8, 1.5, reactorRadius * 1.8);
    const filterMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
    const filter_mesh = new THREE.Mesh(filterGeom, filterMat);
    filter_mesh.position.set(0, -11, 0);
    filter_mesh.castShadow = true;
    scene.add(filter_mesh);

    // Ground
    const groundGeom = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x3f4655 });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -15;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      reactor.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    sceneRef.current = scene;

    return () => {
      renderer.dispose();
    };
  }, [showVisualizer, reactorHeight, reactorDiameter]);

  // ==================== UI COMPONENTS ====================
  const MetricCard = ({ label, value, unit, color }) => (
    <div className={`metric-card ${color}`}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-unit">{unit}</div>
    </div>
  );

  const ControlGroup = ({ label, value, onChange, min, max, step = 1 }) => (
    <div className="control-group">
      <label>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <span className="control-value">{value}</span>
    </div>
  );

  return (
    <div className="simulator-container">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0f1419;
          --card: #1a1f2e;
          --text: #e4e4e7;
          --muted: #a1a1aa;
          --accent: #fbbf24;
          --green: #10b981;
          --purple: #8b5cf6;
          --orange: #f59e0b;
          --border: #3f4655;
        }
        body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); }
        .simulator-container { background: var(--bg); color: var(--text); padding: 2rem; max-width: 1600px; margin: 0 auto; }
        .header { margin-bottom: 2rem; }
        h1 { font-size: 2.5rem; font-weight: 700; color: var(--accent); margin-bottom: 0.5rem; }
        .subtitle { color: var(--muted); margin-bottom: 1rem; }
        .tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 2px solid var(--border); }
        .tab-button {
          background: transparent; border: none; color: var(--muted); padding: 0.75rem 1.5rem;
          cursor: pointer; font-size: 1rem; font-weight: 600; border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }
        .tab-button:hover { color: var(--text); }
        .tab-button.active { color: var(--accent); border-bottom-color: var(--accent); }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .section { background: var(--card); border: 2px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; }
        .section-reactor { border-color: var(--green); }
        .section-reactor h2 { color: var(--green); }
        .section-downstream { border-color: var(--purple); }
        .section-downstream h2 { color: var(--purple); }
        .section-operating { border-color: var(--accent); }
        .section-operating h2 { color: var(--accent); }
        h2 { font-size: 1.2rem; font-weight: 600; margin-bottom: 1.5rem; }
        .control-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .control-group { display: flex; flex-direction: column; }
        label { font-size: 0.85rem; color: var(--muted); margin-bottom: 0.5rem; font-weight: 600; }
        input[type="range"] { width: 100%; height: 6px; background: var(--border); border-radius: 3px; outline: none; -webkit-appearance: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: var(--accent); border-radius: 50%; cursor: pointer; }
        input[type="range"]::-moz-range-thumb { width: 16px; height: 16px; background: var(--accent); border-radius: 50%; cursor: pointer; border: none; }
        .control-value { font-size: 0.9rem; color: var(--text); margin-top: 0.25rem; font-weight: 700; }
        select { background: var(--card); color: var(--text); border: 1px solid var(--border); padding: 0.5rem; border-radius: 4px; font-size: 1rem; }
        .checkbox-group { display: flex; align-items: center; gap: 0.75rem; }
        input[type="checkbox"] { width: 20px; height: 20px; cursor: pointer; }
        .mode-selector { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .mode-button { padding: 0.75rem 1.5rem; background: var(--card); border: 2px solid var(--border); color: var(--text); border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        .mode-button.active { background: var(--accent); color: black; border-color: var(--accent); }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 2rem; }
        .metric-card { background: rgba(0, 0, 0, 0.3); padding: 1rem; border-radius: 6px; border-left: 3px solid; }
        .metric-card.green { border-left-color: var(--green); }
        .metric-card.accent { border-left-color: var(--accent); }
        .metric-card.purple { border-left-color: var(--purple); }
        .metric-card.orange { border-left-color: var(--orange); }
        .metric-label { font-size: 0.75rem; color: var(--muted); margin-bottom: 0.5rem; }
        .metric-value { font-size: 1.5rem; font-weight: 700; }
        .metric-unit { font-size: 0.7rem; color: var(--muted); }
        .composition-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.75rem; margin-top: 1rem; }
        .composition-item { background: rgba(0, 0, 0, 0.3); padding: 0.75rem; border-radius: 4px; text-align: center; }
        .composition-label { font-size: 0.75rem; color: var(--muted); }
        .composition-value { font-size: 1.3rem; font-weight: 700; color: var(--accent); }
        #visualizer-container { width: 100%; background: rgba(0, 0, 0, 0.3); border-radius: 8px; }
        .button-group { display: flex; gap: 1rem; margin-top: 1rem; }
        button { padding: 0.75rem 1.5rem; background: var(--green); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        button:hover { filter: brightness(1.1); }
        button.secondary { background: var(--purple); }
      `}</style>

      <div className="header">
        <h1>Unified Gasifier Simulator</h1>
        <p className="subtitle">Educational tool for wood gasification system design (US customary units)</p>
      </div>

      {/* Mode Selector */}
      <div className="mode-selector">
        <button 
          className={`mode-button ${mode === 'ideal' ? 'active' : ''}`}
          onClick={() => setMode('ideal')}
        >
          Ideal Performance
        </button>
        <button 
          className={`mode-button ${mode === 'realistic' ? 'active' : ''}`}
          onClick={() => setMode('realistic')}
        >
          Realistic Performance
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-button ${activeTab === 'reactor' ? 'active' : ''}`} onClick={() => setActiveTab('reactor')}>
          Reactor
        </button>
        <button className={`tab-button ${activeTab === 'operating' ? 'active' : ''}`} onClick={() => setActiveTab('operating')}>
          Operating Conditions
        </button>
        <button className={`tab-button ${activeTab === 'downstream' ? 'active' : ''}`} onClick={() => setActiveTab('downstream')}>
          Downstream
        </button>
        <button className={`tab-button ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
          Results
        </button>
      </div>

      {/* REACTOR TAB */}
      {activeTab === 'reactor' && (
        <div className="tab-content active">
          <div className="section section-reactor">
            <h2>Reactor Geometry & Fuel</h2>
            <div className="control-grid">
              <ControlGroup label="Height (in)" value={reactorHeight} onChange={setReactorHeight} min={24} max={72} step={1} />
              <ControlGroup label="Diameter (in)" value={reactorDiameter} onChange={setReactorDiameter} min={6} max={24} step={1} />
              <ControlGroup label="Feed Rate (lbm/hr)" value={feedRateLbH} onChange={setFeedRateLbH} min={10} max={200} step={5} />
            </div>
            <div className="control-grid">
              <div className="control-group">
                <label>Fuel Type</label>
                <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                  <option value="woodChips">Wood Chips</option>
                  <option value="woodPellets">Wood Pellets</option>
                  <option value="charcoal">Charcoal</option>
                  <option value="biomass">Biomass</option>
                </select>
              </div>
              <div className="control-group">
                <label>Grate Type</label>
                <select value={grate} onChange={(e) => setGrate(e.target.value)}>
                  <option value="fixed">Fixed</option>
                  <option value="moving">Moving</option>
                  <option value="rotating">Rotating</option>
                </select>
              </div>
            </div>
            <div className="control-grid">
              <ControlGroup label="Fuel Moisture (% wet basis)" value={moisturePercent} onChange={setMoisturePercent} min={5} max={50} step={1} />
            </div>
          </div>
        </div>
      )}

      {/* OPERATING CONDITIONS TAB */}
      {activeTab === 'operating' && (
        <div className="tab-content active">
          <div className="section section-operating">
            <h2>Operating Conditions</h2>
            <div className="control-grid">
              <ControlGroup label="Equivalence Ratio (ER)" value={equivalenceRatio} onChange={setEquivalenceRatio} min={0.15} max={0.45} step={0.01} />
              <ControlGroup label="Air Temperature (°F)" value={airTempF} onChange={setAirTempF} min={50} max={300} step={5} />
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '1rem' }}>
              <strong>Tip:</strong> ER = 0.25–0.35 is typical for efficient gasification. Lower ER = higher CO/H₂ (producer gas). Higher ER = more complete oxidation.
            </p>
          </div>
        </div>
      )}

      {/* DOWNSTREAM TAB */}
      {activeTab === 'downstream' && (
        <div className="tab-content active">
          <div className="section section-downstream">
            <h2>Downstream Equipment</h2>
            <div className="control-grid">
              <div className="control-group">
                <label>Cooler Type</label>
                <select value={coolerType} onChange={(e) => setCoolerType(e.target.value)}>
                  <option value="shell">Shell & Tube</option>
                  <option value="air">Air Cooler</option>
                  <option value="radiator">Radiator</option>
                  <option value="none">None</option>
                </select>
              </div>
              <ControlGroup label="Cooler Efficiency" value={coolerEfficiency} onChange={setCoolerEfficiency} min={0.5} max={0.95} step={0.05} />
            </div>
            <div className="control-grid">
              <div className="control-group">
                <label>Filter Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="ceramic">Ceramic Candle</option>
                  <option value="baffle">Baffle</option>
                  <option value="mesh">Mesh</option>
                </select>
              </div>
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  checked={crackerEnabled} 
                  onChange={(e) => setCrackerEnabled(e.target.checked)}
                />
                <label style={{ margin: 0 }}>Enable Tar Cracker</label>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button className="secondary" onClick={() => setShowVisualizer(!showVisualizer)}>
              {showVisualizer ? 'Hide' : 'Show'} 3D Visualization
            </button>
          </div>

          {showVisualizer && (
            <div ref={containerRef} id="visualizer-container" style={{ marginTop: '1rem' }}></div>
          )}
        </div>
      )}

      {/* RESULTS TAB */}
      {activeTab === 'results' && (
        <div className="tab-content active">
          <div className="section section-reactor">
            <h2>Mass Flows</h2>
            <div className="metrics-grid">
              <MetricCard label="Feed Rate" value={results.feedRateLbH} unit="lbm/hr" color="green" />
              <MetricCard label="Dry Fuel" value={Math.round(results.dryFuel)} unit="lbm/hr" color="green" />
              <MetricCard label="Water Input" value={Math.round(results.waterIn)} unit="lbm/hr" color="accent" />
              <MetricCard label="Air Rate" value={Math.round(results.actualAir)} unit="lbm/hr" color="orange" />
              <MetricCard label="Airflow" value={Math.round(results.airCfm)} unit="cfm" color="orange" />
              <MetricCard label="Gas Rate" value={Math.round(results.gasRate)} unit="cfm" color="purple" />
            </div>
          </div>

          <div className="section section-operating">
            <h2>Temperature & Energy</h2>
            <div className="metrics-grid">
              <MetricCard label="Reactor Temperature" value={results.reactorTemp} unit="°F" color="orange" />
              <MetricCard label="Gas Exit Temp" value={results.gasExitTemp} unit="°F" color="purple" />
              <MetricCard label="Fuel Energy" value={results.fuelEnergy} unit="Btu/hr" color="green" />
              <MetricCard label="Total Input" value={results.totalInput} unit="Btu/hr" color="green" />
              <MetricCard label="Gas Energy Out" value={results.energyOut} unit="Btu/hr" color="accent" />
              <MetricCard label="Heat Removed" value={results.heatRemoved} unit="Btu/hr" color="accent" />
              <MetricCard label="Cold Gas Efficiency" value={results.cge} unit="%" color="purple" />
            </div>
          </div>

          <div className="section section-downstream">
            <h2>Syngas Composition</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem' }}>
              Empirical model based on equivalence ratio and fuel type. Validate against measured data.
            </p>
            <div className="composition-grid">
              <div className="composition-item">
                <div className="composition-label">CO</div>
                <div className="composition-value">{results.co}%</div>
              </div>
              <div className="composition-item">
                <div className="composition-label">H₂</div>
                <div className="composition-value">{results.h2}%</div>
              </div>
              <div className="composition-item">
                <div className="composition-label">CO₂</div>
                <div className="composition-value">{results.co2}%</div>
              </div>
              <div className="composition-item">
                <div className="composition-label">CH₄</div>
                <div className="composition-value">{results.ch4}%</div>
              </div>
              <div className="composition-item">
                <div className="composition-label">N₂</div>
                <div className="composition-value">{results.n2}%</div>
              </div>
              <div className="composition-item">
                <div className="composition-label">Gas LHV</div>
                <div className="composition-value">{results.gasLHV}</div>
              </div>
            </div>
          </div>

          <div className="section section-reactor">
            <h2>System Performance</h2>
            <div className="metrics-grid">
              <MetricCard label="Tar Content" value={results.tarGNm3} unit="g/Nm³" color="orange" />
              <MetricCard label="Pressure Drop" value={results.pressureDrop} unit="inH₂O" color="accent" />
              <MetricCard label="Reactor Area" value={results.reactorArea} unit="ft²" color="green" />
              <MetricCard label="Hearth Load" value={results.hearthLoad} unit="lbm/ft²/hr" color="purple" />
              <MetricCard label="Gas Velocity" value={results.velocity} unit="ft/s" color="accent" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedGasifierSimulator;
