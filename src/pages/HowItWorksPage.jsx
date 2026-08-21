import React from 'react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">How Wood Gasification Works</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-slate-600 mb-6">
            Wood gasification is a thermochemical process that converts solid wood fuel into combustible gas (syngas) through incomplete combustion.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Basic Process</h2>

          <div className="bg-slate-50 p-8 rounded-lg mb-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">1. Drying Zone</h3>
                <p className="text-slate-600 mt-2">
                  Incoming wood is heated by hot gases above, removing moisture. Heat required: ~600°F.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">2. Pyrolysis Zone</h3>
                <p className="text-slate-600 mt-2">
                  Wood breaks down into charcoal and volatile compounds. Temperature: 600-900°F.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">3. Oxidation Zone (Combustion)</h3>
                <p className="text-slate-600 mt-2">
                  Limited air reacts with charcoal, producing heat and CO/CO₂. Temperature: 1000-1800°F.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">4. Reduction Zone</h3>
                <p className="text-slate-600 mt-2">
                  Hot CO₂ and H₂O react with charcoal, producing CO and H₂ (syngas). Temperature: 800-1200°F.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Syngas Composition</h2>
          <p className="text-slate-600 mb-4">
            The gas produced contains several components, each contributing to performance:
          </p>

          <ul className="space-y-3 text-slate-600">
            <li><strong>CO (Carbon Monoxide):</strong> ~18% - Primary combustible component</li>
            <li><strong>H₂ (Hydrogen):</strong> ~15% - Secondary combustible component</li>
            <li><strong>CO₂ (Carbon Dioxide):</strong> ~12% - Inert (endothermic reactions)</li>
            <li><strong>CH₄ (Methane):</strong> ~1% - Minor combustible</li>
            <li><strong>N₂ (Nitrogen):</strong> ~54% - Inert (air dilution)</li>
            <li><strong>Tar &amp; Moisture:</strong> Highly variable - Must be managed downstream</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Key Performance Metrics</h2>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Cold Gas Efficiency (CGE)</h3>
            <p className="text-slate-600 mb-3">
              The ratio of chemical energy in syngas to energy input from fuel:
            </p>
            <p className="font-mono bg-white p-4 rounded border border-blue-200 text-sm">
              CGE = (Gas Output Energy) / (Fuel Input Energy) × 100%
            </p>
            <p className="text-slate-600 mt-3">
              Typical range: 70-95% depending on design and operating conditions.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Designing for Performance</h2>
          <p className="text-slate-600 mb-4">
            Several parameters directly affect gasifier output:
          </p>
          <ul className="space-y-3 text-slate-600">
            <li><strong>Equivalence Ratio (ER):</strong> Controls air/fuel ratio. Higher ER = more combustion, higher temps</li>
            <li><strong>Hearth Load:</strong> Fuel mass per unit area. Higher load = higher throughput but potential burnthrough</li>
            <li><strong>Reactor Height:</strong> Affects residence time and zone development</li>
            <li><strong>Moisture Content:</strong> Wet fuel reduces efficiency significantly</li>
            <li><strong>Fuel Type:</strong> Different woods have different LHV and ash content</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Downstream Processing</h2>
          <p className="text-slate-600 mb-4">
            Raw syngas must be treated before use:
          </p>
          <ul className="space-y-3 text-slate-600">
            <li><strong>Cooling:</strong> Brings gas to usable temperature, removes moisture</li>
            <li><strong>Filtration:</strong> Removes particulate and some tar</li>
            <li><strong>Tar Cracking:</strong> Thermal treatment reduces tar to lighter hydrocarbons</li>
            <li><strong>Condensation:</strong> Further tar and moisture removal</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mt-12">
            <p className="text-slate-700">
              <strong>Note:</strong> These descriptions are simplified models for educational purposes. Actual gasifier behavior depends on many coupled phenomena. Use measured data from your system to validate model predictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
