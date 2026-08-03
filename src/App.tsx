import { useState, useEffect } from 'react';
import { ActivePage } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ServicesPage from './components/ServicesPage';
import IndustriesPage from './components/IndustriesPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import LeadsPage from './components/LeadsPage';
import SecurityPage from './components/SecurityPage';
import TrialModal from './components/TrialModal';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [securityTab, setSecurityTab] = useState<'security' | 'privacy' | 'terms' | 'about'>('security');
  const [isTrialOpen, setIsTrialOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  }, []);

  const handlePageChange = (page: ActivePage, tab?: 'security' | 'privacy' | 'terms' | 'about') => {
    setActivePage(page);
    if (tab) {
      setSecurityTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTrial = () => {
    setIsTrialOpen(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-[#0B0B0F] text-[#e4e1e7]">
      
      {/* Shared Header Navigation */}
      <Navbar 
        activePage={activePage} 
        onPageChange={handlePageChange} 
        onStartTrial={handleStartTrial} 
      />

      {/* Main Page Area with Dynamic View Selector */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <HomePage 
            onStartTrial={handleStartTrial} 
            onNavigateToMarketing={() => handlePageChange('contact')} 
          />
        )}
        {activePage === 'services' && (
          <ServicesPage onBookDemo={handleStartTrial} />
        )}
        {activePage === 'industries' && (
          <IndustriesPage onBookDemo={handleStartTrial} />
        )}
        {activePage === 'about' && (
          <AboutPage onBookDemo={handleStartTrial} />
        )}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'leads' && <LeadsPage onBookDemo={handleStartTrial} />}
        {activePage === 'security' && <SecurityPage initialTab={securityTab} />}
      </main>

      {/* Shared Footer Area */}
      <Footer onPageChange={handlePageChange} />

      {/* Multi-step Trial Sandbox Configurator Modal */}
      <TrialModal 
        isOpen={isTrialOpen} 
        onClose={() => setIsTrialOpen(false)} 
      />
    </div>
  );
}
