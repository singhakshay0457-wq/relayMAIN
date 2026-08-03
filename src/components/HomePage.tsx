import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Sparkles, Zap, Shield, Rocket, CheckCircle2, TrendingUp, Clock, 
  BarChart3, MessageSquare, PhoneCall, Bot, Calendar, Database, Mail, Mic, UserCheck, 
  Building2, Stethoscope, Utensils, Dumbbell, Hotel, Wrench, HardHat, Car, Scale, 
  GraduationCap, DollarSign, ShoppingCart, Target, Briefcase, Megaphone, Globe, Share2, 
  Search, MessageCircle, FileText, Check, ChevronDown, ChevronUp, Star, Award, 
  Layers, Cpu, Phone, Building, Send, ArrowDown, Users, Activity, Play, Video, 
  CheckCircle, RefreshCw, Layout, Eye, Sparkle
} from 'lucide-react';
import LeadSimulator from './LeadSimulator';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface HomePageProps {
  onStartTrial: () => void;
  onNavigateToMarketing: () => void;
}

export default function HomePage({ onStartTrial, onNavigateToMarketing }: HomePageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Strategy Call Booking Form State
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    industry: 'Real Estate',
    primaryGoal: 'Generate More Leads & Automate Sales'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationForm.email.trim() || !consultationForm.name.trim()) return;

    setIsSubmitting(true);
    try {
      const docId = `strategy_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await setDoc(doc(db, 'consultationRequests', docId), {
        ...consultationForm,
        createdAt: serverTimestamp(),
        source: 'HomepageStrategyCall'
      });
      setSubmitSuccess(true);
      setConsultationForm({
        name: '',
        businessName: '',
        email: '',
        phone: '',
        industry: 'Real Estate',
        primaryGoal: 'Generate More Leads & Automate Sales'
      });
      setTimeout(() => setSubmitSuccess(false), 8000);
    } catch (err) {
      console.error('Consultation booking error:', err);
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Services Data (Exact 9 items specified by user)
  const servicesList = [
    {
      title: 'AI Chatbots & AI Agents',
      desc: '24/7 intelligent conversational agents that engage, qualify, and convert website & messenger traffic into booked calls.',
      icon: Bot,
      emoji: '🤖',
      tag: 'Autonomous Sales'
    },
    {
      title: 'Digital Marketing',
      desc: 'Full-funnel digital campaigns designed to attract high-intent buyers and drive measurable revenue growth.',
      icon: TrendingUp,
      emoji: '📈',
      tag: 'Growth Engine'
    },
    {
      title: 'Social Media Management',
      desc: 'Strategic content creation, community engagement, and automated DM handling across Instagram, Facebook & LinkedIn.',
      icon: Share2,
      emoji: '📱',
      tag: 'Brand Building'
    },
    {
      title: 'Content Creation & Video Editing',
      desc: 'High-converting video reels, promotional graphics, and brand copywriting tailored for social and ad channels.',
      icon: Video,
      emoji: '🎥',
      tag: 'Creative Studio'
    },
    {
      title: 'Website Development',
      desc: 'Ultra-fast, mobile-optimized, high-converting websites with embedded AI lead capture and instant scheduling.',
      icon: Globe,
      emoji: '🌐',
      tag: 'High Conversion'
    },
    {
      title: 'SEO (Search Engine Optimization)',
      desc: 'Top Google rankings and local search dominance to bring an endless stream of organic inbound buyers.',
      icon: Search,
      emoji: '🔍',
      tag: 'Organic Growth'
    },
    {
      title: 'CRM & Lead Automation',
      desc: 'Centralized lead pipeline setup, automatic contact scoring, and multi-channel follow-up in HubSpot, Salesforce, or Zoho.',
      icon: Database,
      emoji: '💬',
      tag: 'Pipeline Sync'
    },
    {
      title: 'Email Marketing',
      desc: 'Hyper-personalized automated email nurture sequences that convert cold subscribers into repeat clients.',
      icon: Mail,
      emoji: '📧',
      tag: 'Nurture Engine'
    },
    {
      title: 'Google & Meta Ads',
      desc: 'Targeted Google Search and Facebook/Instagram Ad campaigns connected directly to instant AI response.',
      icon: Megaphone,
      emoji: '📊',
      tag: 'Instant ROI'
    },
  ];

  // 2. Why Choose Relay (6 Core Pillars)
  const whyChooseUsPillars = [
    {
      title: 'AI-First Solutions',
      desc: 'Cutting-edge autonomous voice and chat LLMs natively built into your entire marketing infrastructure for zero response delay.',
      icon: Cpu
    },
    {
      title: 'Custom Strategies',
      desc: 'No generic cookie-cutter templates. We craft bespoke growth blueprints engineered specifically for your industry and target market.',
      icon: Target
    },
    {
      title: 'Fast Implementation',
      desc: 'Go live with automated campaigns and 24/7 AI agents in days—not months. Zero technical complexity for your internal team.',
      icon: Zap
    },
    {
      title: 'Transparent Communication',
      desc: 'Real-time client portal access, clear ROI analytics, and straightforward reporting with no hidden vanity metrics.',
      icon: Eye
    },
    {
      title: 'End-to-End Marketing',
      desc: 'Complete agency capabilities under one roof—from ad copy and video reels to high-converting websites and CRM follow-up.',
      icon: Layers
    },
    {
      title: 'Dedicated Support',
      desc: 'Continuous technical support, strategic account management, and proactive AI conversation tuning to keep scaling your ROI.',
      icon: Shield
    },
  ];

  // 3. How We Work (4 Process Steps)
  const processSteps = [
    {
      number: '01',
      title: 'Free Consultation',
      desc: 'We analyze your current marketing channels, lead response velocity, and sales bottleneck to identify immediate growth opportunities.',
      icon: PhoneCall
    },
    {
      number: '02',
      title: 'Strategy & Architecture',
      desc: 'We engineer a tailored AI marketing strategy, ad acquisition funnels, website wireframes, and conversation workflows.',
      icon: Target
    },
    {
      number: '03',
      title: 'Build & Launch',
      desc: 'Our agency team designs your high-converting assets, launches ad campaigns, and integrates 24/7 AI agents into your CRM.',
      icon: Rocket
    },
    {
      number: '04',
      title: 'Optimize & Scale',
      desc: 'We analyze real-time lead performance, refine ad targeting, expand marketing channels, and continuously scale your revenue.',
      icon: TrendingUp
    },
  ];

  // 4. Case Studies
  const caseStudies = [
    {
      title: 'Vance & Co Real Estate',
      industry: 'Real Estate Agency',
      problem: 'Losing high-budget buyers on weekends when agents were off-duty.',
      solution: 'Deployed Relay AI Voice & Instagram DM Agent connected to Google Calendar.',
      results: [
        '+340% increase in weekend tour bookings',
        '$180,000 property transaction captured in first 30 days',
        'Under 2-second response time 24/7'
      ],
      metric: '+340% Tour Bookings'
    },
    {
      title: 'Aesthetic Dental Care',
      industry: 'Healthcare / Dental Clinic',
      problem: 'Front desk missed 40+ patient inquiry calls weekly during peak clinic hours.',
      solution: '24/7 AI Receptionist answering overflow calls & instant SMS follow-up.',
      results: [
        '0 missed patient inquiries',
        '68% reduction in appointment no-shows',
        '18 extra emergency appointments scheduled weekly'
      ],
      metric: '0 Missed Patient Calls'
    },
    {
      title: 'Pulse Commerce & Fitness',
      industry: 'E-commerce & Subscription Services',
      problem: 'High ad campaign lead drop-off due to slow email responses.',
      solution: 'Connected Meta Lead Ads directly to instant WhatsApp & AI chat follow-up.',
      results: [
        '4.2x ROAS on Meta Ad campaigns',
        '45% reduction in customer acquisition cost',
        '+62% lead-to-booked-consultation conversion'
      ],
      metric: '4.2x Ad ROAS'
    }
  ];

  // 5. Testimonials
  const testimonials = [
    {
      quote: "Relay AI transformed our entire lead pipeline. Our Meta ads now connect directly to an AI chat agent that qualifies prospects and books calls before our team even wakes up.",
      author: "Julian Thorne",
      role: "Head of Marketing",
      company: "Apex Media Group"
    },
    {
      quote: "As a contractor on site all day, I used to lose thousands in quote requests because I couldn't pick up the phone. Relay AI asks budget, scope, and schedules quote visits for me automatically.",
      author: "Dave Miller",
      role: "Founder & CEO",
      company: "Miller Premier Construction"
    },
    {
      quote: "Their team built a stunning modern website and wired it with an AI chatbot that answers patient questions instantly. It paid for itself in the first week.",
      author: "Dr. Sarah Lin",
      role: "Practice Owner",
      company: "Aesthetic Dental Care"
    }
  ];

  // 6. Before & After Marketing Performance
  const metricsComparison = [
    { label: 'Average Lead Response Time', before: '4 Hours', after: '1.8 Seconds', highlight: '99.9% Faster' },
    { label: 'Inquiry-to-Meeting Conversion Rate', before: '1.8%', after: '7.4%', highlight: '+310% Improvement' },
    { label: 'Ad Campaign Return on Spend (ROAS)', before: '1.4x', after: '4.2x', highlight: '3x Revenue Growth' },
    { label: 'After-Hours Lead Drop-Off Rate', before: '62%', after: '4%', highlight: 'Nearly Zero Loss' }
  ];

  // 7. Industries We Serve (Exact 8 items specified by user)
  const targetIndustries = [
    { name: 'Real Estate', icon: Building2, desc: 'Instant tour bookings, buyer budget qualification & listing inquiries.' },
    { name: 'Business Consulting', icon: Briefcase, desc: 'High-ticket client qualification & strategy consultation scheduling.' },
    { name: 'Healthcare', icon: Stethoscope, desc: '24/7 patient triage, appointment scheduling & clinic inquiry handling.' },
    { name: 'E-commerce', icon: ShoppingCart, desc: 'Pre-purchase support, checkout recovery & automated order tracking.' },
    { name: 'Education', icon: GraduationCap, desc: 'Student enrollment inquiries, course information & campus tour booking.' },
    { name: 'Hospitality', icon: Hotel, desc: 'Direct room reservations, event quote inquiries & VIP guest concierge.' },
    { name: 'Automotive', icon: Car, desc: 'Test drive scheduling, service department booking & trade-in estimates.' },
    { name: 'Professional Services', icon: Scale, desc: 'Legal, accounting, and financial service intake & case screening.' },
  ];

  // 8. FAQs
  const faqs = [
    {
      q: "What services does Relay AI Technologies provide?",
      a: "Relay AI Technologies is a full-service AI marketing agency. We provide end-to-end growth solutions including AI Chatbots & Agents, Digital Marketing, Social Media Management, Content & Video Editing, Custom Website Development, SEO, CRM Automation, Email Marketing, and Google & Meta Ad campaigns."
    },
    {
      q: "How does the AI lead automation work?",
      a: "When a potential client submits a form, sends a WhatsApp message, or calls your business, Relay AI responds in under 1.8 seconds. It engages in natural dialogue, answers questions, qualifies buyer budget/intent, and books meetings directly into your calendar."
    },
    {
      q: "Can you help build our website and ad campaigns too?",
      a: "Yes! We build high-converting websites, design creative ad campaigns, write copy, manage social media channels, and connect everything directly into automated AI response systems for maximum ROI."
    },
    {
      q: "How fast can we see results?",
      a: "Our team typically deploys your custom AI agents, website optimizations, and ad campaigns within 3 to 7 business days. You will start capturing missed leads and booking strategy calls immediately upon launch."
    },
    {
      q: "Do you offer solutions for agencies and consultants?",
      a: "Yes! We have a dedicated 'Partnerships' program offering white-label AI portals, revenue sharing, and joint go-to-market solutions for agencies, management consultants, and holding companies like Madar Group."
    }
  ];

  return (
    <div className="space-y-28 pt-24 pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto text-white">
      
      {/* ==========================================
          1. HERO SECTION
         ========================================== */}
      <section id="hero" className="relative pt-6 sm:pt-12 text-center space-y-8 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-electric-blue/10 border border-electric-blue/30 shadow-lg shadow-electric-blue/10">
          <Sparkles className="w-4 h-4 text-electric-cyan animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-extrabold">
            Relay AI Technologies • AI Marketing &amp; Automation Agency
          </span>
        </div>

        <div className="space-y-5">
          <h1 className="font-sans font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[1.08] text-gradient">
            Grow Your Business with <br />
            <span className="text-white">AI-Powered Marketing &amp; Automation</span>
          </h1>

          <p className="font-sans text-brand-text-muted text-base sm:text-xl max-w-3xl mx-auto leading-relaxed pt-2">
            We help businesses generate more leads, automate customer communication, and scale faster through AI, digital marketing, websites, and CRM solutions.
          </p>
        </div>

        {/* Hero CTAs requested: Book a Free Strategy Call & View Our Services */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => handleScrollTo('book-consultation')}
            className="w-full sm:w-auto primary-gradient-bg text-black font-sans text-sm font-black uppercase tracking-wider px-9 py-4.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-electric-blue/25 cursor-pointer flex items-center justify-center gap-2.5"
            id="hero-strategy-call-btn"
          >
            <span>Book a Free Strategy Call</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleScrollTo('services')}
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-sans text-sm font-bold uppercase tracking-wider px-8 py-4.5 rounded-xl border border-white/15 transition-all cursor-pointer flex items-center justify-center gap-2"
            id="hero-view-services-btn"
          >
            <span>View Our Services</span>
            <ArrowDown className="w-4 h-4 text-electric-cyan" />
          </button>
        </div>

        {/* Live Network Status Bar */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-brand-text-muted bg-[#050507]/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-white font-bold">24/7 AI Voice &amp; Chat: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-electric-cyan"></span>
              <span className="text-white font-bold">Response Velocity: &lt;1.8s</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
              <span className="text-white font-bold">Ad &amp; CRM Sync: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-white font-bold">Guarantee: Zero Missed Leads</span>
            </div>
          </div>
        </div>
      </section>


      {/* ==========================================
          2. SERVICES SECTION (9 Requested Icons/Cards)
         ========================================== */}
      <section id="services" className="space-y-12 pt-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            End-To-End Growth Capabilities
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
            Our Core Services
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
            Everything your business needs to generate high-intent leads, present a world-class brand, and automate sales conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((srv, idx) => (
            <div 
              key={idx} 
              className="glass-card p-7 rounded-2xl space-y-4 border border-white/10 hover:border-electric-cyan/40 transition-all duration-300 group hover:-translate-y-1 bg-[#06070D]"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center text-electric-cyan text-xl group-hover:scale-110 transition-transform">
                  <span>{srv.emoji}</span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-electric-cyan font-bold px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                  {srv.tag}
                </span>
              </div>

              <h3 className="font-sans font-bold text-xl text-white group-hover:text-electric-cyan transition-colors">
                {srv.title}
              </h3>

              <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                {srv.desc}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* ==========================================
          3. WHY CHOOSE RELAY
         ========================================== */}
      <section className="space-y-12 pt-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            The Relay AI Advantage
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
            Why Choose Relay AI Technologies
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
            We blend cutting-edge artificial intelligence with seasoned digital marketing execution to deliver unmatched speed and ROI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUsPillars.map((pillar, idx) => (
            <div key={idx} className="glass-card p-7 rounded-2xl border border-white/10 space-y-3 bg-[#05060A]">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-electric-cyan mb-2">
                <pillar.icon className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-lg text-white">{pillar.title}</h3>
              <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ==========================================
          4. HOW WE WORK (4 Steps)
         ========================================== */}
      <section id="how-we-work" className="space-y-12 pt-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            Our Proven Growth Framework
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
            How We Work
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
            A structured four-phase process designed for speed, clarity, and rapid business scaling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((p, idx) => (
            <div key={idx} className="glass-card p-7 rounded-2xl border border-white/10 space-y-4 relative bg-[#06070E] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-electric-cyan opacity-80">{p.number}</span>
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-electric-cyan">
                    <p.icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-sans font-bold text-lg text-white">{p.title}</h3>
                <p className="text-xs text-brand-text-muted leading-relaxed">{p.desc}</p>
              </div>

              <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-electric-cyan font-bold uppercase tracking-wider">
                Phase {p.number} Milestone
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ==========================================
          5. RESULTS SECTION (Case Studies, Testimonials, Interactive Demo, Performance)
         ========================================== */}
      <section id="results" className="space-y-16 pt-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            Tangible Impact &amp; Proof
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
            Proven Marketing &amp; Automation Results
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
            Real case studies, performance benchmarks, and live automation walk-throughs demonstrating measurable growth.
          </p>
        </div>

        {/* Before & After Benchmark Grid */}
        <div className="glass-card p-8 rounded-3xl border border-electric-cyan/30 bg-gradient-to-r from-[#05060A] via-[#090D1C] to-[#05060A] space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-sans font-bold text-xl text-white">Before vs. After Relay AI Implementation</h3>
            <p className="text-xs text-brand-text-muted">Average performance improvements across 45+ active client campaigns.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricsComparison.map((m, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <span className="text-xs font-mono text-brand-text-muted uppercase font-bold block">{m.label}</span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-400 line-through font-mono">Before: {m.before}</span>
                  <span className="text-emerald-400 font-mono font-bold">After: {m.after}</span>
                </div>
                <div className="p-2 rounded-lg bg-electric-cyan/10 border border-electric-cyan/20 text-electric-cyan text-center font-mono text-xs font-extrabold">
                  ⚡ {m.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Studies */}
        <div className="space-y-8">
          <h3 className="font-sans font-bold text-2xl text-white text-center">Featured Client Case Studies</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((cs, idx) => (
              <div key={idx} className="glass-card p-7 rounded-2xl border border-white/10 space-y-5 flex flex-col justify-between bg-[#06070E]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-brand-text-muted uppercase tracking-wider">{cs.industry}</span>
                    <span className="text-xs font-mono font-bold text-electric-cyan px-2.5 py-1 rounded bg-electric-cyan/10 border border-electric-cyan/20">
                      {cs.metric}
                    </span>
                  </div>

                  <h4 className="font-sans font-bold text-lg text-white">{cs.title}</h4>

                  <div className="space-y-2 text-xs text-brand-text-muted leading-relaxed">
                    <p><strong className="text-rose-300">Challenge:</strong> {cs.problem}</p>
                    <p><strong className="text-electric-cyan">Solution:</strong> {cs.solution}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-1.5">
                    <span className="text-[10px] font-mono text-white font-bold block uppercase">Verified Outcomes:</span>
                    {cs.results.map((res, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Interactive Automation Demo */}
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
              Interactive Automation Demo
            </span>
            <h3 className="font-sans font-bold text-2xl text-white">Experience AI Lead Qualification Live</h3>
            <p className="text-xs sm:text-sm text-brand-text-muted max-w-xl mx-auto">
              Simulate an inbound customer inquiry below to see how Relay AI evaluates budget, intent, and books appointments in real-time.
            </p>
          </div>

          <LeadSimulator />
        </div>

        {/* Client Testimonials */}
        <div className="space-y-8 pt-6">
          <h3 className="font-sans font-bold text-2xl text-white text-center">What Our Clients Say</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass-card p-7 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between bg-[#05060A]">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-sans font-bold text-sm text-white">{t.author}</h4>
                  <p className="text-[11px] text-brand-text-muted">{t.role} • {t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ==========================================
          6. INDUSTRIES WE SERVE (8 Requested Items)
         ========================================== */}
      <section id="industries" className="space-y-12 pt-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            Tailored Industry Solutions
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
            Industries We Serve
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
            Pre-configured AI conversation playbooks and ad funnels customized for your industry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {targetIndustries.map((ind, idx) => (
            <div 
              key={idx} 
              className="glass-card p-6 rounded-2xl border border-white/10 hover:border-electric-cyan/30 transition-all group bg-[#06070D]"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-electric-cyan group-hover:bg-electric-cyan group-hover:text-black transition-all mb-4">
                <ind.icon className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-lg text-white group-hover:text-electric-cyan transition-colors">
                {ind.name}
              </h3>
              <p className="text-xs text-brand-text-muted mt-2 leading-relaxed">
                {ind.desc}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* ==========================================
          7. FAQs
         ========================================== */}
      <section className="space-y-8 pt-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            Clear Answers
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-xl border border-white/10 overflow-hidden bg-[#06070D]">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-sans font-bold text-base text-white hover:text-electric-cyan transition-colors"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-5 h-5 text-electric-cyan shrink-0" /> : <ChevronDown className="w-5 h-5 text-brand-text-muted shrink-0" />}
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-brand-text-muted leading-relaxed border-t border-white/5 pt-3 animate-slide-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>


      {/* ==========================================
          8. CTA SECTION (Book Your Free Consultation Today)
         ========================================== */}
      <section id="book-consultation" className="pt-8">
        <div className="glass-card p-8 sm:p-14 rounded-3xl border border-electric-cyan/40 bg-gradient-to-br from-[#050507] via-[#0A0E22] to-[#050507] space-y-8 relative overflow-hidden shadow-2xl">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
              Ready To Grow Your Business?
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
              Book Your Free Consultation Today
            </h2>
            <p className="text-sm sm:text-base text-brand-text-muted">
              Get a personalized growth roadmap showing how Relay AI Technologies will generate more leads and automate your sales.
            </p>
          </div>

          <form onSubmit={handleConsultationSubmit} className="max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={consultationForm.name}
                  onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                  placeholder="e.g. John Smith"
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={consultationForm.businessName}
                  onChange={(e) => setConsultationForm({ ...consultationForm, businessName: e.target.value })}
                  placeholder="e.g. Apex Realty Group"
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={consultationForm.email}
                  onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
                  placeholder="john@company.com"
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={consultationForm.phone}
                  onChange={(e) => setConsultationForm({ ...consultationForm, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Industry</label>
                <select
                  value={consultationForm.industry}
                  onChange={(e) => setConsultationForm({ ...consultationForm, industry: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan transition-colors"
                >
                  {targetIndustries.map((ind, i) => (
                    <option key={i} value={ind.name}>{ind.name}</option>
                  ))}
                  <option value="Other Industry">Other Industry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Primary Growth Goal</label>
                <select
                  value={consultationForm.primaryGoal}
                  onChange={(e) => setConsultationForm({ ...consultationForm, primaryGoal: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan transition-colors"
                >
                  <option value="Generate More Leads & Automate Sales">Generate More Leads &amp; Automate Sales</option>
                  <option value="AI Voice & Chatbot Implementation">AI Voice &amp; Chatbot Implementation</option>
                  <option value="Full Digital Marketing & Ads">Full Digital Marketing &amp; Ads</option>
                  <option value="Website Development & SEO">Website Development &amp; SEO</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 primary-gradient-bg text-black font-sans text-xs font-black uppercase tracking-wider py-4 rounded-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-electric-blue/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Booking Strategy Call...' : 'Book Your Free Consultation'}</span>
              </button>

              <a
                href="mailto:sales@relayaitechnologies.com?subject=Direct%20Consultation%20Inquiry"
                className="sm:w-48 bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold uppercase py-4 rounded-xl border border-white/10 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-electric-cyan" />
                <span>Direct Email</span>
              </a>
            </div>

            <div className="pt-2 text-center">
              <span className="text-xs text-brand-text-muted font-mono">
                Direct Sales &amp; Inquiries Email: {' '}
                <a 
                  href="mailto:sales@relayaitechnologies.com?subject=Relay%20AI%20Inquiry" 
                  className="text-electric-cyan font-bold hover:underline"
                >
                  sales@relayaitechnologies.com
                </a>
              </span>
            </div>

            {submitSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-slide-in">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Consultation request received! Our growth strategist will reach out within 15 minutes.</span>
              </div>
            )}
          </form>
        </div>
      </section>

    </div>
  );
}
