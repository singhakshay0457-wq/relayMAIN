export type ActivePage = 'home' | 'about' | 'contact' | 'leads' | 'security' | 'partnerships' | 'schedule';

export interface MeetingBooking {
  id?: string;
  meetingType: string;
  durationMinutes: number;
  dateString: string; // ISO or formatted date
  timeSlot: string;
  timeZone: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  createdAt?: any;
  whatsappSent?: boolean;
}

export interface MarketingService {
  id: string;
  title: string;
  description: string;
  iconName: string; // Refers to Lucide icon name
  gridSpanClass: string;
  colorTheme: 'primary' | 'secondary' | 'tertiary' | 'cyan';
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  subheading?: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  status?: 'typing' | 'sent';
}

export interface SimulatorLead {
  name: string;
  email: string;
  company: string;
  budget: string;
  interest: string;
  score: number; // calculated qualification score (0-100)
  status: 'new' | 'qualifying' | 'qualified' | 'booked';
}
