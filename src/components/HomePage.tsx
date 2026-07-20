import { ArrowRight, Sparkles, Zap, Shield, Users, Clock, Flame } from 'lucide-react';
import LeadSimulator from './LeadSimulator';

interface HomePageProps {
  onStartTrial: () => void;
  onNavigateToMarketing: () => void;
}

export default function HomePage({ onStartTrial, onNavigateToMarketing }: HomePageProps) {
  const stats = [
    { label: 'Instant response time', value: '< 2.0s', icon: Clock },
    { label: 'SaaS conversion lift', value: '+240%', icon: Flame },
    { label: 'Active agent containers', value: '14,200+', icon: Users },
  ];

  const valueProps = [
    {
      title: 'Zero Leakage',
      desc: 'Never miss a weekend, night, or holiday inquiry. Relay AI responds instantly while competitors sleep.',
      icon: Zap,
    },
    {
      title: 'Auto-Qualification',
      desc: 'Filters low-budget and bad-fit inquiries through natural dialogue, conserving human sales bandwidth.',
      icon: Shield,
    },
    {
      title: 'Dynamic Booking',
      desc: 'Integrates with Google Calendar & Outlook to book walkthroughs instantly inside the conversation stream.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-24 pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
      {/* HERO SECTION */}
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        {/* Glow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-blue/10 border border-electric-blue/20 animate-slide-in">
          <Sparkles className="w-4 h-4 text-brand-primary" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-primary font-bold">
            Introducing Relay AI v2.0
          </span>
        </div>

        {/* Hero Headings */}
        <div className="space-y-4">
          <h1 className="font-sans font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[1.1] text-gradient">
            Respond Instantly to Every Single Lead
          </h1>
          <p className="font-sans text-brand-text-muted text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Relay AI qualifies customers, answers complex objections, follows up automatically, and books live demonstrations 24/7. Fully autonomous marketing intelligence.
          </p>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartTrial}
            className="w-full sm:w-auto primary-gradient-bg text-black font-sans text-sm font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-electric-blue/15 cursor-pointer flex items-center justify-center gap-2"
            id="hero-cta-trial"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateToMarketing}
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-sans text-sm font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
            id="hero-cta-marketing"
          >
            <span>Explore Features</span>
          </button>
        </div>
      </div>

      {/* METRICS METRIC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="glass-card p-6 rounded-xl flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-electric-cyan/10 border border-electric-cyan/20 text-electric-cyan">
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-sans font-extrabold text-3xl text-white tracking-tight">
                {s.value}
              </span>
              <span className="block text-xs font-mono uppercase tracking-wider text-brand-text-muted">
                {s.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* LIVE INTERACTIVE DEMO SIMULATOR VIEW */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl text-white tracking-tight">
            See Relay AI in Action
          </h2>
          <p className="text-sm text-brand-text-muted max-w-lg mx-auto leading-relaxed">
            Watch our containerized conversation layer qualify a new marketing prospect and synchronise details in real time.
          </p>
        </div>
        
        <LeadSimulator />
      </div>

      {/* VALUE PROPOSITION GRID */}
      <div className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Why Modern Sales Teams Rely on Relay
          </h2>
          <p className="text-sm text-brand-text-muted max-w-lg mx-auto leading-relaxed">
            Eliminate response friction and compress your sales cycle from days to seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueProps.map((p, idx) => (
            <div key={idx} className="glass-card p-8 rounded-xl space-y-4">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                <p.icon className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-lg text-white">{p.title}</h3>
              <p className="text-sm text-brand-text-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
