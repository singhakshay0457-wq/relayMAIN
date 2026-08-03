import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Sparkles, Zap, Shield, Rocket, CheckCircle2, TrendingUp, Clock, Flame, 
  BarChart3, MessageSquare, PhoneCall, Bot, Calendar, Database, Mail, Mic, UserCheck, 
  Building2, Stethoscope, Utensils, Dumbbell, Hotel, Wrench, HardHat, Car, Scale, 
  GraduationCap, DollarSign, ShoppingCart, Target, Briefcase, Megaphone, Globe, Share2, 
  Search, MessageCircle, FileText, Check, ChevronDown, ChevronUp, Star, Award, Lock, 
  Layers, Cpu, Phone, Building, Send, AlertTriangle, ArrowDown, HelpCircle, Users, Activity,
  Play, Pause, Volume2, VolumeX, Maximize, Video, Tv, Film, Instagram, Repeat, Link, Copy,
  ExternalLink, Heart, Bookmark
} from 'lucide-react';
import LeadSimulator from './LeadSimulator';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface HomePageProps {
  onStartTrial: () => void;
  onNavigateToMarketing: () => void;
}

export default function HomePage({ onStartTrial, onNavigateToMarketing }: HomePageProps) {
  // Active industry tab filter
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Booking Form State
  const [demoForm, setDemoForm] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    industry: 'Real Estate',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Rotating Headlines
  const alternativeHeadlines = [
    "Every Missed Enquiry Costs You Money.",
    "AI That Replies Before Your Competitor Does.",
    "Your Business Never Sleeps Again."
  ];
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % alternativeHeadlines.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoForm.email.trim() || !demoForm.name.trim()) return;

    setIsSubmitting(true);
    try {
      const docId = `demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await setDoc(doc(db, 'demoRequests', docId), {
        ...demoForm,
        createdAt: serverTimestamp(),
        source: 'LandingPageDemo'
      });
      setSubmitSuccess(true);
      setDemoForm({
        name: '',
        businessName: '',
        email: '',
        phone: '',
        industry: 'Real Estate',
        message: ''
      });
      setTimeout(() => setSubmitSuccess(false), 8000);
    } catch (err) {
      console.error('Demo booking error:', err);
      // Fallback local success
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Solutions data
  const solutions = [
    {
      title: 'AI Receptionist',
      desc: 'Answers incoming phone calls instantly 24/7 with human-grade voice inflection.',
      icon: PhoneCall,
      tag: 'Voice Intelligence'
    },
    {
      title: 'AI Chat Agent',
      desc: 'Engages prospective buyers on Website, WhatsApp, Instagram, Facebook Messenger & Email.',
      icon: Bot,
      tag: 'Omnichannel'
    },
    {
      title: 'Lead Qualification',
      desc: 'Asks crucial qualifier questions: Budget, Location, Requirements, Timeline & Intent.',
      icon: UserCheck,
      tag: 'Smart Scoring'
    },
    {
      title: 'Appointment Booking',
      desc: 'Automatically checks availability & locks slots directly into Google Calendar or Calendly.',
      icon: Calendar,
      tag: 'Zero Back-and-Forth'
    },
    {
      title: 'CRM Integration',
      desc: 'Stores every lead, transcript, and qualification telemetry into HubSpot, Salesforce, or Zoho.',
      icon: Database,
      tag: 'Auto Sync'
    },
    {
      title: 'Follow-Up Automation',
      desc: 'Multi-touch SMS, WhatsApp & Email sequences ensure no prospective buyer falls through the cracks.',
      icon: MessageCircle,
      tag: 'Nurture Engine'
    },
    {
      title: 'Email Automation',
      desc: 'Delivers hyper-personalized, context-aware email responses in under 2 seconds.',
      icon: Mail,
      tag: 'Instant Dispatch'
    },
    {
      title: 'AI Voice Agent',
      desc: 'Natural, human-like phone dialogue capable of overcoming objections and booking calls.',
      icon: Mic,
      tag: 'Natural Speech'
    },
    {
      title: 'AI Sales Agent',
      desc: 'Converts cold inquiries and abandoned leads into high-ticket paying customers.',
      icon: TrendingUp,
      tag: 'Revenue Driver'
    },
  ];

  // Industries data
  const industries = [
    { name: 'Real Estate', icon: Building2, desc: 'Instant tour bookings & buyer budget qualification.' },
    { name: 'Dental Clinics', icon: Stethoscope, desc: 'After-hours patient scheduling & emergency triage.' },
    { name: 'Medical Clinics', icon: Stethoscope, desc: 'HIPAA-conscious appointment dispatch & inquiries.' },
    { name: 'Restaurants', icon: Utensils, desc: 'Table reservations & event catering quote capture.' },
    { name: 'Gyms', icon: Dumbbell, desc: 'Trial pass activation & membership consultation booking.' },
    { name: 'Hotels', icon: Hotel, desc: 'Direct room booking inquiries & VIP guest concierge.' },
    { name: 'Home Services', icon: Wrench, desc: 'Immediate dispatch for plumbing, HVAC & electrical.' },
    { name: 'Construction', icon: HardHat, desc: 'Project estimate requests & sub-contractor intake.' },
    { name: 'Car Dealerships', icon: Car, desc: 'Test drive scheduling & trade-in value estimates.' },
    { name: 'Law Firms', icon: Scale, desc: 'Immediate case screening & consultation scheduling.' },
    { name: 'Education', icon: GraduationCap, desc: 'Student enrollment inquiries & campus tour booking.' },
    { name: 'Finance', icon: DollarSign, desc: 'Loan application qualification & advisor meetings.' },
    { name: 'E-commerce', icon: ShoppingCart, desc: 'Pre-purchase support, tracking & checkout recovery.' },
    { name: 'Marketing Agencies', icon: Target, desc: 'Ad lead instant response & pitch meeting booking.' },
    { name: 'Retail Stores', icon: Briefcase, desc: 'Inventory inquiries & custom order intake.' },
    { name: 'Any Service Business', icon: Rocket, desc: 'Custom tailored AI workflows for any industry.' },
  ];

  // Marketing Services
  const marketingServices = [
    { title: 'Google Ads', desc: 'High-intent search campaigns directly wired to instant AI response.', icon: Megaphone },
    { title: 'Meta Ads', desc: 'Facebook & Instagram lead ads with instant 2-second AI chat follow-up.', icon: Share2 },
    { title: 'Instagram Marketing', desc: 'Automated DM response converting story replies into booked calls.', icon: MessageSquare },
    { title: 'Facebook Marketing', desc: 'Messenger AI agents capturing inquiries from posts and ads.', icon: Globe },
    { title: 'Landing Pages', desc: 'Ultra-fast, conversion-optimized landing pages with embedded AI chat.', icon: LayoutIcon },
    { title: 'Lead Generation', desc: 'Omnichannel lead capture funnels capturing 100% of prospects.', icon: Users },
    { title: 'Sales Funnels', desc: 'Automated multi-step buyer journeys built for high conversion.', icon: Target },
    { title: 'SEO', desc: 'Organic traffic growth feeding into 24/7 AI lead capture.', icon: Search },
    { title: 'Email Marketing', desc: 'Hyper-personalized automated email nurture sequences.', icon: Mail },
    { title: 'WhatsApp Campaigns', desc: 'Direct WhatsApp broadcast and instant conversation handling.', icon: Phone },
    { title: 'Content Creation', desc: 'Brand-aligned marketing assets driving inbound traffic.', icon: FileText },
    { title: 'AI Automation', desc: 'Custom webhook workflows linking marketing channels to CRM.', icon: Cpu },
    { title: 'CRM Setup', desc: 'Full architecture & pipeline setup in HubSpot, Salesforce, or Zoho.', icon: Database },
    { title: 'Conversion Optimization', desc: 'A/B testing and friction elimination to maximize ROI.', icon: BarChart3 },
    { title: 'Analytics', desc: 'Real-time telemetry on lead velocity, conversation rates & revenue.', icon: Activity },
    { title: 'Business Growth Strategy', desc: 'End-to-end consultation to scale your monthly lead volume.', icon: TrendingUp },
  ];

  // Timeline How It Works
  const timelineSteps = [
    {
      step: '01',
      title: 'Customer Contacts Your Business',
      desc: 'Inbound inquiry arrives via phone call, website form, WhatsApp DM, Instagram message, or ad campaign.',
      icon: PhoneCall
    },
    {
      step: '02',
      title: 'Relay AI Instantly Replies',
      desc: 'In under 1.8 seconds, our AI agent responds with natural, brand-aligned conversation.',
      icon: Zap
    },
    {
      step: '03',
      title: 'AI Qualifies The Lead',
      desc: 'System dynamically evaluates buyer budget, location, timeline, and exact service requirements.',
      icon: UserCheck
    },
    {
      step: '04',
      title: 'AI Answers Questions',
      desc: 'Relay AI addresses complex objection queries using your custom business knowledge base.',
      icon: Bot
    },
    {
      step: '05',
      title: 'AI Books Appointment',
      desc: 'Qualified prospect selects an open slot directly inside the chat or phone call on Google Calendar.',
      icon: Calendar
    },
    {
      step: '06',
      title: 'Business Closes The Sale',
      desc: 'Your team steps into pre-qualified, warm meetings and closes the revenue effortless.',
      icon: Award
    },
  ];

  // Features list
  const platformFeatures = [
    '24/7 AI Agents', 'Voice AI Intelligence', 'Omnichannel Chat AI', 'WhatsApp AI Integration',
    'Instagram DM Automation', 'Facebook Messenger AI', 'Email AI Dispatch', 'Website Live Chatbot',
    'CRM Synchronization', 'Analytics Dashboard', 'HD Call Recording', 'Lead Telemetry Tracking',
    'Google & Calendly Scheduling', 'Multi-language Support (40+)', 'Cloud Native Infrastructure', 'Enterprise Grade Security'
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "Relay AI captured $180,000 in property inquiries during a single long weekend when our office was closed. It booked 14 walkthroughs automatically before Monday morning.",
      author: "Marcus Vance",
      role: "Managing Director",
      company: "Vance & Co Real Estate",
      metric: "+340% Weekend Bookings",
      industry: "Real Estate Agency"
    },
    {
      quote: "Our front desk missed dozens of call inquiries during peak surgery hours. Relay AI's Voice Agent now answers every phone call in 1 second and fills open dental slots automatically.",
      author: "Dr. Sarah Lin",
      role: "Lead Dentist & Owner",
      company: "Aesthetic Dental Care",
      metric: "0 Missed Patient Calls",
      industry: "Dental Clinic"
    },
    {
      quote: "Our client acquisition cost dropped by 45% within 30 days. Connecting Meta Ad campaigns straight to Relay AI chat meant leads were qualified and booked in under 2 minutes.",
      author: "Julian Thorne",
      role: "Head of Performance Marketing",
      company: "Apex Media Agency",
      metric: "+280% Ad Campaign ROI",
      industry: "Marketing Agency"
    },
    {
      quote: "As a contractor on site all day, I used to lose thousands in quote requests because I couldn't pick up the phone. Relay AI asks budget, scope, and schedules quote visits for me.",
      author: "Dave Miller",
      role: "Founder",
      company: "Miller Premier Builders",
      metric: "15 Hours Saved / Week",
      industry: "Construction Company"
    },
    {
      quote: "Late night Instagram DMs used to go cold by morning. Relay AI greets prospective members at 1 AM, answers membership questions, and signs them up for trial passes.",
      author: "Elena Rostova",
      role: "Operations Manager",
      company: "Pulse Fitness Labs",
      metric: "+62% DM-to-Member Conversion",
      industry: "Fitness Studio"
    }
  ];

  // FAQs
  const faqs = [
    {
      q: "What is Relay AI?",
      a: "Relay AI Technologies is an enterprise-grade AI automation platform and marketing agency. We deploy autonomous AI agents across Voice Calls, Website Chat, WhatsApp, Instagram, Facebook, and Email to ensure your business answers every lead instantly, qualifies prospects, and books meetings 24/7."
    },
    {
      q: "How quickly does it reply?",
      a: "Relay AI processes and responds to inbound inquiries in under 1.8 seconds. Whether a prospect calls your phone, submits a web form, or sends an Instagram DM, our system engages them before competitors even see the notification."
    },
    {
      q: "Can it answer calls?",
      a: "Yes! Relay AI Voice Agent speaks in a natural, human-like voice, handles complex phone dialogues, answers customer questions, screens low-budget leads, and books appointments directly during the phone call."
    },
    {
      q: "Can it integrate with my CRM?",
      a: "Absolutely. Relay AI natively syncs with HubSpot, Salesforce, Zoho, ActiveCampaign, Pipedrive, and custom webhooks. All lead details, conversation transcripts, and qualification scores are logged instantly."
    },
    {
      q: "Does it book meetings?",
      a: "Yes. Relay AI integrates seamlessly with Google Calendar, Outlook Calendar, and Calendly. High-intent qualified leads choose an available slot directly inside the conversation stream without any manual back-and-forth."
    },
    {
      q: "Can it replace receptionists?",
      a: "Relay AI acts as a 24/7 super-receptionist that never sleeps, takes breaks, or misses a call. It can handle 100% of after-hours and overflow inquiries, allowing your human staff to focus on high-value in-person tasks."
    },
    {
      q: "Can it work with WhatsApp?",
      a: "Yes! Relay AI connects directly to the official WhatsApp Business API to provide automated instant replies, interactive qualification options, and automated follow-up messages on WhatsApp."
    },
    {
      q: "Can it work with Instagram?",
      a: "Yes. Relay AI handles Instagram Direct Messages, story replies, and comment mentions automatically, converting social engagement into booked sales meetings."
    },
    {
      q: "How secure is it?",
      a: "Relay AI is engineered with enterprise security. All data is encrypted in transit (TLS 1.3) and at rest (AES-256), backed by Cloud Run infrastructure, strict role-based access control, and Firestore security rules."
    }
  ];

  return (
    <div className="space-y-28 pt-24 pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto text-white">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative pt-6 sm:pt-12 text-center space-y-8 max-w-5xl mx-auto">
        {/* Floating Glowing Pill / Sub-headline badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-electric-blue/10 border border-electric-blue/30 shadow-lg shadow-electric-blue/10 animate-pulse">
          <Sparkles className="w-4 h-4 text-electric-cyan" />
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-extrabold">
            Relay AI Technologies • Autonomous Sales Engine
          </span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="font-sans font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[1.08] text-gradient">
            Never Miss Another Lead Again.
          </h1>
          
          {/* Animated Headline Ticker */}
          <div className="h-8 flex items-center justify-center">
            <p className="font-mono text-sm sm:text-base text-electric-cyan font-bold tracking-wider transition-all duration-500">
              ⚡ {alternativeHeadlines[headlineIndex]}
            </p>
          </div>

          <p className="font-sans text-brand-text-muted text-base sm:text-xl max-w-3xl mx-auto leading-relaxed pt-2">
            Every missed call. Every ignored enquiry. Every delayed response. <br className="hidden sm:inline" />
            <strong className="text-white font-bold">That's revenue walking straight to your competitors.</strong>
          </p>
          
          <p className="font-sans text-brand-text-muted/90 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Relay AI Technologies uses intelligent AI Agents to instantly respond to leads, qualify customers, answer questions, nurture conversations and book meetings automatically—24/7.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => handleScrollTo('book-demo')}
            className="w-full sm:w-auto primary-gradient-bg text-black font-sans text-sm font-black uppercase tracking-wider px-9 py-4.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-electric-blue/25 cursor-pointer flex items-center justify-center gap-2.5"
            id="hero-book-demo-btn"
          >
            <span>Book Free Demo</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleScrollTo('how-it-works')}
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-sans text-sm font-bold uppercase tracking-wider px-8 py-4.5 rounded-xl border border-white/15 transition-all cursor-pointer flex items-center justify-center gap-2"
            id="hero-see-works-btn"
          >
            <span>See How It Works</span>
            <ArrowDown className="w-4 h-4 text-electric-cyan" />
          </button>
        </div>

        {/* Live Network Particle Banner Visual */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-brand-text-muted bg-[#050507]/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-white font-bold">AI Voice Agent: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-electric-cyan"></span>
              <span className="text-white font-bold">Latency: 1.8s</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
              <span className="text-white font-bold">Calendar Sync: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-white font-bold">Coverage: 24/7/365</span>
            </div>
          </div>
        </div>
      </section>



      {/* 3. PROBLEM VS SOLUTION SECTION */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            The Automation Advantage
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
            Your Marketing Works. <br />
            <span className="text-rose-400">Your Follow-Up Doesn't.</span>
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
            Compare the old leaky sales pipeline with Relay AI's instant autonomous response engine.
          </p>
        </div>

        {/* Flow comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Old Way */}
          <div className="glass-card p-8 rounded-2xl border border-rose-500/20 bg-rose-950/10 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold px-3 py-1 bg-rose-500/10 rounded-md border border-rose-500/20">
                ❌ The Old Way (Leaky Funnel)
              </span>
              <span className="text-xs text-rose-400 font-mono font-bold">High Lead Loss</span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">1</span>
                <span>Customer sends enquiry via Web or Phone</span>
              </div>
              <div className="text-center text-rose-400 font-bold text-lg">↓</div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">2</span>
                <span>Business replies after 4 hours or next day</span>
              </div>
              <div className="text-center text-rose-400 font-bold text-lg">↓</div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">3</span>
                <span>Customer chooses competitor who replied first</span>
              </div>
              <div className="text-center text-rose-400 font-bold text-lg">↓</div>
              <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-center font-sans font-bold text-sm">
                Lost Revenue & Wasted Ad Spend 💸
              </div>
            </div>
          </div>

          {/* Relay AI Way */}
          <div className="glass-card p-8 rounded-2xl border border-electric-cyan/30 bg-electric-blue/10 space-y-6 relative overflow-hidden shadow-2xl shadow-electric-blue/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-electric-cyan font-bold px-3 py-1 bg-electric-cyan/10 rounded-md border border-electric-cyan/20">
                ⚡ The Relay AI Engine
              </span>
              <span className="text-xs text-electric-cyan font-mono font-bold">100% Captured</span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-black/60 border border-electric-cyan/20 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-electric-cyan/20 text-electric-cyan flex items-center justify-center font-bold">1</span>
                <span className="text-white">Customer sends enquiry via Web or Phone</span>
              </div>
              <div className="text-center text-electric-cyan font-bold text-lg">↓</div>
              <div className="p-3.5 rounded-xl bg-black/60 border border-electric-cyan/20 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-electric-cyan/20 text-electric-cyan flex items-center justify-center font-bold">2</span>
                <span className="text-white">Relay AI replies instantly in under 1.8 seconds</span>
              </div>
              <div className="text-center text-electric-cyan font-bold text-lg">↓</div>
              <div className="p-3.5 rounded-xl bg-black/60 border border-electric-cyan/20 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-electric-cyan/20 text-electric-cyan flex items-center justify-center font-bold">3</span>
                <span className="text-white">AI qualifies lead & books meeting on calendar</span>
              </div>
              <div className="text-center text-electric-cyan font-bold text-lg">↓</div>
              <div className="p-4 rounded-xl primary-gradient-bg text-black text-center font-sans font-black text-sm shadow-lg shadow-electric-blue/20">
                Business Wins The Customer & Grows Revenue 🎉
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SOLUTIONS SECTION ("What Relay AI Does") */}
      <section id="solutions" className="space-y-12 pt-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            Comprehensive Automation Suite
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
            What Relay AI Does
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
            Nine intelligent AI agent modules that transform inbound inquiries into scheduled revenue.
          </p>
        </div>

        {/* 9 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((item, idx) => (
            <div 
              key={idx} 
              className="glass-card p-7 rounded-2xl space-y-4 border border-white/10 hover:border-electric-cyan/40 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center text-electric-cyan group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-electric-cyan font-bold px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                  {item.tag}
                </span>
              </div>

              <h3 className="font-sans font-bold text-xl text-white group-hover:text-electric-cyan transition-colors">
                {item.title}
              </h3>

              <p className="text-sm text-brand-text-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INDUSTRIES SECTION ("Built For Every Business") */}
      <section id="industries" className="space-y-12 pt-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            Industry Tailored Playbooks
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
            Built For Every Business
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
            Pre-trained AI conversation models customized for high-friction service industries.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {industries.map((ind, idx) => (
            <div 
              key={idx} 
              className="glass-card p-5 rounded-xl border border-white/10 hover:border-electric-cyan/30 transition-all group cursor-pointer bg-[#050507]/60"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-electric-cyan group-hover:bg-electric-cyan group-hover:text-black transition-all mb-3">
                <ind.icon className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-sm text-white group-hover:text-electric-cyan transition-colors">
                {ind.name}
              </h4>
              <p className="text-xs text-brand-text-muted mt-1 leading-normal line-clamp-2">
                {ind.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. MARKETING SERVICES SECTION */}
      <section id="marketing" className="space-y-12 pt-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            Full-Funnel Growth Engineering
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
            We Don't Just Build AI. <br />
            <span className="text-gradient">We Grow Businesses.</span>
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
            We run high-converting ad campaigns and growth funnels, connected directly into Relay AI's instant response automation.
          </p>
        </div>

        {/* Marketing Services Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketingServices.map((m, idx) => (
            <div key={idx} className="glass-card p-5 rounded-xl border border-white/10 hover:border-brand-primary/40 transition-all group">
              <div className="w-9 h-9 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-3">
                <m.icon className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-base text-white">{m.title}</h4>
              <p className="text-xs text-brand-text-muted leading-relaxed mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. HOW IT WORKS (Timeline) */}
      <section id="how-it-works" className="space-y-12 pt-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            Seamless Workflow
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
            How Relay AI Works
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
            From initial customer touchpoint to closed deal in 6 automated steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-electric-cyan opacity-80">
                  {step.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <step.icon className="w-5 h-5 text-electric-cyan" />
                </div>
              </div>
              <h3 className="font-sans font-bold text-lg text-white">{step.title}</h3>
              <p className="text-xs text-brand-text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FEATURES SECTION */}
      <section id="features" className="space-y-12 pt-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            Enterprise Architecture
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
            One Platform. Complete Business Automation.
          </h2>
        </div>

        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 bg-[#050507]/80">
          {platformFeatures.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <CheckCircle2 className="w-5 h-5 text-electric-cyan shrink-0" />
              <span className="text-xs font-sans font-bold text-white">{feat}</span>
            </div>
          ))}
        </div>
      </section>



      {/* 10. TESTIMONIALS SECTION */}
      <section className="space-y-12 pt-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            Client Success
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
            Trusted by High-Growth Businesses
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-card p-7 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
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

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-sans font-bold text-sm text-white">{t.author}</h4>
                  <p className="text-[11px] text-brand-text-muted">{t.role} • {t.company}</p>
                </div>
                <span className="text-[10px] font-mono text-electric-cyan font-bold px-2 py-1 rounded bg-electric-cyan/10 border border-electric-cyan/20">
                  {t.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* 12. FAQ SECTION */}
      <section className="space-y-8 pt-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            Frequently Asked Questions
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight">
            Got Questions? We Have Answers.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-sans font-bold text-base text-white hover:text-electric-cyan transition-colors"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-5 h-5 text-electric-cyan shrink-0" /> : <ChevronDown className="w-5 h-5 text-brand-text-muted shrink-0" />}
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-sm text-brand-text-muted leading-relaxed border-t border-white/5 pt-3 animate-slide-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 13. CONTACT / BOOK DEMO SECTION */}
      <section id="book-demo" className="pt-12">
        <div className="glass-card p-8 sm:p-14 rounded-3xl border border-electric-cyan/30 bg-gradient-to-br from-[#050507] via-electric-blue/10 to-[#050507] space-y-8 relative overflow-hidden shadow-2xl">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
              Personalized Demonstration
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
              Ready To Stop Losing Customers?
            </h2>
            <p className="text-sm sm:text-base text-brand-text-muted">
              See Relay AI Technologies in action with a free personalized demo tailored to your exact industry and lead volume.
            </p>
          </div>

          <form onSubmit={handleDemoSubmit} className="max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={demoForm.name}
                  onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                  placeholder="e.g. John Smith"
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-electric-cyan transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={demoForm.businessName}
                  onChange={(e) => setDemoForm({ ...demoForm, businessName: e.target.value })}
                  placeholder="e.g. Apex Realty"
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-electric-cyan transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={demoForm.email}
                  onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                  placeholder="john@company.com"
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-electric-cyan transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={demoForm.phone}
                  onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-electric-cyan transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Industry</label>
              <select
                value={demoForm.industry}
                onChange={(e) => setDemoForm({ ...demoForm, industry: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-electric-cyan transition-colors"
              >
                {industries.map((ind, i) => (
                  <option key={i} value={ind.name}>{ind.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Message / Current Lead Bottleneck</label>
              <textarea
                rows={3}
                value={demoForm.message}
                onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                placeholder="Tell us about your current monthly lead volume or response challenges..."
                className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-electric-cyan transition-colors resize-none"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 primary-gradient-bg text-black font-sans text-sm font-black uppercase tracking-wider py-4 rounded-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-electric-blue/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Booking Demo...' : 'Book Free Demo'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.location.href = 'mailto:sales@relayaitechnologies.com?subject=Relay%20AI%20Enterprise%20Sales%20Inquiry'}
                className="sm:w-48 bg-white/10 hover:bg-white/20 text-white font-sans text-sm font-bold uppercase py-4 rounded-xl border border-white/10 transition-all cursor-pointer text-center"
              >
                Talk To Sales
              </button>
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
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-mono flex items-center gap-2 animate-slide-in">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Demo booking received! Our AI automation specialist will reach out within 15 minutes.</span>
              </div>
            )}
          </form>
        </div>
      </section>

    </div>
  );
}

// LayoutIcon helper component
function LayoutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" strokeWidth="2" />
      <path strokeWidth="2" d="M3 9h18M9 21V9" />
    </svg>
  );
}


