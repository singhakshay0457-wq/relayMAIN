import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Terminal, ChevronDown, Check, Sparkles, Server, ArrowRight } from 'lucide-react';
import { FAQItem } from '../types';
import { collection, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { googleSignIn } from '../lib/gmailService';
import { User as FirebaseUser } from 'firebase/auth';

const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "What is Relay AI's typical response speed?",
    answer: "Relay AI containerized pipelines run with sub-second execution speeds. Across SMS, Email, and WhatsApp API webhooks, typical prospect dispatch response is completed in under 1.8 seconds."
  },
  {
    id: 2,
    question: "Do I need custom developer code to connect HubSpot or Salesforce?",
    answer: "No. Relay AI features pre-built OAuth synchronization connectors. You can authenticate and sync pipelines securely with a single click, allowing immediate lead dealt scoring push."
  },
  {
    id: 3,
    question: "How does the AI know how to answer custom pricing questions?",
    answer: "You can load custom company manifests (FAQs, documentation sheets, pricing rules) directly inside the configurator. The AI utilizes advanced vector retrieval to synthesize highly accurate, brand-aligned answers."
  },
  {
    id: 4,
    question: "Can we restrict walkthrough booking to high-budget prospects?",
    answer: "Absolutely. You define the exact criteria (budget, company size, region). Prospects below the threshold are guided to a resource page, while high-budget accounts book directly on calendar slots."
  }
];

export default function ContactPage() {
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    volume: '500-1000',
    message: ''
  });

  // Simulated Inbox / Live Firestore state
  const [inboxLeads, setInboxLeads] = useState<any[]>([
    {
      name: 'System Hook Integration Test',
      email: 'sales@relayaitechnologies.com',
      company: 'Relay AI Technologies',
      volume: '1000-5000',
      score: 98,
      playbook: 'Immediate Callback Webhook Trigger',
      status: 'Triggered'
    }
  ]);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [usingFirestore, setUsingFirestore] = useState(false);

  // Monitor auth state to switch to/from real-time database
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  // Real-time Firestore sync
  useEffect(() => {
    if (!user) {
      setUsingFirestore(false);
      return;
    }

    setUsingFirestore(true);
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const leadsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (leadsList.length > 0) {
        setInboxLeads(leadsList);
      }
    }, (error) => {
      console.error("Firestore leads subscription error:", error);
      handleFirestoreError(error, OperationType.GET, 'leads');
    });

    return () => unsubscribeSnapshot();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) return;

    setSubmitting(true);

    // Calculate score based on volume
    let calculatedScore = 75;
    if (formData.volume === '5000+') calculatedScore = 98;
    else if (formData.volume === '1000-5000') calculatedScore = 92;
    else if (formData.volume === '500-1000') calculatedScore = 84;

    const newInbound = {
      name: formData.name,
      email: formData.email,
      company: formData.company,
      volume: formData.volume,
      message: formData.message || '',
      score: calculatedScore,
      playbook: calculatedScore > 85 ? 'High-Priority Walkthrough Trigger' : 'Standard Resource Nurture',
      status: 'Triggered',
      createdAt: serverTimestamp()
    };

    try {
      // Create new Firestore document with auto-generated ID
      const leadsCol = collection(db, 'leads');
      const leadDocRef = doc(leadsCol);
      await setDoc(leadDocRef, newInbound);

      // If user is not signed in, manually update state for beautiful instant presentation
      if (!user) {
        setInboxLeads((prev) => [
          { ...newInbound, createdAt: new Date().toISOString() },
          ...prev
        ]);
      }

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        volume: '500-1000',
        message: ''
      });

      // Clear toast after 5s
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Failed to submit lead to Firestore:", error);
      handleFirestoreError(error, OperationType.WRITE, 'leads');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (id: number) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  return (
    <div className="space-y-20 pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary font-bold px-3 py-1 bg-white/5 rounded-full border border-white/10">
          SECURE DISPATCH CHANNELS
        </span>
        <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Connect with Relay AI
        </h1>
        <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
          Submit the form to test the pipeline. Watch your lead populate, score itself, and assign playbooks instantly in our sandbox on the right.
        </p>
      </div>

      {/* Grid: Form on left, Simulated Inbox on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 md:p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-2.5 text-brand-primary border-b border-white/5 pb-4">
            <MessageSquare className="w-5 h-5 text-electric-cyan" />
            <h2 className="font-sans font-bold text-lg text-white">Lead Dispatch Form</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-brand-text-muted mb-1.5 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Sarah Connor"
                  className="w-full bg-[#050507] border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand-primary placeholder:text-brand-text-muted/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-brand-text-muted mb-1.5 uppercase">Work Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sconnor@cyberdyne.org"
                  className="w-full bg-[#050507] border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand-primary placeholder:text-brand-text-muted/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-brand-text-muted mb-1.5 uppercase">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Cyberdyne Systems"
                  className="w-full bg-[#050507] border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand-primary placeholder:text-brand-text-muted/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-brand-text-muted mb-1.5 uppercase">Lead Volume</label>
                <select
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  className="w-full bg-[#050507] border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand-primary"
                >
                  <option value="100-500">100 - 500 leads/mo</option>
                  <option value="500-1000">500 - 1,000 leads/mo</option>
                  <option value="1000-5000">1,000 - 5,000 leads/mo</option>
                  <option value="5000+">5,000+ leads/mo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-brand-text-muted mb-1.5 uppercase">Inquiry Scope / Message</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Briefly tell us what you would like your automated system to achieve..."
                className="w-full bg-[#050507] border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand-primary placeholder:text-brand-text-muted/30 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider cursor-pointer transition-all ${
                submitting
                  ? 'bg-brand-surface-elevated text-brand-text-muted border border-white/5 cursor-not-allowed'
                  : 'primary-gradient-bg text-black hover:brightness-110 active:scale-95 shadow-md shadow-electric-blue/15'
              }`}
            >
              {submitting ? 'Executing Dispatch Sync...' : 'Send Inbound Lead Inquiry'}
            </button>

            {submitSuccess && (
              <div className="flex items-center gap-2 text-xs text-green-400 font-mono animate-slide-in p-3.5 rounded-lg bg-green-500/10 border border-green-500/20">
                <Check className="w-4 h-4 shrink-0" />
                <span>Success! Lead sent. Look at the Sandbox on the right to see telemetry scoring!</span>
              </div>
            )}
          </form>
        </div>

        {/* Sandbox Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4.5 h-4.5 text-brand-primary" />
                <h3 className="font-sans font-bold text-sm text-white">Live Ingress Sandbox</h3>
              </div>
              <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                usingFirestore ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-electric-cyan border border-white/10'
              }`}>
                {usingFirestore ? 'Firestore Connected' : 'Local Sandbox'}
              </span>
            </div>

            {!user && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2.5">
                <p className="text-[11px] text-brand-text-muted leading-relaxed">
                  Authenticate via Google to enable real-time persistent Firestore database synchronization.
                </p>
                <button
                  onClick={async () => {
                    try {
                      await googleSignIn();
                    } catch (e) {
                      console.error("Auth flow error:", e);
                    }
                  }}
                  className="w-full py-2 bg-white text-gray-900 rounded-lg text-[10px] font-mono uppercase font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Sync with Firebase
                </button>
              </div>
            )}

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {inboxLeads.map((lead, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#050507] border border-white/5 space-y-3.5 animate-slide-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-sans font-bold text-xs text-white">{lead.name}</h4>
                      <span className="text-[10px] font-mono text-brand-text-muted">{lead.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-electric-cyan/10 border border-electric-cyan/20">
                      <span className="text-[9px] font-mono text-electric-cyan font-bold">{lead.score}% FIT</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-[10px] font-mono text-brand-text-muted border-t border-white/5 pt-2">
                    <div className="flex justify-between">
                      <span>Webhook Target:</span>
                      <span className="text-white font-bold">{lead.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Playbook:</span>
                      <span className="text-electric-blue font-bold">{lead.playbook}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Status:</span>
                      <span className="text-green-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-brand-text-muted leading-relaxed">
            Everything you need to know about setting up and running autonomous sales agents.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = activeFaq === faq.id;
            return (
              <div 
                key={faq.id} 
                className="glass-card rounded-xl overflow-hidden border border-white/5"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex justify-between items-center p-5 text-left font-sans font-bold text-sm text-white cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-brand-text-muted transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-brand-primary' : ''
                  }`} />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 border-t border-white/5 text-xs text-brand-text-muted leading-relaxed bg-black/10 animate-slide-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
