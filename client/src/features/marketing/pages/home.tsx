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
import { useState, useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { cycleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [activeSlide, setActiveSlide] = useState(0);

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

  // Auto-play carousel
  useEffect(() => {
    const carouselExamples = 3; // Total de slides
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselExamples);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

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
                      <p className="text-sm text-gray-800">Ai Mateus... tô com mt vontade de te ver hj 😏</p>
                    </div>
                  </div>

                  {/* Mensagem enviada (IA) */}
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%] shadow-md">
                      <p className="text-sm text-white font-medium">Cê tá me deixando louco falando assim... vem logo q eu vou te comer gostoso 🔥😈</p>
                    </div>
                  </div>

                  {/* Mensagem recebida 2 */}
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[75%] shadow-sm">
                      <p className="text-sm text-gray-800">Tô molhadinha só de pensar... vem msm?</p>
                      <p className="text-xs text-gray-500 mt-1">10:45</p>
                    </div>
                  </div>

                  {/* Mensagem enviada 2 (IA) */}
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%] shadow-md">
                      <p className="text-sm text-white font-medium">Vou sim bb... e vc vai gozar mt hj, isso eu garanto 😏💦</p>
                    </div>
                  </div>

                  {/* Mensagem recebida 3 */}
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[75%] shadow-sm">
                      <p className="text-sm text-gray-800">Promete? Então chega logo 🔥😘</p>
                    </div>
                  </div>

                  {/* Mensagem enviada 3 (IA) */}
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%] shadow-md">
                      <p className="text-sm text-white font-medium">Já tô saindo... se prepara q vou te foder bem gostoso 😈🔥</p>
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
      <section className="bg-gradient-to-b from-white via-pink-50 to-white py-12 md:py-20">
        <main className="container max-w-7xl mx-auto px-3 md:px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full font-bold mb-6 shadow-lg">
              <Flame className="w-5 h-5" />
              <span>Veja a Magia Acontecer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Do Bloqueio à Conquista em 3 Segundos ⚡
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Exemplos REAIS de como transformar qualquer mensagem em respostas irresistíveis
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Carrossel Container com transição suave */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {/* Exemplo 1 - Paquera Quente */}
                <div className="flex-shrink-0 w-full">
                  <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 p-8 md:p-12">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-6 shadow-xl border-2 border-white">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold">MENSAGEM RECEBIDA</span>
                      </div>
                      <p className="text-lg md:text-2xl text-gray-800 font-semibold">"Tô com vontade de te ver... mas só se vc prometer ser ousado 😏"</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-black text-blue-600">💬 NORMAL</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Seguro</span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">"Oi! Claro, vamos marcar sim. Que tal amanhã? Podemos tomar um café e conversar melhor 😊"</p>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-3 border-pink-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-black text-red-600">🔥 SAFADO</span>
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">TOP!</span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium leading-relaxed">"Ousado é pouco... vou te deixar sem ar bb. Vem hj q eu te mostro como eu sei ser BEM ousado 😈🔥"</p>
                      </div>
                      <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-black text-yellow-600">😂 ENGRAÇADO</span>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Divertido</span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">"Ousado eu sou até no pedido de pizza kkkk mas prometo te surpreender 😄"</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exemplo 2 - Investida Direta */}
                <div className="flex-shrink-0 w-full">
                  <div className="bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 p-8 md:p-12">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-6 shadow-xl border-2 border-white">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">MENSAGEM RECEBIDA</span>
                      </div>
                      <p className="text-lg md:text-2xl text-gray-800 font-semibold">"Esse seu sorriso tá me deixando doido... 🤤"</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-black text-blue-600">💬 NORMAL</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Educado</span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">"Muito obrigado! Você é muito simpático também 😊 Adorei conversar com você"</p>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-3 border-purple-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-black text-red-600">🔥 SAFADO</span>
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">QUENTE!</span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium leading-relaxed">"Imagina quando vc me ver de pertinho entt... prometo te deixar mt mais doido 😏🔥"</p>
                      </div>
                      <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-black text-yellow-600">😂 ENGRAÇADO</span>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Leve</span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">"Opa, cuidado aí que esse sorriso é registrado kkkk mas pode olhar à vontade 😄✨"</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exemplo 3 - Volta do Ex */}
                <div className="flex-shrink-0 w-full">
                  <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-8 md:p-12">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-6 shadow-xl border-2 border-white">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">MENSAGEM RECEBIDA</span>
                      </div>
                      <p className="text-lg md:text-2xl text-gray-800 font-semibold">"Oi... faz mt tempo né? Tô com saudade da gente"</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-black text-blue-600">💬 NORMAL</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Neutro</span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">"Oi! Sim, faz tempo mesmo. Como você está? Vamos conversar melhor pra ver"</p>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-3 border-orange-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-black text-red-600">🔥 SAFADO</span>
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">POWER!</span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium leading-relaxed">"Saudade da gente ou do que a gente fazia? 😏 Se for a segunda opção, bora relembrar hj msm 🔥"</p>
                      </div>
                      <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-black text-yellow-600">😂 ENGRAÇADO</span>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Leve</span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">"Olha quem acordou da hibernação kkkk que saudade suspeita hein 😂 mas tá perdoado(a)"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicadores modernos com animação */}
            <div className="flex justify-center gap-3 mt-8">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    activeSlide === index
                      ? 'w-12 h-3 bg-gradient-to-r from-pink-500 to-rose-500'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>

            <p className="text-center text-gray-600 mt-6 text-sm font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              Carrossel automático - muda a cada 5 segundos
            </p>
          </div>
        </main>
      </section>

      {/* Como Funciona */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 md:py-24 overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500 rounded-full blur-3xl"></div>
        </div>

      <main className="container max-w-7xl mx-auto px-3 md:px-4 relative z-10">
        <div id="como-funciona" ref={howItWorksRef} className="scroll-animate">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full font-bold mb-6 border border-white/20">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Simples, Rápido e Eficaz</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              Como Funciona?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Em 3 passos simples, você vai de "sem resposta" para "conquistando" em segundos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-sm rounded-3xl p-8 text-center border-2 border-pink-500/30 hover:border-pink-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                {/* Número animado */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto text-white text-4xl font-black shadow-2xl">
                    1
                  </div>
                </div>

                <div className="mb-4">
                  <MessageCircle className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">Cole a Mensagem</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Recebeu aquela mensagem difícil? Cole no app e deixa a IA trabalhar pra você 📱
                </p>
              </div>

              {/* Seta conectora - apenas em desktop */}
              <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                <div className="text-pink-500 text-4xl">→</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm rounded-3xl p-8 text-center border-2 border-purple-500/30 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                {/* Número animado */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto text-white text-4xl font-black shadow-2xl">
                    2
                  </div>
                </div>

                <div className="mb-4">
                  <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">Escolha o Tom</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Normal, Safado ou Engraçado - você decide como quer conquistar 🎯
                </p>
              </div>

              {/* Seta conectora - apenas em desktop */}
              <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                <div className="text-purple-500 text-4xl">→</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-sm rounded-3xl p-8 text-center border-2 border-orange-500/30 hover:border-orange-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                {/* Número animado */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto text-white text-4xl font-black shadow-2xl">
                    3
                  </div>
                </div>

                <div className="mb-4">
                  <Flame className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">Copie e Conquiste</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Escolha entre 3 respostas perfeitas e mande a que mais combina com você 🔥
                </p>
              </div>
            </div>
          </div>

          {/* Call to action extra */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/20">
              <Zap className="w-6 h-6 text-yellow-400" />
              <p className="text-white font-bold text-lg">
                Tempo médio de resposta: <span className="text-yellow-400">3 segundos ⚡</span>
              </p>
            </div>
          </div>
        </div>
      </main>
      </section>

      {/* Features com Imagens */}
      <section className="bg-theme-gradient py-16 md:py-24">
      <main className="container max-w-7xl mx-auto px-4">
        <div ref={whyChooseRef} className="scroll-animate">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-xl">
              Por Que Escolher o Flerte Chat?
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              A ferramenta que transforma seus dates em conquistas reais
            </p>
          </div>

          {/* Feature 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1 relative group">
              {/* Imagem com overlay romântico/sexy */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-rose-600/30 z-10"></div>
                <img
                  src="/couple-flirting.jpg"
                  alt="Casal apaixonado se beijando intensamente - flerte e conquista real"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                {/* Badge flutuante */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 z-20 shadow-xl">
                  <p className="text-pink-600 font-black text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 fill-pink-600" />
                    95% Taxa de Sucesso
                  </p>
                </div>
              </div>
            </div>
            <div className="text-white order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-rose-600 rounded-full px-6 py-3 mb-6 shadow-lg">
                <Flame className="w-5 h-5" />
                <span className="font-bold">MAIS POPULAR</span>
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight">
                Respostas que Provocam, Seduzem e Conquistam 💋
              </h3>
              <p className="text-xl mb-8 opacity-95 leading-relaxed">
                Nossa IA foi treinada com <strong>91.600 mensagens reais</strong> de flerte. Ela entende o contexto,
                capta a vibe e gera respostas tão naturais e provocantes que parecem escritas por você.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-lg font-semibold">100% brasileiro - com gírias, safadeza e expressões autênticas 🇧🇷</span>
                </li>
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-lg font-semibold">3 tons: Normal, Safado ou Engraçado - você escolhe a vibe 😏</span>
                </li>
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-lg font-semibold">Respostas em menos de 3 segundos - strike while the iron is hot ⚡</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-orange-600 rounded-full px-6 py-3 mb-6 shadow-lg">
                <Zap className="w-5 h-5" />
                <span className="font-bold">SUPER RÁPIDO</span>
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight">
                Nunca Mais Deixe no Vácuo 🚀
              </h3>
              <p className="text-xl mb-8 opacity-95 leading-relaxed">
                Acabou aquela ansiedade de não saber o que responder. Com o Flerte Chat,
                você sempre tem a resposta perfeita, provocante e irresistível na ponta dos dedos.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-lg font-semibold">Responda em segundos, não em horas - mantenha o fogo aceso 🔥</span>
                </li>
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-lg font-semibold">Conversas fluindo naturalmente - sem bloqueios, só conquistas 💬</span>
                </li>
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-lg font-semibold">Impressione com criatividade e ousadia - seja inesquecível 😈</span>
                </li>
              </ul>
            </div>
            <div className="relative group">
              {/* Imagem com overlay romântico/sexy */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-600/30 z-10"></div>
                <img
                  src="/couple-texting.jpg"
                  alt="Casal jovem se olhando apaixonadamente, sorrindo e flertando - romance e paixão"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                {/* Badge flutuante */}
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 z-20 shadow-xl">
                  <p className="text-orange-600 font-black text-lg flex items-center gap-2">
                    <Flame className="w-5 h-5 fill-orange-600" />
                    10.000+ Mensagens
                  </p>
                </div>
              </div>
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
