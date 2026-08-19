#!/usr/bin/env python3
"""
Integrated Downdraft Gasifier Design + Reduction Zone Kinetic Model
===================================================================
English (US customary) units throughout.

This model:
1. Takes a target power or wood feed rate
2. Sizes the throat and key geometry using classic FAO / SERI hearth-load rules
3. Runs a 1-D kinetic model of the reduction zone
4. Reports recommended dimensions + predicted gas composition, LHV, and efficiency

Starter version – reduction zone kinetics are functional but simplified.
Upper zones (drying / pyrolysis / oxidation) are treated with typical outlet
assumptions that can later be expanded into full kinetic zones.
"""

import numpy as np
from scipy.integrate import solve_ivp
import math

# ============================================================
# USER INPUTS – change these
# ============================================================

target_mode = "wood"          # "wood" or "power"
wood_feed_lb_h_dry = 8.0      # lb dry wood per hour
target_electric_kW = 3.0      # kW electric
engine_efficiency = 0.22      # overall engine + generator efficiency

moisture_wet_basis = 0.15
equivalence_ratio = 0.30
gas_yield_scf_per_lb = 37.0

design_hearth_load = 2.45     # scf/h per in² of throat
reduction_height_in = 14.0
use_imbert_style = True

# ============================================================
# DESIGN CALCULATIONS
# ============================================================

def calculate_design():
    if target_mode == "power":
        required_gas_scf_h = (target_electric_kW * 3412) / (140 * engine_efficiency)
        wood_needed = required_gas_scf_h / gas_yield_scf_per_lb
    else:
        wood_needed = wood_feed_lb_h_dry
        required_gas_scf_h = wood_needed * gas_yield_scf_per_lb

    throat_area_in2 = required_gas_scf_h / design_hearth_load
    throat_dia_in = math.sqrt(4 * throat_area_in2 / math.pi)

    hearth_dia_in = throat_dia_in + (8.0 if use_imbert_style else 4.0)
    nozzle_plane_height = max(4.0, 1.2 * throat_dia_in)

    nozzle_info = suggest_nozzles(throat_dia_in)

    return {
        "wood_lb_h_dry": wood_needed,
        "gas_scf_h": required_gas_scf_h,
        "throat_dia_in": throat_dia_in,
        "throat_area_in2": throat_area_in2,
        "hearth_dia_in": hearth_dia_in,
        "nozzle_plane_height_in": nozzle_plane_height,
        "reduction_height_in": reduction_height_in,
        "nozzles": nozzle_info,
        "hearth_load_used": design_hearth_load
    }

def suggest_nozzles(throat_dia):
    table = [
        (2.76, 0.41, 3), (3.15, 0.35, 5), (3.54, 0.39, 5), (3.94, 0.43, 5),
        (4.72, 0.50, 5), (5.12, 0.53, 5), (5.91, 0.59, 5), (6.69, 0.56, 7),
        (7.48, 0.63, 7), (8.66, 0.71, 7), (10.63, 0.87, 7), (11.81, 0.94, 7)
    ]
    closest = min(table, key=lambda x: abs(x[0] - throat_dia))
    return {
        "nozzle_dia_in": closest[1],
        "num_nozzles": closest[2],
        "note": f"Closest FAO match for ~{closest[0]:.2f} in throat"
    }

# ============================================================
# REDUCTION ZONE KINETIC MODEL
# ============================================================

def reduction_zone_model(design):
    y0_comp = np.array([0.48, 0.12, 0.14, 0.08, 0.15, 0.03])  # N2, CO, CO2, H2, H2O, CH4
    T0_F = 1750.0
    height = design["reduction_height_in"]

    def odes(z, y):
        T_R = y[0]
        T_K = max((T_R - 460.0) * 5.0/9.0 + 273.15, 900.0)

        y_CO  = max(y[1], 1e-6)
        y_CO2 = max(y[2], 1e-6)
        y_H2  = max(y[3], 1e-6)
        y_H2O = max(y[4], 1e-6)
        y_CH4 = max(y[5], 1e-6)

        CRF = 40.0
        k1 = 1.2e3 * np.exp(-11500.0 / T_K)
        k2 = 9.0e2 * np.exp(-10500.0 / T_K)
        k3 = 15.0  * np.exp(-6500.0  / T_K)
        k4 = 600.0 * np.exp(-9500.0  / T_K)

        r1 = CRF * k1 * (y_CO2 - (y_CO**2) / 20.0)
        r2 = CRF * k2 * (y_H2O - (y_CO * y_H2) / 10.0)
        r3 = CRF * k3 * (y_H2**2 - y_CH4 * 4.0)
        r4 = CRF * k4 * (y_CH4 * y_H2O - (y_CO * y_H2**3) / 5.0)

        r1 = np.clip(r1, -0.04, 0.04)
        r2 = np.clip(r2, -0.04, 0.04)
        r3 = np.clip(r3, -0.015, 0.015)
        r4 = np.clip(r4, -0.025, 0.025)

        dy = np.zeros(7)
        dy[0] = -70.0 * (abs(r1) + abs(r2) + 0.35*abs(r4))
        dy[1] =  2*r1 + r2 - r4
        dy[2] = -r1
        dy[3] =  r2 - 2*r3 + 3*r4
        dy[4] = -r2 - r4
        dy[5] =  r3 - r4
        dy[6] =  0.0
        return dy

    y_init = np.array([T0_F + 460.0, y0_comp[1], y0_comp[2], y0_comp[3],
                       y0_comp[4], y0_comp[5], y0_comp[0]])

    sol = solve_ivp(odes, [0, height], y_init, method="BDF",
                    dense_output=True, rtol=1e-4, atol=1e-6)

    if not sol.success:
        return None

    y_exit_raw = sol.y[:, -1]
    T_exit_F = y_exit_raw[0] - 460.0

    y_exit = {
        "CO":  max(y_exit_raw[1], 0),
        "CO2": max(y_exit_raw[2], 0),
        "H2":  max(y_exit_raw[3], 0),
        "H2O": max(y_exit_raw[4], 0),
        "CH4": max(y_exit_raw[5], 0),
        "N2":  max(y_exit_raw[6], 0),
    }
    total = sum(y_exit.values())
    for k in y_exit:
        y_exit[k] /= total

    dry_total = y_exit["N2"] + y_exit["CO"] + y_exit["CO2"] + y_exit["H2"] + y_exit["CH4"]
    y_dry = {k: y_exit[k]/dry_total for k in ["N2", "CO", "CO2", "H2", "CH4"]}

    LHV = (y_dry["CO"]*322 + y_dry["H2"]*275 + y_dry["CH4"]*911)

    return {
        "success": True,
        "T_exit_F": T_exit_F,
        "y_wet": y_exit,
        "y_dry": y_dry,
        "LHV_BTU_scf": LHV,
    }

# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    print("=" * 60)
    print("  DOWNDRAFT GASIFIER – DESIGN + REDUCTION ZONE MODEL")
    print("=" * 60)

    design = calculate_design()

    print("\n--- DESIGN SIZING (from hearth load rules) ---")
    print(f"Dry wood feed rate     : {design['wood_lb_h_dry']:.1f} lb/h")
    print(f"Producer gas flow      : {design['gas_scf_h']:.0f} scf/h")
    print(f"Design hearth load     : {design['hearth_load_used']:.2f} scf/h·in²")
    print(f"Throat diameter        : {design['throat_dia_in']:.2f} in")
    print(f"Throat area            : {design['throat_area_in2']:.2f} in²")
    print(f"Hearth diameter (noz.) : {design['hearth_dia_in']:.2f} in")
    print(f"Nozzle plane height    : {design['nozzle_plane_height_in']:.1f} in above throat")
    print(f"Reduction zone height  : {design['reduction_height_in']:.1f} in")
    print(f"Suggested nozzles      : {design['nozzles']['num_nozzles']} × {design['nozzles']['nozzle_dia_in']:.2f} in")
    print(f"  ({design['nozzles']['note']})")

    print("\n--- REDUCTION ZONE KINETIC RESULTS ---")
    result = reduction_zone_model(design)

    if result is None:
        print("Solver did not converge.")
    else:
        print(f"Exit temperature       : {result['T_exit_F']:.0f} °F")
        print(f"Dry LHV                : {result['LHV_BTU_scf']:.0f} BTU/scf")
        print("\nExit gas composition (dry basis, vol%):")
        for sp in ["CO", "H2", "CO2", "CH4", "N2"]:
            print(f"  {sp:4s} : {result['y_dry'][sp]*100:5.1f} %")

        print("\nExit gas composition (wet basis, vol%):")
        for sp in ["CO", "H2", "CO2", "H2O", "CH4", "N2"]:
            print(f"  {sp:4s} : {result['y_wet'][sp]*100:5.1f} %")

        gas_energy_out = design['gas_scf_h'] * result['LHV_BTU_scf']
        wood_energy_in = design['wood_lb_h_dry'] * 8000
        cge = gas_energy_out / wood_energy_in * 100
        print(f"\nApprox. cold-gas efficiency : {cge:.1f} %")

    print("\n" + "=" * 60)
    print("Notes: Starter kinetics – directional but not fully calibrated.")
    print("Next: full four-zone model, better energy balance, tar estimate.")
    print("=" * 60)
