import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import SimulatorPage from './pages/SimulatorPage';
import HowItWorksPage from './pages/HowItWorksPage';
import BuildGuidesPage from './pages/BuildGuidesPage';
import FuelTypesPage from './pages/FuelTypesPage';
import SafetyPage from './pages/SafetyPage';
import ResourcesPage from './pages/ResourcesPage';
import TroubleshootingPage from './pages/TroubleshootingPage';
import GlossaryPage from './pages/GlossaryPage';
import AboutPage from './pages/AboutPage';
import LegalPage from './pages/LegalPage';
import MaintenancePage from './pages/MaintenancePage';
import RealBuildsPage from './pages/RealBuildsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Router basename="/wood-gasifier">
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/build-guides" element={<BuildGuidesPage />} />
          <Route path="/fuel-types" element={<FuelTypesPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/troubleshooting" element={<TroubleshootingPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/real-builds" element={<RealBuildsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
