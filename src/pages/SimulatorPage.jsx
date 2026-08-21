import React from 'react';
import UnifiedGasifierSimulator from '../components/SimulatorComponent';

export default function SimulatorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Gasifier Simulator</h1>
          <p className="text-lg text-slate-600">
            Interactive performance calculator with ideal and realistic modes. Adjust reactor parameters, downstream equipment, and operating conditions to explore gasifier behavior.
          </p>
        </div>
        <UnifiedGasifierSimulator />
      </div>
    </div>
  );
}
