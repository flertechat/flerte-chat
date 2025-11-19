import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SparklesIcon, 
  CheckIcon, 
  StarIcon, 
  ArrowRightIcon, 
  FlameIcon, 
  ShieldIcon, 
  LockIcon,
  ZapIcon,
  UserIcon
} from '../../shared/components/Icons';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    navigate('/login');
  };
  
  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50 dark:bg-navy-900">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full z-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-coral-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left: Copy */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            
            {/* Social Proof Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm animate-fade-in-up hover:scale-105 transition-transform cursor-default">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white dark:border-navy-800 overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?img=${10+i}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="text-coral-500 font-bold">🔥 +18.000</span> encontros marcados
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-navy-900 dark:text-white leading-[1.1]">
              Do "Vácuo" direto <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-500 via-red-500 to-purple-600 drop-shadow-sm">
                pra cama.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Chega de conversa chata. O <strong>FlerteChat</strong> usa IA proibida para criar mensagens que ativam o desejo instantâneo. <br/><strong>Cuidado: use com moderação.</strong>
            </p>

            {/* CTA Block */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <button 
                onClick={handleCTAClick} 
                className="group relative w-full sm:w-auto px-8 py-5 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-400 hover:to-coral-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-coral-500/30 transition-all transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                <span className="relative flex items-center justify-center gap-2">
                  Quero Conquistar Agora <FlameIcon className="w-5 h-5 group-hover:animate-pulse" />
                </span>
              </button>
              
              <div className="flex flex-col items-center sm:items-start text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-1">
                  <LockIcon className="w-3 h-3" /> <span>Totalmente confidencial</span>
                </div>
                <div className="flex items-center gap-1">
                  <ZapIcon className="w-3 h-3" /> <span>Aumente sua taxa em 300%</span>
                </div>
              </div>
            </div>

            {/* Scarcity Banner - Improved */}
            <div className="mt-6 p-3 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 rounded-r-lg inline-block text-left">
              <p className="text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                <FlameIcon className="w-4 h-4 animate-pulse" /> 
                Oferta +18: <span className="font-normal text-slate-700 dark:text-slate-300">Plano Premium (Ilimitado) com 50% OFF expira em <span className="font-mono font-bold">01:42:15</span></span>
              </p>
            </div>
          </div>

          {/* Right: Visual Mockup */}
          <div className="flex-1 w-full max-w-[400px] lg:max-w-full perspective-1000">
            <div className="relative transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out">
               {/* Phone Frame */}
               <div className="relative z-20 bg-navy-900 border-[10px] border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden aspect-[9/19]">
                 {/* Dynamic Chat UI */}
                 <div className="absolute inset-0 bg-slate-50 dark:bg-navy-800 flex flex-col">
                   <div className="h-24 bg-white dark:bg-navy-900 border-b border-slate-100 dark:border-navy-700 flex items-end pb-4 px-6">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-coral-400 p-[2px]">
                         <div className="w-full h-full rounded-full bg-white dark:bg-navy-800 flex items-center justify-center overflow-hidden">
                            <img src="https://i.pravatar.cc/100?img=5" alt="Crush" />
                         </div>
                       </div>
                       <div>
                         <div className="font-bold text-sm dark:text-white">Crush 🔥</div>
                         <div className="text-xs text-green-500 font-medium">Online</div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex-1 p-4 space-y-4 overflow-hidden flex flex-col justify-end pb-20">
                     {/* Message History */}
                     <div className="flex flex-col space-y-1">
                       <div className="bg-white dark:bg-navy-700 p-3 rounded-2xl rounded-tl-none shadow-sm self-start max-w-[85%] text-sm dark:text-slate-200">
                         "Oi sumido... tô sozinha em casa e pensando em você. 😈"
                       </div>
                       <span className="text-[10px] text-slate-400 ml-2">23:40</span>
                     </div>

                     <div className="flex flex-col space-y-1">
                       <div className="bg-coral-500 text-white p-3 rounded-2xl rounded-tr-none shadow-sm self-end max-w-[85%] text-sm">
                          "É? E o que exatamente você tá pensando?"
                       </div>
                       <span className="text-[10px] text-slate-400 self-end mr-2">23:41</span>
                     </div>

                     <div className="flex flex-col space-y-1">
                       <div className="bg-white dark:bg-navy-700 p-3 rounded-2xl rounded-tl-none shadow-sm self-start max-w-[85%] text-sm dark:text-slate-200 animate-fade-in-left">
                         "Que você devia vir aqui agora e tirar minha roupa... 🔥"
                       </div>
                       <span className="text-[10px] text-slate-400 ml-2">23:42</span>
                     </div>

                     <div className="flex flex-col space-y-1">
                        {/* Floating AI Suggestions */}
                        <div className="self-end w-full max-w-[95%] space-y-2">
                          <div className="text-[10px] text-right text-coral-500 font-bold uppercase tracking-wider mb-1 animate-pulse">Modo Safado (+18):</div>
                          <div className="bg-gradient-to-r from-coral-500 to-coral-600 p-3 rounded-2xl rounded-tr-none shadow-lg text-white text-sm cursor-pointer transform hover:scale-105 transition-transform animate-fade-in-up delay-100 border border-coral-400">
                            "Manda a localização. Em 20 minutos eu tôí pra te mostrar que sou muito melhor ao vivo."
                          </div>
                          <div className="bg-white dark:bg-navy-700 border border-slate-200 dark:border-navy-600 p-3 rounded-2xl rounded-tr-none shadow-sm text-slate-600 dark:text-slate-300 text-sm opacity-60 hover:opacity-100 cursor-pointer transition-opacity animate-fade-in-up delay-200">
                            "Cuidado com o que pede... eu posso realizar agora mesmo."
                          </div>
                        </div>
                     </div>
                   </div>
                   
                   {/* Fake Input */}
                   <div className="absolute bottom-0 left-0 w-full h-20 bg-white dark:bg-navy-900 border-t border-slate-100 dark:border-navy-700 p-4 flex items-center gap-2">
                      <div className="flex-1 h-10 bg-slate-100 dark:bg-navy-800 rounded-full pl-4 flex items-center text-xs text-slate-400">Digite sua mensagem...</div>
                      <div className="w-10 h-10 bg-coral-500 rounded-full flex items-center justify-center text-white">
                        <ArrowRightIcon className="w-5 h-5" />
                      </div>
                   </div>
                 </div>
               </div>
               
               {/* Floating Badge */}
               <div className="absolute top-1/3 -right-10 z-30 bg-white dark:bg-navy-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-navy-600 animate-bounce-slow">
                 <div className="flex items-center gap-3">
                   <div className="bg-red-100 text-red-600 p-2 rounded-full">
                     <FlameIcon className="w-5 h-5" />
                   </div>
                   <div>
                     <div className="text-xs text-slate-500">Temperatura</div>
                     <div className="font-bold text-navy-900 dark:text-white">Explodiu 🔥</div>
                   </div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- LOGO STRIP --- */}
      <div className="w-full border-y border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 py-8 overflow-hidden">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Use sem moderação no</p>
        <div className="flex justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {['Tinder', 'WhatsApp', 'Instagram', 'Bumble', 'Grindr'].map(app => (
            <span key={app} className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">{app}</span>
          ))}
        </div>
      </div>

      {/* --- PAIN VS SOLUTION --- */}
      <section className="w-full py-24 px-4 bg-slate-50 dark:bg-navy-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-navy-900 dark:text-white mb-16">
            A diferença entre "Boa noite" e "Vem pra cá"
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* The Problem */}
            <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/30">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">🥶</span>
                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">Você hoje:</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <span className="text-red-500 font-bold">✕</span>
                  Dorme sozinho(a) todo fim de semana.
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <span className="text-red-500 font-bold">✕</span>
                  Cai na "Friendzone" por ser bonzinho demais.
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <span className="text-red-500 font-bold">✕</span>
                  A conversa esfria antes de chegar no "vamos?".
                </li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="bg-coral-50 dark:bg-coral-900/10 p-8 rounded-3xl border border-coral-100 dark:border-coral-900/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-coral-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                COM FLERTECHAT
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">🥵</span>
                <h3 className="text-2xl font-bold text-coral-600 dark:text-coral-400">Você Turbinado:</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <CheckIcon className="w-5 h-5 text-coral-500 mt-0.5" />
                  Gera tensão sexual na primeira mensagem.
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <CheckIcon className="w-5 h-5 text-coral-500 mt-0.5" />
                  Transforma matches em encontros reais (e quentes).
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <CheckIcon className="w-5 h-5 text-coral-500 mt-0.5" />
                  Deixa a pessoa viciada em falar com você.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Feature Grid) --- */}
      <section className="w-full py-24 px-4 bg-white dark:bg-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-4">Armamento Pesado</h2>
             <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Tecnologia usada para hackear a atração humana.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FlameIcon className="w-8 h-8 text-red-500" />,
                title: "Modo Picante (+18)",
                desc: "Para quando você quer ir direto ao ponto. Insinuações que deixam a pessoa suando frio."
              },
              {
                icon: <SparklesIcon className="w-8 h-8 text-coral-500" />,
                title: "Leitura de Intenção",
                desc: "A IA sabe se ela(e) quer papo furado ou se quer ação, e ajusta a resposta."
              },
              {
                icon: <ShieldIcon className="w-8 h-8 text-blue-500" />,
                title: "Anti-Seca",
                desc: "Nosso objetivo é um só: tirar você do zero a zero. Resultados comprovados."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-slate-50 dark:bg-navy-700 hover:bg-white dark:hover:bg-navy-600 border border-slate-100 dark:border-navy-600 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="mb-6 bg-white dark:bg-navy-800 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-navy-900 dark:text-white">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS (Wall of Love) --- */}
      <section className="w-full py-24 px-4 bg-slate-50 dark:bg-navy-900 border-t border-slate-200 dark:border-navy-700">
        <div className="max-w-7xl mx-auto">
           <h2 className="text-3xl md:text-4xl font-bold text-center text-navy-900 dark:text-white mb-12">
             Histórias Reais (e Quentes)
           </h2>
           
           <div className="grid md:grid-cols-3 gap-6">
             {[
               { name: "Marcos P.", role: "Tinder", text: "Mano, eu mandei a sugestão 'Safada' nível 3 e ela respondeu: 'Vem logo'. Eu tava desacreditado. A noite foi insana.", stars: 5 },
               { name: "Júlia R.", role: "Instagram", text: "Ele ficava só de papinho. Usei o FlerteChat pra dar um ultimato com classe. Ele tava na minha porta em 20 min.", stars: 5 },
               { name: "Beto K.", role: "Grindr", text: "A IA entende a linguagem perfeitamente. As respostas são diretas, sem enrolação. Consegui 3 encontros na mesma semana.", stars: 5 },
             ].map((t, i) => (
               <div key={i} className="bg-white dark:bg-navy-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-navy-700">
                 <div className="flex text-yellow-400 mb-4 gap-1">
                   {[...Array(t.stars)].map((_, j) => <StarIcon key={j} className="w-5 h-5" fill="currentColor" />)}
                 </div>
                 <p className="text-slate-700 dark:text-slate-300 mb-6 italic">"{t.text}"</p>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${20+i}`} alt={t.name} />
                   </div>
                   <div>
                     <div className="font-bold text-navy-900 dark:text-white">{t.name}</div>
                     <div className="text-xs text-slate-500">{t.role}</div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* --- FAQ (Accordion Style) --- */}
      <section className="w-full py-20 px-4 bg-white dark:bg-navy-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-navy-900 dark:text-white">Perguntas (que ninguém tem coragem de fazer)</h2>
          <div className="space-y-4">
            {[
              { q: "As mensagens são muito pesadas?", a: "Depende de você. O modo 'Normal' é romântico. O modo 'Safado' vai do nível 1 (insinuação) ao nível 5 (convite explícito). Você escolhe o quanto quer arriscar." },
              { q: "Funciona pra conseguir sexo casual?", a: "Sim. A IA foi treinada para identificar aberturas e acelerar o processo de intimidade. Mas lembre-se: consentimento é tudo." },
              { q: "Minha conta pode ser banida?", a: "Não. As mensagens são humanas e contextuais. Não usamos spam nem bots automáticos. Você copia e cola." },
              { q: "É discreto na fatura do cartão?", a: "Totalmente. O nome que aparece é genérico, ninguém vai saber o seu segredo." }
            ].map((item, i) => (
              <details key={i} className="group bg-slate-50 dark:bg-navy-700 rounded-xl overflow-hidden transition-all duration-300 border border-slate-100 dark:border-navy-600">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                  <h3 className="font-bold text-lg text-navy-900 dark:text-white">{item.q}</h3>
                  <span className="text-coral-500 transform group-open:rotate-180 transition-transform">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="w-full py-20 px-4 bg-gradient-to-br from-navy-900 to-navy-800 text-white text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="relative z-10 max-w-4xl mx-auto space-y-8">
           <h2 className="text-4xl md:text-5xl font-extrabold">Sua cama ainda está vazia?</h2>
           <p className="text-xl text-slate-300">Pare de perder tempo. Comece a flertar como um profissional.</p>
           <button 
             onClick={handleCTAClick}
             className="inline-flex items-center px-10 py-5 bg-coral-500 hover:bg-coral-400 text-white text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-transform"
           >
             Quero Sair do Zero a Zero <FlameIcon className="ml-2 w-6 h-6" />
           </button>
           <p className="text-sm opacity-50 mt-4">Sigilo absoluto • Satisfação garantida</p>
         </div>
      </section>
      
      <footer className="w-full py-8 bg-navy-900 text-slate-500 text-center text-sm border-t border-navy-800">
        <p>&copy; 2024 FlerteChat. Feito para maiores de 18 anos.</p>
      </footer>
    </div>
  );
};