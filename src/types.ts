export type ActivePage = 'home' | 'services' | 'industries' | 'about' | 'contact' | 'leads' | 'security';

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
