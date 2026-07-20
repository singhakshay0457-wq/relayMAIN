import React, { useState, useEffect } from 'react';
import { 
  initAuth, 
  googleSignIn, 
  googleSignOut, 
  listMessages, 
  getMessageDetails, 
  sendEmail, 
  trashMessage, 
  GmailMessage 
} from '../lib/gmailService';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  Mail, 
  Send, 
  Trash2, 
  RefreshCw, 
  Lock, 
  User as UserIcon, 
  LogOut, 
  Plus, 
  Inbox, 
  CheckCircle, 
  AlertTriangle,
  X,
  ChevronRight,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';

export default function GmailPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Gmail state
  const [emails, setEmails] = useState<GmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<GmailMessage | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });

  // Confirmation Modals State
  const [confirmModal, setConfirmModal] = useState<{
    type: 'send' | 'trash' | null;
    messageId?: string;
    onConfirm: () => void;
    title: string;
    description: string;
  }>({
    type: null,
    onConfirm: () => {},
    title: '',
    description: ''
  });

  // Load Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setNeedsAuth(false);
        setError(null);
        // Automatically load inbox once token is cached
        loadInbox();
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        // Load actual emails
        await loadInbox();
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setError(err.message || 'Authentication failed. Please verify popup permissions.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await googleSignOut();
      setUser(null);
      setToken(null);
      setEmails([]);
      setSelectedEmail(null);
      setNeedsAuth(true);
    } catch (err: any) {
      console.error('Logout failed:', err);
    }
  };

  const loadInbox = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const messageList = await listMessages(12);
      if (messageList.length === 0) {
        setEmails([]);
        setIsLoading(false);
        return;
      }

      // Fetch details for all messages in parallel
      const detailedEmails = await Promise.all(
        messageList.map(async (msg) => {
          try {
            return await getMessageDetails(msg.id);
          } catch (e) {
            console.error(`Failed to fetch message details for ${msg.id}:`, e);
            return null;
          }
        })
      );

      // Filter out failures and sort by date/ID
      const validEmails = detailedEmails.filter((email): email is GmailMessage => email !== null);
      setEmails(validEmails);
      
      // Auto-select the first one if none selected
      if (validEmails.length > 0 && !selectedEmail) {
        setSelectedEmail(validEmails[0]);
      }
    } catch (err: any) {
      console.error('Error loading inbox:', err);
      setError('Error fetching messages. Your session may have expired. Please sign in again.');
      setNeedsAuth(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Confirmation Modal for Sending an Email
  const triggerSendConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeData.to || !composeData.subject || !composeData.body) {
      setError('All compose fields are required.');
      return;
    }

    setConfirmModal({
      type: 'send',
      title: 'Confirm Outbound Email Dispatch',
      description: `Are you sure you want to send this email to "${composeData.to}" with subject "${composeData.subject}"? This action will deliver the mail immediately via your Gmail account.`,
      onConfirm: executeSendEmail
    });
  };

  // Execute actual email send
  const executeSendEmail = async () => {
    setConfirmModal({ type: null, onConfirm: () => {}, title: '', description: '' });
    setIsLoading(true);
    setError(null);
    try {
      await sendEmail(composeData.to, composeData.subject, composeData.body);
      setIsComposing(false);
      setComposeData({ to: '', subject: '', body: '' });
      // Show short toast/alert
      alert('Email sent successfully!');
      await loadInbox();
    } catch (err: any) {
      console.error('Failed to send email:', err);
      setError(`Failed to send email: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Confirmation Modal for Trashing an Email
  const triggerTrashConfirm = (messageId: string) => {
    setConfirmModal({
      type: 'trash',
      messageId,
      title: 'Confirm Message Deletion',
      description: 'Are you sure you want to move this email to Gmail trash? You can recover it within 30 days in your Gmail bin.',
      onConfirm: () => executeTrashEmail(messageId)
    });
  };

  // Execute actual trash operation
  const executeTrashEmail = async (messageId: string) => {
    setConfirmModal({ type: null, onConfirm: () => {}, title: '', description: '' });
    setIsLoading(true);
    setError(null);
    try {
      await trashMessage(messageId);
      if (selectedEmail?.id === messageId) {
        setSelectedEmail(null);
      }
      setEmails((prev) => prev.filter((e) => e.id !== messageId));
      alert('Email moved to trash.');
      await loadInbox();
    } catch (err: any) {
      console.error('Failed to trash email:', err);
      setError(`Failed to delete email: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary font-bold px-3 py-1 bg-white/5 rounded-full border border-white/10">
              GMAIL INTEGRATION PIPELINE
            </span>
          </div>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-white tracking-tight flex items-center gap-3">
            <Mail className="w-8 h-8 text-electric-cyan" /> Gmail Dispatch Hub
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted">
            Connect your Gmail inbox to monitor automated sales answers, draft outbound playbooks, and manage live leads with real-time sync.
          </p>
        </div>

        {/* Authenticated user banner / Log in */}
        {!needsAuth && user && (
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2.5">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-white/20" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-none">{user.displayName || 'Authorized User'}</p>
                <p className="text-[10px] font-mono text-brand-text-muted mt-0.5 leading-none">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg text-brand-text-muted hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </div>

      {/* ERROR MSG BANNER */}
      {error && (
        <div className="flex items-start gap-3 text-xs text-red-400 font-mono p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
          <div className="space-y-1">
            <span className="font-bold">Authentication or Api Sync Error:</span>
            <p className="opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* LOGIN OVERLAY VIEW */}
      {needsAuth ? (
        <div className="glass-card max-w-md mx-auto p-8 rounded-2xl text-center space-y-6 border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-electric-cyan/5 rounded-full filter blur-xl"></div>
          
          <div className="mx-auto w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-electric-cyan animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="font-sans font-bold text-xl text-white">OAuth Secure Connection Needed</h3>
            <p className="text-xs text-brand-text-muted leading-relaxed">
              To browse, analyze, and send system dispatch alerts through your Google Mail inbox, Relay AI requires permission to interface with the Gmail APIs.
            </p>
          </div>

          <div className="border-t border-white/5 pt-6 flex justify-center">
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className={`flex items-center gap-3 bg-white text-gray-900 border border-gray-200 rounded-xl px-6 py-3.5 font-sans font-semibold text-xs uppercase tracking-wider hover:bg-gray-50 active:scale-95 transition-all shadow-md cursor-pointer ${
                isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isLoggingIn ? 'Connecting Securely...' : 'Sign in with Google'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-brand-text-muted/60 uppercase">
            <span>Enterprise Encrypted SSL Connection</span>
          </div>
        </div>
      ) : (
        /* MAIN WORKSPACE - TWO PANELS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: INBOX LIST (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-4 rounded-2xl space-y-4">
              
              {/* Header actions */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-brand-primary" />
                  <h3 className="font-sans font-bold text-sm text-white">Gmail Live Inbox</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadInbox}
                    disabled={isLoading}
                    className="p-1.5 rounded-lg text-brand-text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Refresh Inbox"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-electric-cyan' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      setIsComposing(true);
                      setSelectedEmail(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/15 border border-brand-primary/20 hover:bg-brand-primary/25 rounded-lg text-brand-primary font-bold text-[10px] uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Compose
                  </button>
                </div>
              </div>

              {/* Inbox Loader */}
              {isLoading && emails.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-brand-primary animate-spin mx-auto" />
                  <p className="text-xs font-mono text-brand-text-muted">Interfacing with Google REST endpoints...</p>
                </div>
              ) : emails.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <Mail className="w-10 h-10 text-white/10 mx-auto" />
                  <p className="text-xs font-bold text-white">Inbox empty</p>
                  <p className="text-[11px] text-brand-text-muted max-w-xs mx-auto">No recent incoming email threads were discovered on your Google account.</p>
                </div>
              ) : (
                /* Thread list */
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {emails.map((email) => {
                    const isSelected = selectedEmail?.id === email.id;
                    return (
                      <div
                        key={email.id}
                        onClick={() => {
                          setSelectedEmail(email);
                          setIsComposing(false);
                        }}
                        className={`p-3.5 rounded-xl text-left border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#0a0a0f] border-brand-primary/50 shadow-md shadow-brand-primary/5' 
                            : 'bg-[#050507] border-white/5 hover:border-white/10 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <p className="font-sans font-bold text-xs text-white truncate max-w-[70%]">
                            {email.from.replace(/<.*>/, '').trim() || email.from}
                          </p>
                          <span className="text-[9px] font-mono text-brand-text-muted shrink-0">
                            {email.date ? new Date(email.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                          </span>
                        </div>
                        
                        <p className="text-[11px] text-white font-medium truncate mb-1">
                          {email.subject}
                        </p>
                        
                        <p className="text-[10px] text-brand-text-muted truncate">
                          {email.snippet}
                        </p>

                        <div className="flex items-center gap-1.5 mt-2.5">
                          {email.labels.filter(l => !l.startsWith('CATEGORY_')).slice(0, 2).map((label) => (
                            <span 
                              key={label} 
                              className="text-[8px] font-mono uppercase bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-brand-text-muted"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: VIEW MESSAGE OR COMPOSE PANEL (7 cols) */}
          <div className="lg:col-span-7">
            {isComposing ? (
              /* COMPOSE PANEL */
              <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2.5 text-brand-primary">
                    <Send className="w-5 h-5 text-electric-cyan" />
                    <h2 className="font-sans font-bold text-lg text-white">New Dispatch Draft</h2>
                  </div>
                  <button 
                    onClick={() => {
                      setIsComposing(false);
                      if (emails.length > 0) setSelectedEmail(emails[0]);
                    }}
                    className="p-1 rounded-lg text-brand-text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={triggerSendConfirm} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-brand-text-muted mb-1 uppercase">To Recipient</label>
                    <input
                      type="email"
                      required
                      placeholder="prospect@client-company.com"
                      value={composeData.to}
                      onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                      className="w-full bg-[#050507] border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand-primary placeholder:text-brand-text-muted/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-brand-text-muted mb-1 uppercase">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Automated Pipeline Qualification Report"
                      value={composeData.subject}
                      onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                      className="w-full bg-[#050507] border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand-primary placeholder:text-brand-text-muted/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-brand-text-muted mb-1 uppercase">Message Body (HTML support)</label>
                    <textarea
                      rows={10}
                      required
                      placeholder="Hi Team,&#10;&#10;Here are the dispatch records. Let me know if you would like to book a walkthrough..."
                      value={composeData.body}
                      onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                      className="w-full bg-[#050507] border border-white/10 rounded-lg py-3 px-4 text-xs text-white focus:outline-none focus:border-brand-primary placeholder:text-brand-text-muted/30 font-sans resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsComposing(false);
                        if (emails.length > 0) setSelectedEmail(emails[0]);
                      }}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      Cancel Draft
                    </button>
                    
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 px-6 py-2.5 primary-gradient-bg text-black hover:brightness-110 active:scale-95 rounded-lg font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-electric-blue/15"
                    >
                      <Send className="w-3.5 h-3.5" /> Dispatch Mail
                    </button>
                  </div>
                </form>
              </div>
            ) : selectedEmail ? (
              /* DETAILED VIEW */
              <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
                
                {/* Meta details header */}
                <div className="border-b border-white/5 pb-5 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="font-sans font-bold text-base md:text-lg text-white">
                        {selectedEmail.subject}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[9px] font-mono bg-electric-cyan/10 border border-electric-cyan/20 px-2.5 py-0.5 rounded text-electric-cyan font-bold">
                          MSG-ID: {selectedEmail.id}
                        </span>
                        {selectedEmail.labels.filter(l => !l.startsWith('CATEGORY_')).map((label) => (
                          <span 
                            key={label} 
                            className="text-[9px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-brand-text-muted"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <button
                      onClick={() => triggerTrashConfirm(selectedEmail.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg text-[10px] font-mono uppercase font-bold cursor-pointer transition-colors"
                      title="Move Message to Trash"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Trash
                    </button>
                  </div>

                  {/* sender / details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono text-brand-text-muted bg-[#050507]/40 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="text-white/40">From:</span> <span className="text-white font-bold">{selectedEmail.from}</span>
                    </div>
                    <div className="md:text-right">
                      <span className="text-white/40">Received:</span> <span className="text-electric-blue font-bold">{new Date(selectedEmail.date).toLocaleString()}</span>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <span className="text-white/40">To:</span> <span className="text-brand-text-muted">{selectedEmail.to}</span>
                    </div>
                  </div>
                </div>

                {/* EMAIL BODY - Isolated in visual sandboxed canvas */}
                <div className="bg-[#050507] border border-white/5 rounded-xl p-6 overflow-x-auto min-h-[250px] relative">
                  {selectedEmail.body.includes('<') && selectedEmail.body.includes('>') ? (
                    /* Render rich body beautifully or fall back */
                    <div 
                      className="text-xs text-brand-text-muted leading-relaxed space-y-3"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                    />
                  ) : (
                    <pre className="text-xs text-brand-text-muted leading-relaxed font-sans whitespace-pre-wrap">
                      {selectedEmail.body}
                    </pre>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[10px] font-mono text-brand-text-muted">
                  <span>Standard TLS Encrypted Message Body</span>
                  <span>SMTP Pipeline: Secure</span>
                </div>
              </div>
            ) : (
              /* EMPTY SELECT VIEW */
              <div className="glass-card p-12 rounded-2xl text-center space-y-4 text-brand-text-muted">
                <Mail className="w-12 h-12 text-white/10 mx-auto" />
                <h3 className="font-sans font-bold text-sm text-white">No Message Selected</h3>
                <p className="text-xs max-w-sm mx-auto">
                  Choose a message from the live list on the left to read its full headers, status tags, and content bodies.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETAILED USER CONFIRMATION MODAL OVERLAY */}
      {confirmModal.type && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="glass-card max-w-md w-full p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl space-y-5 relative">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="font-sans font-bold text-base text-white">{confirmModal.title}</h3>
            </div>

            <p className="text-xs text-brand-text-muted leading-relaxed">
              {confirmModal.description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setConfirmModal({ type: null, onConfirm: () => {}, title: '', description: '' })}
                className="flex-1 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Cancel Action
              </button>
              
              <button
                onClick={confirmModal.onConfirm}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  confirmModal.type === 'send'
                    ? 'primary-gradient-bg text-black hover:brightness-110'
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/15'
                }`}
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
