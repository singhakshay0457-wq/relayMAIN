import React, { useState } from 'react';
import { 
  PhoneCall, Bot, UserCheck, Calendar, Database, Mail, MessageCircle, Megaphone, 
  ArrowRight, CheckCircle2, Zap, Shield, Sparkles, Clock, BarChart3, ChevronRight 
} from 'lucide-react';

interface ServicesPageProps {
  onBookDemo: () => void;
}

export default function ServicesPage({ onBookDemo }: ServicesPageProps) {
  const [activeTab, setActiveTab] = useState<string>('voice');

  const servicesList = [
    {
      id: 'voice',
      title: 'AI Voice Agent',
      icon: PhoneCall,
      subtitle: 'Human-like 24/7 Phone Reception',
      tagline: 'Never miss another incoming customer call.',
      description: 'Our AI Voice Agent answers phone calls instantly in under 2 seconds with natural inflection. It handles caller inquiries, qualifies prospect budgets, answers complex questions, and books appointments directly during the call.',
      features: [
        'Natural speech synthesis & instant inflection',
        'Inbound & outbound call handling',
        'Real-time Google Calendar & CRM booking',
        'HD call recording & transcript logging',
        'Custom objection handling knowledge base',
        'Multi-language phone dialogue (40+ languages)'
      ],
      metrics: '0 Missed Calls • 1.8s Latency • 3.5x More Bookings'
    },
    {
      id: 'chat',
      title: 'AI Chat Agent',
      icon: Bot,
      subtitle: 'Omnichannel Web & Social AI Agent',
      tagline: 'Engage website visitors and social media leads 24/7.',
      description: 'Deploy an intelligent chat agent across your website, Instagram DMs, Facebook Messenger, and web portals. Converts window shoppers into qualified appointments without human delay.',
      features: [
        'Embeddable website widget & popups',
        'Instagram Direct Message & Story reply automation',
        'Facebook Messenger instant chat handling',
        'Contextual memory across multi-turn conversations',
        'Rich media & document sharing capabilities',
        'Smooth human handoff when complex escalation is needed'
      ],
      metrics: '24/7 Availability • 85% Resolution Rate • +240% Lead Capture'
    },
    {
      id: 'qualification',
      title: 'Lead Qualification',
      icon: UserCheck,
      subtitle: 'Autonomous Lead Scoring & Screening',
      tagline: 'Filter out tire-kickers and prioritize high-value buyers.',
      description: 'Relay AI dynamically asks crucial qualifier questions—budget, project scope, location, urgency, and decision-maker status—before passing qualified opportunities to your team.',
      features: [
        'Custom qualification rubric configuration',
        'Dynamic scoring engine (0 - 100 points)',
        'Automatic tiering (Hot, Warm, Unqualified)',
        'Instant notifications for top-tier prospects',
        'Prevents calendar spam from unbudgeted leads',
        'Detailed lead telemetry saved to CRM'
      ],
      metrics: '100% Leads Scored • Zero Wasted Sales Hours • High Quality'
    },
    {
      id: 'booking',
      title: 'Appointment Booking',
      icon: Calendar,
      subtitle: 'Automated Calendar Synchronization',
      tagline: 'Eliminate endless back-and-forth emails forever.',
      description: 'Relay AI checks live team availability and locks in confirmed appointments directly into Google Calendar, Outlook, or Calendly right inside the phone or chat conversation.',
      features: [
        'Two-way Google Calendar & Outlook integration',
        'Timezone auto-detection & localized formatting',
        'Automated SMS & email calendar invites',
        'Pre-meeting reminder sequences to eliminate no-shows',
        'Custom buffer times & daily meeting caps',
        'Rescheduling & cancellation self-serve management'
      ],
      metrics: 'Zero Double Bookings • 92% Show Rate • Instant Sync'
    },
    {
      id: 'crm',
      title: 'CRM Automation',
      icon: Database,
      subtitle: 'Real-Time Pipeline Synchronization',
      tagline: 'Keep your entire database updated automatically.',
      description: 'Every contact detail, qualification note, transcript, and booking timestamp is instantly written to your existing CRM system without any manual copy-pasting.',
      features: [
        'Native connectors for HubSpot, Salesforce, Zoho, Pipedrive',
        'Custom Webhooks & Zapier/Make integrations',
        'Automated deal pipeline stage movement',
        'Full conversation logs attached to contact records',
        'Duplicate contact detection & merging',
        'Custom field mapping for unique industry data'
      ],
      metrics: '100% Data Accuracy • 35+ Hours Saved/Month • Zero Data Loss'
    },
    {
      id: 'email',
      title: 'Email Automation',
      icon: Mail,
      subtitle: 'Sub-2-Second Email Response Engine',
      tagline: 'Reply to inbound email quotes before competitors open their inbox.',
      description: 'Monitors inbound contact form emails and sales inquiries, composing hyper-personalized, context-aware answers that move prospects to the next step instantly.',
      features: [
        'Inbound email parsing & intent detection',
        'Contextual response generation with custom knowledge base',
        'Automated quote attachment & pricing estimates',
        'Personalized follow-up email drips',
        'SPF/DKIM/DMARC secure deliverability',
        'Escalation triggers for urgent inquiries'
      ],
      metrics: 'Under 2-Second Reply • 4.2x Faster Conversion • 100% Coverage'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Automation',
      icon: MessageCircle,
      subtitle: 'Official WhatsApp Business API Automation',
      tagline: 'Engage customers on the world’s most popular messaging app.',
      description: 'Connect Relay AI to WhatsApp Business API to run automated chat flows, send interactive catalog menus, broadcast promotional campaigns, and answer customer support questions 24/7.',
      features: [
        'Official WhatsApp Business API verification setup',
        'Interactive quick-reply buttons & list menus',
        'Automated WhatsApp appointment confirmations & reminders',
        'Broadcast promotional messaging with template approval',
        'Multi-agent shared inbox for human support',
        'Rich image, video, and PDF document dispatch'
      ],
      metrics: '98% Open Rate • 45% Response Rate • Instant DM Conversions'
    },
    {
      id: 'marketing',
      title: 'Marketing Services',
      icon: Megaphone,
      subtitle: 'Full-Funnel Customer Acquisition Campaigns',
      tagline: 'High-converting ad campaigns paired with instant AI follow-up.',
      description: 'We design, launch, and optimize high-intent ad campaigns on Google Search, Meta (Facebook & Instagram), and LinkedIn—connecting ad leads directly to Relay AI for instant conversion.',
      features: [
        'Google Search Ads for high-intent buyer keywords',
        'Meta Lead Ads with instant 2-second AI chat response',
        'Conversion-optimized landing page design',
        'A/B creative testing & copywriting',
        'Transparent ROI & cost-per-acquisition reporting',
        'End-to-end sales funnel architecture'
      ],
      metrics: '3x-5x Average ROI • -40% Cost Per Lead • Complete Management'
    }
  ];

  const selectedService = servicesList.find(s => s.id === activeTab) || servicesList[0];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Enterprise Automation Suite
        </div>
        <h1 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl text-slate-900 dark:text-white tracking-tight leading-tight">
          Services & Automation Capabilities
        </h1>
        <p className="font-sans text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
          Relay AI Technologies provides an integrated suite of autonomous AI agents and growth marketing services designed to capture every lead and scale business revenue 24/7.
        </p>
      </div>

      {/* Services Grid Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 bg-slate-100/80 dark:bg-slate-900/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
        {servicesList.map((service) => {
          const Icon = service.icon;
          const isActive = service.id === activeTab;
          return (
            <button
              key={service.id}
              onClick={() => setActiveTab(service.id)}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'bg-white dark:bg-[#1A1A22] text-blue-600 dark:text-blue-400 shadow-md border border-slate-200/80 dark:border-slate-700 font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
              <span className="text-xs text-center leading-tight line-clamp-1">{service.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Service Showcase Card */}
      <div className="bg-white dark:bg-[#131317] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">
              <selectedService.icon className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                {selectedService.subtitle}
              </span>
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {selectedService.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onBookDemo}
            className="bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/20 flex items-center gap-2 whitespace-nowrap"
          >
            <span>Book Demo For {selectedService.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Overview & Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Overview</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              {selectedService.description}
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
              <strong className="text-blue-600 dark:text-blue-400 block mb-1 uppercase tracking-wider">Performance Benchmark:</strong>
              {selectedService.metrics}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Key Features & Capabilities</h3>
            <div className="space-y-2.5">
              {selectedService.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Services Grid Overview */}
      <div className="space-y-8 pt-8">
        <div className="text-center space-y-2">
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Complete Service Breakdown
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Click any service above or explore the individual automation modules below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.id}
                onClick={() => setActiveTab(service.id)}
                className="bg-white dark:bg-[#131317] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {service.tagline}
                </p>
                <div className="pt-2 flex items-center text-xs font-mono text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Explore details</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-3 max-w-2xl mx-auto">
          <h2 className="font-sans font-black text-2xl sm:text-4xl">
            Ready to Automate Your Business Service Workflow?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Book a custom demo with our AI solution architects and see Relay AI configured for your exact business process.
          </p>
        </div>
        <button
          onClick={onBookDemo}
          className="bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-xl transition-all cursor-pointer shadow-xl shadow-blue-600/30"
        >
          Book Your Free Demo Now
        </button>
      </div>

    </div>
  );
}
