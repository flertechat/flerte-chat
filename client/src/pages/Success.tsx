import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";
import { CheckCircle, ArrowRight, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Success() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      setLocation("/app");
    }, 5000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={APP_LOGO} alt="Logo" className="w-16 h-16 object-contain" />
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-lg opacity-50"></div>
            <CheckCircle className="w-24 h-24 text-green-500 relative" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Parabéns!
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            Seu plano foi ativado com sucesso
          </p>
          <p className="text-sm text-gray-600">
            Você agora tem acesso completo a todos os recursos do {APP_TITLE}
          </p>
        </div>

        {/* Plan Details */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border-2 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-green-500" />
            <h3 className="font-bold text-gray-900">Seu plano está ativo</h3>
          </div>
          <p className="text-sm text-gray-600">
            Você pode começar a usar o {APP_TITLE} agora mesmo para gerar mensagens de flerte personalizadas com os 3 tons de voz disponíveis.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => setLocation("/app")}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 font-bold text-lg py-6 rounded-lg shadow-lg flex items-center justify-center gap-2"
          >
            Acessar o App
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="w-full font-bold text-gray-900 border-2 border-gray-300 hover:bg-gray-50 py-6"
          >
            Voltar para Home
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          Você será redirecionado automaticamente em 5 segundos...
        </p>
      </div>
    </div>
  );
}
