import { Button } from "@/shared/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/shared/constants/app";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function FAQ() {
  const [, setLocation] = useLocation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Como funciona o FlerteChat?",
      answer: "O FlerteChat usa inteligência artificial para gerar respostas personalizadas para suas conversas de flerte. Você cola a mensagem que recebeu, escolhe o tom (Normal, Safado ou Engraçado) e recebe 3 opções de resposta criativas e naturais."
    },
    {
      question: "Quantos créditos eu ganho gratuitamente?",
      answer: "Todos os novos usuários recebem 10 créditos gratuitos para testar o serviço. Cada geração de mensagens consome 1 crédito e fornece 3 opções de resposta."
    },
    {
      question: "Como funcionam os planos pagos?",
      answer: "Oferecemos três planos: Free (10 mensagens grátis), Pro (50 mensagens/semana ou 200/mês) e Premium (ilimitado). Os planos Pro e Premium têm opções semanais e mensais com preços diferenciados."
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Sim! Você pode cancelar sua assinatura a qualquer momento sem custos adicionais. O cancelamento será efetivo no final do período de cobrança atual e você manterá acesso até lá."
    },
    {
      question: "Os créditos expiram?",
      answer: "Créditos gratuitos não expiram. Créditos de planos pagos são renovados automaticamente no início de cada período (semanal ou mensal) e não acumulam."
    },
    {
      question: "As mensagens geradas são naturais?",
      answer: "Sim! Nossa IA foi treinada para gerar mensagens que soam naturais e autênticas. Milhares de usuários já usaram com sucesso e relatam que ninguém percebe que foi gerado por IA."
    },
    {
      question: "Vocês armazenam minhas conversas?",
      answer: "Armazenamos temporariamente suas conversas para fornecer histórico e melhorar o serviço, mas nunca compartilhamos com terceiros. Você pode excluir suas conversas a qualquer momento."
    },
    {
      question: "Posso usar em qualquer app de mensagens?",
      answer: "Sim! O FlerteChat funciona com qualquer plataforma - WhatsApp, Instagram, Tinder, Bumble, etc. Você só precisa copiar a mensagem que recebeu e colar no nosso app."
    },
    {
      question: "E se eu não gostar das respostas geradas?",
      answer: "Você pode gerar novas respostas quantas vezes quiser (consumindo 1 crédito por geração). Também pode alternar entre os tons de voz para obter estilos diferentes."
    },
    {
      question: "Como funciona o pagamento?",
      answer: "Processamos todos os pagamentos de forma segura através do Stripe. Aceitamos cartões de crédito e débito. Suas informações de pagamento são criptografadas e nunca armazenadas em nossos servidores."
    },
    {
      question: "Vocês oferecem reembolso?",
      answer: "Oferecemos garantia de satisfação de 7 dias. Se você não estiver satisfeito com o serviço, entre em contato conosco dentro de 7 dias da compra para solicitar reembolso total."
    },
    {
      question: "O serviço funciona em português?",
      answer: "Sim! O FlerteChat foi desenvolvido especificamente para o português brasileiro, com gírias, expressões e contexto cultural apropriados."
    },
    {
      question: "Posso usar para conversas profissionais?",
      answer: "O FlerteChat foi projetado especificamente para conversas de flerte e relacionamento. Para comunicação profissional, recomendamos outras ferramentas mais adequadas."
    },
    {
      question: "Como entro em contato com o suporte?",
      answer: "Você pode nos contatar através do email pauloromulo2000k@gmail.com ou usar o formulário de contato no rodapé do app. Respondemos em até 24 horas."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim! Levamos a segurança muito a sério. Usamos criptografia de ponta a ponta, seguimos as melhores práticas de segurança e estamos em conformidade com a LGPD (Lei Geral de Proteção de Dados)."
    }
  ];

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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-800 mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-xl text-gray-600">
            Tudo que você precisa saber sobre o FlerteChat
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between text-left py-4 hover:text-rose-600 transition-colors"
              >
                <span className="font-bold text-lg text-gray-800 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-rose-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="pb-4 pr-12">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Não encontrou sua resposta?
          </h2>
          <p className="text-lg mb-6 opacity-95">
            Nossa equipe está pronta para ajudar você!
          </p>
          <Button
            onClick={() => setLocation("/app")}
            variant="secondary"
            size="lg"
            className="bg-white text-rose-600 hover:bg-gray-100 font-bold"
          >
            Entre em Contato
          </Button>
        </div>
      </main>
    </div>
  );
}
