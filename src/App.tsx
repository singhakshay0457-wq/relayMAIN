import { useState, useEffect } from 'react';
import { ActivePage } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ShaderBackground from './components/ShaderBackground';
import HomePage from './components/HomePage';
import ContactPage from './components/ContactPage';
import GmailPage from './components/GmailPage';
import SecurityPage from './components/SecurityPage';
import TrialModal from './components/TrialModal';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [securityTab, setSecurityTab] = useState<'security' | 'privacy' | 'terms' | 'about'>('security');
  const [isTrialOpen, setIsTrialOpen] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handlePageChange = (page: ActivePage, tab?: 'security' | 'privacy' | 'terms' | 'about') => {
    setActivePage(page);
    if (tab) {
      setSecurityTab(tab);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Interactive WebGL Shader Background */}
      <ShaderBackground />

      {/* Shared Header Navigation */}
      <Navbar 
        activePage={activePage} 
        onPageChange={handlePageChange} 
        onStartTrial={() => setIsTrialOpen(true)} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Page Area with Dynamic View Selector */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <HomePage 
            onStartTrial={() => setIsTrialOpen(true)} 
            onNavigateToMarketing={() => handlePageChange('security', 'about')} 
          />
        )}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'gmail' && <GmailPage />}
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
