
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Message, ChatSession, Tone, Length, Analysis } from '../../shared/types';
import { TONES } from '../../shared/constants';
import { generateFlirtyResponses } from './services/geminiService';
import { SendIcon, SparklesIcon, CopyIcon, MenuIcon, UserIcon, FlameIcon, ShieldIcon, ZapIcon } from '../../shared/components/Icons';

interface ChatDashboardProps {
  user: User;
  updateUser: (u: User) => void;
}

export const ChatDashboard: React.FC<ChatDashboardProps> = ({ user, updateUser }) => {
  const [inputMsg, setInputMsg] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>('normal');
  const [selectedLength, setSelectedLength] = useState<Length>('normal');
  
  // Mock Initial Session
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: '1', preview: 'Oi, sumida...', timestamp: Date.now() - 100000, messages: [], lastTone: 'safado' },
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0].id);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, loading]);

  const handleGenerate = async () => {
    if (!inputMsg.trim()) return;
    
    if (user.credits <= 0 && user.plan === 'free') {
       setError("Sem créditos! Faça um upgrade.");
       setTimeout(() => navigate('/plans'), 2000);
       return;
    }

    setError(null);
    setLoading(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMsg,
      timestamp: Date.now()
    };

    // Optimistic Update
    const updatedSessions = sessions.map(s => 
      s.id === activeSessionId 
        ? { ...s, messages: [...s.messages, userMsg] }
        : s
    );
    setSessions(updatedSessions);
    setInputMsg('');

    try {
      // Call Updated Service
      const result = await generateFlirtyResponses(userMsg.content as string, selectedTone, selectedLength);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: result.suggestions,
        analysis: result.analysis, // Attach the brain analysis
        tone: selectedTone,
        length: selectedLength,
        timestamp: Date.now()
      };

      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { 
              ...s, 
              messages: [...s.messages, aiMsg],
              preview: (userMsg.content as string).substring(0, 25) + '...',
              lastTone: selectedTone
            }
          : s
      ));

      if (user.credits < 1000) {
        updateUser({ ...user, credits: user.credits - 1 });
      }

    } catch (err) {
      setError("Erro ao conectar com a IA. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      preview: 'Nova Conversa',
      timestamp: Date.now(),
      messages: [],
      lastTone: 'normal'
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Render the AI Strategy Card
  const renderAnalysisCard = (analysis: Analysis) => {
    const getScoreColor = (score: number) => {
      if (score < 40) return 'text-blue-400';
      if (score < 70) return 'text-yellow-400';
      return 'text-green-400';
    };

    return (
      <div className="mb-4 bg-navy-800/50 border border-navy-700 rounded-xl p-4 backdrop-blur-sm animate-fade-in-up">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-coral-500/10 rounded-lg">
              <ZapIcon className="w-4 h-4 text-coral-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-coral-500">Análise do Coach</span>
          </div>
          <div className={`text-xs font-bold px-2 py-1 rounded bg-navy-900 border border-navy-700 ${getScoreColor(analysis.score)}`}>
            {analysis.score}% Interesse
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
           <div>
             <p className="text-[10px] text-slate-400 uppercase font-bold">Sentimento</p>
             <p className="text-sm text-white font-medium">{analysis.sentiment}</p>
           </div>
           <div>
             <p className="text-[10px] text-slate-400 uppercase font-bold">Nível de Risco</p>
             <p className={`text-sm font-medium ${analysis.risk === 'Alto' ? 'text-red-400' : 'text-green-400'}`}>
               {analysis.risk}
             </p>
           </div>
        </div>
        
        <div className="bg-navy-900/80 p-3 rounded-lg border border-navy-700">
          <p className="text-xs text-slate-300 italic">
            "<span className="font-semibold text-coral-400">Dica:</span> {analysis.advice}"
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)] max-w-7xl mx-auto bg-navy-900 shadow-2xl overflow-hidden md:rounded-2xl md:my-4 md:border border-navy-700">
      
      {/* Sidebar History */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-navy-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-navy-700 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 h-full flex flex-col">
          <button 
            onClick={createNewSession}
            className="w-full mb-4 py-3 px-4 bg-coral-500 hover:bg-coral-600 text-white rounded-xl font-bold shadow-lg shadow-coral-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span className="text-xl">+</span> Nova Conversa
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
            {sessions.map(session => (
              <button
                key={session.id}
                onClick={() => {
                  setActiveSessionId(session.id);
                  if (window.innerWidth < 768) setShowSidebar(false);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all border ${
                  activeSessionId === session.id
                    ? 'bg-navy-700 border-coral-500/30 shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-navy-700/50 text-slate-400'
                }`}
              >
                <p className={`font-medium text-sm truncate ${activeSessionId === session.id ? 'text-white' : ''}`}>
                  {session.preview}
                </p>
                <div className="flex justify-between items-center mt-1">
                   <span className="text-[10px] uppercase text-coral-500 font-bold tracking-wider">{session.lastTone}</span>
                   <span className="text-[10px] text-slate-500 opacity-80">{new Date(session.timestamp).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-navy-900/80 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative bg-navy-900">
        {/* Header */}
        <div className="p-4 border-b border-navy-700 bg-navy-800/90 backdrop-blur-md flex items-center gap-3 z-20 sticky top-0 shadow-sm">
           <button onClick={() => setShowSidebar(!showSidebar)} className="md:hidden text-slate-300">
             <MenuIcon className="w-6 h-6" />
           </button>
           <div>
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
               {activeSession.messages.length === 0 ? "Consultor Amoroso" : "Análise em Tempo Real"}
               <span className="flex h-2 w-2 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
             </h2>
             <p className="text-xs text-slate-400 font-medium">Modo: <span className="text-coral-500 uppercase">{selectedTone}</span></p>
           </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          {activeSession.messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-70">
              <div className="relative group cursor-pointer" onClick={() => document.querySelector('textarea')?.focus()}>
                <div className="absolute inset-0 bg-coral-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                <div className="w-24 h-24 bg-navy-800 border border-navy-700 rounded-full flex items-center justify-center relative z-10 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                   <SparklesIcon className="w-10 h-10 text-coral-500" />
                </div>
              </div>
              <div className="max-w-sm px-4">
                <p className="font-bold text-xl mb-2 text-white">Cole a mensagem do Crush</p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  A IA vai analisar o sentimento oculto e criar <br/>3 respostas estrategicamente perfeitas.
                </p>
              </div>
            </div>
          )}

          {activeSession.messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[90%] md:max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-md border border-white/5 ${msg.role === 'user' ? 'bg-navy-700 text-slate-400' : 'bg-gradient-to-br from-coral-500 to-coral-600 text-white'}`}>
                   {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                </div>

                {/* Content */}
                <div className="flex flex-col space-y-2 w-full">
                  {msg.role === 'user' ? (
                    // USER MESSAGE
                    <div className="bg-navy-800 p-4 rounded-2xl rounded-tl-none border border-navy-700 shadow-lg text-slate-200 leading-relaxed relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full bg-slate-700"></div>
                       <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-wider">Recebido</p>
                       <p className="italic opacity-90">"{msg.content}"</p>
                    </div>
                  ) : (
                    // AI RESPONSE
                    <div className="w-full animate-fade-in-up">
                      
                      {/* Step 1: Analysis Card */}
                      {msg.analysis && renderAnalysisCard(msg.analysis)}

                      {/* Step 2: Suggestions */}
                      <div className="space-y-3">
                        {(msg.content as string[]).map((suggestion, idx) => (
                          <div key={idx} className="bg-navy-800 border border-navy-600 p-4 rounded-xl shadow-lg hover:border-coral-500/50 transition-all group relative overflow-hidden cursor-pointer hover:bg-navy-750">
                            
                            {/* Glow Effect on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-coral-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            
                            <p className="text-slate-100 pr-8 font-medium relative z-10 leading-relaxed selection:bg-coral-500/30">{suggestion}</p>
                            
                            <button 
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(suggestion); }}
                              className="absolute top-3 right-3 text-slate-500 hover:text-coral-500 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-navy-700 rounded-lg"
                              title="Copiar resposta"
                            >
                              <CopyIcon className="w-4 h-4" />
                            </button>

                            <div className="mt-3 flex justify-end items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity relative z-10">
                               <span className="text-[10px] uppercase font-bold text-coral-400 px-2 py-0.5 bg-navy-900 rounded-md border border-navy-700 shadow-inner">Opção {idx + 1}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-500 self-end px-1 font-mono opacity-50">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-end w-full">
               <div className="flex flex-col items-end space-y-2">
                 <div className="flex items-center space-x-2 bg-navy-800 px-4 py-3 rounded-2xl rounded-tr-none border border-navy-600 shadow-lg">
                   <span className="text-xs font-bold text-coral-500 animate-pulse mr-2">ANALISANDO INTENÇÃO...</span>
                   <div className="w-1.5 h-1.5 bg-coral-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                   <div className="w-1.5 h-1.5 bg-coral-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                   <div className="w-1.5 h-1.5 bg-coral-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-navy-800 border-t border-navy-700 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
          {error && (
            <div className="mb-3 p-3 bg-red-900/20 text-red-400 rounded-xl text-sm flex items-center animate-shake border border-red-900/50">
              ⚠️ {error}
            </div>
          )}

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
            {/* Tone Selector */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {TONES.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id as Tone)}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                    selectedTone === tone.id
                      ? 'bg-coral-500 text-white border-coral-500 shadow-lg shadow-coral-500/20 transform scale-105'
                      : 'bg-navy-900 text-slate-400 border-navy-700 hover:bg-navy-700 hover:text-slate-200'
                  }`}
                >
                  <span className="mr-1.5 text-sm">{tone.emoji}</span>
                  {tone.label}
                </button>
              ))}
            </div>

            {/* Length Selector */}
            <div className="flex bg-navy-900 p-1 rounded-lg self-start sm:self-auto border border-navy-700">
              {(['curto', 'normal'] as Length[]).map((len) => (
                <button
                  key={len}
                  onClick={() => setSelectedLength(len)}
                  className={`px-3 py-1 rounded-md text-xs font-bold capitalize transition-all ${
                    selectedLength === len
                      ? 'bg-navy-700 text-coral-500 shadow-sm border border-navy-600'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {/* Input Field */}
          <div className="relative flex items-end gap-2">
            <textarea
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Cole a mensagem aqui..."
              className="w-full bg-navy-900 text-white rounded-2xl border border-navy-700 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 p-4 min-h-[60px] max-h-[120px] resize-none text-sm shadow-inner placeholder:text-slate-600 transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !inputMsg.trim()}
              className="h-[60px] w-[60px] flex items-center justify-center bg-coral-500 hover:bg-coral-600 disabled:bg-navy-700 disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded-2xl shadow-lg shadow-coral-500/30 transition-all transform hover:scale-105 active:scale-95 group"
            >
              {loading ? <span className="animate-spin text-xl">✨</span> : <SendIcon className="w-6 h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-2">
             <span className="text-[10px] text-slate-500 flex items-center gap-1">
               <ShieldIcon className="w-3 h-3" /> Dados criptografados
             </span>
             <span className={`text-xs font-bold flex items-center gap-1 ${user.credits === 0 ? 'text-red-500' : 'text-slate-400'}`}>
               <SparklesIcon className="w-3 h-3" />
               {user.credits > 1000 ? '∞ Créditos' : `${user.credits} restantes`}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};
