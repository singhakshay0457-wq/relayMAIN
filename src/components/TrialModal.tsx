import { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Terminal, Server, Sliders, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrialModal({ isOpen, onClose }: TrialModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Relay Admin',
    email: 'integration@relayaitechnologies.com',
    company: 'https://relayaitechnologies.com',
    crm: 'HubSpot',
    volume: '500-1000',
    voice: 'Analytical Tech',
    welcomeMsg: 'Hi there! I noticed you are exploring our solutions. How can I help you today?'
  });

  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSuccess(false);
      setIsDeploying(false);
      setDeploymentLogs([]);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      startDeployment();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const startDeployment = async () => {
    setIsDeploying(true);
    setStep(4);

    // Save to Firestore trials collection
    try {
      const trialCol = collection(db, 'trials');
      const trialDocRef = doc(trialCol);
      await setDoc(trialDocRef, {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        crm: formData.crm,
        volume: formData.volume,
        voice: formData.voice,
        welcomeMsg: formData.welcomeMsg,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Failed to save trial details to Firestore:", error);
      handleFirestoreError(error, OperationType.WRITE, 'trials');
    }
    
    const logs = [
      '⚡ [SYS_INIT] Bootstrapping Relay Core Engine V2.0...',
      '📡 [PORT_BIND] Binding interface to custom ingress endpoints...',
      '🔗 [CRM_SYNC] Linking secure client tokens to database...',
      '🗄️ [DB_CONN] Connection established with HubSpot Sandbox CRM successfully.',
      '🎙️ [VOICE_SYS] Synthesizing speech modules with ' + formData.voice + ' parameters...',
      '🧪 [QUAL_MATRIX] Mapping qualification weight criteria with lead threshold value: ' + formData.volume + '...',
      '🤖 [AGENT_READY] Building container layer. Manifest successfully loaded.',
      '🚀 [DEPLOY_SUCCESS] Relay AI Agent is fully deployed & operational!'
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setDeploymentLogs((prev) => [...prev, logs[i]]);
    }
    
    setIsDeploying(false);
    setSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Modal Wrapper */}
      <div className="w-full max-w-2xl bg-[#0e0e13] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/90 animate-slide-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-brand-surface border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-electric-cyan animate-pulse"></div>
            <span className="font-sans font-bold text-sm text-white">
              Relay AI Agent Configurator
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-muted hover:text-white transition-colors cursor-pointer"
            id="close-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        {step < 4 && (
          <div className="flex border-b border-white/5 bg-black/25">
            {[
              { num: 1, label: 'Identity', icon: Server },
              { num: 2, label: 'Pipeline', icon: Sliders },
              { num: 3, label: 'Personality', icon: Volume2 },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex-1 flex items-center justify-center gap-2 py-3 border-r border-white/5 text-xs font-mono transition-colors ${
                  step === s.num
                    ? 'text-brand-primary bg-white/5 font-bold'
                    : step > s.num
                    ? 'text-green-400'
                    : 'text-brand-text-muted/50'
                }`}
              >
                <s.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{s.label}</span>
                {step > s.num && <Check className="w-3 h-3 text-green-400" />}
              </div>
            ))}
          </div>
        )}

        {/* Step Contents */}
        <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4 animate-slide-in">
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-lg text-white">Create Sandbox Instance</h3>
                <p className="text-xs text-brand-text-muted">
                  Let's initialize your company profile to custom tailor the automated responses.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-brand-text-muted mb-1.5 uppercase">Work Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g., Dev Admin"
                    className="w-full bg-[#050507] border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand-primary placeholder:text-brand-text-muted/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-brand-text-muted mb-1.5 uppercase">Work Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="E.g., admin@relayaitechnologies.com"
                    className="w-full bg-[#050507] border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand-primary placeholder:text-brand-text-muted/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-brand-text-muted mb-1.5 uppercase">Company URL</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="E.g., https://relayaitechnologies.com"
                    className="w-full bg-[#050507] border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand-primary placeholder:text-brand-text-muted/40"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-slide-in">
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-lg text-white">Configure Pipeline Ingress</h3>
                <p className="text-xs text-brand-text-muted">
                  Choose your active CRM for push sync and estimated initial lead volume.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-brand-text-muted uppercase">Target CRM Integration</label>
                  <select
                    value={formData.crm}
                    onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                    className="w-full bg-[#050507] border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand-primary"
                  >
                    <option value="HubSpot">HubSpot Sandbox</option>
                    <option value="Salesforce">Salesforce Pipeline</option>
                    <option value="Zapier">Zapier Webhooks</option>
                    <option value="Slack">Slack Notification Bus</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-brand-text-muted uppercase">Monthly Lead Volume</label>
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
                <label className="block text-xs font-mono text-brand-text-muted mb-1.5 uppercase">AI Welcome Hook Message</label>
                <textarea
                  rows={3}
                  value={formData.welcomeMsg}
                  onChange={(e) => setFormData({ ...formData, welcomeMsg: e.target.value })}
                  className="w-full bg-[#050507] border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-slide-in">
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-lg text-white">Synthesize Brand Voice</h3>
                <p className="text-xs text-brand-text-muted">
                  Choose the conversational archetype Relay AI will assume with your prospects.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Analytical Tech', desc: 'Precise, technical, metrics-driven' },
                  { name: 'Warm Sales Coach', desc: 'Empathetic, helpful, consultative' },
                  { name: 'Elite Concierge', desc: 'Polished, luxury tone, precise speed' },
                  { name: 'Direct Closer', desc: 'Fast, appointment-focused' }
                ].map((v) => (
                  <button
                    key={v.name}
                    onClick={() => setFormData({ ...formData, voice: v.name })}
                    className={`p-4 rounded-lg border text-left cursor-pointer transition-all ${
                      formData.voice === v.name
                        ? 'bg-electric-blue/15 border-electric-blue/60 text-white'
                        : 'bg-black/20 border-white/5 text-brand-text-muted hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <span className="block font-bold text-xs">{v.name}</span>
                    <span className="block text-[10px] opacity-75 mt-0.5">{v.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 p-3 rounded-lg bg-electric-cyan/5 border border-electric-cyan/15 text-xs text-electric-cyan">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  You are standard-licensed with unlimited dialogue threads during your 14-day free trial sandbox period.
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-slide-in">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-electric-cyan animate-pulse" />
                <h3 className="font-sans font-bold text-base text-white">Executing Host Build Sequence</h3>
              </div>

              {/* Terminal window mockup */}
              <div className="bg-black/90 rounded-xl border border-white/10 p-4 font-mono text-xs leading-relaxed space-y-1.5 h-64 overflow-y-auto shadow-inner">
                {deploymentLogs.map((log, idx) => (
                  <div key={idx} className={log.includes('[DEPLOY_SUCCESS]') ? 'text-green-400 font-bold' : 'text-brand-text-muted'}>
                    {log}
                  </div>
                ))}
                {isDeploying && (
                  <div className="flex items-center gap-2 text-electric-cyan">
                    <span className="w-2.5 h-2.5 bg-electric-cyan animate-ping rounded-full shrink-0"></span>
                    <span>Building container...</span>
                  </div>
                )}
              </div>

              {success && (
                <div className="text-center space-y-4 py-4 animate-slide-in">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold text-base text-white">System Deployed & Live!</h4>
                    <p className="text-xs text-brand-text-muted max-w-md mx-auto">
                      Your autonomous marketing agent is ready. Leads will now be responded to instantly and synchronized directly to your CRM.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={onClose}
                      className="primary-gradient-bg text-black font-sans text-xs font-bold uppercase tracking-wider px-8 py-3 rounded-lg hover:brightness-110 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Launch AI Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer controls */}
        {step < 4 && (
          <div className="flex justify-between items-center px-6 py-4 bg-brand-surface border-t border-white/5">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-1 text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                step === 1 ? 'text-brand-text-muted/20 cursor-not-allowed' : 'text-brand-text-muted hover:text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={step === 1 && (!formData.name || !formData.email || !formData.company)}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                step === 1 && (!formData.name || !formData.email || !formData.company)
                  ? 'bg-brand-surface-elevated text-brand-text-muted border border-white/5 cursor-not-allowed'
                  : 'primary-gradient-bg text-black hover:brightness-110 active:scale-95'
              }`}
            >
              <span>{step === 3 ? 'Deploy Agent' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
