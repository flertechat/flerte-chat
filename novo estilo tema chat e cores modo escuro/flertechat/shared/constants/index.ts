import { Plan, User } from '../types';

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 'R$ 0,00',
    interval: 'unico',
    creditsText: '10 créditos',
    isUnlimited: false,
    features: ['10 mensagens grátis', 'Acesso a todos os tons', 'Histórico básico'],
  },
  {
    id: 'pro_weekly',
    name: 'Pro Semanal',
    price: 'R$ 9,90',
    interval: 'semanal',
    creditsText: '50 msgs/semana',
    isUnlimited: false,
    features: ['Renova toda semana', 'Sem anúncios', 'Suporte prioritário'],
  },
  {
    id: 'premium_weekly',
    name: 'Premium Semanal',
    price: 'R$ 19,90',
    interval: 'semanal',
    creditsText: 'Ilimitado',
    isUnlimited: true,
    features: ['Gerações Ilimitadas', 'Acesso antecipado a recursos', 'Modo Turbo'],
  },
  {
    id: 'pro_monthly',
    name: 'Pro Mensal',
    price: 'R$ 29,90',
    interval: 'mensal',
    creditsText: '200 msgs/mês',
    isUnlimited: false,
    features: ['Melhor custo-benefício', 'Sem anúncios', 'Suporte prioritário'],
  },
  {
    id: 'premium_monthly',
    name: 'Premium Mensal',
    price: 'R$ 59,90',
    interval: 'mensal',
    creditsText: 'Ilimitado',
    isUnlimited: true,
    features: ['Gerações Ilimitadas', 'Status VIP', 'Todos os recursos desbloqueados'],
  },
];

export const TONES = [
  { id: 'normal', emoji: '🙂', label: 'Normal', desc: 'Amigável e educado' },
  { id: 'safado', emoji: '😏', label: 'Safado', desc: 'Picante e direto' },
  { id: 'engracado', emoji: '😄', label: 'Engraçado', desc: 'Criativo e humorístico' },
] as const;

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Don Juan',
  email: 'flerte@exemplo.com',
  plan: 'free',
  credits: 10,
  subscriptionStatus: 'active',
};