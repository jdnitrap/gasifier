import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, BookOpen, Wrench } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Power Your Home with Wood Gas
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Interactive simulator, design guides, and practical knowledge for building home-scale wood gasifiers. Learn gasification physics, explore design options, and simulate real-world performance.
            </p>
            <div className="flex gap-4">
              <Link
                to="/simulator"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Launch Simulator <ArrowRight size={20} />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-8 text-white">
            <div className="aspect-square flex items-center justify-center">
              <div className="text-center">
                <Zap size={64} className="mx-auto mb-4" />
                <p className="text-lg">Interactive Gasifier Simulator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Everything You Need to Know
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Interactive Simulator',
                description: 'Model gasifier performance with ideal and realistic modes. Calculate efficiency, temperature, and syngas composition.',
                link: '/simulator',
              },
              {
                icon: BookOpen,
                title: 'Design Guides',
                description: 'Step-by-step guides for sizing, materials, construction, and integration. Based on FAO standards and field experience.',
                link: '/build-guides',
              },
              {
                icon: Wrench,
                title: 'Practical Knowledge',
                description: 'Troubleshooting, maintenance, fuel types, safety protocols, and real-world build examples from experienced builders.',
                link: '/resources',
              },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className="p-8 border border-slate-200 rounded-lg hover:shadow-lg transition-shadow hover:border-blue-300"
              >
                <item.icon size={40} className="text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Explore the interactive simulator to see how different design parameters affect gasifier performance.
          </p>
          <Link
            to="/simulator"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-slate-100 transition-colors font-semibold"
          >
            Open Simulator <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
