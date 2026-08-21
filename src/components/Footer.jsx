import React from 'react';
import { Link } from 'react-router-dom';

const footerLinks = [
  {
    title: 'Resources',
    links: [
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Build Guides', href: '/build-guides' },
      { name: 'Safety', href: '/safety' },
      { name: 'Troubleshooting', href: '/troubleshooting' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { name: 'Fuel Types', href: '/fuel-types' },
      { name: 'Glossary', href: '/glossary' },
      { name: 'Real Builds', href: '/real-builds' },
      { name: 'Maintenance', href: '/maintenance' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Legal', href: '/legal' },
      { name: 'Resources', href: '/resources' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚙️</span>
              </div>
              <span className="font-bold text-lg">Wood Gasifier</span>
            </div>
            <p className="text-slate-400 text-sm">
              Educational gasifier simulator for home-scale builders and experimenters.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://github.com/jdnitrap/wood-gasifier"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
            <p>&copy; 2026 Wood Gasifier. Educational use only.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/legal" className="hover:text-blue-400 transition-colors">
                Legal
              </Link>
              <a
                href="https://github.com/jdnitrap/wood-gasifier"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
