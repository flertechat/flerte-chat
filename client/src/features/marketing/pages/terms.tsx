import { Button } from "@/shared/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/shared/constants/app";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Terms() {
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
          Termos e Condições
        </h1>
        <p className="text-gray-600 mb-8">
          Última atualização: Janeiro de 2025
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Ao acessar e usar o FlerteChat, você concorda em cumprir e estar vinculado a estes Termos e Condições. Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Descrição do Serviço</h2>
            <p className="text-gray-700 leading-relaxed">
              O FlerteChat é uma plataforma de geração de mensagens de flerte assistida por inteligência artificial. Fornecemos sugestões de respostas baseadas no contexto fornecido pelo usuário, em diferentes tons de voz (Normal, Safado, Engraçado).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Elegibilidade</h2>
            <p className="text-gray-700 leading-relaxed">
              Você deve ter pelo menos 18 anos de idade para usar o FlerteChat. Ao usar nosso serviço, você declara e garante que tem pelo menos 18 anos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Conta de Usuário</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Criação de Conta</h3>
                <p className="text-gray-700 leading-relaxed">
                  Para usar o FlerteChat, você deve criar uma conta fornecendo informações precisas e completas. Você é responsável por manter a confidencialidade de suas credenciais de login.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Responsabilidade da Conta</h3>
                <p className="text-gray-700 leading-relaxed">
                  Você é responsável por todas as atividades que ocorrem em sua conta. Notifique-nos imediatamente se suspeitar de uso não autorizado.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Planos e Pagamentos</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 Planos Disponíveis</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Plano Free:</strong> 10 mensagens gratuitas</li>
                  <li><strong>Plano Pro:</strong> 50 mensagens/semana ou 200 mensagens/mês</li>
                  <li><strong>Plano Premium:</strong> Mensagens ilimitadas</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 Cobrança</h3>
                <p className="text-gray-700 leading-relaxed">
                  Assinaturas são cobradas de forma recorrente (semanal ou mensal) através do Stripe. Você autoriza cobranças automáticas no método de pagamento fornecido.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">5.3 Cancelamento</h3>
                <p className="text-gray-700 leading-relaxed">
                  Você pode cancelar sua assinatura a qualquer momento. O cancelamento será efetivo no final do período de cobrança atual. Não oferecemos reembolsos proporcionais.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">5.4 Alterações de Preço</h3>
                <p className="text-gray-700 leading-relaxed">
                  Reservamo-nos o direito de alterar preços com aviso prévio de 30 dias. Alterações não afetam assinaturas ativas até a renovação.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Uso Aceitável</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Você concorda em NÃO usar o FlerteChat para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Assédio, stalking ou comportamento abusivo</li>
              <li>Enviar spam ou conteúdo não solicitado</li>
              <li>Violar leis locais, estaduais ou federais</li>
              <li>Personificar outras pessoas ou entidades</li>
              <li>Compartilhar conteúdo ilegal, difamatório ou obsceno</li>
              <li>Tentar burlar limitações de créditos ou assinaturas</li>
              <li>Fazer engenharia reversa ou copiar nosso serviço</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Propriedade Intelectual</h2>
            <p className="text-gray-700 leading-relaxed">
              O FlerteChat e todo o seu conteúdo, recursos e funcionalidades são de propriedade exclusiva da FlerteChat e são protegidos por leis de direitos autorais, marcas registradas e outras leis de propriedade intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Conteúdo Gerado por IA</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">8.1 Natureza das Sugestões</h3>
                <p className="text-gray-700 leading-relaxed">
                  As mensagens geradas são sugestões criadas por IA e não garantimos que sejam sempre apropriadas ou eficazes. Use seu próprio julgamento ao enviar mensagens.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">8.2 Responsabilidade do Usuário</h3>
                <p className="text-gray-700 leading-relaxed">
                  Você é totalmente responsável pelas mensagens que escolhe enviar. O FlerteChat não se responsabiliza por consequências resultantes do uso de nossas sugestões.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Isenção de Garantias</h2>
            <p className="text-gray-700 leading-relaxed">
              O serviço é fornecido "como está" e "conforme disponível". Não garantimos que o serviço será ininterrupto, seguro ou livre de erros. Não garantimos resultados específicos no uso de nossas sugestões.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 leading-relaxed">
              Em nenhuma circunstância a FlerteChat será responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros, dados, uso ou outros danos intangíveis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Suspensão e Encerramento</h2>
            <p className="text-gray-700 leading-relaxed">
              Reservamo-nos o direito de suspender ou encerrar sua conta a qualquer momento, sem aviso prévio, por violação destes termos ou por qualquer outra razão que considerarmos apropriada.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Modificações dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos modificar estes Termos a qualquer momento. Notificaremos você sobre mudanças materiais. O uso continuado do serviço após as mudanças constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Lei Aplicável</h2>
            <p className="text-gray-700 leading-relaxed">
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida nos tribunais brasileiros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">14. Contato</h2>
            <p className="text-gray-700 leading-relaxed">
              Para questões sobre estes Termos, entre em contato conosco:
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

          <section className="border-t pt-8">
            <p className="text-gray-600 text-sm italic">
              Ao usar o FlerteChat, você reconhece que leu, entendeu e concorda em estar vinculado a estes Termos e Condições.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
