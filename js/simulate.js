import { computeDesign } from "./compute.js";
import { heatLossFor, idealFamily } from "./efficiency.js";
import { getInput } from "./form.js";
import { BTU_HP, ENG_EFF } from "./fuels.js";
import { metric, render } from "./render.js";
import { fuelLhv, gasComp, yieldOf } from "./thermo.js";
import { $id, clamp } from "./util.js";

const zoomOpts = {
  pan: { enabled: true, mode: "x" },
  zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "x" },
};

let trendCharts = {};
const sim = {
  running: false, timer: null, t: 0, history: [], maxT: 0, stepMin: 10,
  fuelLeft: 0, fuelStart: 0, feed: 8, walk: { h2: 0, co: 0, tar: 0, lhv: 0 },
};

export function fuelFactor(left, start) {
  if (start <= 0) return 0;
  const frac = left / start;
  if (frac > 0.12) return 1;
  const x = frac / 0.12;
  return Math.max(0, x * x * (3 - 2 * x));
}

function makeLine(id, label, color, yTitle) {
  return new Chart($id(id).getContext("2d"), {
    type: "line",
    data: { labels: [], datasets: [{ label, data: [], borderColor: color, tension: 0.25, pointRadius: 0, borderWidth: 2 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: "#9a937f", maxTicksLimit: 8 }, grid: { color: "#3a4030" }, title: { display: true, text: "Time (hours)", color: "#9a937f" } },
        y: { ticks: { color: "#9a937f" }, grid: { color: "#3a4030" }, title: { display: true, text: yTitle, color: "#9a937f" } },
      },
      plugins: { legend: { labels: { color: "#9a937f" } }, zoom: zoomOpts },
    },
  });
}

function destroyTrends() {
  Object.keys(trendCharts).forEach((k) => {
    if (trendCharts[k]) { trendCharts[k].destroy(); trendCharts[k] = null; }
  });
}

function initTrends() {
  destroyTrends();
  trendCharts.fuel = makeLine("trendFuel", "Fuel remaining", "#8aaa6e", "Fuel remaining (lb dry)");
  trendCharts.lhv = makeLine("trendLHV", "LHV", "#c9a227", "LHV (Btu/scf)");
  trendCharts.tar = makeLine("trendTar", "Tar", "#d08a3a", "Tar (mg/Nm³)");
  trendCharts.power = makeLine("trendPower", "Shaft power", "#ece7d8", "Shaft power (hp)");
  trendCharts.comp = new Chart($id("trendComp").getContext("2d"), {
    type: "line",
    data: { labels: [], datasets: [
      { label: "H₂ %", data: [], borderColor: "#9a937f", tension: 0.25, pointRadius: 0, borderWidth: 2 },
      { label: "CO %", data: [], borderColor: "#c9a227", tension: 0.25, pointRadius: 0, borderWidth: 2 },
    ] },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: "#9a937f", maxTicksLimit: 8 }, grid: { color: "#3a4030" }, title: { display: true, text: "Time (hours)", color: "#9a937f" } },
        y: { ticks: { color: "#9a937f" }, grid: { color: "#3a4030" }, title: { display: true, text: "Volume %", color: "#9a937f" } },
      },
      plugins: { legend: { labels: { color: "#9a937f" } }, zoom: zoomOpts },
    },
  });
  trendCharts.eff = new Chart($id("trendEff").getContext("2d"), {
    type: "line",
    data: { labels: [], datasets: [
      { label: "CGE real %", data: [], borderColor: "#c9a227", tension: 0.25, pointRadius: 0, borderWidth: 2 },
      { label: "CGE ideal %", data: [], borderColor: "#8aaa6e", tension: 0.25, pointRadius: 0, borderWidth: 2, borderDash: [6, 4] },
      { label: "Overall real %", data: [], borderColor: "#ece7d8", tension: 0.25, pointRadius: 0, borderWidth: 2 },
      { label: "Overall ideal %", data: [], borderColor: "#9a937f", tension: 0.25, pointRadius: 0, borderWidth: 2, borderDash: [6, 4] },
    ] },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: "#9a937f", maxTicksLimit: 8 }, grid: { color: "#3a4030" }, title: { display: true, text: "Time (hours)", color: "#9a937f" } },
        y: { min: 0, max: 90, ticks: { color: "#9a937f" }, grid: { color: "#3a4030" }, title: { display: true, text: "Efficiency %", color: "#9a937f" } },
      },
      plugins: { legend: { labels: { color: "#9a937f" } }, zoom: zoomOpts },
    },
  });
  trendCharts.combined = new Chart($id("trendCombined").getContext("2d"), {
    type: "line",
    data: { labels: [], datasets: [
      { label: "Fuel remaining", data: [], borderColor: "#8aaa6e", tension: 0.25, pointRadius: 0, borderWidth: 2 },
      { label: "LHV", data: [], borderColor: "#c9a227", tension: 0.25, pointRadius: 0, borderWidth: 2 },
      { label: "Tar (inv)", data: [], borderColor: "#d08a3a", tension: 0.25, pointRadius: 0, borderWidth: 2 },
      { label: "Shaft power", data: [], borderColor: "#ece7d8", tension: 0.25, pointRadius: 0, borderWidth: 2 },
      { label: "H₂", data: [], borderColor: "#9a937f", tension: 0.25, pointRadius: 0, borderWidth: 2 },
      { label: "CO", data: [], borderColor: "#c45c3e", tension: 0.25, pointRadius: 0, borderWidth: 2 },
      { label: "CGE real", data: [], borderColor: "#7eb8c9", tension: 0.25, pointRadius: 0, borderWidth: 2 },
    ] },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: "#9a937f", maxTicksLimit: 10 }, grid: { color: "#3a4030" }, title: { display: true, text: "Time (hours)", color: "#9a937f" } },
        y: { min: 0, max: 100, ticks: { color: "#9a937f" }, grid: { color: "#3a4030" }, title: { display: true, text: "Normalized % of run max", color: "#9a937f" } },
      },
      plugins: { legend: { labels: { color: "#9a937f" } }, zoom: zoomOpts },
    },
  });
}

function norm(arr) {
  const m = Math.max(...arr, 1e-9);
  return arr.map((v) => (v / m) * 100);
}

function updateTracker() {
  if (!sim.history.length) { $id("effTracker").innerHTML = ""; return; }
  const n = sim.history.length;
  const last = sim.history[n - 1];
  const avg = (k) => sim.history.reduce((s, h) => s + h[k], 0) / n;
  const ofI = last.cgeIdeal > 0.1 ? (last.cgeReal / last.cgeIdeal) * 100 : 0;
  $id("effTracker").innerHTML =
    metric("CGE now (real)", `${last.cgeReal.toFixed(1)}%`, "", "accent") +
    metric("CGE now (ideal)", `${last.cgeIdeal.toFixed(1)}%`) +
    metric("Run-average CGE", `${avg("cgeReal").toFixed(1)}%`, "", "accent") +
    metric("This step vs ideal", `${ofI.toFixed(0)}%`, "", "orange");
}

function updateTrendCharts() {
  const L = sim.history.map((h) => h.t.toFixed(2));
  const fuel = sim.history.map((h) => h.fuelLeft);
  const lhv = sim.history.map((h) => h.LHV);
  const tar = sim.history.map((h) => h.tar);
  const pow = sim.history.map((h) => h.power);
  const h2 = sim.history.map((h) => h.H2);
  const co = sim.history.map((h) => h.CO);
  const cgeR = sim.history.map((h) => h.cgeReal);
  const cgeI = sim.history.map((h) => h.cgeIdeal);
  const ovR = sim.history.map((h) => h.overallReal);
  const ovI = sim.history.map((h) => h.overallIdeal);
  const set = (chart, i, data) => { chart.data.labels = L; chart.data.datasets[i].data = data; chart.update("none"); };
  set(trendCharts.fuel, 0, fuel);
  set(trendCharts.lhv, 0, lhv);
  set(trendCharts.tar, 0, tar);
  set(trendCharts.power, 0, pow);
  trendCharts.comp.data.labels = L;
  trendCharts.comp.data.datasets[0].data = h2;
  trendCharts.comp.data.datasets[1].data = co;
  trendCharts.comp.update("none");
  trendCharts.eff.data.labels = L;
  trendCharts.eff.data.datasets[0].data = cgeR;
  trendCharts.eff.data.datasets[1].data = cgeI;
  trendCharts.eff.data.datasets[2].data = ovR;
  trendCharts.eff.data.datasets[3].data = ovI;
  trendCharts.eff.update("none");
  const tarMax = Math.max(...tar, 1);
  trendCharts.combined.data.labels = L;
  trendCharts.combined.data.datasets[0].data = norm(fuel);
  trendCharts.combined.data.datasets[1].data = norm(lhv);
  trendCharts.combined.data.datasets[2].data = tar.map((v) => ((tarMax - v) / tarMax) * 100);
  trendCharts.combined.data.datasets[3].data = norm(pow);
  trendCharts.combined.data.datasets[4].data = norm(h2);
  trendCharts.combined.data.datasets[5].data = norm(co);
  trendCharts.combined.data.datasets[6].data = norm(cgeR);
  trendCharts.combined.update("none");
  updateTracker();
}

function stepTrends() {
  if (!sim.running) return;
  const d = computeDesign(getInput());
  const dt = sim.stepMin / 60;
  sim.walk.h2 = clamp(sim.walk.h2 + (Math.random() - 0.5) * 0.35, -2.5, 2.5);
  sim.walk.co = clamp(sim.walk.co + (Math.random() - 0.5) * 0.3, -2.2, 2.2);
  sim.walk.tar = clamp(sim.walk.tar + (Math.random() - 0.5) * 2.5, -18, 18);
  sim.walk.lhv = clamp(sim.walk.lhv + (Math.random() - 0.5) * 0.8, -6, 6);
  const ff = fuelFactor(sim.fuelLeft, sim.fuelStart);
  let gas = { H2: 0, CO: 0, CH4: 0, CO2: 0, N2: 100, LHV: 0, tar: 0 };
  let power = 0, cgeReal = 0, cgeIdeal = 0, overallReal = 0, overallIdeal = 0;
  if (ff > 0.001) {
    gas = gasComp(d.fuel, d.inp.moisture, d.inp.er, d.sizes.family, sim.t, sim.walk);
    gas.H2 *= ff; gas.CO *= ff; gas.CH4 *= ff; gas.LHV *= ff;
    gas.tar = Math.round(gas.tar * (0.3 + 0.7 * ff));
    const yld = Math.max(25, yieldOf(d.fuel, d.inp.moisture));
    const yldI = Math.max(25, yieldOf(d.fuel, 12));
    const scfm = ((sim.feed * yld) / 60) * ff;
    power = (scfm * gas.LHV * 60 * ENG_EFF) / BTU_HP;
    const idealFam = idealFamily(d.inp.endUse);
    const gasI = gasComp(d.fuel, 12, 0.3, idealFam, sim.t, {
      h2: sim.walk.h2 * 0.25, co: sim.walk.co * 0.25, tar: sim.walk.tar * 0.2, lhv: sim.walk.lhv * 0.25,
    }, 0.12);
    gasI.LHV *= ff;
    const flhv = fuelLhv(d.fuel);
    const wall = heatLossFor(d.sizes.family, d.inp.moisture, d.inp.er, false);
    const wallI = heatLossFor(idealFam, 12, 0.3, true);
    cgeReal = flhv > 0 ? ((yld * gas.LHV) / flhv) * (1 - wall) : 0;
    cgeIdeal = flhv > 0 ? ((yldI * gasI.LHV) / flhv) * (1 - wallI) : 0;
    overallReal = d.inp.endUse === "heat" ? cgeReal * 0.78 : cgeReal * 0.22;
    overallIdeal = d.inp.endUse === "heat" ? cgeIdeal * 0.9 : cgeIdeal * 0.24;
  }
  sim.history.push({
    t: +sim.t.toFixed(2), fuelLeft: +sim.fuelLeft.toFixed(2), LHV: +gas.LHV.toFixed(1),
    tar: gas.tar, power: +power.toFixed(2), H2: +gas.H2.toFixed(2), CO: +gas.CO.toFixed(2),
    cgeReal: +(cgeReal * 100).toFixed(2), cgeIdeal: +(cgeIdeal * 100).toFixed(2),
    overallReal: +(overallReal * 100).toFixed(2), overallIdeal: +(overallIdeal * 100).toFixed(2),
  });
  if (sim.history.length > 600) sim.history.shift();
  updateTrendCharts();
  $id("simStatus").textContent = `Running… t = ${sim.t.toFixed(2)} h / ${sim.maxT} h · Fuel left ${sim.fuelLeft.toFixed(1)} lb · ${sim.feed} lb/h`;
  sim.fuelLeft = Math.max(0, sim.fuelLeft - sim.feed * dt);
  if (sim.fuelLeft <= 0.001) {
    sim.history.push({ t: +(sim.t + dt).toFixed(2), fuelLeft: 0, LHV: 0, tar: 0, power: 0, H2: 0, CO: 0, cgeReal: 0, cgeIdeal: 0, overallReal: 0, overallIdeal: 0 });
    updateTrendCharts();
    stopTrends();
    $id("simStatus").textContent = `Fuel exhausted near t = ${(sim.t + dt).toFixed(2)} h. You can save CSV.`;
    return;
  }
  sim.t += dt;
  if (sim.t > sim.maxT + 0.001) {
    stopTrends();
    $id("simStatus").textContent = `Finished ${sim.maxT} h. Fuel remaining ${sim.fuelLeft.toFixed(1)} lb. You can save CSV.`;
    return;
  }
  sim.timer = setTimeout(stepTrends, 90);
}

export function startTrends() {
  if (sim.running) return;
  resetTrends(false);
  initTrends();
  const d = computeDesign(getInput());
  sim.maxT = +$id("hours").value;
  $id("opHours").value = sim.maxT;
  $id("opHoursVal").textContent = sim.maxT;
  sim.stepMin = +$id("timestep").value;
  sim.feed = d.sizes.feed;
  sim.t = 0;
  sim.fuelStart = sim.feed * sim.maxT;
  sim.fuelLeft = sim.fuelStart;
  sim.history = [];
  sim.walk = { h2: 0, co: 0, tar: 0, lhv: 0 };
  sim.running = true;
  $id("btnStart").disabled = true;
  $id("btnStop").disabled = false;
  $id("btnSave").disabled = true;
  $id("simStatus").textContent = `Starting with ${sim.fuelLeft.toFixed(1)} lb at ${sim.feed} lb/h for ${sim.maxT} h…`;
  stepTrends();
}

export function stopTrends() {
  sim.running = false;
  clearTimeout(sim.timer);
  $id("btnStart").disabled = false;
  $id("btnStop").disabled = true;
  $id("btnSave").disabled = !(sim.history.length && !sim.running);
  if (sim.t < sim.maxT && sim.fuelLeft > 0.001) {
    $id("simStatus").textContent = `Paused at t = ${sim.t.toFixed(2)} h. You can save CSV.`;
  }
}

export function resetTrends(upd) {
  stopTrends();
  sim.t = 0;
  sim.history = [];
  sim.fuelLeft = 0;
  sim.fuelStart = 0;
  destroyTrends();
  $id("btnSave").disabled = true;
  $id("effTracker").innerHTML = "";
  if (upd !== false) $id("simStatus").textContent = "Reset. Ready to start.";
}

export function resetZoom() {
  Object.values(trendCharts).forEach((c) => { if (c && c.resetZoom) c.resetZoom(); });
}

export function saveData() {
  if (!sim.history.length) return;
  const header = "time_h,fuel_remaining_lb,LHV_Btu_per_scf,tar_mg_per_Nm3,shaft_power_hp,H2_pct,CO_pct,cge_real_pct,cge_ideal_pct,overall_real_pct,overall_ideal_pct";
  const rows = sim.history.map((h) => [h.t, h.fuelLeft, h.LHV, h.tar, h.power, h.H2, h.CO, h.cgeReal, h.cgeIdeal, h.overallReal, h.overallIdeal].join(","));
  const csv = ["# Hearth Lab trend export", header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `gasifier_trends_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  $id("simStatus").textContent = `CSV saved (${sim.history.length} points).`;
}

export function bindSim() {
  $id("btnStart").addEventListener("click", startTrends);
  $id("btnStop").addEventListener("click", stopTrends);
  $id("btnReset").addEventListener("click", () => resetTrends());
  $id("btnSave").addEventListener("click", saveData);
  $id("btnZoom").addEventListener("click", resetZoom);
  $id("hours").addEventListener("input", () => {
    $id("hoursVal").textContent = $id("hours").value;
    $id("opHours").value = $id("hours").value;
    $id("opHoursVal").textContent = $id("hours").value;
    render();
  });
}
