import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Video, 
  User, 
  Mail, 
  Building2, 
  MessageSquare, 
  Sparkles, 
  Download, 
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  Plus,
  Trash2,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { MeetingBooking } from '../types';
import { 
  signInWithGoogleCalendar, 
  createGoogleCalendarEvent, 
  fetchUpcomingCalendarEvents, 
  deleteCalendarEvent,
  initCalendarAuth
} from '../lib/googleCalendar';
import { User as FirebaseUser } from 'firebase/auth';

interface MeetingType {
  id: string;
  title: string;
  duration: number;
  description: string;
  icon: string;
  badge?: string;
}

const MEETING_TYPES: MeetingType[] = [
  {
    id: '15-min-plan',
    title: '15-Minute - Video Marketing Game Plan Session',
    duration: 15,
    description: "Book in a time to talk, and let's see what kind of video marketing game plan we can put together for you 📹 (There's nothing for sale on this call - Just a quick chat to understand your needs and see how we can help)",
    icon: '📹',
    badge: 'Popular'
  },
  {
    id: '30-min-ai-growth',
    title: '30-Minute - AI Growth & Automation Strategy',
    duration: 30,
    description: 'Explore how Relay AI voice bots, custom CRM automations, and lead scoring pipelines can cut manual lead response time down to under 2 seconds.',
    icon: '⚡'
  },
  {
    id: '45-min-tech-audit',
    title: '45-Minute - Enterprise Infrastructure Audit',
    duration: 45,
    description: 'A deep-dive walkthrough with an AI solution architect to map out your software architecture, custom webhooks, and enterprise OAuth integrations.',
    icon: '🛡️'
  }
];

const TIMEZONES = [
  { value: 'GMT+05:30 Asia/Calcutta (GMT+5:30)', label: 'GMT+05:30 Asia/Calcutta (GMT+5:30)' },
  { value: 'GMT-05:00 Eastern Time (US & Canada)', label: 'GMT-05:00 Eastern Time (US & Canada)' },
  { value: 'GMT-08:00 Pacific Time (US & Canada)', label: 'GMT-08:00 Pacific Time (US & Canada)' },
  { value: 'GMT-06:00 Central Time (US & Canada)', label: 'GMT-06:00 Central Time (US & Canada)' },
  { value: 'GMT+00:00 UTC / London (GMT)', label: 'GMT+00:00 UTC / London (GMT)' },
  { value: 'GMT+01:00 Central European Time (CET)', label: 'GMT+01:00 Central European Time (CET)' },
  { value: 'GMT+08:00 Singapore / Hong Kong (SGT)', label: 'GMT+08:00 Singapore / Hong Kong (SGT)' },
  { value: 'GMT+09:00 Japan / Tokyo (JST)', label: 'GMT+09:00 Japan / Tokyo (JST)' },
  { value: 'GMT+10:00 Australia / Sydney (AEST)', label: 'GMT+10:00 Australia / Sydney (AEST)' },
];

const AVAILABLE_TIMES = [
  '09:30 AM',
  '09:45 AM',
  '10:00 AM',
  '10:15 AM',
  '10:30 AM',
  '10:45 AM',
  '11:00 AM',
  '11:15 AM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM'
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MeetingScheduler() {
  const [selectedType, setSelectedType] = useState<MeetingType>(MEETING_TYPES[0]);
  
  // Date & Calendar State (Defaulting to August 2026 or current date)
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 7 = August (0-indexed)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  
  // Selected Day State
  const [selectedDay, setSelectedDay] = useState<number>(4); // August 4, 2026 as per screenshot
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>('10:00 AM');
  const [timeZone, setTimeZone] = useState<string>('GMT+05:30 Asia/Calcutta (GMT+5:30)');
  
  // Step Management: 'calendar' | 'details' | 'confirmed'
  const [step, setStep] = useState<'calendar' | 'details' | 'confirmed'>('calendar');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    notes: '',
    guestEmail: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<MeetingBooking | null>(null);
  const [pastBookings, setPastBookings] = useState<MeetingBooking[]>([]);

  // Google Calendar Integration State
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [calendarToken, setCalendarToken] = useState<string | null>(null);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<any[]>([]);
  const [isConnectingCalendar, setIsConnectingCalendar] = useState(false);
  const [calendarSyncError, setCalendarSyncError] = useState<string | null>(null);
  const [googleMeetUrl, setGoogleMeetUrl] = useState<string>('https://meet.google.com/relay-growth-call');

  // Load existing bookings & initialize Calendar Auth
  useEffect(() => {
    try {
      const stored = localStorage.getItem('relay_booked_meetings');
      if (stored) {
        setPastBookings(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local bookings", e);
    }

    initCalendarAuth(
      async (user, token) => {
        setGoogleUser(user);
        setCalendarToken(token);
        if (user.email && !formData.email) {
          setFormData((prev) => ({
            ...prev,
            email: user.email || '',
            name: user.displayName || prev.name
          }));
        }
        try {
          const events = await fetchUpcomingCalendarEvents(token, 5);
          setGoogleCalendarEvents(events);
        } catch (err) {
          console.warn('Could not load Google Calendar events:', err);
        }
      },
      () => {
        setGoogleUser(null);
        setCalendarToken(null);
      }
    );
  }, []);

  const handleConnectGoogleCalendar = async () => {
    setIsConnectingCalendar(true);
    setCalendarSyncError(null);
    try {
      const res = await signInWithGoogleCalendar();
      if (res) {
        setGoogleUser(res.user);
        setCalendarToken(res.accessToken);
        setFormData((prev) => ({
          ...prev,
          email: res.user.email || prev.email,
          name: res.user.displayName || prev.name
        }));
        
        // Fetch upcoming events to verify
        const events = await fetchUpcomingCalendarEvents(res.accessToken, 5);
        setGoogleCalendarEvents(events);
      }
    } catch (err: any) {
      console.error('Calendar Connect Error:', err);
      setCalendarSyncError(err.message || 'Failed to connect Google Calendar. Please try again.');
    } finally {
      setIsConnectingCalendar(false);
    }
  };

  const handleRefreshCalendarEvents = async () => {
    if (!calendarToken) return;
    try {
      const events = await fetchUpcomingCalendarEvents(calendarToken, 5);
      setGoogleCalendarEvents(events);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeleteCalendarEvent = async (eventId: string, summary: string) => {
    if (!calendarToken) return;
    try {
      const success = await deleteCalendarEvent(calendarToken, eventId, summary);
      if (success) {
        setGoogleCalendarEvents((prev) => prev.filter((ev) => ev.id !== eventId));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete event');
    }
  };

  // Helper date calculations
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfWeek = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfWeek = getFirstDayOfWeek(currentMonth, currentYear);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(1);
    setSelectedTimeSlot(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(1);
    setSelectedTimeSlot(null);
  };

  const formatFormattedDateString = () => {
    const dayOfWeekStr = DAYS_OF_WEEK[new Date(currentYear, currentMonth, selectedDay).getDay()];
    const monthShortStr = MONTH_NAMES[currentMonth].substring(0, 3);
    return `${dayOfWeekStr}, ${monthShortStr} ${selectedDay}, ${currentYear}`;
  };

  const handleProceedToDetails = () => {
    if (!selectedTimeSlot) return;
    setStep('details');
  };

  const handleBookMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setSubmitting(true);

    const formattedDate = formatFormattedDateString();

    const bookingPayload: MeetingBooking = {
      meetingType: selectedType.title,
      durationMinutes: selectedType.duration,
      dateString: formattedDate,
      timeSlot: selectedTimeSlot || '10:00 AM',
      timeZone: timeZone,
      name: formData.name,
      email: formData.email,
      company: formData.company || 'N/A',
      notes: formData.notes || '',
      createdAt: new Date().toISOString()
    };

    // If connected to Google Calendar, create event directly on primary calendar
    let createdGoogleMeetUrl = 'https://meet.google.com/relay-growth-call';
    if (calendarToken) {
      try {
        // Calculate start and end ISO strings
        const startIso = new Date(currentYear, currentMonth, selectedDay, 10, 0, 0).toISOString();
        const endIso = new Date(currentYear, currentMonth, selectedDay, 10, selectedType.duration, 0).toISOString();

        const calResponse = await createGoogleCalendarEvent(calendarToken, {
          summary: `${selectedType.title} - ${formData.name}`,
          description: `Relay AI Consultation.\nCompany: ${formData.company}\nNotes: ${formData.notes}`,
          startDateTime: startIso,
          endDateTime: endIso,
          timeZone: timeZone.split(' ')[0],
          attendees: [
            { email: formData.email, displayName: formData.name },
            ...(formData.guestEmail ? [{ email: formData.guestEmail }] : [])
          ]
        });

        if (calResponse?.hangoutLink) {
          createdGoogleMeetUrl = calResponse.hangoutLink;
          setGoogleMeetUrl(calResponse.hangoutLink);
        }

        // Refresh events list
        const updatedEvents = await fetchUpcomingCalendarEvents(calendarToken, 5);
        setGoogleCalendarEvents(updatedEvents);
      } catch (calErr: any) {
        console.warn('Failed to auto-create Google Calendar event:', calErr);
      }
    }

    // Save to Firestore 'meetings' collection
    try {
      await addDoc(collection(db, 'meetings'), {
        ...bookingPayload,
        serverCreatedAt: serverTimestamp(),
        meetingUrl: createdGoogleMeetUrl
      });
    } catch (err) {
      console.warn("Firestore save warning (saving locally):", err);
      try {
        handleFirestoreError(err, OperationType.WRITE, 'meetings');
      } catch (e) {
        // Fallthrough to local persistence
      }
    }

    // Save to Local Storage
    const updatedBookings = [bookingPayload, ...pastBookings];
    setPastBookings(updatedBookings);
    try {
      localStorage.setItem('relay_booked_meetings', JSON.stringify(updatedBookings));
    } catch (e) {
      console.error(e);
    }

    setConfirmedBooking(bookingPayload);
    setSubmitting(false);
    setStep('confirmed');
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = () => {
    if (!confirmedBooking) return '#';
    const title = encodeURIComponent(confirmedBooking.meetingType);
    const details = encodeURIComponent(`Video Call: https://meet.google.com/relay-growth-call\n\nNotes: ${confirmedBooking.notes || 'None'}`);
    const location = encodeURIComponent('https://meet.google.com/relay-growth-call');
    
    // Approximate ISO times
    const startTime = `${currentYear}${String(currentMonth + 1).padStart(2, '0')}${String(selectedDay).padStart(2, '0')}T100000Z`;
    const endTime = `${currentYear}${String(currentMonth + 1).padStart(2, '0')}${String(selectedDay).padStart(2, '0')}T103000Z`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startTime}/${endTime}`;
  };

  // Generate and Download .ics File
  const downloadIcsFile = () => {
    if (!confirmedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Relay AI Technologies//Meeting Scheduler//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
SUMMARY:${confirmedBooking.meetingType}
DESCRIPTION:Relay AI Consultation with ${confirmedBooking.name}. Video Link: https://meet.google.com/relay-growth-call
LOCATION:https://meet.google.com/relay-growth-call
STATUS:CONFIRMED
ORGANIZER;CN=Relay AI Team:mailto:sales@relayaitechnologies.com
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${confirmedBooking.name}:mailto:${confirmedBooking.email}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relay-meeting-invite.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-electric-cyan font-bold px-3.5 py-1 bg-electric-cyan/10 rounded-full border border-electric-cyan/20 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-electric-cyan" />
          <span>Interactive Calendar & Meeting Booking</span>
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
          Schedule Your 1-on-1 Session
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Pick a time that works best for you. Choose from 15, 30, or 45-minute growth consultations with our AI solution architects.
        </p>

        {/* Google Calendar Connection Control Bar */}
        <div className="pt-2">
          {calendarToken && googleUser ? (
            <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium">Google Calendar Connected: <strong className="text-white">{googleUser.email}</strong></span>
              <button
                onClick={handleRefreshCalendarEvents}
                className="p-1 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-colors"
                title="Refresh Calendar Events"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleConnectGoogleCalendar}
                disabled={isConnectingCalendar}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>{isConnectingCalendar ? 'Connecting Google Calendar...' : 'Sign in with Google Calendar'}</span>
              </button>
              <span className="text-[11px] text-slate-400">Connect your account to auto-sync bookings directly to your Google Calendar</span>
            </div>
          )}
          {calendarSyncError && (
            <p className="text-xs text-rose-400 mt-2 font-mono">{calendarSyncError}</p>
          )}
        </div>
      </div>

      {/* Meeting Type Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {MEETING_TYPES.map((mType) => {
          const isSelected = selectedType.id === mType.id;
          return (
            <button
              key={mType.id}
              onClick={() => {
                setSelectedType(mType);
                setStep('calendar');
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-electric-blue/20 border-electric-cyan text-white shadow-lg shadow-electric-blue/20'
                  : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/30 hover:text-white'
              }`}
            >
              <span className="text-base">{mType.icon}</span>
              <span>{mType.title}</span>
              {mType.badge && (
                <span className="text-[10px] bg-electric-cyan text-black px-2 py-0.5 rounded-full font-black uppercase">
                  {mType.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Calendar Card Wrapper */}
      <div className="glass-card rounded-3xl border border-white/10 bg-[#080B18] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* Left Panel: Meeting Info & Overview (4 Cols on desktop) */}
        <div className="lg:col-span-4 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-b from-[#0B0F24] to-[#060813] space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-electric-cyan uppercase tracking-wider font-bold">
                Selected Consultation
              </span>
              <h2 className="font-sans font-black text-2xl text-white tracking-tight leading-snug">
                {selectedType.title}
              </h2>
            </div>

            <div className="space-y-3.5 text-xs text-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center text-electric-cyan shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">{selectedType.duration} minutes</div>
                  <div className="text-[11px] text-slate-400">Video Consultation</div>
                </div>
              </div>

              {selectedTimeSlot && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{formatFormattedDateString()}</div>
                    <div className="text-[11px] text-electric-cyan font-mono font-semibold">{selectedTimeSlot}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-white truncate max-w-[200px]">{timeZone.split(' ')[0]}</div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{timeZone}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Google Meet Video Link</div>
                  <div className="text-[11px] text-slate-400">Web conferencing provided upon confirmation</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <p className="text-xs text-brand-text-muted leading-relaxed">
                {selectedType.description}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant booking confirmation & .ics calendar invite sent to your inbox.</span>
          </div>
        </div>

        {/* Right Panel: Dynamic Step Content (8 Cols on desktop) */}
        <div className="lg:col-span-8 p-6 sm:p-8 bg-[#070914] flex flex-col justify-between">
          
          {/* STEP 1: CALENDAR & TIME SLOTS */}
          {step === 'calendar' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <h3 className="font-sans font-black text-xl text-white">
                  Select Date & Time
                </h3>

                {/* Timezone Selector Dropdown */}
                <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200">
                  <Globe className="w-3.5 h-3.5 text-electric-cyan shrink-0" />
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer max-w-[220px] truncate"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value} className="bg-[#0B0F24] text-white">
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid Layout: Calendar on Left, Time Slots on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Calendar Column (7 Cols on MD+) */}
                <div className="md:col-span-7 space-y-4 bg-black/30 p-4 rounded-2xl border border-white/5">
                  
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between px-2">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="font-sans font-bold text-sm text-white tracking-wide">
                      {MONTH_NAMES[currentMonth]} {currentYear}
                    </span>

                    <button
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="Next Month"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Day of Week Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {DAYS_OF_WEEK.map((d) => (
                      <span key={d} className="text-[11px] font-mono text-slate-400 font-semibold uppercase py-1">
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Calendar Day Grid */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {/* Empty Padding Cells for First Day Offset */}
                    {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="h-9 sm:h-10" />
                    ))}

                    {/* Day Cells */}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                      const dayNum = idx + 1;
                      const isSelected = selectedDay === dayNum;
                      
                      // Simulate weekends vs weekdays
                      const dateObj = new Date(currentYear, currentMonth, dayNum);
                      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                      const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

                      return (
                        <button
                          key={`day-${dayNum}`}
                          disabled={isPast}
                          onClick={() => {
                            setSelectedDay(dayNum);
                            if (!selectedTimeSlot) {
                              setSelectedTimeSlot('10:00 AM');
                            }
                          }}
                          className={`h-9 sm:h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center relative cursor-pointer ${
                            isPast
                              ? 'text-slate-600 opacity-30 cursor-not-allowed'
                              : isSelected
                              ? 'bg-electric-blue text-white font-black shadow-lg shadow-electric-blue/40 ring-2 ring-electric-cyan scale-105'
                              : isWeekend
                              ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                              : 'bg-blue-950/20 text-electric-cyan border border-electric-cyan/20 hover:bg-electric-cyan/20 hover:border-electric-cyan'
                          }`}
                        >
                          {dayNum}
                          {isSelected && (
                            <span className="absolute -bottom-0.5 w-1 h-1 bg-white rounded-full"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5 px-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-electric-cyan"></span> Available
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-600"></span> Unavailable
                    </span>
                  </div>
                </div>

                {/* Time Slots Column (5 Cols on MD+) */}
                <div className="md:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-300 font-bold uppercase">
                      Available Slots for {MONTH_NAMES[currentMonth].substring(0, 3)} {selectedDay}
                    </span>
                  </div>

                  <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {AVAILABLE_TIMES.map((time) => {
                      const isSlotSelected = selectedTimeSlot === time;
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTimeSlot(time)}
                          className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                            isSlotSelected
                              ? 'bg-electric-cyan/20 border-electric-cyan text-white shadow-md shadow-electric-cyan/10'
                              : 'bg-black/40 border-white/10 text-slate-300 hover:border-electric-cyan/50 hover:text-white'
                          }`}
                        >
                          <span>{time}</span>
                          {isSlotSelected && (
                            <span className="text-[10px] bg-electric-cyan text-black px-2 py-0.5 rounded font-black uppercase flex items-center gap-1">
                              <Check className="w-3 h-3" /> Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Proceed CTA */}
                  <button
                    onClick={handleProceedToDetails}
                    disabled={!selectedTimeSlot}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedTimeSlot
                        ? 'primary-gradient-bg text-black hover:brightness-110 active:scale-95 shadow-lg shadow-electric-blue/20'
                        : 'bg-white/10 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Next: Enter Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: ATTENDEE DETAILS FORM */}
          {step === 'details' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono text-electric-cyan uppercase font-bold">Step 2 of 2</span>
                  <h3 className="font-sans font-black text-xl text-white">Enter Your Details</h3>
                </div>
                <button
                  onClick={() => setStep('calendar')}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  ← Back to Calendar
                </button>
              </div>

              <form onSubmit={handleBookMeetingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase font-semibold">Your Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Smith"
                        className="w-full bg-[#03050C] border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-electric-cyan placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase font-semibold">Work Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full bg-[#03050C] border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-electric-cyan placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase font-semibold">Company / Website</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Acme Corp"
                        className="w-full bg-[#03050C] border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-electric-cyan placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase font-semibold">Add Guest Emails (Optional)</label>
                    <div className="relative">
                      <Plus className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="email"
                        value={formData.guestEmail}
                        onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                        placeholder="colleague@company.com"
                        className="w-full bg-[#03050C] border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-electric-cyan placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase font-semibold">Please share anything that will help prepare for our meeting</label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. We are looking to automate prospect calls and sync qualified leads directly into HubSpot..."
                      className="w-full bg-[#03050C] border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-electric-cyan placeholder:text-slate-600 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl primary-gradient-bg text-black font-sans font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-electric-blue/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>{submitting ? 'Confirming & Registering Slot...' : 'Schedule Event & Send Calendar Invite'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: INSTANT CONFIRMATION */}
          {step === 'confirmed' && confirmedBooking && (
            <div className="space-y-6 text-center max-w-xl mx-auto py-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Booking Confirmed!
                </span>
                <h3 className="font-sans font-black text-2xl sm:text-3xl text-white">
                  You are scheduled with Relay AI
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  A calendar invitation and Google Meet video link have been generated for your session.
                </p>
              </div>

              {/* Event Card */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/15 text-left space-y-3">
                <div className="font-bold text-sm text-white border-b border-white/10 pb-2 flex items-center justify-between">
                  <span>{confirmedBooking.meetingType}</span>
                  <span className="text-xs font-mono text-electric-cyan">{confirmedBooking.durationMinutes} min</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Date & Time</span>
                    <span className="font-semibold text-white">{confirmedBooking.dateString}</span>
                    <div className="text-electric-cyan font-bold">{confirmedBooking.timeSlot}</div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Timezone</span>
                    <span className="font-semibold text-white truncate block">{confirmedBooking.timeZone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Video Call Location:</span>
                  <a
                    href="https://meet.google.com/relay-growth-call"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-electric-cyan hover:underline font-mono font-bold flex items-center gap-1"
                  >
                    <span>meet.google.com/relay-growth-call</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl primary-gradient-bg text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-electric-blue/15"
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Add to Google Calendar</span>
                </a>

                <button
                  onClick={downloadIcsFile}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .ics Invite</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setStep('calendar');
                  setConfirmedBooking(null);
                }}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer pt-2 block mx-auto"
              >
                Schedule Another Meeting
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Booked Meetings History Drawer / List */}
      {pastBookings.length > 0 && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-base text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-electric-cyan" />
              <span>Your Scheduled Meetings ({pastBookings.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Stored locally in your browser session</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastBookings.map((b, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#060814] border border-white/10 space-y-2 text-xs">
                <div className="font-bold text-white truncate">{b.meetingType}</div>
                <div className="text-electric-cyan font-mono">{b.dateString} at {b.timeSlot}</div>
                <div className="text-slate-400 text-[11px]">Attendee: {b.name} ({b.email})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Google Calendar Synced Events Section */}
      {calendarToken && (
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/20 bg-emerald-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-base text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-400" />
              <span>Google Calendar Events (Synced via REST API)</span>
            </h3>
            <button
              onClick={handleRefreshCalendarEvents}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {googleCalendarEvents.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No upcoming events found on your primary Google Calendar.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {googleCalendarEvents.map((ev) => (
                <div key={ev.id} className="p-4 rounded-2xl bg-[#060A16] border border-white/10 space-y-2 text-xs relative group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-white truncate">{ev.summary || 'Untitled Event'}</div>
                    <button
                      onClick={() => handleDeleteCalendarEvent(ev.id, ev.summary || 'Event')}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      title="Remove event from Google Calendar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-emerald-400 font-mono text-[11px]">
                    {ev.start?.dateTime ? new Date(ev.start.dateTime).toLocaleString() : ev.start?.date || 'All Day'}
                  </div>
                  {ev.htmlLink && (
                    <a
                      href={ev.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-electric-cyan hover:underline inline-flex items-center gap-1 pt-1"
                    >
                      <span>Open in Google Calendar</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
