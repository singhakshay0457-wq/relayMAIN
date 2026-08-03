import React from 'react';
import { 
  Building2, Shield, Zap, Rocket, Award, Users, CheckCircle2, 
  ArrowRight, Sparkles, Globe, Terminal, Lock, Cpu, Clock 
} from 'lucide-react';

interface AboutPageProps {
  onBookDemo: () => void;
}

export default function AboutPage({ onBookDemo }: AboutPageProps) {
  const values = [
    {
      title: 'Zero Lead Loss Philosophy',
      desc: 'We believe every customer inquiry is valuable. No prospect should ever wait hours or receive an unanswered voicemail.',
      icon: Zap
    },
    {
      title: 'Enterprise Safety & Privacy',
      desc: 'Built with strict encryption, TLS 1.3, AES-256 Firestore persistence, and role-based access control by default.',
      icon: Shield
    },
    {
      title: 'Human-Grade Conversation Quality',
      desc: 'Our AI voice and chat agents are pre-trained to sound natural, polite, helpful, and brand-aligned across every turn.',
      icon: Users
    },
    {
      title: 'Measurable Revenue Impact',
      desc: 'We evaluate success strictly by increased appointment volume, higher conversion rates, and recovered lost revenue.',
      icon: Award
    }
  ];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-20">
      
      {/* Hero Header */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold uppercase tracking-widest">
          <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          About Relay AI Technologies
        </div>
        
        <h1 className="font-sans font-black text-4xl sm:text-6xl text-slate-900 dark:text-white tracking-tight leading-tight">
          Powering the Next Generation of Autonomous Lead Conversion
        </h1>

        <p className="font-sans text-slate-600 dark:text-slate-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
          Relay AI Technologies is an enterprise AI automation company and growth marketing agency. We bridge the gap between initial customer inquiry and booked live calendar appointments—instantly, 24/7.
        </p>
      </div>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#131317] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Rocket className="w-6 h-6" />
          </div>
          <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white">Our Mission</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            To eliminate lead loss for businesses worldwide. By combining cutting-edge voice intelligence, multi-channel chat AI, and seamless CRM integrations, we ensure that every prospective buyer receives an immediate, intelligent response in under 2 seconds.
          </p>
        </div>

        <div className="bg-white dark:bg-[#131317] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white">Our Vision</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            A world where business communication is effortless, instant, and frictionless. Where human professionals focus on delivering great service, while autonomous AI agents handle 100% of lead qualification, scheduling, and routine follow-ups around the clock.
          </p>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="bg-slate-900 dark:bg-[#0A0A0F] border border-slate-800 text-white rounded-3xl p-8 sm:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center shadow-xl">
        <div className="space-y-1">
          <span className="font-sans font-black text-3xl sm:text-5xl text-blue-400 block tracking-tight">
            &lt; 1.8s
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
            Average Response Time
          </span>
        </div>
        <div className="space-y-1">
          <span className="font-sans font-black text-3xl sm:text-5xl text-blue-400 block tracking-tight">
            100%
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
            Inquiry Capture Rate
          </span>
        </div>
        <div className="space-y-1">
          <span className="font-sans font-black text-3xl sm:text-5xl text-blue-400 block tracking-tight">
            24/7/365
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
            Autonomous Availability
          </span>
        </div>
        <div className="space-y-1">
          <span className="font-sans font-black text-3xl sm:text-5xl text-blue-400 block tracking-tight">
            +340%
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
            Average Conversion Lift
          </span>
        </div>
      </div>

      {/* Core Engineering Values */}
      <div className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="font-sans font-black text-3xl text-slate-900 dark:text-white">
            Our Core Principles
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            The foundational standards that guide every AI agent model, database schema, and customer solution we build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, idx) => (
            <div key={idx} className="bg-white dark:bg-[#131317] p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-1">
                <v.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">{v.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise Architecture & Security */}
      <div className="bg-white dark:bg-[#131317] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Security & Trust</span>
            <h3 className="font-sans font-black text-xl text-slate-900 dark:text-white">Built On Google Cloud & Firebase Enterprise</h3>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Relay AI Technologies is architected with strict cloud safety standards. All user data, lead transcripts, and appointment logs are encrypted in transit via TLS 1.3 and at rest using AES-256 in Firestore Enterprise. Role-based access control guarantees that your data stays strictly isolated.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Encryption Standard</span>
            <span>TLS 1.3 / AES-256 Bit</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Cloud Runtime</span>
            <span>Serverless Cloud Run Container</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Database Isolation</span>
            <span>Strict Firestore ABAC Security Rules</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-blue-600 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
        <h2 className="font-sans font-black text-2xl sm:text-4xl">
          Partner With Relay AI Technologies Today
        </h2>
        <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
          Let our team demonstrate how Relay AI can automate your sales leads and increase monthly appointment volume.
        </p>
        <button
          onClick={onBookDemo}
          className="bg-white text-blue-600 hover:bg-slate-100 font-sans text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-xl transition-all cursor-pointer shadow-lg"
        >
          Book Your Free Demo
        </button>
      </div>

    </div>
  );
}
