import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Safety Guidelines</h1>
        <p className="text-lg text-slate-600 mb-8">
          Wood gasifiers operate at high temperatures and pressures. Proper safety practices are essential.
        </p>

        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg mb-8 flex gap-4">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h2 className="font-bold text-red-900 mb-2">Critical Safety Concerns</h2>
            <ul className="text-red-800 space-y-1 text-sm">
              <li>• Reactor reaches 1000-1800°F — severe burn hazard</li>
              <li>• Syngas is flammable and toxic (CO poisoning risk)</li>
              <li>• Improper operation can cause explosions</li>
              <li>• Always use in well-ventilated areas only</li>
            </ul>
          </div>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Essential Safety Equipment</h2>
            <ul className="space-y-2 text-slate-600">
              <li>✓ Heat-resistant gloves and apron (up to 500°F)</li>
              <li>✓ Safety glasses</li>
              <li>✓ Proper ventilation (outdoor only)</li>
              <li>✓ Fire extinguisher (CO₂ or dry powder, NOT water)</li>
              <li>✓ Carbon monoxide detector</li>
              <li>✓ Temperature monitoring equipment</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Operating Procedures</h2>
            <ul className="space-y-2 text-slate-600">
              <li>• Startup and shutdown only by trained personnel</li>
              <li>• Never operate indoors or in enclosed spaces</li>
              <li>• Maintain proper fuel feed rate</li>
              <li>• Monitor temperature continuously</li>
              <li>• Shut down if temperatures exceed 1900°F</li>
              <li>• Allow cooling time before maintenance</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Emergency Response</h2>
            <ul className="space-y-2 text-slate-600">
              <li>• Shut off fuel feed immediately</li>
              <li>• Reduce air flow to minimum</li>
              <li>• Evacuate area if gas leaks detected</li>
              <li>• Seek fresh air if experiencing dizziness</li>
              <li>• Contact emergency services if serious injury</li>
            </ul>
          </div>
        </section>

        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mt-8">
          <p className="text-yellow-900">
            <strong>Disclaimer:</strong> This is educational information only. Building and operating gasifiers involves significant risk. Consult local regulations, obtain proper permits, and follow all safety codes before construction or operation.
          </p>
        </div>
      </div>
    </div>
  );
}
