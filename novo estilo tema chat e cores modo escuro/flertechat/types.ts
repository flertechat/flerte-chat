export type PlanTier = 'free' | 'pro_weekly' | 'pro_monthly' | 'premium_weekly' | 'premium_monthly';

export interface Plan {
  id: PlanTier;
  name: string;
  price: string; // Display string like "R$ 9,90"
  interval: 'semanal' | 'mensal' | 'unico';
  creditsText: string;
  isUnlimited: boolean;
  features: string[];
}

export type Tone = 'normal' | 'safado' | 'engracado';

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string | string[]; // User sends string, AI returns array of options
  tone?: Tone;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: PlanTier;
  credits: number;
  subscriptionStatus: 'active' | 'canceled' | 'expired' | null;
  renewalDate?: string; // ISO date string
}

export interface ChatSession {
  id: string;
  preview: string;
  timestamp: number;
  messages: Message[];
  lastTone: Tone;
}
