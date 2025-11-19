import { memo } from "react";
import { APP_LOGO, APP_TITLE } from "@/shared/constants/app";
import { Mail, MessageSquare } from "lucide-react";
import { useLocation } from "wouter";

interface DashboardFooterProps {
  onContactClick: () => void;
}

export const DashboardFooter = memo(({ onContactClick }: DashboardFooterProps) => {
  const [, setLocation] = useLocation();

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={APP_LOGO} alt="Logo" className="w-8 h-8 object-contain logo-pulse" />
              <span className="font-bold text-xl app-title">{APP_TITLE}</span>
            </div>
            <p className="text-gray-400 text-sm italic mb-4">
              "Sua arma secreta para quebrar o gelo"
            </p>
            <p className="text-gray-400 text-sm">
              © 2025 FlerteChat. Todos os direitos reservados.
            </p>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">Suporte</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="mailto:pauloromulo2000k@gmail.com"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email de Suporte
                </a>
              </li>
              <li>
                <button
                  onClick={onContactClick}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contate-nos
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => setLocation("/privacy")}
                  className="hover:text-white transition-colors"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLocation("/terms")}
                  className="hover:text-white transition-colors"
                >
                  Termos e Condições
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/faq")} className="hover:text-white transition-colors">
                  Perguntas Frequentes
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">Empresa</h3>
            <p className="text-gray-400 text-sm mb-2">FlerteChat</p>
            <p className="text-gray-400 text-sm">
              Transformando conversas em conexões reais desde 2025.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

DashboardFooter.displayName = "DashboardFooter";
