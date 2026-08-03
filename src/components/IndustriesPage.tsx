import React, { useState } from 'react';
import { 
  Building2, Stethoscope, Utensils, HardHat, ShoppingCart, GraduationCap, 
  Briefcase, ArrowRight, CheckCircle2, Sparkles, Building, ChevronRight, Users, Shield, Clock
} from 'lucide-react';

interface IndustriesPageProps {
  onBookDemo: () => void;
}

export default function IndustriesPage({ onBookDemo }: IndustriesPageProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('real-estate');

  const industriesList = [
    {
      id: 'real-estate',
      title: 'Real Estate',
      icon: Building2,
      tagline: 'Instant property tour bookings & pre-qualified buyer screening.',
      description: 'Relay AI engages property buyers and tenants instantly 24/7. It asks budget requirements, preferred locations, move-in timelines, and schedules showing appointments directly into realtor calendars.',
      useCases: [
        'Automatic property tour scheduling',
        'Buyer budget & financing qualification',
        'Listing sheet & brochure dispatch',
        'Open house RSVP & follow-up management'
      ],
      roi: '+340% Weekend Showing Appointments'
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      icon: Stethoscope,
      tagline: 'Patient inquiry triage & HIPAA-conscious consultation scheduling.',
      description: 'Medical practices and specialist clinics use Relay AI to handle incoming patient calls, answer clinic location & service queries, screen consultation requirements, and book appointments automatically.',
      useCases: [
        'New patient intake & scheduling',
        'Specialty clinic consultation booking',
        'Pre-appointment intake instructions',
        'After-hours patient inquiry handling'
      ],
      roi: '0 Missed Patient Inquiries'
    },
    {
      id: 'dental',
      title: 'Dental Clinics',
      icon: Stethoscope,
      tagline: '24/7 emergency triage & hygiene appointment booking.',
      description: 'Dental clinics lose thousands when emergency or routine calls hit voicemail after hours. Relay AI acts as an instant digital receptionist, filling open appointment slots in real time.',
      useCases: [
        'Emergency dental call triage',
        'Teeth whitening & cosmetic consultation booking',
        'Hygiene appointment reminders & rescheduling',
        'Insurance inquiry handling'
      ],
      roi: '+$14,000 Monthly Recovered Revenue'
    },
    {
      id: 'construction',
      title: 'Construction',
      icon: HardHat,
      tagline: 'Estimate request intake & project scope qualification.',
      description: 'Contractors and construction firms are on job sites all day. Relay AI captures quote requests, qualifies project scope & budget, and schedules site inspection walkthroughs.',
      useCases: [
        'Project scope & budget intake',
        'Site inspection & quote visit booking',
        'Sub-contractor inquiry screening',
        'Architectural blueprint request logging'
      ],
      roi: '15+ Hours Saved Per Week'
    },
    {
      id: 'restaurants',
      title: 'Restaurants & Hospitality',
      icon: Utensils,
      tagline: 'Table reservations & private event catering inquiry capture.',
      description: 'Relay AI answers reservation calls and web chats instantly during dinner rushes, taking table bookings, catering quotes, and private event details without interrupting waitstaff.',
      useCases: [
        'Instant table reservation booking',
        'Private party & event room inquiries',
        'Catering menu & dietary quote dispatch',
        'Operating hours & location directions'
      ],
      roi: '100% Reservation Call Capture'
    },
    {
      id: 'retail',
      title: 'Retail & E-commerce',
      icon: ShoppingCart,
      tagline: 'Pre-purchase support, inventory checking & custom order intake.',
      description: 'Engage online shoppers and store patrons instantly. Relay AI answers product stock questions, assists with checkout friction, and guides customers to completed purchases.',
      useCases: [
        'Real-time inventory stock inquiries',
        'Order tracking & shipping status',
        'Custom order specification intake',
        'Abandoned cart recovery chat sequences'
      ],
      roi: '+38% E-commerce Cart Recovery'
    },
    {
      id: 'education',
      title: 'Education',
      icon: GraduationCap,
      tagline: 'Student admissions inquiries & campus tour scheduling.',
      description: 'Universities, vocational schools, and online academies use Relay AI to guide prospective students through course selection, tuition queries, and campus visit scheduling.',
      useCases: [
        'Admissions requirement Q&A',
        'Campus tour & open day booking',
        'Tuition fee & scholarship details',
        'Course syllabus dispatch'
      ],
      roi: '+52% Campus Tour Attendance'
    },
    {
      id: 'professional-services',
      title: 'Professional Services',
      icon: Briefcase,
      tagline: 'Consultation intake for Law, Accounting & Consulting firms.',
      description: 'Law firms, CPAs, and business advisory services rely on Relay AI to screen incoming client inquiries, gather preliminary case details, and lock in paid initial consultations.',
      useCases: [
        'Case details & conflict intake',
        'Paid consultation calendar booking',
        'Service fee schedule information',
        'Client document intake checklists'
      ],
      roi: '-45% Cost Per Qualified Client'
    }
  ];

  const currentIndustry = industriesList.find(i => i.id === selectedIndustry) || industriesList[0];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Industry Solutions
        </div>
        <h1 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl text-slate-900 dark:text-white tracking-tight leading-tight">
          Tailored For Your Industry
        </h1>
        <p className="font-sans text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
          Relay AI Technologies delivers pre-configured AI agent workflows customized for the unique customer journeys, compliance requirements, and sales cycles of your specific industry.
        </p>
      </div>

      {/* Industry Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-100 dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
        {industriesList.map((ind) => {
          const Icon = ind.icon;
          const isActive = ind.id === selectedIndustry;
          return (
            <button
              key={ind.id}
              onClick={() => setSelectedIndustry(ind.id)}
              className={`flex items-center gap-3 p-3.5 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'bg-white dark:bg-[#1A1A22] text-blue-600 dark:text-blue-400 shadow-md border border-slate-200 dark:border-slate-700 font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
              <span className="text-xs sm:text-sm text-left font-sans leading-tight line-clamp-1">{ind.title}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Industry Detail Card */}
      <div className="bg-white dark:bg-[#131317] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-12 space-y-8 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <currentIndustry.icon className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Tailored Playbook
              </span>
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                Relay AI for {currentIndustry.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onBookDemo}
            className="bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/20 flex items-center gap-2 whitespace-nowrap"
          >
            <span>Book {currentIndustry.title} Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Industry Challenge & Solution</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              {currentIndustry.description}
            </p>
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-xs font-mono text-blue-900 dark:text-blue-300 font-bold">
              ⚡ Expected Outcome: {currentIndustry.roi}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Core Use Cases</h3>
            <div className="space-y-2.5">
              {currentIndustry.useCases.map((uc, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>{uc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid view of all industries */}
      <div className="space-y-8 pt-6">
        <div className="text-center space-y-2">
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Explore All 8 Core Industry Verticals
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industriesList.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.id}
                onClick={() => setSelectedIndustry(ind.id)}
                className="bg-white dark:bg-[#131317] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {ind.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {ind.tagline}
                </p>
                <div className="pt-2 flex items-center text-xs font-mono text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                  <span>View Playbook</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <h2 className="font-sans font-black text-2xl sm:text-4xl">
          Don't See Your Specific Industry?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Relay AI can be custom-trained on any specialized business domain, CRM setup, or unique qualification rubric.
        </p>
        <button
          onClick={onBookDemo}
          className="bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-xl transition-all cursor-pointer shadow-xl shadow-blue-600/30"
        >
          Request Custom Industry Build
        </button>
      </div>

    </div>
  );
}
