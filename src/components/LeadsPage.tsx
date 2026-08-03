import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  Filter, 
  Sparkles, 
  Mail, 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Server,
  Zap,
  ChevronRight,
  Database
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { googleSignIn } from '../lib/gmailService';
import { User as FirebaseUser } from 'firebase/auth';

interface LeadItem {
  id: string;
  name: string;
  email: string;
  company: string;
  volume: string;
  message?: string;
  score: number;
  playbook: string;
  status: string;
  type: 'form_inquiry' | 'trial_config';
  crm?: string;
  createdAt?: any;
}

const DEFAULT_DEMO_LEADS: LeadItem[] = [
  {
    id: 'demo-1',
    name: 'Sarah Connor',
    email: 'sconnor@cyberdyne.org',
    company: 'Cyberdyne Systems',
    volume: '5000+ leads/mo',
    message: 'We are looking to automate 100% of our inbound voice and web inquiries with HubSpot integration.',
    score: 98,
    playbook: 'High-Priority Walkthrough Trigger',
    status: 'Qualified',
    type: 'form_inquiry',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-2',
    name: 'Relay Admin',
    email: 'sales@relayaitechnologies.com',
    company: 'Relay AI Technologies',
    volume: '1000-5000 leads/mo',
    score: 92,
    playbook: 'Immediate Callback Webhook Trigger',
    status: 'Triggered',
    type: 'trial_config',
    crm: 'HubSpot Sandbox',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'demo-3',
    name: 'Marcus Vance',
    email: 'm.vance@apexlogistics.io',
    company: 'Apex Logistics Group',
    volume: '1000-5000 leads/mo',
    message: 'Need 24/7 SMS and WhatsApp response for urgent freight booking inquiries.',
    score: 94,
    playbook: 'High-Priority Walkthrough Trigger',
    status: 'Contacted',
    type: 'form_inquiry',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'demo-4',
    name: 'Elena Rostova',
    email: 'elena@vanguardcap.com',
    company: 'Vanguard Capital Partners',
    volume: '500-1000 leads/mo',
    message: 'Interested in instant lead qualification for wealth management consultations.',
    score: 84,
    playbook: 'Standard Resource Nurture',
    status: 'New',
    type: 'form_inquiry',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export default function LeadsPage({ onBookDemo }: { onBookDemo?: () => void }) {
  const [leads, setLeads] = useState<LeadItem[]>(DEFAULT_DEMO_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'form' | 'trials'>('all');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [usingFirestore, setUsingFirestore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  // Firebase auth state observer
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Sync leads from Firestore
  useEffect(() => {
    setLoading(true);
    let unsubLeads: () => void = () => {};
    let unsubTrials: () => void = () => {};

    try {
      // Subscribe to 'leads' collection
      const leadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      unsubLeads = onSnapshot(leadsQuery, (snapshot) => {
        const firestoreLeads: LeadItem[] = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          type: 'form_inquiry' as const,
          ...(docSnap.data() as Omit<LeadItem, 'id' | 'type'>)
        }));

        // Subscribe to 'trials' collection
        const trialsQuery = query(collection(db, 'trials'), orderBy('createdAt', 'desc'));
        unsubTrials = onSnapshot(trialsQuery, (trialSnap) => {
          const trialLeads: LeadItem[] = trialSnap.docs.map(docSnap => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              name: data.name || 'Anonymous Prospect',
              email: data.email || 'N/A',
              company: data.company || 'N/A',
              volume: data.volume || '100-500',
              message: `CRM Target: ${data.crm || 'N/A'} | Voice archetype: ${data.voice || 'Default'} | Welcome Msg: "${data.welcomeMsg || ''}"`,
              score: 90,
              playbook: 'Trial Configurator Deployment',
              status: 'Triggered',
              type: 'trial_config' as const,
              crm: data.crm,
              createdAt: data.createdAt
            };
          });

          const combined = [...firestoreLeads, ...trialLeads];
          if (combined.length > 0) {
            setLeads(combined);
            setUsingFirestore(true);
          }
          setLoading(false);
        }, (err) => {
          console.warn("Trials Firestore read warning:", err);
          setLoading(false);
        });

      }, (err) => {
        console.warn("Leads Firestore read warning:", err);
        setLoading(false);
      });
    } catch (e) {
      console.error("Firestore sync init error:", e);
      setLoading(false);
    }

    return () => {
      unsubLeads();
      unsubTrials();
    };
  }, [user]);

  // Handle status update
  const handleUpdateStatus = async (leadId: string, newStatus: string, type: 'form_inquiry' | 'trial_config') => {
    // Update local state first
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }

    // If using Firestore, update collection
    if (usingFirestore && !leadId.startsWith('demo-')) {
      try {
        const colName = type === 'trial_config' ? 'trials' : 'leads';
        const docRef = doc(db, colName, leadId);
        await updateDoc(docRef, { status: newStatus });
      } catch (e) {
        console.error("Failed to update status in Firestore:", e);
      }
    }
  };

  // Filtered leads
  const filteredLeads = leads.filter(item => {
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'form' ? item.type === 'form_inquiry' :
      item.type === 'trial_config';

    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.message && item.message.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === 'all' ? true :
      item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesTab && matchesSearch && matchesStatus;
  });

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Company', 'Lead Volume', 'Score %', 'Playbook', 'Status', 'Type', 'Inquiry Message'];
    const csvRows = filteredLeads.map(l => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.company.replace(/"/g, '""')}"`,
      `"${l.volume}"`,
      `"${l.score}"`,
      `"${l.playbook.replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.type}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relay_ai_inquiries_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 text-electric-cyan font-mono text-xs font-bold uppercase tracking-widest">
            <Database className="w-3.5 h-3.5" />
            Lead & Inquiry Management Console
          </div>
          <h1 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
            Inbound Lead Enquiries
          </h1>
          <p className="text-sm text-brand-text-muted max-w-2xl">
            View, search, filter, and manage all prospective leads and trial demo requests submitted through Relay AI forms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-mono font-bold text-white hover:bg-white/20 transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-electric-cyan" />
            <span>Export CSV</span>
          </button>

          {onBookDemo && (
            <button
              onClick={onBookDemo}
              className="primary-gradient-bg text-black font-sans text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md shadow-electric-blue/20"
            >
              <span>+ Test Demo Intake</span>
            </button>
          )}
        </div>
      </div>

      {/* Sync Badge Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full shrink-0 ${usingFirestore ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
          <div className="text-xs">
            <span className="font-bold text-white">
              {usingFirestore ? 'Firestore Enterprise Live Sync Connected' : 'Local Ingress Sandbox Mode'}
            </span>
            <p className="text-brand-text-muted text-[11px]">
              {usingFirestore 
                ? 'Real-time database listener active. New form submissions appear instantly across all devices.'
                : 'Showing sandbox records. Authenticate with Google/Firebase to unlock full cloud persistence.'}
            </p>
          </div>
        </div>

        {!user && (
          <button
            onClick={async () => {
              try {
                await googleSignIn();
              } catch (e) {
                console.error("Google sign in failed:", e);
              }
            }}
            className="px-4 py-2 rounded-xl bg-white text-gray-900 font-mono text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
          >
            Sync with Firestore
          </button>
        )}
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl space-y-1 border border-white/10">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-text-muted">Total Inquiries</span>
          <span className="block font-sans font-black text-3xl text-white">{leads.length}</span>
          <span className="text-[10px] text-electric-cyan font-mono">100% Captured</span>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1 border border-white/10">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-text-muted">High-Fit Leads (&gt;85%)</span>
          <span className="block font-sans font-black text-3xl text-green-400">
            {leads.filter(l => l.score >= 85).length}
          </span>
          <span className="text-[10px] text-green-400/80 font-mono">Priority Walkthrough Fit</span>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1 border border-white/10">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-text-muted">New / Triggered</span>
          <span className="block font-sans font-black text-3xl text-electric-cyan">
            {leads.filter(l => l.status === 'New' || l.status === 'Triggered').length}
          </span>
          <span className="text-[10px] text-electric-cyan font-mono">&lt; 1.8s Auto-Response</span>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1 border border-white/10">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-text-muted">Qualified &amp; Contacted</span>
          <span className="block font-sans font-black text-3xl text-indigo-300">
            {leads.filter(l => l.status === 'Qualified' || l.status === 'Contacted').length}
          </span>
          <span className="text-[10px] text-indigo-300/80 font-mono">In Active Pipeline</span>
        </div>
      </div>

      {/* Navigation Tabs & Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Tab Filter */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-electric-blue text-black font-extrabold shadow-sm' : 'text-brand-text-muted hover:text-white'
              }`}
            >
              All Inquiries ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'form' ? 'bg-electric-blue text-black font-extrabold shadow-sm' : 'text-brand-text-muted hover:text-white'
              }`}
            >
              Contact Forms ({leads.filter(l => l.type === 'form_inquiry').length})
            </button>
            <button
              onClick={() => setActiveTab('trials')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'trials' ? 'bg-electric-blue text-black font-extrabold shadow-sm' : 'text-brand-text-muted hover:text-white'
              }`}
            >
              Demo Trials ({leads.filter(l => l.type === 'trial_config').length})
            </button>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-brand-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, email, company..."
                className="w-full bg-[#050507] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-electric-cyan placeholder:text-brand-text-muted/40"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#050507] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-electric-cyan"
            >
              <option value="all">All Statuses</option>
              <option value="triggered">Triggered / New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table / Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main List Column */}
        <div className={`space-y-3.5 ${selectedLead ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          {filteredLeads.length === 0 ? (
            <div className="glass-card p-12 text-center space-y-4 rounded-2xl border border-white/10">
              <AlertCircle className="w-10 h-10 text-brand-text-muted mx-auto" />
              <h3 className="font-sans font-bold text-lg text-white">No Lead Inquiries Found</h3>
              <p className="text-xs text-brand-text-muted max-w-sm mx-auto">
                No matching leads found for your search query or filters. Submit a form on the Contact page or start a trial to see live entries.
              </p>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected 
                      ? 'border-electric-cyan bg-electric-blue/10 shadow-lg shadow-electric-blue/10' 
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-sans font-bold text-base text-white">{lead.name}</h3>
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          lead.type === 'trial_config' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        }`}>
                          {lead.type === 'trial_config' ? 'Demo Trial' : 'Form Inquiry'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-brand-text-muted">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-electric-cyan" />
                          {lead.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-electric-cyan" />
                          {lead.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="block font-mono text-xs text-electric-cyan font-bold">{lead.score}% FIT</span>
                        <span className="block text-[10px] text-brand-text-muted">{lead.volume}</span>
                      </div>

                      <select
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value, lead.type)}
                        className={`text-[10px] font-mono font-bold uppercase py-1 px-2.5 rounded-lg border focus:outline-none cursor-pointer ${
                          lead.status === 'Qualified' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          lead.status === 'Contacted' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                          'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Triggered">Triggered</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  {lead.message && (
                    <p className="text-xs text-brand-text-muted/90 line-clamp-2 italic bg-black/20 p-2.5 rounded-xl border border-white/5">
                      "{lead.message}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] font-mono text-brand-text-muted pt-1 border-t border-white/5">
                    <span>Playbook: <strong className="text-white">{lead.playbook}</strong></span>
                    <span className="flex items-center gap-1 text-electric-cyan font-bold">
                      <span>View details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Lead Detail Inspector */}
        {selectedLead && (
          <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-electric-cyan/30 space-y-6 sticky top-28 bg-[#0D0E14] shadow-2xl">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-electric-cyan font-bold block">
                  Lead Inspector
                </span>
                <h3 className="font-sans font-bold text-xl text-white">{selectedLead.name}</h3>
                <span className="text-xs text-brand-text-muted font-mono">{selectedLead.company}</span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-brand-text-muted hover:text-white p-1 text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-brand-text-muted uppercase font-mono block">Work Email</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-electric-cyan font-bold underline break-all">
                    {selectedLead.email}
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-brand-text-muted uppercase font-mono block">Estimated Volume</span>
                  <span className="text-white font-bold">{selectedLead.volume}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-brand-text-muted">Qualification Score</span>
                  <span className="text-green-400 font-bold">{selectedLead.score}% Match</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-green-400 rounded-full" style={{ width: `${selectedLead.score}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-brand-text-muted uppercase block">Active AI Playbook</span>
                <div className="p-3 rounded-xl bg-electric-cyan/5 border border-electric-cyan/20 text-electric-cyan font-mono text-xs font-bold">
                  ⚡ {selectedLead.playbook}
                </div>
              </div>

              {selectedLead.message && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-brand-text-muted uppercase block">Inquiry Message / Config</span>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-brand-text-muted text-xs leading-relaxed font-sans">
                    {selectedLead.message}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono text-brand-text-muted uppercase block">Update Status</span>
                <div className="grid grid-cols-2 gap-2">
                  {['New', 'Triggered', 'Contacted', 'Qualified', 'Closed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedLead.id, st, selectedLead.type)}
                      className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                        selectedLead.status === st
                          ? 'bg-electric-cyan text-black font-black'
                          : 'bg-white/5 border border-white/10 text-brand-text-muted hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`mailto:${selectedLead.email}?subject=Relay%20AI%20Inquiry%20Follow-up%20-%20${encodeURIComponent(selectedLead.company)}&body=Hi%20${encodeURIComponent(selectedLead.name)},%0A%0AThank%20you%20for%20reaching%20out%20to%20Relay%20AI%20Technologies.`}
                  className="w-full primary-gradient-bg text-black font-sans text-xs font-bold uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md shadow-electric-blue/20"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
