import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { APP_LOGO, APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, AlertCircle, CheckCircle, Calendar, Zap } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Subscription() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const subscriptionQuery = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const cancelMutation = trpc.subscription.cancel.useMutation({
    onSuccess: () => {
      toast.success("Assinatura cancelada! Você ainda pode usar seus créditos.");
      setShowCancelModal(false);
      subscriptionQuery.refetch();
    },
    onError: (error: any) => {
      toast.error("Erro ao cancelar assinatura: " + error.message);
    },
  });

  if (!isAuthenticated) {
    return null;
  }

  const subscription = subscriptionQuery.data;
  const isActive = subscription?.status === "active";
  const isCancelled = subscription?.status === "cancelled";
  const isFree = subscription?.plan === "free";

  const getPlanName = (plan: string) => {
    const planNames: Record<string, string> = {
      free: "Grátis",
      proWeekly: "Pro Semanal",
      proMonthly: "Pro Mensal",
      premiumWeekly: "Premium Semanal",
      premiumMonthly: "Premium Mensal",
    };
    return planNames[plan] || plan;
  };

  const getStatusBadge = () => {
    if (isFree) {
      return <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-200 text-gray-800">Plano Gratuito</span>;
    }
    if (isActive) {
      return <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-200 text-green-800">Ativo</span>;
    }
    if (isCancelled) {
      return <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-200 text-yellow-800">Cancelado</span>;
    }
    return null;
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/20">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            onClick={() => setLocation("/app")}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl text-white">{APP_TITLE}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Gerenciar Assinatura</h1>
          <p className="text-gray-600 mb-8">Visualize e gerencie sua assinatura atual</p>

          {/* Plano Atual */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-8 mb-8 border-2 border-rose-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {getPlanName(subscription?.plan || "free")}
                </h2>
                <div className="flex items-center gap-2">
                  {getStatusBadge()}
                </div>
              </div>
              <Zap className="w-12 h-12 text-orange-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Créditos */}
              <div className="bg-white rounded-lg p-4 border border-rose-200">
                <p className="text-sm text-gray-600 mb-1">Créditos Restantes</p>
                <p className="text-3xl font-black text-rose-600">
                  {subscription?.creditsTotal === -1 ? "∞" : subscription?.creditsRemaining || 0}
                </p>
                {subscription?.creditsTotal !== -1 && (
                  <p className="text-xs text-gray-500 mt-1">
                    de {subscription?.creditsTotal || 0} total
                  </p>
                )}
              </div>

              {/* Data de Início */}
              <div className="bg-white rounded-lg p-4 border border-rose-200">
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data de Início
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDate(subscription?.startDate)}
                </p>
              </div>

              {/* Data de Renovação */}
              <div className="bg-white rounded-lg p-4 border border-rose-200">
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Próxima Renovação
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {isFree || isCancelled ? "N/A" : formatDate(subscription?.endDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {isCancelled && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-yellow-800 mb-1">Assinatura Cancelada</h3>
                  <p className="text-sm text-yellow-700">
                    Sua assinatura foi cancelada. Você pode continuar usando seus créditos até o final. 
                    Quando os créditos acabarem, você voltará ao plano Gratuito com 10 créditos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isActive && !isFree && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-800 mb-1">Assinatura Ativa</h3>
                  <p className="text-sm text-green-700">
                    Sua assinatura está ativa e será renovada automaticamente na data de renovação.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isFree && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-800 mb-1">Plano Gratuito</h3>
                  <p className="text-sm text-blue-700">
                    Você está usando o plano gratuito. Escolha um plano pago para obter mais créditos!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setLocation("/plans")}
              className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-lg h-12 rounded-lg"
            >
              Ver Planos
            </Button>

            {isActive && !isFree && (
              <Button
                onClick={() => setShowCancelModal(true)}
                variant="outline"
                className="flex-1 border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold text-lg h-12 rounded-lg"
              >
                Cancelar Assinatura
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Confirmação de Cancelamento */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Cancelar Assinatura?</DialogTitle>
            <DialogDescription className="text-base mt-4">
              <div className="space-y-4">
                <p>
                  Você tem certeza que deseja cancelar sua assinatura de <strong>{getPlanName(subscription?.plan || "")}</strong>?
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-900 mb-2">✓ Você mantém seus créditos</p>
                  <p className="text-sm text-green-800">
                    Seus {subscription?.creditsRemaining} créditos restantes continuarão disponíveis para usar.
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-yellow-900 mb-2">⚠ Sem renovação automática</p>
                  <p className="text-sm text-yellow-800">
                    A renovação automática será cancelada. Não há reembolso.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => setShowCancelModal(false)}
              variant="outline"
              className="flex-1"
            >
              Manter Assinatura
            </Button>
            <Button
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {cancelMutation.isPending ? "Cancelando..." : "Sim, Cancelar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
