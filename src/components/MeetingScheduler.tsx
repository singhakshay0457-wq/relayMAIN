import React from 'react';
import { CalendarDays, ExternalLink, Sparkles } from 'lucide-react';

const CALENDLY_URL = "https://calendly.com/singhakshay0457/sales-meeting";

export default function MeetingScheduler() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-electric-cyan" />
          <span>Interactive Meeting Booking</span>
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
          Schedule Your 1-on-1 Session
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Pick a time that works best for you via our official Calendly scheduler.
        </p>
      </div>

      {/* Calendly Live View Container */}
      <div className="glass-card rounded-3xl border border-blue-500/30 bg-[#060815] shadow-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-blue-950/40 border border-blue-500/20 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Calendly Sales Meeting Calendar</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">Active Sync</span>
              </h3>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 font-mono underline flex items-center gap-1 mt-0.5"
              >
                <span>{CALENDLY_URL}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 shrink-0 cursor-pointer"
          >
            <span>Open in Calendly Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-white/95 shadow-inner">
          <iframe
            src={CALENDLY_URL}
            className="w-full h-[680px] border-0"
            title="Calendly Sales Meeting"
          />
        </div>
      </div>
    </div>
  );
}
