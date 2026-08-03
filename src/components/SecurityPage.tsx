import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Eye, 
  Key, 
  CheckCircle, 
  Server, 
  AlertTriangle, 
  Globe, 
  ArrowRight, 
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Users,
  Briefcase,
  MapPin,
  Mail,
  Heart,
  UserCheck
} from 'lucide-react';

interface SecurityPageProps {
  initialTab?: 'security' | 'privacy' | 'terms' | 'about';
}

export default function SecurityPage({ initialTab = 'security' }: SecurityPageProps) {
  const [activeTab, setActiveTab] = useState<'security' | 'privacy' | 'terms' | 'about'>(initialTab);

  // Sync active tab if initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Scroll to top on load or tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="space-y-10 pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto border-b border-white/5 pb-8">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary font-bold px-3 py-1 bg-white/5 rounded-full border border-white/10">
          TRUST, SECURITY & COMPLIANCE
        </span>
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
          Trust & Security Center
        </h1>
        <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
          At Relay AI, we hold our legal, privacy, and security commitments to the highest standards. Explore our platform security measures, dynamic Firestore parameters, and privacy protocols.
        </p>
      </div>

      {/* Interactive Tabs Navigation */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30 shadow-lg shadow-brand-primary/5'
              : 'text-brand-text-muted hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-electric-cyan" />
          Security Hub
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'about'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30 shadow-lg shadow-brand-primary/5'
              : 'text-brand-text-muted hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400" />
          Our Story & Human Trust
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30 shadow-lg shadow-brand-primary/5'
              : 'text-brand-text-muted hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Eye className="w-4 h-4 text-electric-blue" />
          Privacy Policy
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'terms'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30 shadow-lg shadow-brand-primary/5'
              : 'text-brand-text-muted hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          Terms of Service
        </button>
      </div>

      {/* TAB CONTENT: SECURITY HUB */}
      {activeTab === 'security' && (
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Intro Security Card */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-electric-cyan/5 rounded-full filter blur-xl"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-electric-cyan" />
              </div>
              <div>
                <h3 className="font-sans font-extrabold text-lg text-white">Platform Security Architecture</h3>
                <p className="text-[11px] font-mono text-brand-text-muted">SECURE DATALINK & COMPLIANCE MATRIX</p>
              </div>
            </div>
            
            <p className="text-xs text-brand-text-muted leading-relaxed">
              Relay AI employs a fortress-grade security matrix to safeguard user configurations, inbox telemetry, and client data. All endpoints are fully TLS-wrapped, and client-side database integrations run under strict authorization sandboxes with no long-term plaintext data persistence on transient servers.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#050507]/60 border border-white/5 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-electric-blue">
                <Key className="w-4.5 h-4.5" />
                <h4 className="font-sans font-bold text-sm text-white">Volatile Token Caching</h4>
              </div>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                We cache all Google OAuth access tokens strictly inside volatile, in-memory script bounds. Access tokens are never written to unencrypted storage (like `localStorage` or `sessionStorage`), eliminating cross-site scripting (XSS) compromise threat surfaces.
              </p>
            </div>

            <div className="p-6 bg-[#050507]/60 border border-white/5 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-electric-cyan">
                <Server className="w-4.5 h-4.5" />
                <h4 className="font-sans font-bold text-sm text-white">Granular Firestore Rules</h4>
              </div>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                Our Cloud Firestore database is fortified with custom, production-level security rules. We validate exact schema constraints on client writes, prohibiting unauthorized database reads, over-privileged score modifications, or cross-document field injections.
              </p>
            </div>

            <div className="p-6 bg-[#050507]/60 border border-white/5 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Cpu className="w-4.5 h-4.5" />
                <h4 className="font-sans font-bold text-sm text-white">TLS 1.3 Transport Wrapper</h4>
              </div>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                Every data payload exchanged between Relay AI client endpoints, Firestore, and the Google APIs is encrypted in-transit using industry-standard high-entropy TLS 1.3 cryptographic layers.
              </p>
            </div>

            <div className="p-6 bg-[#050507]/60 border border-white/5 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Layers className="w-4.5 h-4.5" />
                <h4 className="font-sans font-bold text-sm text-white">Full Tenant Isolation</h4>
              </div>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                Database structures maintain rigorous tenant isolation. Real-time leads synced through individual Google Auth sessions are siloed and strictly accessible only by the respective authenticated owner accounts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRIVACY POLICY */}
      {activeTab === 'privacy' && (
        <div className="glass-card p-6 md:p-10 rounded-3xl border border-white/10 space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Eye className="w-6 h-6 text-electric-blue" />
            <h2 className="font-sans font-extrabold text-xl text-white">Privacy Policy</h2>
          </div>

          <p className="text-[11px] font-mono text-brand-text-muted/60 uppercase">
            Effective Date: July 7, 2026 | Version 2.0 Compliance Release
          </p>

          <div className="space-y-6 text-xs text-brand-text-muted leading-relaxed">
            <div className="space-y-2.5">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-blue"></span>
                1. Information We Collect
              </h3>
              <p>
                We do not collect or monitor your general web traffic, keystrokes, or location. We collect information only when explicitly authorized by you through Google OAuth, which allows Relay AI to access specifically approved Gmail data.
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-1 text-brand-text-muted">
                <li><strong>Identity Information:</strong> We store your basic Google profile information (name, email address, profile photo URL) strictly to personalize your dashboard context.</li>
                <li><strong>Inquiry Submission Data:</strong> Any names, emails, and company metrics entered on the contact/leads form are written securely into our isolated Firestore database.</li>
                <li><strong>Email Threads Metadata:</strong> Upon authorizing Google Mail connection, Relay AI lists your latest 10-12 email headers (Sender, Subject, Date, Snippet) to visualize incoming sales workflows.</li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-blue"></span>
                2. Use of Google User Data (API Disclosure)
              </h3>
              <p>
                Relay AI’s use of information received from Google APIs will adhere to the <strong>Google API Services User Data Policy</strong>, including the Limited Use requirements.
              </p>
              <p>
                Our server integration runs entirely via secure client-side tokens. Email bodies and structures are parsed dynamically to compose prompt templates and automate lead dispatches. Under no circumstances do we utilize or share your Google user data for training AI language models, advertising, target-profiling, or data brokerage.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-blue"></span>
                3. Data Storage & Volatility Limits
              </h3>
              <p>
                Any email data parsed via REST API resides exclusively in volatile memory cache while the application tab remains open in your browser. No backups, duplicate database logs, or cold records of your Google emails are preserved in Relay AI’s databases. Leads submitted directly via the Contact/Inbound Form are written to Firestore and can be edited or deleted immediately by logged-in users.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-blue"></span>
                4. Data Sub-processors & Third-Parties
              </h3>
              <p>
                Relay AI relies exclusively on highly certified cloud providers for computing and storage needs:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-1 text-brand-text-muted">
                <li><strong>Google Cloud Platform (Firebase):</strong> For hosting database entities, authenticating active accounts, and serving front-end bundle assets.</li>
                <li><strong>Google Workspace API Server:</strong> Connecting client-side requests to mail exchange systems.</li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-blue"></span>
                5. Rights of the Data Subject
              </h3>
              <p>
                Under global data frameworks (GDPR and CCPA), you are entitled to full ownership of your data. You may request absolute deletion of all your registered leads, sandbox configurations, and linked authorization sessions by contacting our support team at <span className="text-electric-cyan font-bold font-mono">sales@relayaitechnologies.com</span>. All such deletion requests are executed programmatically within 24 hours of confirmation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TERMS OF SERVICE */}
      {activeTab === 'terms' && (
        <div className="glass-card p-6 md:p-10 rounded-3xl border border-white/10 space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <FileText className="w-6 h-6 text-emerald-400" />
            <h2 className="font-sans font-extrabold text-xl text-white">Terms of Service</h2>
          </div>

          <p className="text-[11px] font-mono text-brand-text-muted/60 uppercase">
            Last Updated: July 7, 2026 | Relay AI Beta Agreement
          </p>

          <div className="space-y-6 text-xs text-brand-text-muted leading-relaxed">
            <div className="space-y-2.5">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                1. Acceptance of Terms
              </h3>
              <p>
                By registering an account, connecting your Google Workspace, or configuring sandbox agents on Relay AI (the "Service"), you agree to be bound by these Terms of Service. If you do not accept these terms, you are prohibited from utilizing the Service.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                2. Sandbox Quota & Appropriate API Use
              </h3>
              <p>
                The Service is provided primarily as an advanced sandbox environment for simulating lead dispatches, pipeline score metrics, and workflow automations. You agree not to abuse or exploit the Service, including but not limited to:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-1 text-brand-text-muted">
                <li>Sending unsolicited bulk email campaigns (SPAM) or spoofing headers.</li>
                <li>Attempting to inject malicious document code payloads or execute unauthorized database operations.</li>
                <li>Bypassing system quotas, scraping user metadata, or probing server network surfaces.</li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                3. Sandbox Trial Indemnity & Beta Disclaimer
              </h3>
              <p>
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
              </p>
              <p>
                Relay AI is currently in active Beta development. We do not guarantee uninterrupted server uptime, absolute synchronicity with third-party CRM APIs, or zero data drift under extreme bandwidth volume. We will not be liable for any lost profits, revenue, reputation, or direct/indirect damages arising from the use of the Service.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                4. Intellectual Property
              </h3>
              <p>
                All graphic interfaces, WebGL shaders, branding, source structures, and compiled bundles of Relay AI are the exclusive intellectual property of Relay AI Technologies. You are granted a limited, non-exclusive, non-transferable license to access the interface for validation and review.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                5. Governance & Termination
              </h3>
              <p>
                We reserve the right, at our sole discretion, to suspend or terminate account credentials or access permissions instantly if we identify a breach of security rules, spamming behavior, or inappropriate API interactions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: OUR STORY & HUMAN TRUST */}
      {activeTab === 'about' && (
        <div className="space-y-12 max-w-5xl mx-auto">
          {/* Motto Hero Section */}
          <div className="relative p-8 md:p-12 rounded-3xl border border-white/10 bg-gradient-to-r from-rose-500/5 via-brand-primary/5 to-transparent overflow-hidden text-center space-y-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
            <Heart className="w-10 h-10 text-rose-500 mx-auto animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold block">
              OUR CORE DIRECTIVE
            </span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
              "People buy from people."
            </h2>
            <p className="text-sm text-brand-text-muted max-w-2xl mx-auto leading-relaxed">
              In an era saturated by low-quality automated noise, Relay AI is built to preserve and amplify authentic human relationships. We don't build barriers between you and your customers; we clear the path so you can build real trust.
            </p>
          </div>

          {/* Core Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Why Relay AI */}
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-electric-cyan" />
                </div>
                <h3 className="font-sans font-bold text-lg text-white">Why Relay AI?</h3>
              </div>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                Traditional lead response pipelines are clunky, impersonal, and slow. They rely on cold mail mergers or isolated form processors that drop context. 
              </p>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                Relay AI bridges this gap with lightning-fast, high-context inbound scoring and real-time playbook dispatches. We ensure that your prospective leads receive premium, tailored resources in seconds—keeping your sales conversations completely secure and deeply personal.
              </p>
            </div>

            {/* Who It's Built For */}
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-electric-blue" />
                </div>
                <h3 className="font-sans font-bold text-lg text-white">Who It's Built For</h3>
              </div>
              <div className="space-y-3 text-xs text-brand-text-muted">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p><strong>Founders & Lean Teams:</strong> Who need to instantly triage high-value inquiries and trigger qualified walk-throughs without wasting time.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p><strong>Growth Agencies & Consultancies:</strong> Demanding rapid "speed-to-lead" turnaround to keep client pipelines warm and highly responsive.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p><strong>Security-First Businesses:</strong> Who refuse to sacrifice user privacy or compromise their Google Workspace security margins.</p>
                </div>
              </div>
            </div>

            {/* Australian Businesses Served */}
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-sans font-bold text-lg text-white">Australian Businesses Served</h3>
              </div>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                Proudly engineered and supported locally, Relay AI is built to support the high-velocity requirements of Australian startups, B2B firms, and consulting practices across Sydney, Melbourne, Brisbane, and beyond.
              </p>
              <div className="p-3.5 rounded-xl bg-[#050507] border border-white/5 text-[10px] font-mono text-brand-text-muted space-y-1.5">
                <div className="flex justify-between items-center">
                  <span>AUSTRALIAN LOCAL SUPPORT:</span>
                  <span className="text-emerald-400 font-bold">ACTIVE (AEST)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>COMPLIANCE ALIGNMENT:</span>
                  <span className="text-electric-cyan font-bold">AU PRIVACY ACT 1988</span>
                </div>
              </div>
            </div>

            {/* The Founder Story */}
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="font-sans font-bold text-lg text-white">The Founder</h3>
              </div>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                Relay AI was founded by <strong>Akshay Singh</strong>, a technologist obsessed with workflow velocity and software security. 
              </p>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                Frustrated by complex enterprise integrations and the clinical impersonality of modern sales bots, Akshay created Relay AI as a tool to streamline the backend logistics, so business owners can focus on human conversations.
              </p>
            </div>

          </div>

          {/* Contact Details Panel */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h3 className="font-sans font-extrabold text-xl text-white">Get in Touch Directly</h3>
              <p className="text-xs text-brand-text-muted">No walls. No automatic support queues. Reach out directly to the team.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a 
                href="mailto:sales@relayaitechnologies.com"
                className="p-5 rounded-2xl bg-[#050507]/60 border border-white/5 hover:border-white/10 transition-colors space-y-2 text-left block cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-electric-cyan group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-sans font-bold text-xs text-white">Direct Sales & Inquiries Email</h4>
                <p className="text-[11px] font-mono text-brand-text-muted break-all">sales@relayaitechnologies.com</p>
              </a>

              <div className="p-5 rounded-2xl bg-[#050507]/60 border border-white/5 space-y-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-sans font-bold text-xs text-white">Location</h4>
                <p className="text-[11px] text-brand-text-muted font-mono">Sydney, NSW, Australia</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
