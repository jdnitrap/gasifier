import React from 'react';

export default function FuelTypesPage() {
  const fuels = [
    {
      name: 'Hardwood (Oak, Maple, Ash)',
      pros: 'High energy density (8000+ Btu/lbm), low ash content',
      cons: 'Slower drying, more expensive',
      best: 'Primary fuel for optimal performance',
    },
    {
      name: 'Softwood (Pine, Fir)',
      pros: 'Readily available, fast drying',
      cons: 'Lower energy density, higher moisture',
      best: 'Secondary or mixed fuel',
    },
    {
      name: 'Bark/Branches',
      pros: 'Waste product, renewable',
      cons: 'Variable quality, high ash',
      best: 'Not recommended - use clean wood',
    },
    {
      name: 'Wood Chips (3/4" diameter)',
      pros: 'Uniform size, consistent performance',
      cons: 'Requires chipping equipment',
      best: 'Ideal for downdraft gasifiers',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Fuel Types &amp; Properties</h1>
        <p className="text-lg text-slate-600 mb-8">
          Gasifier performance depends heavily on fuel type and quality. This guide covers common fuels, their properties, and suitability.
        </p>

        <div className="grid gap-6">
          {fuels.map((fuel, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{fuel.name}</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-green-700">Pros</p>
                  <p className="text-slate-600">{fuel.pros}</p>
                </div>
                <div>
                  <p className="font-semibold text-red-700">Cons</p>
                  <p className="text-slate-600">{fuel.cons}</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-700">Best For</p>
                  <p className="text-slate-600">{fuel.best}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-12 bg-slate-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Moisture Content is Critical</h2>
          <p className="text-slate-600 mb-4">
            Wet fuel significantly reduces gasifier efficiency. Ideal moisture content: <strong>10-15%</strong>
          </p>
          <ul className="space-y-2 text-slate-600">
            <li>20% moisture: ~10% efficiency loss</li>
            <li>30% moisture: ~25% efficiency loss</li>
            <li>40%+ moisture: Gasifier may not run</li>
          </ul>
          <p className="text-slate-600 mt-4">
            Store wood under cover for at least 6-12 months before use. Stack with gaps for air circulation.
          </p>
        </section>

        <section className="mt-8 bg-amber-50 border border-amber-200 p-6 rounded-lg">
          <p className="text-slate-700">
            <strong>Measurement:</strong> Use a wood moisture meter to verify dryness. Target: 10-15% moisture content.
          </p>
        </section>
      </div>
    </div>
  );
}
