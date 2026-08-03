import React from 'react';
import { Target, Compass, Sparkles } from 'lucide-react';

interface AboutPageProps {
  onBookDemo: () => void;
}

export default function AboutPage({ onBookDemo }: AboutPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-6">
        <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-electric-cyan" />
          <span>About Relay AI Technologies</span>
        </span>
        
        <h1 className="font-sans font-black text-4xl sm:text-6xl text-white tracking-tight leading-tight">
          Smarter, Faster, and More Effective Growth
        </h1>
        
        <div className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto space-y-4">
          <p>
            At Relay, we believe every business deserves smarter, faster, and more effective growth. We are a results-driven AI marketing and automation agency that helps businesses generate leads, streamline operations, and build a stronger digital presence.
          </p>
          <p>
            Our expertise combines artificial intelligence, digital marketing, website development, CRM automation, content creation, and social media management to create solutions that save time, improve customer experiences, and drive measurable growth.
          </p>
          <p>
            We don’t believe in one-size-fits-all strategies. Every business is unique, which is why we take the time to understand your goals, challenges, and vision before building a tailored growth plan that delivers real results.
          </p>
          <p>
            Whether you’re a startup looking to establish your brand or an established business ready to scale, Relay becomes your trusted growth partner—leveraging technology, creativity, and data-driven strategies to help you stay ahead in an ever-evolving digital world.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mission Card */}
        <div className="glass-card p-8 rounded-3xl border border-electric-cyan/30 bg-gradient-to-br from-[#060812] to-[#0B1024] space-y-4 relative overflow-hidden group hover:border-electric-cyan transition-all">
          <div className="w-12 h-12 rounded-2xl bg-electric-cyan/10 border border-electric-cyan/30 flex items-center justify-center text-electric-cyan">
            <Target className="w-6 h-6" />
          </div>

          <h2 className="font-sans font-black text-2xl text-white tracking-tight">
            Our Mission
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            To empower businesses with innovative AI-powered marketing and automation solutions that accelerate growth, improve efficiency, and create lasting success.
          </p>
        </div>

        {/* Vision Card */}
        <div className="glass-card p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#060812] to-[#110D28] space-y-4 relative overflow-hidden group hover:border-indigo-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Compass className="w-6 h-6" />
          </div>

          <h2 className="font-sans font-black text-2xl text-white tracking-tight">
            Our Vision
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            To become a global leader in AI-driven business growth, helping companies of all sizes transform the way they attract customers, communicate, and scale.
          </p>
        </div>

      </section>

    </div>
  );
}
