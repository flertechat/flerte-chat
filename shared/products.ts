/**
 * Flerte Chat Subscription Plans
 * 
 * Define all subscription products and prices here.
 * These should match the products created in Stripe Dashboard.
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // in cents (BRL)
  stripePriceId: string;
  features: string[];
  credits: number; // -1 for unlimited
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: "free",
    name: "Grátis",
    description: "Para testar",
    price: 0,
    stripePriceId: "",
    features: [
      "10 mensagens grátis",
      "Todos os tons de voz",
      "Upload de imagem",
    ],
    credits: 10,
  },
  proWeekly: {
    id: "proWeekly",
    name: "Pro Semanal",
    description: "50 mensagens por semana",
    price: 990, // R$ 9,90
    stripePriceId: "price_1SUtnaROt9620AeF15uSi74D",
    features: [
      "50 mensagens por semana",
      "Histórico ilimitado",
      "Favoritos ilimitados",
    ],
    credits: 50,
    popular: true,
  },
  proMonthly: {
    id: "proMonthly",
    name: "Pro Mensal",
    description: "200 mensagens por mês",
    price: 2990, // R$ 29,90
    stripePriceId: "price_1SUtoSROt9620AeFzlPnP0He",
    features: [
      "200 mensagens por mês",
      "Histórico ilimitado",
      "Favoritos ilimitados",
    ],
    credits: 200,
  },
  premiumWeekly: {
    id: "premiumWeekly",
    name: "Premium Semanal",
    description: "Mensagens ilimitadas por semana",
    price: 1990, // R$ 19,90
    stripePriceId: "price_1SUtp9ROt9620AeF3m4jhSuz",
    features: [
      "Mensagens ilimitadas por semana",
      "Prioridade na geração",
      "Suporte prioritário",
      "Novos recursos primeiro",
    ],
    credits: -1, // Unlimited
  },
  premiumMonthly: {
    id: "premiumMonthly",
    name: "Premium Mensal",
    description: "Mensagens ilimitadas por mês",
    price: 5990, // R$ 59,90
    stripePriceId: "price_1SUtpYROt9620AeFP5ROMYos",
    features: [
      "Mensagens ilimitadas por mês",
      "Prioridade na geração",
      "Suporte VIP 24/7",
      "Novos recursos primeiro",
    ],
    credits: -1, // Unlimited
  },
};

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS[planId];
}

export function formatPrice(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}
