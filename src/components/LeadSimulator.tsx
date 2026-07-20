import { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, User, RefreshCw, CheckCircle2, ShieldCheck, Database, Calendar } from 'lucide-react';

interface SimulatorPersona {
  name: string;
  role: string;
  company: string;
  industry: string;
  volume: string;
  painPoint: string;
  budget: string;
  dialogue: { sender: 'agent' | 'lead'; text: string; delay: number }[];
}

const PERSONAS: SimulatorPersona[] = [
  {
    name: 'Sarah Jenkins',
    role: 'VP of Growth',
    company: 'CloudScale Inc.',
    industry: 'B2B SaaS',
    volume: '1,200 leads/mo',
    painPoint: 'Tired of losing prospects to slow weekend response times.',
    budget: '$3,500/mo',
    dialogue: [
      { sender: 'agent', text: "Hi Sarah! Welcome to CloudScale. I noticed you're looking to optimize your signup flow. Are you looking to respond to marketing signups or cold inquiries?", delay: 1200 },
      { sender: 'lead', text: "Mainly marketing signups! We get high volumes on weekends, but our sales team is offline, so we leak leads to competitors.", delay: 1500 },
      { sender: 'agent', text: "That makes complete sense. Relay AI runs 24/7 with a response speed under 2 seconds. What CRM or database are you currently using to store signups?", delay: 1400 },
      { sender: 'lead', text: "We use HubSpot, and we really need any qualified leads pushed there immediately with their notes.", delay: 1600 },
      { sender: 'agent', text: "Absolutely! Relay AI has a native HubSpot webhook. Based on your 1,200 leads/mo volume, I can configure a custom qualification sequence. What is your target monthly budget for automating this?", delay: 1600 },
      { sender: 'lead', text: "Around $3,000 to $4,000 per month if the conversion rate holds up.", delay: 1300 },
      { sender: 'agent', text: "Perfect. Based on our model, we estimate a 4.5x conversion lift by filling that weekend gap. Let's get you set up with a dedicated engineer! I have a slot tomorrow at 10:00 AM PST. Shall I book that?", delay: 1800 },
      { sender: 'lead', text: "Yes, please! That works perfectly. Send the calendar link to sarah@cloudscale.io.", delay: 1400 },
      { sender: 'agent', text: "All set! Calendar invite sent, lead qualified (98% match score), and pipeline record synced to your HubSpot account. Look forward to speaking tomorrow!", delay: 1500 }
    ]
  },
  {
    name: 'Alex Rivera',
    role: 'Founder',
    company: 'Velo Design Agency',
    industry: 'Creative Services',
    volume: '250 leads/mo',
    painPoint: 'Spending 15 hours a week manually qualifying bad-fit leads.',
    budget: '$1,200/mo',
    dialogue: [
      { sender: 'agent', text: "Hello Alex! I've analyzed Velo Design's portfolio. Are you looking to filter for high-budget enterprise clients or generic design requests?", delay: 1200 },
      { sender: 'lead', text: "Enterprise mainly. We get too many low-budget inquiries that eat up our call times.", delay: 1500 },
      { sender: 'agent', text: "Understood. We can set a strict qualification filter. For example, asking about project scope before booking a calendar slot. What is your minimum threshold?", delay: 1500 },
      { sender: 'lead', text: "Our minimum project size is $10,000. Anyone below that should be routed to a waitlist.", delay: 1400 },
      { sender: 'agent', text: "Configured! Relay AI will automatically guide low-budget leads to a custom resources page, and seamlessly book the high-budget ones on your calendar. Should we activate this flow?", delay: 1600 },
      { sender: 'lead', text: "Wow, yes. That saves us so much prospecting time. Let's do a demo.", delay: 1200 },
      { sender: 'agent', text: "Great! I have booked a demo for you with Velo's custom filter active. Talk to you soon!", delay: 1400 }
    ]
  }
];

export default function LeadSimulator() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'agent' | 'lead'; text: string }[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [leadScore, setLeadScore] = useState(0);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'completed'>('idle');

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const activePersona = PERSONAS[selectedIdx];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const startSimulation = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setMessages([]);
    setCurrentStep(0);
    setLeadScore(0);
    setSyncStatus('idle');

    const dialogue = PERSONAS[selectedIdx].dialogue;

    for (let i = 0; i < dialogue.length; i++) {
      const line = dialogue[i];
      setIsTyping(true);
      
      // Simulate reading/typing delay
      await new Promise((resolve) => setTimeout(resolve, line.delay * 0.7));
      setIsTyping(false);

      setMessages((prev) => [...prev, { sender: line.sender, text: line.text }]);
      setCurrentStep(i + 1);

      // Incrementally calculate lead score as dialogue proceeds
      if (line.sender === 'lead') {
        setLeadScore((prev) => Math.min(prev + 20 + Math.floor(Math.random() * 10), 98));
      }

      // Simulate live CRM sync at the end
      if (i === dialogue.length - 2) {
        setSyncStatus('syncing');
      } else if (i === dialogue.length - 1) {
        setSyncStatus('completed');
      }
    }
    
    setIsPlaying(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
      {/* Simulation Controls & Personas (4 columns) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-card p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-brand-primary">
            <Sparkles className="w-5 h-5 text-electric-cyan" />
            <h3 className="font-sans font-bold text-base text-white">Select Lead Persona</h3>
          </div>
          <p className="text-xs text-brand-text-muted leading-relaxed">
            Choose a mock scenario to see how Relay AI automatically qualifies leads, scores them, and integrates them into active databases.
          </p>

          <div className="space-y-3 pt-2">
            {PERSONAS.map((p, idx) => (
              <button
                key={p.name}
                onClick={() => {
                  if (isPlaying) return;
                  setSelectedIdx(idx);
                  setMessages([]);
                  setLeadScore(0);
                  setSyncStatus('idle');
                }}
                disabled={isPlaying}
                className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedIdx === idx
                    ? 'bg-electric-blue/10 border-electric-blue/40 text-white'
                    : 'bg-black/30 border-white/5 text-brand-text-muted hover:border-white/15 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">{p.name}</span>
                  <span className="text-[10px] font-mono uppercase bg-white/5 px-2 py-0.5 rounded text-electric-cyan">
                    {p.industry}
                  </span>
                </div>
                <p className="text-xs opacity-80 font-medium mb-1">{p.role} at {p.company}</p>
                <p className="text-[11px] opacity-60 leading-relaxed italic">"{p.painPoint}"</p>
              </button>
            ))}
          </div>

          <button
            onClick={startSimulation}
            disabled={isPlaying}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-sm cursor-pointer transition-all ${
              isPlaying
                ? 'bg-brand-surface-elevated text-brand-text-muted border border-white/10 cursor-not-allowed'
                : 'primary-gradient-bg text-black hover:brightness-110 active:scale-95 shadow-md shadow-electric-blue/10'
            }`}
          >
            {isPlaying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Qualifying...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Simulate AI Conversation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulator Active Screen (8 columns) */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Chat window (7 cols) */}
        <div className="md:col-span-7 flex flex-col h-[460px] bg-[#050507] border border-white/10 rounded-xl overflow-hidden shadow-inner">
          {/* Window bar */}
          <div className="flex justify-between items-center px-4 py-3 bg-brand-surface border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              <span className="text-xs font-mono text-brand-text-muted ml-2">relay_ai_agent.py</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-electric-cyan/10 border border-electric-cyan/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-electric-cyan"></span>
              </span>
              <span className="text-[9px] font-mono text-electric-cyan font-bold">LIVE STREAM</span>
            </div>
          </div>

          {/* Messages pane */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !isTyping ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <Sparkles className="w-8 h-8 text-electric-cyan opacity-40 animate-pulse" />
                <p className="text-sm font-bold text-white">Terminal Idle</p>
                <p className="text-xs text-brand-text-muted max-w-xs">
                  Press "Simulate AI Conversation" to trigger the sequence and view the decision logic tree.
                </p>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-[85%] ${
                    m.sender === 'agent' ? 'mr-auto' : 'ml-auto flex-row-reverse'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                    m.sender === 'agent'
                      ? 'bg-gradient-to-br from-electric-blue to-electric-cyan text-black'
                      : 'bg-white/10 text-white'
                  }`}>
                    {m.sender === 'agent' ? 'AI' : <User className="w-3 h-3 text-brand-primary" />}
                  </div>
                  <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                    m.sender === 'agent'
                      ? 'bg-brand-surface-elevated text-white border border-white/5'
                      : 'bg-electric-blue/15 text-brand-primary border border-electric-blue/10'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex gap-3 mr-auto max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-electric-blue to-electric-cyan text-black flex items-center justify-center shrink-0 text-[10px] font-bold">
                  AI
                </div>
                <div className="p-3 bg-brand-surface-elevated rounded-xl border border-white/5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Status Bar */}
          <div className="px-4 py-2 bg-brand-surface border-t border-white/10 text-[10px] font-mono text-brand-text-muted flex justify-between">
            <span>Status: {isPlaying ? 'PROCESSING_DIALOGUE' : 'IDLE'}</span>
            <span>Response time: &lt; 1.8s</span>
          </div>
        </div>

        {/* Real-time telemetry / Output metrics (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          {/* Live telemetry card */}
          <div className="glass-card p-5 rounded-xl space-y-4">
            <div className="border-b border-white/5 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary font-bold">
                Live Telemetry
              </span>
              <h4 className="font-sans font-bold text-sm text-white">Qualification Core</h4>
            </div>

            {/* Score circle */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-2 border-white/5">
                {/* Circular track border colored based on score */}
                <div 
                  className="absolute inset-0 rounded-full border-2 border-electric-cyan opacity-80" 
                  style={{ clipPath: `polygon(50% 50%, -50% -50%, ${leadScore * 3.6}% -50%)`, transform: 'rotate(-90deg)' }}
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-white block leading-none">{leadScore}%</span>
                  <span className="text-[9px] font-mono text-brand-text-muted uppercase tracking-wider">MATCH</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-brand-text-muted">Lead Name:</span>
                <span className="text-white font-medium text-right">{isPlaying || messages.length > 0 ? activePersona.name : '—'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-brand-text-muted">Company:</span>
                <span className="text-white font-medium text-right">{isPlaying || messages.length > 0 ? activePersona.company : '—'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-brand-text-muted">Vol Threshold:</span>
                <span className="text-white font-medium text-right">{isPlaying || messages.length > 0 ? activePersona.volume : '—'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-brand-text-muted">Budget Fit:</span>
                <span className={`font-semibold ${leadScore > 60 ? 'text-green-400' : 'text-brand-text-muted'}`}>
                  {isPlaying || messages.length > 0 ? (leadScore > 40 ? 'HIGH MATCH' : 'CALCULATING') : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* CRM status card */}
          <div className="glass-card p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-primary" />
              <h5 className="font-sans font-bold text-xs text-white uppercase tracking-wider">Sync Integrations</h5>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {/* Sync line */}
              <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5">
                <span className="text-brand-text-muted">CRM Sync:</span>
                {syncStatus === 'idle' && (
                  <span className="text-[10px] text-brand-text-muted">IDLE</span>
                )}
                {syncStatus === 'syncing' && (
                  <span className="text-[10px] text-electric-cyan flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    PUSHING_RECORD
                  </span>
                )}
                {syncStatus === 'completed' && (
                  <span className="text-[10px] text-green-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    HUBSPOT_SUCCESS
                  </span>
                )}
              </div>

              {/* Calendar booking line */}
              <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5">
                <span className="text-brand-text-muted">Invite:</span>
                {syncStatus === 'completed' ? (
                  <span className="text-[10px] text-green-400 flex items-center gap-1 font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    SLOT_RESERVED
                  </span>
                ) : (
                  <span className="text-[10px] text-brand-text-muted">PENDING_CONFIRM</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
