import React from 'react';
import { ActivePage } from '../types';
import { Mail, Terminal, Instagram, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: ActivePage, initialTab?: 'security' | 'privacy' | 'terms' | 'about') => void;
}

export default function Footer({ onPageChange }: FooterProps) {
  const handleScrollToSection = (sectionId: string) => {
    onPageChange('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="w-full bg-[#050507] border-t border-white/10 mt-20 relative z-10 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleScrollToSection('hero')}>
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-electric-blue via-electric-cyan to-indigo-600 p-0.5 shadow-lg shadow-electric-blue/20">
                <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-electric-cyan" />
                </div>
              </div>
              <span className="font-sans text-xl font-black text-white tracking-tight">
                Relay AI <span className="text-electric-cyan font-mono text-sm font-normal">Technologies</span>
              </span>
            </div>

            <p className="font-sans text-brand-primary text-sm font-semibold tracking-wide">
              Never Miss Another Lead.
            </p>

            <p className="text-brand-text-muted text-xs max-w-sm leading-relaxed">
              Relay AI Technologies uses autonomous AI agents, voice intelligence, and complete business marketing automation to instantly engage, qualify, and convert every lead 24/7.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs font-mono text-electric-cyan">
              <Mail className="w-3.5 h-3.5" />
              <a href="mailto:sales@relayaitechnologies.com" className="hover:underline font-bold">sales@relayaitechnologies.com</a>
            </div>

            {/* Social & Direct Contact Icons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a href="https://wa.me/917390099764?text=Hi%20Relay%20AI%20Technologies,%20I'd%20like%20to%20inquire%20about%20your%20AI%20marketing%20and%20automation%20solutions." target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors" aria-label="WhatsApp Us">
                <span>WhatsApp (+91 7390099764)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a href="mailto:sales@relayaitechnologies.com" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-text-muted hover:text-white hover:bg-white/10 transition-colors" aria-label="Email Us">
                <Mail className="w-4 h-4 text-electric-cyan" />
              </a>
              <a href="https://www.instagram.com/relayaitechnologies?igsh=N3IyMXVna3B6aWZk" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-text-muted hover:text-white hover:bg-white/10 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider text-electric-cyan">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs text-brand-text-muted">
              <li>
                <button onClick={() => onPageChange('security', 'privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('security', 'terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('security', 'security')} className="hover:text-white transition-colors">
                  Security Controls
                </button>
              </li>
              <li>
                <a href="mailto:sales@relayaitechnologies.com" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Contact Security</span>
                  <ArrowUpRight className="w-3 h-3 text-brand-text-muted" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-brand-text-muted text-center md:text-left">
            © {new Date().getFullYear()} Relay AI Technologies Inc. All rights reserved. Powered by Autonomous AI Agents.
          </p>
        </div>
      </div>
    </footer>
  );
}

