import React, { useState } from 'react';
import { 
  Building2, Users, Handshake, ArrowRight, CheckCircle2, ShieldCheck, Zap, 
  Sparkles, DollarSign, Award, Layers, Globe, Mail, Phone, Send, Check, 
  TrendingUp, BarChart, FileText, ChevronRight, Share2, Briefcase
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { notifyNewPartnership } from '../lib/notificationService';

interface PartnershipsPageProps {
  onBookDemo: () => void;
}

export default function PartnershipsPage({ onBookDemo }: PartnershipsPageProps) {
  const [formData, setFormData] = useState({
    partnerType: 'Agency Partner',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    clientCount: '10-50 Clients',
    interests: 'White-Label AI Agents & Marketing Automation',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.companyName || !formData.contactName) return;

    setIsSubmitting(true);
    try {
      const docId = `partner_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await setDoc(doc(db, 'partnerInquiries', docId), {
        ...formData,
        createdAt: serverTimestamp(),
        source: 'PartnershipsPage'
      });

      // Dispatch Email Notification directly to singhakshay0457@gmail.com
      notifyNewPartnership({
        name: formData.contactName,
        email: formData.email,
        company: formData.companyName,
        type: formData.partnerType,
        message: formData.message || 'No additional message'
      }).catch(err => console.warn('Partner notification error:', err));

      setSubmitSuccess(true);
      setFormData({
        partnerType: 'Agency Partner',
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        clientCount: '10-50 Clients',
        interests: 'White-Label AI Agents & Marketing Automation',
        message: ''
      });
      setTimeout(() => setSubmitSuccess(false), 8000);
    } catch (err) {
      console.error('Partner submission error:', err);
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const partnerTypes = [
    {
      title: 'White-Label Agency Partner',
      badge: 'Most Popular for Agencies',
      desc: 'Deploy Relay AI’s autonomous voice, chat, and ad lead automation under your agency’s own brand and custom domain.',
      benefits: [
        '100% Custom Branded Dashboard & Domain',
        '30% Recurring Wholesale Margin',
        'Dedicated Technical Solutions Engineer',
        'Pre-Built Agency Client Onboarding Templates'
      ],
      icon: Building2
    },
    {
      title: 'Enterprise & Group Alliance',
      badge: 'Built for Conglomerates & Madar Group',
      desc: 'Turn-key AI transformation and marketing automation architecture across multi-brand portfolios and regional subsidiaries.',
      benefits: [
        'Centralized Multi-Account Governance',
        'Enterprise SLA & Custom Security Protocol',
        'Custom ERP / CRM Webhook Architecture',
        'Dedicated Executive Account Director'
      ],
      icon: Handshake
    },
    {
      title: 'Consultants & Growth Advisors',
      badge: 'High-Yield Referral',
      desc: 'Recommend Relay AI to your advisory clients and earn industry-leading recurring referral revenue on every account.',
      benefits: [
        '20% Lifetime Recurring Revenue Share',
        'Zero Implementation Overhead For You',
        'Co-Branded Client Case Study Assets',
        'VIP Priority Partner Support Line'
      ],
      icon: Users
    }
  ];

  const partnershipSteps = [
    {
      step: '01',
      title: 'Initial Discovery Call',
      desc: 'We review your agency or group portfolio to align technical capabilities and commercial margin structures.'
    },
    {
      step: '02',
      title: 'Custom Sandbox & Portal Setup',
      desc: 'We provision your white-label portal, custom domain, and co-branded pitch collateral within 48 hours.'
    },
    {
      step: '03',
      title: 'Co-Selling & Client Pitching',
      desc: 'Our solution engineers assist you on high-ticket client calls to demonstrate live AI voice and ad workflows.'
    },
    {
      step: '04',
      title: 'Scale & Recurring Revenue',
      desc: 'Automated billing, instant sub-account provisioning, and quarterly revenue share distributions.'
    }
  ];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto text-white space-y-24">
      
      {/* Hero Header */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan font-mono text-xs font-bold uppercase tracking-widest shadow-lg shadow-electric-blue/10">
          <Handshake className="w-4 h-4" />
          <span>Strategic Agency &amp; Enterprise Partnerships</span>
        </div>

        <h1 className="font-sans font-black text-4xl sm:text-6xl text-white tracking-tight leading-tight">
          Scale Your Agency Revenue with <br />
          <span className="text-gradient">Relay AI Partnership Alliance</span>
        </h1>

        <p className="font-sans text-brand-text-muted text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
          Partner with Relay AI Technologies to offer cutting-edge AI agents, digital marketing, website development, and CRM automation to your clients under your own brand or through our lucrative alliance network.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              const el = document.getElementById('partner-form');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="primary-gradient-bg text-black font-sans text-sm font-black uppercase tracking-wider px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-xl shadow-electric-blue/20 cursor-pointer flex items-center gap-2"
          >
            <span>Apply For Partnership</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <a
            href="mailto:sales@relayaitechnologies.com?subject=Strategic%20Partnership%20Inquiry%20-%20Madar%20Group%20/%20Agency"
            className="bg-white/5 hover:bg-white/10 text-white font-sans text-sm font-bold uppercase tracking-wider px-7 py-4 rounded-xl border border-white/15 transition-all flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-electric-cyan" />
            <span>Direct Partner Email</span>
          </a>
        </div>
      </div>

      {/* Special Spotlight: Enterprise & Madar Group Collaboration Framework */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl border border-electric-cyan/40 bg-gradient-to-r from-[#070913] via-[#0D1226] to-[#070913] space-y-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
              🏢 Enterprise Strategic Hub
            </span>
            <h2 className="font-sans font-black text-2xl sm:text-4xl text-white">
              Built For Enterprise Groups &amp; Holding Companies
            </h2>
            <p className="text-sm text-brand-text-muted leading-relaxed">
              Designed specifically for multi-brand conglomerates, holding groups like Madar Group, and premier digital agencies seeking unified AI marketing governance.
            </p>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs text-electric-cyan font-bold shrink-0 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Multi-Unit Governance Ready</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <Layers className="w-6 h-6 text-electric-cyan" />
            <h3 className="font-sans font-bold text-base text-white">Unified Portfolio Dashboard</h3>
            <p className="text-xs text-brand-text-muted">Manage all group subsidiaries, real estate brands, or client accounts from one executive command center.</p>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <Zap className="w-6 h-6 text-indigo-400" />
            <h3 className="font-sans font-bold text-base text-white">Instant Omnichannel Rollout</h3>
            <p className="text-xs text-brand-text-muted">Deploy pre-built voice receptionists and ad lead funnels across new portfolio ventures in hours, not months.</p>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <h3 className="font-sans font-bold text-base text-white">Revenue Sharing &amp; Equity ROI</h3>
            <p className="text-xs text-brand-text-muted">Maximize group profitability with custom volume discounts, shared GTM strategy, and transparent ROI metrics.</p>
          </div>
        </div>
      </div>

      {/* Partnership Models Grid */}
      <div className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            Tailored Collaboration Tiers
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-4xl text-white">
            Choose How You Want To Partner
          </h2>
          <p className="text-sm text-brand-text-muted">
            Flexible engagement models engineered for agencies, consultants, and enterprise networks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partnerTypes.map((type, idx) => (
            <div 
              key={idx}
              className="glass-card p-8 rounded-2xl border border-white/10 hover:border-electric-cyan/40 transition-all space-y-6 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center text-electric-cyan group-hover:scale-110 transition-transform">
                    <type.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-electric-cyan font-bold px-2.5 py-1 rounded-full bg-electric-cyan/10 border border-electric-cyan/20">
                    {type.badge}
                  </span>
                </div>

                <h3 className="font-sans font-bold text-xl text-white">{type.title}</h3>
                <p className="text-xs text-brand-text-muted leading-relaxed">{type.desc}</p>

                <div className="pt-4 border-t border-white/10 space-y-2.5">
                  <span className="text-[11px] font-mono text-white font-bold block uppercase tracking-wider">Included Perks:</span>
                  {type.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-electric-cyan shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setFormData({ ...formData, partnerType: type.title });
                  const el = document.getElementById('partner-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-electric-cyan hover:text-black font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Select {type.title}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* How Partnerships Work (Process Steps) */}
      <div className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
            Streamlined Onboarding
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-4xl text-white">
            4 Simple Steps To Partner Success
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnershipSteps.map((step, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 space-y-3 relative bg-[#06070C]">
              <span className="font-mono text-3xl font-black text-electric-cyan/60">{step.step}</span>
              <h3 className="font-sans font-bold text-lg text-white">{step.title}</h3>
              <p className="text-xs text-brand-text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Application Form */}
      <div id="partner-form" className="pt-8">
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-electric-cyan/30 bg-gradient-to-br from-[#050507] via-[#090C19] to-[#050507] max-w-3xl mx-auto space-y-8 shadow-2xl">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20">
              Apply For Partnership
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-white">
              Partner Strategy Application
            </h2>
            <p className="text-xs sm:text-sm text-brand-text-muted">
              Submit your company details below. Our Partner Executive team responds within 24 hours to schedule a formal partner review.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Partnership Type *</label>
                <select
                  value={formData.partnerType}
                  onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan"
                >
                  <option value="White-Label Agency Partner">White-Label Agency Partner</option>
                  <option value="Enterprise & Group Alliance">Enterprise &amp; Group Alliance (e.g., Madar Group)</option>
                  <option value="Consultants & Growth Advisors">Consultants &amp; Growth Advisors</option>
                  <option value="Technology & Integration Partner">Technology &amp; Integration Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Company / Group Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Madar Group / Apex Marketing"
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="e.g. Alexander Vance"
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Business Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alexander@madargroup.com"
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Active Client / Portfolio Size</label>
                <select
                  value={formData.clientCount}
                  onChange={(e) => setFormData({ ...formData, clientCount: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan"
                >
                  <option value="1-10 Clients">1-10 Clients / Subsidiaries</option>
                  <option value="10-50 Clients">10-50 Clients / Subsidiaries</option>
                  <option value="50-200 Clients">50-200 Clients / Subsidiaries</option>
                  <option value="200+ Enterprise Group">200+ Enterprise Group</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Primary Interest / Scope</label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="e.g. AI Voice Agents, Lead Gen, White-Label Portal, Full Marketing Suite"
                className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-brand-text-muted uppercase mb-1">Additional Notes / Partnership Scope</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Briefly describe your agency or group's current client offerings or integration objectives..."
                className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-electric-cyan resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full primary-gradient-bg text-black font-sans text-xs font-black uppercase tracking-wider py-4 rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-electric-blue/20 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Partner Application...' : 'Submit Partnership Application'}</span>
            </button>

            {submitSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-slide-in">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Partnership application submitted! Our executive partner team will review your application and contact you within 24 hours.</span>
              </div>
            )}
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <span className="text-xs text-brand-text-muted font-mono">
              Direct Partnership Desk: {' '}
              <a href="mailto:sales@relayaitechnologies.com?subject=Strategic%20Partner%20Inquiry" className="text-electric-cyan font-bold hover:underline">
                sales@relayaitechnologies.com
              </a>
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
