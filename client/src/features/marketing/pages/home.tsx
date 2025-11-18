import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/shared/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/shared/constants/app";
import { Sparkles, MessageCircle, Zap, Heart, Check, Star, TrendingUp, Moon, Flame } from "lucide-react";
import { useLocation } from "wouter";
import { useScrollAnimation } from "@/shared/hooks/hooks/useScrollAnimation";
import { BackToTop } from "@/shared/components/back-to-top";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { CountdownBanner } from "@/features/subscription/components/countdown-banner";
import { OnlineUsersBadge } from "@/shared/components/online-users-badge";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { cycleTheme } = useTheme();
  const [, setLocation] = useLocation();

  // Refs for scroll animations
  const heroRef = useScrollAnimation<HTMLDivElement>();
  const statsRef = useScrollAnimation<HTMLDivElement>();
  const howItWorksRef = useScrollAnimation<HTMLDivElement>();
  const whyChooseRef = useScrollAnimation<HTMLDivElement>();
  const testimonialsRef = useScrollAnimation<HTMLDivElement>();
  const ctaRef = useScrollAnimation<HTMLDivElement>();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setLocation("/app");
    } else {
      setLocation("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Countdown Banner */}
      <CountdownBanner />

      {/* Header */}
      <header className="bg-white dark:bg-card shadow-sm sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src={APP_LOGO} alt="FlerteChat" className="h-8 md:h-10 object-contain logo-pulse" />
          </div>
          <div className="flex items-center gap-1 md:gap-6">
            <a href="#como-funciona" className="hidden sm:block text-gray-700 hover:text-gray-900 text-xs md:text-sm font-medium border-b-2 border-dotted border-transparent hover:border-gray-400 transition-all">
              Como funciona?
            </a>
            <a href="#faq" className="hidden md:block text-gray-700 hover:text-gray-900 text-sm font-medium border-b-2 border-dotted border-transparent hover:border-gray-400 transition-all">
              Perguntas frequentes
            </a>
            <a href="#avaliacoes" className="hidden md:block text-gray-700 hover:text-gray-900 text-sm font-medium border-b-2 border-dotted border-transparent hover:border-gray-400 transition-all">
              Avaliações
            </a>
            <Button
              onClick={() => setLocation("/plans")}
              className="text-gray-700 hover:text-gray-900 text-xs md:text-sm font-medium border-b-2 border-dotted border-transparent hover:border-gray-400 transition-all bg-transparent hover:bg-transparent shadow-none"
            >
              Planos
            </Button>
            <Button
              onClick={cycleTheme}
              variant="ghost"
              size="icon"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-8 w-8 md:h-10 md:w-10"
              title="Mudar tema"
            >
              <Moon className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 font-bold text-xs md:text-sm px-3 md:px-6 py-2 rounded-full shadow-lg"
            >
              {isAuthenticated ? "App" : "Grátis"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section com Chat Demo */}
      <section className="theme-flerte bg-theme-gradient py-8 md:py-16 relative overflow-hidden">
        {/* Flame icons decorativos */}
        <div className="absolute top-10 left-10 opacity-10">
          <Flame className="w-32 h-32 text-white" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <Flame className="w-40 h-40 text-white" />
        </div>

      <main className="container max-w-7xl mx-auto px-3 md:px-4 relative z-10">
        <div ref={heroRef} className="scroll-animate grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-20">
          {/* Left: Headline + CTA */}
          <div className="text-white text-center lg:text-left">
            {/* Badge de pessoas online */}
            <div className="flex justify-center lg:justify-start mb-4">
              <OnlineUsersBadge />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 leading-tight">
              Nunca Mais Fique no Vácuo 🔥
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-3 md:mb-4 opacity-95 font-semibold">
              Transforme qualquer mensagem em uma resposta que deixa a pessoa querendo mais
            </p>
            <p className="text-sm sm:text-base md:text-lg mb-6 md:mb-8 opacity-85">
              IA treinada com <strong>91.600 mensagens reais</strong> de flerte. Respostas safadas, engraçadas ou românticas em 3 segundos.
            </p>
            
            {/* Avatares de usuários */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6 md:mb-8">
              <div className="flex -space-x-2 md:-space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white overflow-hidden bg-white">
                  <img src="/avatar-1.jpg" alt="Usuário satisfeito do FlerteChat" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white overflow-hidden bg-white">
                  <img src="/avatar-2.jpg" alt="Usuária satisfeita do FlerteChat" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white overflow-hidden bg-white">
                  <img src="/avatar-3.jpg" alt="Usuário feliz do FlerteChat" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white overflow-hidden bg-white">
                  <img src="/avatar-4.jpg" alt="Usuária feliz do FlerteChat" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xs md:text-sm">
                  +3
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm mb-6 md:mb-8 opacity-90 font-bold flex items-center justify-center lg:justify-start gap-2">
              <Flame className="w-4 h-4 text-yellow-300" />
              Junte-se a <strong>milhares</strong> conquistando dates agora!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Button
                onClick={() => setLocation("/app")}
                size="lg"
                className="bg-white text-pink-600 hover:bg-gray-100 text-base md:text-xl px-8 md:px-12 py-4 md:py-6 font-black shadow-2xl rounded-2xl w-full sm:w-auto hover:scale-105 transition-transform"
              >
                <Flame className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-pink-600" />
                Começar Grátis
              </Button>
              <Button
                onClick={() => setLocation("/plans")}
                variant="outline"
                size="lg"
                className="bg-white/10 border-2 border-white text-white hover:bg-white/20 font-semibold px-6 md:px-8 py-4 md:py-6 rounded-2xl w-full sm:w-auto hover:scale-105 transition-transform"
              >
                Ver Planos 🔥
              </Button>
            </div>
          </div>

          {/* Right: Chat Demo com círculos decorativos */}
          <div className="relative mt-8 lg:mt-0">
            {/* Círculos decorativos - ocultos em mobile */}
            <div className="hidden lg:block absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-orange-400/40 to-orange-500/40 blur-3xl"></div>
            <div className="hidden lg:block absolute -top-10 -right-10 w-80 h-80 rounded-full bg-gradient-to-br from-orange-300/30 to-pink-400/30 blur-2xl"></div>
            <div className="hidden lg:block absolute top-10 right-10 w-64 h-64 rounded-full bg-gradient-to-br from-pink-300/20 to-orange-300/20 blur-xl"></div>
            
            {/* iPhone Mockup */}
            <div className="relative z-10 mx-auto w-[280px] sm:w-[320px] bg-black rounded-[2.5rem] sm:rounded-[3rem] p-2 sm:p-3 shadow-2xl">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20"></div>
              
              {/* Screen */}
              <div className="bg-white rounded-[2.5rem] overflow-hidden h-[600px] relative">
                {/* Status Bar */}
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between text-xs">
                  <span className="font-semibold">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-3 border border-gray-400 rounded-sm"></div>
                  </div>
                </div>
                
                {/* Chat Header */}
                <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-200 bg-white">
                    <img src="/maria-avatar.jpg" alt="Maria" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Maria</div>
                    <div className="text-xs text-green-500">Online</div>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="p-4 space-y-4 bg-gray-50 h-[480px]">
                  {/* Mensagem recebida 1 */}
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[75%] shadow-sm">
                      <p className="text-sm text-gray-800">Oi Mateus, faz dias que te vi, hein?</p>
                    </div>
                  </div>
                  
                  {/* Mensagem enviada (IA) */}
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%] shadow-md">
                      <p className="text-sm text-white font-medium">Tá com saudade é, bb? Bora marcar de se ver então... se o clima esquentar, já sabe né?! 😏🔥</p>
                    </div>
                  </div>

                  {/* Mensagem recebida 2 */}
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[75%] shadow-sm">
                      <p className="text-sm text-gray-800">O que você tem em mente pro "esquentar"?</p>
                      <p className="text-xs text-gray-500 mt-1">10:45</p>
                    </div>
                  </div>

                  {/* Mensagem enviada 2 (IA) */}
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%] shadow-md">
                      <p className="text-sm text-white font-medium">Hmm, primeiro um drink pra relaxar... depois eu te mostro como eu sei esquentar bem as coisas 😈💋</p>
                    </div>
                  </div>

                  {/* Mensagem enviada 3 (IA) */}
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%] shadow-md">
                      <p className="text-sm text-white font-medium">Você vai descobrir... 😏✨</p>
                    </div>
                  </div>
                  
                  {/* Input area */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                    <span className="text-sm text-gray-400 flex-1">Message</span>
                    <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div ref={statsRef} className="scroll-animate bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-black mb-2">10.000+</div>
              <div className="text-lg opacity-90">Mensagens Geradas</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">4.9/5</div>
              <div className="text-lg opacity-90 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                Avaliação Média
              </div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">95%</div>
              <div className="text-lg opacity-90">Taxa de Sucesso</div>
            </div>
          </div>
        </div>
      </main>
      </section>

      {/* Carrossel de Demonstração */}
      <section className="bg-white py-8 md:py-16">
        <main className="container max-w-7xl mx-auto px-3 md:px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 md:mb-4">
              Veja a IA em Ação
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Exemplos reais de mensagens e as 3 respostas geradas: Normal, Safado e Engraçado
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Carrossel Container */}
            <div className="overflow-x-auto snap-x snap-mandatory flex gap-4 md:gap-6 pb-4 scrollbar-hide">
              {/* Exemplo 1 */}
              <div className="flex-shrink-0 w-full snap-center">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
                  <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 mb-4 md:mb-6 shadow-md">
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 font-semibold">MENSAGEM RECEBIDA:</p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 font-medium">"Oi! Vi que você gosta de viajar. Qual foi o lugar mais legal que você já foi?"</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                      <p className="text-xs font-bold text-blue-600 mb-2">💬 NORMAL</p>
                      <p className="text-sm text-gray-800">"Oi! Sim, adoro viajar! O lugar mais incrível foi a Grécia, as praias são de outro mundo. E você, gosta de viajar também?"</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                      <p className="text-xs font-bold text-red-600 mb-2">🔥 SAFADO</p>
                      <p className="text-sm text-gray-800">"Grécia foi incrível, mas confesso que tô mais interessado em explorar novos territórios por aqui... que tal a gente começar com um drink? 😏"</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
                      <p className="text-xs font-bold text-yellow-600 mb-2">😂 ENGRAÇADO</p>
                      <p className="text-sm text-gray-800">"Grécia! Mas o lugar mais legal mesmo foi a padaria da esquina às 3h da manhã... aquele pão de queijo não tem preço 😂"</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exemplo 2 */}
              <div className="flex-shrink-0 w-full snap-center">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
                  <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 mb-4 md:mb-6 shadow-md">
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 font-semibold">MENSAGEM RECEBIDA:</p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 font-medium">"Que foto linda! Você é modelo?"</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                      <p className="text-xs font-bold text-blue-600 mb-2">💬 NORMAL</p>
                      <p className="text-sm text-gray-800">"Obrigado! Não sou modelo não, só gosto de tirar umas fotos legais. Você também curte fotografia?"</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                      <p className="text-xs font-bold text-red-600 mb-2">🔥 SAFADO</p>
                      <p className="text-sm text-gray-800">"Modelo só nas horas vagas 😏 Mas confesso que você tem bom gosto... bora marcar e eu te mostro meu lado mais 'profissional'? 👀"</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
                      <p className="text-xs font-bold text-yellow-600 mb-2">😂 ENGRAÇADO</p>
                      <p className="text-sm text-gray-800">"Modelo? Só de papel machê que eu fiz na escola 😂 Mas valeu, você tem bom gosto pra elogios hein!"</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exemplo 3 */}
              <div className="flex-shrink-0 w-full snap-center">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
                  <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 mb-4 md:mb-6 shadow-md">
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 font-semibold">MENSAGEM RECEBIDA:</p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 font-medium">"Oi sumido! Faz tempo que não te vejo por aqui..."</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                      <p className="text-xs font-bold text-blue-600 mb-2">💬 NORMAL</p>
                      <p className="text-sm text-gray-800">"Oi! Verdade, andei meio ocupado. Mas agora tô de volta! Como você tem passado?"</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                      <p className="text-xs font-bold text-red-600 mb-2">🔥 SAFADO</p>
                      <p className="text-sm text-gray-800">"Sumido mas não esquecido 😏 Tô com saudade... bora matar essa saudade pessoalmente? Prometo compensar o tempo perdido 🔥"</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
                      <p className="text-xs font-bold text-yellow-600 mb-2">😂 ENGRAÇADO</p>
                      <p className="text-sm text-gray-800">"Sumido? Eu tô aqui o tempo todo, você que não olha pro lado certo 😂 Bora marcar um café pra eu te ensinar a me achar?"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Indicador de scroll */}
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-pink-500"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
            
            <p className="text-center text-gray-500 mt-4 text-sm">
              ← Arraste para ver mais exemplos →
            </p>
          </div>
        </main>
      </section>

      {/* Como Funciona */}
      <section className="bg-white py-10 md:py-16">
      <main className="container max-w-7xl mx-auto px-3 md:px-4">
        <div id="como-funciona" ref={howItWorksRef} className="scroll-animate">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 text-center mb-8 md:mb-12">
            Como Funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 text-center shadow-2xl transform hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                1
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Cole a Mensagem</h3>
              <p className="text-gray-600 text-base md:text-lg">
                Copie a mensagem que você recebeu e cole no app
              </p>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 text-center shadow-2xl transform hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                2
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Escolha o Tom</h3>
              <p className="text-gray-600 text-base md:text-lg">
                Normal, Safado ou Engraçado - você decide o estilo
              </p>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 text-center shadow-2xl transform hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Copie e Envie</h3>
              <p className="text-gray-600 text-base md:text-lg">
                Escolha entre 3 opções e mande a melhor resposta
              </p>
            </div>
          </div>
        </div>
      </main>
      </section>

      {/* Features com Imagens */}
      <section className="bg-theme-gradient py-10 md:py-16">
      <main className="container max-w-7xl mx-auto px-4">
        <div ref={whyChooseRef} className="scroll-animate">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white text-center mb-12 drop-shadow-xl">
            Por Que Escolher o Flerte Chat?
          </h2>
          
          {/* Feature 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <img 
                src="/couple-flirting.jpg" 
                alt="Casal flertando" 
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="text-white order-1 lg:order-2">
              <div className="inline-block bg-rose-600 rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-bold">🔥 MAIS POPULAR</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6">Respostas que Funcionam de Verdade</h3>
              <p className="text-xl mb-6 opacity-95">
                Nossa IA foi treinada com milhares de conversas reais. Ela entende o contexto e gera 
                respostas naturais que parecem escritas por você.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-lg" style={{fontWeight: '600'}}>100% brasileiro - com gírias e expressões autênticas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-lg" style={{fontWeight: '600'}}>3 opções diferentes para cada situação</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-lg" style={{fontWeight: '600'}}>Geração instantânea em menos de 3 segundos</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-block bg-orange-600 rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-bold">⚡ SUPER RÁPIDO</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6">Nunca Mais Deixe no Vácuo</h3>
              <p className="text-xl mb-6 opacity-95">
                Acabou aquela ansiedade de não saber o que responder. Com o Flerte Chat, 
                você sempre tem a resposta perfeita na ponta dos dedos.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-lg" style={{fontWeight: '600'}}>Responda em segundos, não em horas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-lg" style={{fontWeight: '600'}}>Mantenha a conversa sempre fluindo</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-lg" style={{fontWeight: '600'}}>Impressione com respostas criativas</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src="/couple-texting.jpg" 
                alt="Casal usando celular" 
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </main>
      </section>

      {/* Depoimentos */}
      <section className="bg-white py-10 md:py-16">
      <main className="container max-w-7xl mx-auto px-3 md:px-4">
        <div id="avaliacoes" ref={testimonialsRef} className="scroll-animate">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 text-center mb-8 md:mb-12">
            O Que Nossos Usuários Dizem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg" style={{fontWeight: '600'}}>
                "Cara, esse app salvou minha vida! Tava travado numa conversa e o Flerte Chat 
                me deu UMA resposta que fez ela rir demais. Agora a gente tá saindo 😂"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 bg-white">
                  <img src="/avatar-1.jpg" alt="Rafael" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Rafael, 25</div>
                  <div className="text-sm text-gray-500">São Paulo, SP</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-base md:text-lg" style={{fontWeight: '600'}}>
                "Melhor investimento que fiz! As respostas são tão naturais que ninguém 
                percebe que foi IA. Já consegui 3 dates esse mês 🔥"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 bg-white">
                  <img src="/avatar-2.jpg" alt="Marcos" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Marcos, 28</div>
                  <div className="text-sm text-gray-500">Rio de Janeiro, RJ</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-base md:text-lg">
                "Eu sou péssima pra flertar por texto, mas com esse app eu pareço 
                profissional! Recomendo demais ❤️"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 bg-white">
                  <img src="/avatar-3.jpg" alt="Carolina" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Carolina, 23</div>
                  <div className="text-sm text-gray-500">Belo Horizonte, MG</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </section>

      {/* Planos e Preços */}
      <section className="bg-white py-10 md:py-20">
        <main className="container max-w-7xl mx-auto px-3 md:px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 md:mb-4">
              Escolha Seu Plano
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Comece grátis e desbloqueie recursos premium quando precisar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto">
            {/* Plano Free */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all">
              <div className="text-center mb-6">
                <h3 className="text-xl font-black text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-black text-gray-900 mb-2">R$0</div>
                <p className="text-gray-500 text-sm">Para começar</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm"><strong>10 mensagens</strong>/mês</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">3 estilos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm">Sem suporte</span>
                </li>
              </ul>
              <Button
                onClick={handleGetStarted}
                variant="outline"
                className="w-full text-sm py-4 font-bold border-2 border-gray-300 hover:bg-gray-50"
              >
                Começar Grátis
              </Button>
            </div>

            {/* Plano Pro Semanal */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 shadow-xl border-3 border-pink-300 hover:shadow-2xl transition-all transform hover:scale-105 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-black text-xs shadow-lg">
                ⭐ POPULAR
              </div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-black text-white mb-1">Pro Semanal</h3>
                <div className="text-3xl font-black text-white mb-1">R$9,90</div>
                <p className="text-pink-100 text-xs">200 msg/mês</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-xs"><strong>200</strong> msg/mês</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-xs">3 estilos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-xs">Suporte</span>
                </li>
              </ul>
              <Button
                onClick={() => setLocation("/plans")}
                className="w-full text-xs py-3 font-black bg-white text-pink-600 hover:bg-gray-100 shadow-lg"
              >
                Assinar
              </Button>
            </div>

            {/* Plano Pro Mensal */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all">
              <div className="text-center mb-6">
                <h3 className="text-lg font-black text-gray-900 mb-1">Pro Mensal</h3>
                <div className="text-3xl font-black text-gray-900 mb-1">R$29,90</div>
                <p className="text-gray-500 text-xs">50 msg/semana</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-xs"><strong>50</strong> msg/sem</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-xs">3 estilos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-xs">Suporte</span>
                </li>
              </ul>
              <Button
                onClick={() => setLocation("/plans")}
                variant="outline"
                className="w-full text-xs py-3 font-bold border-2 border-gray-900 hover:bg-gray-900 hover:text-white"
              >
                Assinar
              </Button>
            </div>

            {/* Plano Premium Semanal */}
            <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl p-6 shadow-xl border-3 border-violet-300 hover:shadow-2xl transition-all">
              <div className="text-center mb-6">
                <h3 className="text-lg font-black text-white mb-1">Premium Semanal</h3>
                <div className="text-3xl font-black text-white mb-1">R$19,90</div>
                <p className="text-violet-100 text-xs">Ilimitado/semana</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-xs"><strong>Ilimitado</strong>/sem</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-xs">3 estilos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-xs">Suporte</span>
                </li>
              </ul>
              <Button
                onClick={() => setLocation("/plans")}
                className="w-full text-xs py-3 font-black bg-white text-violet-600 hover:bg-gray-100 shadow-lg"
              >
                Assinar
              </Button>
            </div>

            {/* Plano Premium Mensal */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl border-3 border-purple-400 hover:shadow-2xl transition-all relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-black text-xs shadow-lg">
                ⭐ MELHOR
              </div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-black text-white mb-1">Premium Mensal</h3>
                <div className="text-3xl font-black text-white mb-1">R$59,90</div>
                <p className="text-purple-100 text-xs">Ilimitado/mês</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-xs"><strong>Ilimitado</strong>/mês</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-xs">3 estilos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-xs">VIP 24/7</span>
                </li>
              </ul>
              <Button
                onClick={() => setLocation("/plans")}
                className="w-full text-xs py-3 font-black bg-white text-purple-600 hover:bg-gray-100 shadow-lg"
              >
                Assinar
              </Button>
            </div>
          </div>
          
          <p className="text-center text-gray-500 mt-12 text-sm">
            Todos os planos incluem garantia de 7 dias. Cancele quando quiser, sem complicação.
          </p>
        </main>
      </section>

      {/* Segurança e LGPD */}
      <section className="bg-gray-50 py-10 md:py-16">
        <main className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Sua Privacidade é Nossa Prioridade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Protegemos seus dados com os mais altos padrões de segurança
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Criptografia de Ponta</h3>
              <p className="text-gray-600">
                Todas as suas mensagens são criptografadas com AES-256, o mesmo padrão usado por bancos.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Conforme LGPD</h3>
              <p className="text-gray-600">
                100% em conformidade com a Lei Geral de Proteção de Dados brasileira. Seus dados são seus.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Armazenamento Temporário</h3>
              <p className="text-gray-600">
                Suas mensagens são processadas e deletadas automaticamente após 24 horas. Zero histórico permanente.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              Não compartilhamos, vendemos ou armazenamos suas conversas. Nosso compromisso é com sua privacidade e segurança.
            </p>
          </div>
        </main>
      </section>

      {/* CTA Final */}
      <section className="bg-theme-gradient py-10 md:py-16">
      <main className="container max-w-7xl mx-auto px-3 md:px-4">
        <div ref={ctaRef} className="scroll-animate text-center bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-16 border-2 border-white/30 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-6 drop-shadow-xl">
            Pronto para Impressionar?
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-6 md:mb-8 max-w-3xl mx-auto">
            Junte-se a milhares de pessoas que já estão conquistando com mensagens irresistíveis. 
            <span className="font-bold"> Comece grátis agora!</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-rose-600 hover:bg-gray-100 text-lg sm:text-xl md:text-2xl px-8 sm:px-12 md:px-16 py-6 sm:py-7 md:py-8 font-black shadow-2xl"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-2 md:mr-3" />
              Começar Grátis
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
            <div className="bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/20">
              <p className="text-white font-black text-center text-sm sm:text-base md:text-lg">Sem cartão de crédito</p>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/20">
              <p className="text-white font-black text-center text-sm sm:text-base md:text-lg">10 mensagens grátis</p>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/20">
              <p className="text-white font-black text-center text-sm sm:text-base md:text-lg">Cancele quando quiser</p>
            </div>
          </div>
        </div>
      </main>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo e Tagline */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={APP_LOGO} alt="Logo" className="w-10 h-10 object-contain logo-pulse" />
                <span className="font-bold text-2xl text-white app-title">{APP_TITLE}</span>
              </div>
              <p className="text-white/80 text-lg mb-4" style={{fontWeight: '800'}}>"Sua arma secreta para quebrar o gelo"</p>
              <div className="flex gap-4">
                {/* Redes sociais removidas */}
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="mailto:pauloromulo2000k@gmail.com" className="text-white/70 hover:text-white transition-colors">Contato</a></li>
                <li><a href="#avaliacoes" className="text-white/70 hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('avaliacoes')?.scrollIntoView({ behavior: 'smooth' }); }}>Avaliações</a></li>
                <li><a href="/faq" className="text-white/70 hover:text-white transition-colors">Perguntas Frequentes</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-white/70 hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="/terms" className="text-white/70 hover:text-white transition-colors">Termos e Condições</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-white/60">
            <p>© 2025 FlerteChat. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}
