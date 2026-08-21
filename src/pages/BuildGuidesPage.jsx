import React from 'react';

const PageTemplate = ({ title, description, children }) => (
  <div className="min-h-screen bg-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">{title}</h1>
      <p className="text-lg text-slate-600 mb-8">{description}</p>
      {children}
    </div>
  </div>
);

export default function BuildGuidesPage() {
  return (
    <PageTemplate
      title="Build Guides"
      description="Step-by-step instructions for designing and building home-scale gasifiers. Covers materials, tools, sizing, and assembly."
    >
      <div className="space-y-8 prose prose-lg max-w-none">
        <section>
          <h2 className="text-2xl font-bold text-slate-900">Downdraft Gasifier Design</h2>
          <p className="text-slate-600">
            Downdraft gasifiers are ideal for small-scale applications. The fuel bed moves downward while air enters from the side.
          </p>
          <ul className="space-y-3 text-slate-600">
            <li>Imbert-style design (classic FAO model)</li>
            <li>Simple geometry, easy to build</li>
            <li>Good for wood chips and small log pieces</li>
            <li>Typical throughput: 20-100 lbm/hr wood</li>
          </ul>
        </section>

        <section className="bg-slate-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-slate-900 mb-3">Key Design Parameters</h3>
          <ul className="space-y-2 text-slate-600">
            <li><strong>Throat Diameter:</strong> 1.5-3 inches (controls hearth load)</li>
            <li><strong>Nozzle Location:</strong> 1-2 inches above throat</li>
            <li><strong>Reactor Height:</strong> 30-60 inches (allows zone development)</li>
            <li><strong>Hearth Load:</strong> 10-30 lbm/ft²/hr (FAO standard)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mt-8">Materials &amp; Tools</h2>
          <p className="text-slate-600 mb-4">Common materials for home builders:</p>
          <ul className="space-y-2 text-slate-600">
            <li>Steel tube (4-8" diameter for reactor)</li>
            <li>Refractory brick or ceramic fiber blanket</li>
            <li>High-temp sealant (for 2000°F+)</li>
            <li>Grates (fixed or moving)</li>
            <li>Piping and fittings for air/gas flow</li>
          </ul>
        </section>

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mt-8">
          <p className="text-slate-700">
            <strong>Tip:</strong> Use the Simulator to model your design before building. Calculate expected temperatures, efficiency, and gas production.
          </p>
        </div>
      </div>
    </PageTemplate>
  );
}
