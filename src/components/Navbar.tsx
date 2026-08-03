import { ActivePage } from '../types';
import { Menu, X, Terminal, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage, initialTab?: 'security' | 'privacy' | 'terms' | 'about') => void;
  onStartTrial: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export default function Navbar({ activePage, onPageChange, onStartTrial, onScrollToSection }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string, pageId?: ActivePage) => {
    if (pageId && pageId !== 'home') {
      onPageChange(pageId);
    } else {
      if (activePage !== 'home') {
        onPageChange('home');
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/10 shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center px-6 md:px-12 py-3.5 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('hero', 'home')}
          className="flex items-center gap-3 cursor-pointer group"
          id="nav-logo-btn"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-electric-blue via-electric-cyan to-indigo-600 p-0.5 shadow-lg shadow-electric-blue/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-electric-cyan" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-lg font-black text-white tracking-tight group-hover:text-electric-cyan transition-colors flex items-center gap-1.5">
              Relay AI <span className="text-[10px] font-mono font-normal px-1.5 py-0.2 rounded bg-electric-blue/20 text-electric-cyan border border-electric-blue/30 uppercase tracking-widest hidden sm:inline-block">Tech</span>
            </span>
            <span className="text-[9px] font-mono text-brand-text-muted tracking-wider -mt-1 uppercase hidden sm:block">
              Technologies
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7">
          <button
            onClick={() => onPageChange('home')}
            className={`text-xs font-sans uppercase font-bold tracking-wider transition-colors cursor-pointer ${
              activePage === 'home' 
                ? 'text-electric-cyan font-extrabold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onPageChange('services')}
            className={`text-xs font-sans uppercase font-bold tracking-wider transition-colors cursor-pointer ${
              activePage === 'services' 
                ? 'text-electric-cyan font-extrabold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => onPageChange('industries')}
            className={`text-xs font-sans uppercase font-bold tracking-wider transition-colors cursor-pointer ${
              activePage === 'industries' 
                ? 'text-electric-cyan font-extrabold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Industries
          </button>
          <button
            onClick={() => onPageChange('about')}
            className={`text-xs font-sans uppercase font-bold tracking-wider transition-colors cursor-pointer ${
              activePage === 'about' 
                ? 'text-electric-cyan font-extrabold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            About
          </button>
          <button
            onClick={() => onPageChange('contact')}
            className={`text-xs font-sans uppercase font-bold tracking-wider transition-colors cursor-pointer ${
              activePage === 'contact' 
                ? 'text-electric-cyan font-extrabold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => onPageChange('leads')}
            className={`text-xs font-sans uppercase font-bold tracking-wider transition-colors cursor-pointer flex items-center gap-1 ${
              activePage === 'leads' 
                ? 'text-electric-cyan font-extrabold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 bg-electric-cyan rounded-full animate-pulse"></span>
            Enquiries
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onStartTrial}
            className="primary-gradient-bg text-black font-sans text-xs font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md shadow-electric-blue/20 cursor-pointer flex items-center gap-1.5"
            id="nav-cta-btn"
          >
            <span>Book Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-2">
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
        <div className="lg:hidden bg-[#0A0A0A]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 shadow-xl animate-slide-in">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { onPageChange('home'); setMobileMenuOpen(false); }}
              className="text-left py-2 font-sans font-bold text-sm text-slate-200 hover:text-electric-cyan uppercase tracking-wider"
            >
              Home
            </button>
            <button
              onClick={() => { onPageChange('services'); setMobileMenuOpen(false); }}
              className="text-left py-2 font-sans font-bold text-sm text-slate-200 hover:text-electric-cyan uppercase tracking-wider"
            >
              Services
            </button>
            <button
              onClick={() => { onPageChange('industries'); setMobileMenuOpen(false); }}
              className="text-left py-2 font-sans font-bold text-sm text-slate-200 hover:text-electric-cyan uppercase tracking-wider"
            >
              Industries
            </button>
            <button
              onClick={() => { onPageChange('about'); setMobileMenuOpen(false); }}
              className="text-left py-2 font-sans font-bold text-sm text-slate-200 hover:text-electric-cyan uppercase tracking-wider"
            >
              About
            </button>
            <button
              onClick={() => { onPageChange('contact'); setMobileMenuOpen(false); }}
              className="text-left py-2 font-sans font-bold text-sm text-slate-200 hover:text-electric-cyan uppercase tracking-wider"
            >
              Contact
            </button>
            <button
              onClick={() => { onPageChange('leads'); setMobileMenuOpen(false); }}
              className="text-left py-2 font-sans font-bold text-sm text-electric-cyan hover:text-white uppercase tracking-wider flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-electric-cyan rounded-full animate-pulse"></span>
              Enquiries Console
            </button>
          </div>
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => { onStartTrial(); setMobileMenuOpen(false); }}
              className="w-full text-center primary-gradient-bg text-black font-sans text-xs font-black uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-electric-blue/20"
              id="mobile-nav-cta-btn"
            >
              <span>Book Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

