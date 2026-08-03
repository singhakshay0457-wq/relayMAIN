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
  Phone,
  Send,
  Share2
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { MeetingBooking } from '../types';

const WhatsappIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.887-9.885 9.887m0-18.067c-6.626 0-12.016 5.39-12.018 12.018a11.96 11.96 0 001.625 6.022L0 24l6.291-1.65a11.968 11.968 0 005.756 1.468h.005c6.627 0 12.018-5.39 12.02-12.018a11.963 11.963 0 00-3.518-8.497 11.963 11.963 0 00-8.504-3.518" />
  </svg>
);

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
    phone: '',
    company: '',
    notes: '',
    guestEmail: ''
  });

  // Host WhatsApp Notification State
  const [hostWhatsappPhone, setHostWhatsappPhone] = useState<string>(() => {
    return localStorage.getItem('relay_host_whatsapp') || '+91 7390099764';
  });
  const [autoOpenWhatsapp, setAutoOpenWhatsapp] = useState<boolean>(true);
  const [whatsappDispatched, setWhatsappDispatched] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<MeetingBooking | null>(null);
  const [pastBookings, setPastBookings] = useState<MeetingBooking[]>([]);

  // Update Host WhatsApp number in storage
  const handleHostWhatsappChange = (newPhone: string) => {
    setHostWhatsappPhone(newPhone);
    try {
      localStorage.setItem('relay_host_whatsapp', newPhone);
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to construct WhatsApp click-to-chat URL
  const buildWhatsappUrl = (booking: MeetingBooking, targetPhone: string) => {
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    const messageText = 
`🚨 *NEW MEETING SCHEDULED ON RELAY AI!* 📅

👤 *Attendee:* ${booking.name}
✉️ *Email:* ${booking.email}
${booking.phone ? `📱 *Attendee WhatsApp/Phone:* ${booking.phone}\n` : ''}${booking.company ? `🏢 *Company:* ${booking.company}\n` : ''}
📌 *Session:* ${booking.meetingType} (${booking.durationMinutes} min)
📆 *Date & Time:* ${booking.dateString} at ${booking.timeSlot}
🌍 *Timezone:* ${booking.timeZone}
${booking.notes ? `📝 *Notes:* ${booking.notes}\n` : ''}
🔗 *Google Meet:* https://meet.google.com/relay-growth-call`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
  };

  const openWhatsappDirect = (booking: MeetingBooking, phone: string = hostWhatsappPhone) => {
    if (!phone) return;
    const url = buildWhatsappUrl(booking, phone);
    window.open(url, '_blank');
    setWhatsappDispatched(true);
  };

  // Load existing bookings
  useEffect(() => {
    try {
      const stored = localStorage.getItem('relay_booked_meetings');
      if (stored) {
        setPastBookings(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local bookings", e);
    }
  }, []);

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
      phone: formData.phone || '',
      company: formData.company || 'N/A',
      notes: formData.notes || '',
      createdAt: new Date().toISOString(),
      whatsappSent: autoOpenWhatsapp
    };

    // Save to Firestore 'meetings' collection
    try {
      await addDoc(collection(db, 'meetings'), {
        ...bookingPayload,
        serverCreatedAt: serverTimestamp(),
        meetingUrl: 'https://meet.google.com/relay-growth-call'
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

    // Auto-open WhatsApp message directly to host WhatsApp number
    if (autoOpenWhatsapp && hostWhatsappPhone) {
      openWhatsappDirect(bookingPayload, hostWhatsappPhone);
    }

    setConfirmedBooking(bookingPayload);
    setSubmitting(false);
    setStep('confirmed');
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
          <span>Interactive Meeting Booking</span>
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight">
          Schedule Your 1-on-1 Session
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Pick a time that works best for you. Choose from 15, 30, or 45-minute growth consultations with our AI solution architects.
        </p>
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
                    <label className="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase font-semibold">Your Phone / WhatsApp Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-[#03050C] border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-electric-cyan placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
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

                {/* Direct WhatsApp Notification Host Config */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wide">
                      <WhatsappIcon className="w-4 h-4 text-emerald-400" />
                      <span>WhatsApp Direct Alert Settings</span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={autoOpenWhatsapp}
                        onChange={(e) => setAutoOpenWhatsapp(e.target.checked)}
                        className="rounded bg-black border-emerald-500/50 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
                      />
                      <span>Auto-send on book</span>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className="text-[11px] font-mono text-slate-300 whitespace-nowrap">Send to Host WhatsApp #:</label>
                    <input
                      type="text"
                      value={hostWhatsappPhone}
                      onChange={(e) => handleHostWhatsappChange(e.target.value)}
                      placeholder="+91 7390099764"
                      className="w-full bg-black/80 border border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-400 placeholder:text-slate-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    When someone books a meeting, a complete formatted summary (Name, Email, Time slot &amp; Meet Link) will be dispatched directly to your WhatsApp!
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl primary-gradient-bg text-black font-sans font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-electric-blue/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>{submitting ? 'Confirming & Registering Slot...' : 'Schedule Event & Dispatch WhatsApp Alert'}</span>
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

                {confirmedBooking.phone && (
                  <div className="text-xs text-slate-300 pt-1 border-t border-white/5 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Attendee Phone: <strong className="text-white font-mono">{confirmedBooking.phone}</strong></span>
                  </div>
                )}

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

              {/* Direct WhatsApp Message Status & Quick Dispatch Card */}
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-left space-y-3 shadow-lg shadow-emerald-500/10">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <WhatsappIcon className="w-5 h-5 text-emerald-400" />
                    <span>WhatsApp Alert Dispatch Hub</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Direct Message
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Meeting details (Name, Time, Zoom/Meet link, Notes) are formatted and prepared for WhatsApp recipient:
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-emerald-400" />
                    <input
                      type="text"
                      value={hostWhatsappPhone}
                      onChange={(e) => handleHostWhatsappChange(e.target.value)}
                      placeholder="+91 7390099764"
                      className="w-full bg-black/90 border border-emerald-500/40 rounded-xl py-2 pl-9 pr-3 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-400 placeholder:text-slate-600"
                    />
                  </div>

                  <button
                    onClick={() => openWhatsappDirect(confirmedBooking, hostWhatsappPhone)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-sans font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
                  >
                    <WhatsappIcon className="w-4 h-4" />
                    <span>Send / Open in WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => openWhatsappDirect(confirmedBooking, hostWhatsappPhone)}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-sans font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <WhatsappIcon className="w-4.5 h-4.5" />
                  <span>Send Meeting Summary to WhatsApp</span>
                </button>

                <button
                  onClick={downloadIcsFile}
                  className="w-full py-3.5 px-4 rounded-xl primary-gradient-bg text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-electric-blue/15 cursor-pointer"
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

    </div>
  );
}
