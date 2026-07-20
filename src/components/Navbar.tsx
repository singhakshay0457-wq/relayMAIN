import { ActivePage } from '../types';
import { Menu, X, Terminal, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage, initialTab?: 'security' | 'privacy' | 'terms' | 'about') => void;
  onStartTrial: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Navbar({ activePage, onPageChange, onStartTrial, theme, onToggleTheme }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'contact', label: 'Contact' },
    { id: 'gmail', label: 'Gmail' },
    { id: 'security', label: 'Trust Center' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-surface/75 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30 transition-all duration-300">
      <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">
        {/* Brand Logo with status light */}
        <div 
          onClick={() => onPageChange('home')}
          className="flex items-center gap-3 cursor-pointer group"
          id="nav-logo-btn"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-electric-blue to-electric-cyan p-0.5 shadow-md shadow-electric-blue/10">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="font-sans text-xl font-bold text-white tracking-tight group-hover:text-brand-primary transition-colors">
            Relay AI
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`relative py-1 font-sans text-sm font-medium transition-colors cursor-pointer hover:text-white ${
                activePage === item.id
                  ? 'text-brand-primary font-semibold border-b-2 border-brand-primary'
                  : 'text-brand-text-muted'
              }`}
              id={`nav-link-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center p-2.5 rounded-lg bg-white/5 border border-white/10 text-brand-primary hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>
          <button
            onClick={onStartTrial}
            className="primary-gradient-bg text-black font-sans text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md shadow-electric-blue/10 cursor-pointer"
            id="nav-cta-btn"
          >
            Start Free Trial
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-brand-text-muted hover:text-white p-1 cursor-pointer"
            id="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-surface/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 animate-slide-in">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 font-sans text-base font-medium transition-colors ${
                  activePage === item.id
                    ? 'text-brand-primary font-semibold'
                    : 'text-brand-text-muted'
                }`}
                id={`mobile-nav-link-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-4 border-t border-white/5 space-y-4">
            <button
              onClick={() => {
                onToggleTheme();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-lg bg-white/5 border border-white/10 text-brand-text-muted hover:text-white transition-all cursor-pointer font-sans text-sm font-bold uppercase tracking-wider"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span>Switch to Dark Mode</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                onStartTrial();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center primary-gradient-bg text-black font-sans text-sm font-bold uppercase tracking-wider py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all"
              id="mobile-nav-cta-btn"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
