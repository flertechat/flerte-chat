import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { APP_LOGO, APP_TITLE } from "@/shared/constants/app";
import { trpc } from "@/lib/trpc";
import { Check, Loader2, ArrowLeft, Sparkles, Zap, Flame, Clock, Star } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Plans() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly'>('weekly');

  const subscriptionQuery = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const currentPlan = subscriptionQuery.data?.plan || "free";

  const createCheckoutMutation = trpc.subscription.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("Redirecionando para o checkout...");
        window.open(data.url, '_blank');
      }
    },
    onError: (error) => {
      toast.error("Erro ao criar checkout: " + error.message);
    },
  });

  const handleSubscribe = async (plan: string) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    createCheckoutMutation.mutate({ planId: plan as string });
  };

  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const difference = midnight.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="min-h-screen bg-navy-900 font-sans">
      {/* Header */}
      <header className="bg-navy-800 border-b border-navy-700 sticky top-0 z-50 backdrop-blur-md bg-navy-800/90">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation(isAuthenticated ? "/app" : "/")}
              variant="ghost"
              size="sm"
              className="text-slate-200 hover:bg-navy-700 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <img src={APP_LOGO} alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-coral-500 to-purple-500 bg-clip-text text-transparent app-title">{APP_TITLE}</span>
            </div>
          </div>
          {isAuthenticated && user && (
            <div className="hidden md:block text-sm text-slate-300">
              Olá, <span className="text-coral-400 font-semibold">{user.name || "Usuário"}</span>!
            </div>
          )}
        </div>
      </header>

      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-red-600 via-coral-600 to-red-600 border-y-4 border-yellow-400 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container max-w-7xl mx-auto px-4 py-4 md:py-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400 rounded-full p-3 animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.6)]">
                <Flame className="w-6 h-6 md:w-8 md:h-8 text-red-600 fill-red-600" />
              </div>
              <div className="text-white text-center md:text-left">
                <div className="text-xl md:text-2xl font-black mb-1 tracking-tight drop-shadow-md">
                  🔥 OFERTA RELÂMPAGO - 50% OFF
                </div>
                <div className="text-sm md:text-lg opacity-95 font-medium">
                  Aproveite antes que acabe! Oferta válida apenas hoje
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />
              <div className="flex gap-2 items-center">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-white tabular-nums leading-none">{formatTime(timeLeft.hours)}</div>
                  <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Horas</div>
                </div>
                <div className="text-white text-xl font-bold pb-3">:</div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-white tabular-nums leading-none">{formatTime(timeLeft.minutes)}</div>
                  <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Min</div>
                </div>
                <div className="text-white text-xl font-bold pb-3">:</div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-white tabular-nums leading-none">{formatTime(timeLeft.seconds)}</div>
                  <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Seg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight">
            Escolha Seu Plano
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Desbloqueie todo o potencial da sua vida amorosa com nossa IA avançada.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={cn("text-lg font-bold transition-colors", billingCycle === 'weekly' ? "text-white" : "text-slate-500")}>
              Semanal
            </span>
            <button
              onClick={() => setBillingCycle(prev => prev === 'weekly' ? 'monthly' : 'weekly')}
              className="relative w-16 h-8 bg-navy-700 rounded-full p-1 transition-colors hover:bg-navy-600 focus:outline-none ring-2 ring-offset-2 ring-offset-navy-900 ring-coral-500"
            >
              <div
                className={cn(
                  "w-6 h-6 bg-coral-500 rounded-full shadow-md transform transition-transform duration-300",
                  billingCycle === 'monthly' ? "translate-x-8" : "translate-x-0"
                )}
              />
            </button>
            <span className={cn("text-lg font-bold transition-colors flex items-center gap-2", billingCycle === 'monthly' ? "text-white" : "text-slate-500")}>
              Mensal
              <span className="bg-green-500 text-navy-900 text-xs px-2 py-0.5 rounded-full font-black animate-pulse">
                -50%
              </span>
            </span>
          </div>

          {isAuthenticated && (
            <Badge className="bg-navy-800 text-coral-400 border-coral-500/50 text-sm px-4 py-1.5 mb-8">
              Plano Atual: <span className="font-bold ml-2 capitalize text-white">{currentPlan}</span>
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto perspective-1000">
          {/* Free Plan */}
          <Card className="border border-navy-600 bg-navy-800/50 backdrop-blur-sm hover:border-navy-500 transition-all duration-300 hover:-translate-y-2 flex flex-col">
            <CardHeader className="border-b border-navy-700/50 pb-8">
              <CardTitle className="text-2xl font-bold text-white mb-2">Grátis</CardTitle>
              <CardDescription className="text-slate-400">Para quem está começando</CardDescription>
              <div className="pt-6">
                <span className="text-4xl md:text-5xl font-black text-white">R$ 0</span>
                <span className="text-slate-500 ml-2 font-medium">/sempre</span>
              </div>
            </CardHeader>
            <CardContent className="pt-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <div className="bg-navy-700 p-1 rounded-full"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-slate-300">10 mensagens grátis</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-navy-700 p-1 rounded-full"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-slate-300">Todos os tons de voz</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-navy-700 p-1 rounded-full"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-slate-300">Análise básica</span>
                </li>
              </ul>
              <Button
                className="w-full py-6 bg-navy-700 hover:bg-navy-600 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-navy-900/50"
                onClick={() => (window.location.href = isAuthenticated ? "/app" : "/login")}
                disabled={currentPlan === "free"}
              >
                {currentPlan === "free" ? "Seu Plano Atual" : "Começar Grátis"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-coral-500 bg-navy-800 relative transform md:scale-110 z-10 shadow-[0_0_40px_rgba(255,111,97,0.15)] hover:shadow-[0_0_60px_rgba(255,111,97,0.25)] transition-all duration-300 flex flex-col">
            <div className="absolute -top-5 left-0 right-0 flex justify-center">
              <Badge className="bg-gradient-to-r from-coral-500 to-red-500 text-white border-none text-sm px-4 py-1.5 shadow-lg font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                MAIS POPULAR
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <div className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md animate-bounce shadow-sm">
                -50%
              </div>
            </div>

            <CardHeader className="border-b border-navy-700 pb-8 pt-10">
              <CardTitle className="text-3xl font-bold text-coral-500 mb-2">Pro</CardTitle>
              <CardDescription className="text-slate-400">Para conquistar de verdade</CardDescription>
              <div className="pt-6">
                <div className="flex items-baseline">
                  <span className="text-sm text-slate-500 line-through mr-2">
                    {billingCycle === 'weekly' ? 'R$ 19,80' : 'R$ 59,80'}
                  </span>
                  <span className="text-5xl font-black text-white">
                    {billingCycle === 'weekly' ? 'R$ 9,90' : 'R$ 29,90'}
                  </span>
                </div>
                <span className="text-slate-400 font-medium block mt-1">
                  /{billingCycle === 'weekly' ? 'semana' : 'mês'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <div className="bg-coral-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-coral-500" /></div>
                  <span className="text-white font-medium">50 mensagens/{billingCycle === 'weekly' ? 'sem' : 'mês'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-coral-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-coral-500" /></div>
                  <span className="text-white font-medium">Histórico Ilimitado</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-coral-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-coral-500" /></div>
                  <span className="text-white font-medium">Análise de Intenção Avançada</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-coral-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-coral-500" /></div>
                  <span className="text-white font-medium">Sem anúncios</span>
                </li>
              </ul>

              <Button
                className="w-full py-7 text-lg bg-gradient-to-r from-coral-500 to-red-500 hover:from-coral-600 hover:to-red-600 text-white font-black rounded-xl shadow-lg shadow-coral-500/25 hover:shadow-coral-500/40 transition-all transform hover:scale-[1.02]"
                onClick={() => handleSubscribe(billingCycle === 'weekly' ? "proWeekly" : "proMonthly")}
                disabled={currentPlan.includes('pro') || createCheckoutMutation.isPending}
              >
                {createCheckoutMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : currentPlan.includes('pro') ? (
                  "Seu Plano Atual"
                ) : (
                  <>
                    QUERO CONQUISTAR
                    <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-slate-500 mt-3">
                Cancele quando quiser. Sem fidelidade.
              </p>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border border-purple-500/50 bg-navy-800/50 backdrop-blur-sm hover:border-purple-500 transition-all duration-300 hover:-translate-y-2 flex flex-col">
            <div className="absolute top-4 right-4">
              <div className="bg-purple-600 text-white text-[10px] font-black px-2 py-1 rounded-md animate-pulse">
                VIP
              </div>
            </div>
            <CardHeader className="border-b border-navy-700/50 pb-8">
              <CardTitle className="text-2xl font-bold text-purple-400 mb-2">Premium</CardTitle>
              <CardDescription className="text-slate-400">O poder total da IA</CardDescription>
              <div className="pt-6">
                <div className="flex items-baseline">
                  <span className="text-sm text-slate-500 line-through mr-2">
                    {billingCycle === 'weekly' ? 'R$ 39,80' : 'R$ 119,80'}
                  </span>
                  <span className="text-4xl md:text-5xl font-black text-white">
                    {billingCycle === 'weekly' ? 'R$ 19,90' : 'R$ 59,90'}
                  </span>
                </div>
                <span className="text-slate-500 font-medium block mt-1">
                  /{billingCycle === 'weekly' ? 'semana' : 'mês'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <div className="bg-purple-500/20 p-1 rounded-full"><Star className="w-3 h-3 text-purple-400 fill-purple-400" /></div>
                  <span className="text-slate-200 font-semibold">Mensagens ILIMITADAS</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-purple-400" /></div>
                  <span className="text-slate-300">Prioridade na fila</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-purple-400" /></div>
                  <span className="text-slate-300">Acesso antecipado a recursos</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-purple-400" /></div>
                  <span className="text-slate-300">Suporte VIP 24/7</span>
                </li>
              </ul>
              <Button
                className="w-full py-6 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-900/50"
                onClick={() => handleSubscribe(billingCycle === 'weekly' ? "premiumWeekly" : "premiumMonthly")}
                disabled={currentPlan.includes('premium') || createCheckoutMutation.isPending}
              >
                {createCheckoutMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : currentPlan.includes('premium') ? (
                  "Seu Plano Atual"
                ) : (
                  "Virar Premium"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Urgency Footer */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-navy-800 border border-yellow-400/30 rounded-2xl p-6 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>
            <p className="text-slate-200 text-lg relative z-10">
              ⚠️ <span className="text-yellow-400 font-bold">ATENÇÃO:</span> Restam apenas <span className="font-black text-white bg-red-600 px-2 py-0.5 rounded mx-1 animate-pulse">{Math.floor(Math.random() * 15) + 7}</span> vagas com o desconto de lançamento. Garanta a sua agora!
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-white">Dúvidas Comuns</h2>
          <div className="grid gap-6">
            <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6 hover:border-coral-500/50 transition-colors">
              <h3 className="font-bold text-lg mb-2 text-white flex items-center gap-3">
                <Zap className="w-5 h-5 text-coral-500" />
                Posso cancelar quando eu quiser?
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Com certeza. Não acreditamos em prender ninguém. Você pode cancelar sua assinatura a qualquer momento nas configurações do seu perfil, sem multas ou letras miúdas.
              </p>
            </div>
            <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6 hover:border-coral-500/50 transition-colors">
              <h3 className="font-bold text-lg mb-2 text-white flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Como funciona a garantia?
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Se você não gostar do app ou não tiver resultados nos primeiros 7 dias, nós devolvemos 100% do seu dinheiro. Risco zero para você.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
