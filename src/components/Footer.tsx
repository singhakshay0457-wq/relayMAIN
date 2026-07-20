import React, { useState } from 'react';
import { ActivePage } from '../types';
import { Mail, Check, Terminal } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: ActivePage, initialTab?: 'security' | 'privacy' | 'terms' | 'about') => void;
}

export default function Footer({ onPageChange }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000); // resets after 5s
  };

  return (
    <footer className="w-full bg-brand-surface-elevated/80 border-t border-white/10 mt-16 backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6 md:px-12 py-16 max-w-7xl mx-auto">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onPageChange('home')}>
            <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-electric-blue to-electric-cyan p-0.5">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-sans text-xl font-bold text-white tracking-tight">
              Relay AI
            </span>
          </div>
          <p className="text-brand-text-muted text-sm max-w-xs leading-relaxed">
            The next generation of lead automation. We bridge the gap between initial customer inquiry and scheduled live booking instantly.
          </p>
        </div>

        {/* Links & Navigation columns grouped */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-white text-xs uppercase tracking-wider text-brand-primary">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-brand-text-muted text-sm">
              <li>
                <button
                  onClick={() => onPageChange('home')}
                  className="hover:text-electric-cyan transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('contact')}
                  className="hover:text-electric-cyan transition-colors text-left cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-white text-xs uppercase tracking-wider text-brand-primary">
              Legal
            </h4>
            <ul className="space-y-2.5 text-brand-text-muted text-sm">
              <li>
                <button 
                  onClick={() => onPageChange('security', 'privacy')} 
                  className="hover:text-electric-cyan transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange('security', 'terms')} 
                  className="hover:text-electric-cyan transition-colors text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange('security', 'security')} 
                  className="hover:text-electric-cyan transition-colors text-left cursor-pointer"
                >
                  Security Hub
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange('security', 'about')} 
                  className="hover:text-rose-400 transition-colors text-left cursor-pointer font-medium"
                >
                  Our Story & Founder
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter column */}
        <div className="space-y-4">
          <h4 className="font-sans font-bold text-white text-xs uppercase tracking-wider text-brand-primary">
            Join our Newsletter
          </h4>
          <p className="text-brand-text-muted text-sm leading-relaxed">
            Stay up to date with the latest advancements in autonomous sales conversion & marketing intelligence.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-[#050507] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors placeholder:text-brand-text-muted/60"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/20 hover:border-brand-primary/40 px-4 py-2.5 rounded-lg transition-all font-bold text-sm cursor-pointer whitespace-nowrap active:scale-95"
            >
              Join
            </button>
          </form>

          {subscribed && (
            <div className="flex items-center gap-2 text-xs text-electric-cyan font-mono animate-slide-in">
              <Check className="w-4 h-4" />
              <span>Successfully subscribed to Newsletter!</span>
            </div>
          )}

          <p className="text-brand-text-muted text-[11px] leading-relaxed pt-2">
            © {new Date().getFullYear()} Relay AI. All rights reserved. Designed for elite, high-performance sales.
          </p>
        </div>
      </div>
    </footer>
  );
}
