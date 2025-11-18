import { Button } from "@/shared/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/shared/constants/app";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Privacy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl text-gray-800 app-title">{APP_TITLE}</span>
          </div>
          <Button
            onClick={() => setLocation("/app")}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-black text-gray-800 mb-4">
          Política de Privacidade
        </h1>
        <p className="text-gray-600 mb-8">
          Última atualização: Janeiro de 2025
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introdução</h2>
            <p className="text-gray-700 leading-relaxed">
              Bem-vindo ao FlerteChat. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nosso serviço de geração de mensagens de flerte com inteligência artificial.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Informações que Coletamos</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Informações de Conta</h3>
                <p className="text-gray-700 leading-relaxed">
                  Coletamos informações básicas de identificação quando você cria uma conta, incluindo nome, email e método de login (OAuth).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 Conteúdo de Conversas</h3>
                <p className="text-gray-700 leading-relaxed">
                  Armazenamos temporariamente as mensagens que você cola no app e as respostas geradas pela IA para melhorar nosso serviço e fornecer histórico de conversas. Não compartilhamos esse conteúdo com terceiros.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.3 Informações de Pagamento</h3>
                <p className="text-gray-700 leading-relaxed">
                  Processamos pagamentos através do Stripe. Não armazenamos informações completas de cartão de crédito em nossos servidores. Todas as transações são processadas de forma segura pelo Stripe.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.4 Dados de Uso</h3>
                <p className="text-gray-700 leading-relaxed">
                  Coletamos informações sobre como você usa o app, incluindo número de mensagens geradas, plano de assinatura, e preferências de tom de voz.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Como Usamos Suas Informações</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Fornecer e melhorar nosso serviço de geração de mensagens</li>
              <li>Processar pagamentos e gerenciar assinaturas</li>
              <li>Enviar notificações importantes sobre sua conta</li>
              <li>Treinar e melhorar nossos modelos de IA</li>
              <li>Prevenir fraudes e abusos do serviço</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Compartilhamento de Informações</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Não vendemos suas informações pessoais. Compartilhamos dados apenas nas seguintes situações:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Provedores de Serviço:</strong> Stripe para processamento de pagamentos, serviços de hospedagem e infraestrutura</li>
              <li><strong>Requisitos Legais:</strong> Quando exigido por lei ou para proteger nossos direitos legais</li>
              <li><strong>Com Seu Consentimento:</strong> Em outras situações com sua permissão explícita</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Segurança dos Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo criptografia de dados em trânsito e em repouso, controles de acesso rigorosos, e monitoramento contínuo de segurança.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Seus Direitos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Acessar suas informações pessoais</li>
              <li>Corrigir dados incompletos ou incorretos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar consentimento para processamento de dados</li>
              <li>Exportar seus dados em formato estruturado</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Retenção de Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Mantemos suas informações pelo tempo necessário para fornecer nossos serviços e cumprir obrigações legais. Conversas podem ser excluídas automaticamente após 90 dias de inatividade, a menos que você as salve explicitamente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Cookies e Tecnologias Similares</h2>
            <p className="text-gray-700 leading-relaxed">
              Utilizamos cookies essenciais para manter sua sessão ativa e melhorar a experiência do usuário. Você pode gerenciar preferências de cookies nas configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Alterações nesta Política</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas por email ou através do app.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contato</h2>
            <p className="text-gray-700 leading-relaxed">
              Para questões sobre privacidade ou para exercer seus direitos, entre em contato conosco:
            </p>
            <p className="text-gray-700 mt-4">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:pauloromulo2000k@gmail.com"
                className="text-rose-600 hover:text-rose-700 underline"
              >
                pauloromulo2000k@gmail.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
