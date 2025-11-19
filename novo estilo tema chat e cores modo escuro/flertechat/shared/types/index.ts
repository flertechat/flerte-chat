
export type PlanTier = 'free' | 'pro_weekly' | 'pro_monthly' | 'premium_weekly' | 'premium_monthly';

export interface Plan {
  id: PlanTier;
  name: string;
  price: string;
  interval: 'semanal' | 'mensal' | 'unico';
  creditsText: string;
  isUnlimited: boolean;
  features: string[];
}

export type Tone = 'normal' | 'safado' | 'engracado';
export type Length = 'curto' | 'normal';

export interface Analysis {
  sentiment: 'Interessado(a)' | 'Neutro' | 'Jogando Verde' | 'Frio' | 'Quente 🔥';
  score: number; // 0 to 100
  advice: string; // Strategic advice (e.g., "Don't answer immediately")
  risk: 'Baixo' | 'Médio' | 'Alto'; // Risk of ruining the chat
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string | string[];
  tone?: Tone;
  length?: Length;
  analysis?: Analysis; // New field for the AI brain
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
  renewalDate?: string;
}

export interface ChatSession {
  id: string;
  preview: string;
  timestamp: number;
  messages: Message[];
  lastTone: Tone;
}
