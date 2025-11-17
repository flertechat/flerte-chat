import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Check, Loader2, ArrowLeft, Flame, Clock, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Plans() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
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
      window.location.href = getLoginUrl();
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
    // Set timer to end at midnight (24 hours from now, reset daily)
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
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/20">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation(isAuthenticated ? "/app" : "/")}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <img src={APP_LOGO} alt="Logo" className="w-10 h-10 object-contain logo-pulse" />
              <span className="font-bold text-2xl text-white drop-shadow-lg app-title">{APP_TITLE}</span>
            </div>
          </div>
          {isAuthenticated && user && (
            <div className="text-sm text-white/90">
              Olá, {user.name || "Usuário"}!
            </div>
          )}
        </div>
      </header>

      {/* Urgency Banner with Countdown */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 border-y-4 border-yellow-300 shadow-2xl">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-300 rounded-full p-3 animate-pulse">
                <Zap className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-white">
                <div className="text-2xl font-black mb-1">
                  🔥 OFERTA RELÂMPAGO - 50% OFF
                </div>
                <div className="text-lg opacity-95">
                  Aproveite antes que acabe! Oferta válida apenas hoje
                </div>
              </div>
            </div>
            
            {/* Countdown Timer */}
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-yellow-300" />
              <div className="flex gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px] text-center border-2 border-yellow-300">
                  <div className="text-3xl font-black text-white">{formatTime(timeLeft.hours)}</div>
                  <div className="text-xs text-yellow-300 font-bold">HORAS</div>
                </div>
                <div className="text-white text-3xl font-bold">:</div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px] text-center border-2 border-yellow-300">
                  <div className="text-3xl font-black text-white">{formatTime(timeLeft.minutes)}</div>
                  <div className="text-xs text-yellow-300 font-bold">MINUTOS</div>
                </div>
                <div className="text-white text-3xl font-bold">:</div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px] text-center border-2 border-yellow-300">
                  <div className="text-3xl font-black text-white">{formatTime(timeLeft.seconds)}</div>
                  <div className="text-xs text-yellow-300 font-bold">SEGUNDOS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16 text-white">
          <h1 className="text-6xl font-black mb-4 drop-shadow-2xl">
            Escolha Seu Plano
          </h1>
          <p className="text-2xl opacity-95 max-w-3xl mx-auto mb-4">
            Comece grátis e faça upgrade quando quiser
          </p>
          <div className="inline-block bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg animate-pulse border-2 border-yellow-300">
            ⚡ APENAS HOJE: 50% DE DESCONTO EM TODOS OS PLANOS!
          </div>
          {isAuthenticated && (
            <Badge className="mt-4 bg-white/20 text-white border-white/40 text-lg px-4 py-2">
              Plano Atual: <span className="font-bold ml-2 capitalize">{currentPlan}</span>
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-white/60 shadow-2xl bg-white hover:scale-105 transition-all">
            <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100 border-b">
              <CardTitle className="text-3xl font-bold">Grátis</CardTitle>
              <CardDescription className="text-lg">Para testar</CardDescription>
              <div className="pt-4">
                <span className="text-5xl font-black">R$ 0</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">10 mensagens grátis</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Todos os tons de voz</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Upload de imagem</span>
              </div>
              <Button
                className="w-full mt-6 bg-gray-600 hover:bg-gray-700"
                onClick={() => (window.location.href = isAuthenticated ? "/app" : getLoginUrl())}
                disabled={currentPlan === "free"}
              >
                {currentPlan === "free" ? "Plano Atual" : "Começar Grátis"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-4 border-rose-500 shadow-2xl bg-white hover:scale-105 transition-all relative">
            <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-sm px-4 py-1">
              <Flame className="w-4 h-4 mr-1 inline" />
              POPULAR
            </Badge>
            <div className="absolute -top-2 -right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce border-2 border-yellow-300">
              -50% HOJE
            </div>
            <CardHeader className="bg-gradient-to-br from-rose-50 to-pink-50 border-b">
              <CardTitle className="text-3xl font-bold text-rose-600">Pro</CardTitle>
              <CardDescription className="text-lg">Para uso regular</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 font-semibold">50 mensagens/semana</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 font-semibold">200 mensagens/mês</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Histórico ilimitado</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Favoritos ilimitados</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="text-center mb-2">
                  <div className="text-sm text-gray-500 line-through">De R$ 19,80</div>
                  <div className="text-2xl font-black text-rose-600">Por apenas R$ 9,90</div>
                </div>
                <Button
                  className="w-full bg-rose-500 hover:bg-rose-600 text-lg font-bold"
                  onClick={() => handleSubscribe("proWeekly")}
                  disabled={currentPlan === "pro_weekly" || createCheckoutMutation.isPending}
                >
                  {createCheckoutMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentPlan === "pro_weekly" ? (
                    "Plano Atual"
                  ) : (
                    <>Semanal - 50% OFF</>
                  )}
                </Button>
                <div className="text-center mb-2">
                  <div className="text-sm text-gray-500 line-through">De R$ 59,80</div>
                  <div className="text-2xl font-black text-rose-600">Por apenas R$ 29,90</div>
                </div>
                <Button
                  className="w-full bg-rose-600 hover:bg-rose-700 text-lg font-bold"
                  onClick={() => handleSubscribe("proMonthly")}
                  disabled={currentPlan === "pro_monthly" || createCheckoutMutation.isPending}
                >
                  {createCheckoutMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentPlan === "pro_monthly" ? (
                    "Plano Atual"
                  ) : (
                    <>Mensal - 50% OFF</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-4 border-orange-500 shadow-2xl bg-white hover:scale-105 transition-all relative">
            <div className="absolute -top-2 -right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce border-2 border-yellow-300">
              -50% HOJE
            </div>
            <CardHeader className="bg-gradient-to-br from-orange-50 to-yellow-50 border-b">
              <CardTitle className="text-3xl font-bold text-orange-600">Premium</CardTitle>
              <CardDescription className="text-lg">Para uso intenso</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 font-semibold">Mensagens ilimitadas</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Prioridade na geração</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Suporte prioritário</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Novos recursos primeiro</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="text-center mb-2">
                  <div className="text-sm text-gray-500 line-through">De R$ 39,80</div>
                  <div className="text-2xl font-black text-orange-600">Por apenas R$ 19,90</div>
                </div>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-lg font-bold"
                  onClick={() => handleSubscribe("premiumWeekly")}
                  disabled={currentPlan === "premium_weekly" || createCheckoutMutation.isPending}
                >
                  {createCheckoutMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentPlan === "premium_weekly" ? (
                    "Plano Atual"
                  ) : (
                    <>Semanal - 50% OFF</>
                  )}
                </Button>
                <div className="text-center mb-2">
                  <div className="text-sm text-gray-500 line-through">De R$ 119,80</div>
                  <div className="text-2xl font-black text-orange-600">Por apenas R$ 59,90</div>
                </div>
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-lg font-bold"
                  onClick={() => handleSubscribe("premiumMonthly")}
                  disabled={currentPlan === "premium_monthly" || createCheckoutMutation.isPending}
                >
                  {createCheckoutMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentPlan === "premium_monthly" ? (
                    "Plano Atual"
                  ) : (
                    <>Mensal - 50% OFF</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgency Message */}
        <div className="mt-12 text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border-2 border-yellow-300">
          <p className="text-white text-xl font-bold">
            ⚠️ <span className="text-yellow-300">ATENÇÃO:</span> Apenas {Math.floor(Math.random() * 15) + 10} vagas restantes com desconto! 
            Não perca essa oportunidade única.
          </p>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center text-white max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4 text-left bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <div>
              <h3 className="font-bold text-xl mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="opacity-90">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem custos adicionais.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Como funciona o teste grátis?</h3>
              <p className="opacity-90">
                Você recebe 10 créditos gratuitos para testar o serviço. Não é necessário cartão de crédito.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Os créditos expiram?</h3>
              <p className="opacity-90">
                Créditos gratuitos não expiram. Créditos de planos pagos são renovados semanalmente ou mensalmente.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">O desconto é real?</h3>
              <p className="opacity-90">
                Sim! Esta é uma oferta especial por tempo limitado. Após o término do cronômetro, os preços voltam ao normal.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
