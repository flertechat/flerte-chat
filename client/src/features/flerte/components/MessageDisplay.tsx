import { memo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Copy, Sparkles, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MessageAnalysis } from "@shared/types";

interface Message {
  role: "user" | "assistant";
  content: string;
  options?: string[];
  analysis?: MessageAnalysis;
}

interface MessageDisplayProps {
  messages: Message[];
  copied: string | null;
  onCopy: (text: string) => void;
  onGenerateMore: () => void;
  isGenerating: boolean;
  context: string;
}

export const MessageDisplay = memo(({
  messages,
  copied,
  onCopy,
  onGenerateMore,
  isGenerating,
  context,
}: MessageDisplayProps) => {
  return (
    <div className="space-y-8">
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            "flex w-full animate-in fade-in slide-in-from-bottom-4 duration-500",
            message.role === "user" ? "justify-start" : "justify-end"
          )}
        >
          <div className={cn(
            "max-w-[90%] md:max-w-[85%] flex gap-3",
            message.role === "user" ? "flex-row" : "flex-row-reverse"
          )}>
            {/* Avatar */}
            <div className={cn(
              "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-md border border-white/5",
              message.role === "user"
                ? "bg-navy-700 text-slate-400"
                : "bg-gradient-to-br from-coral-500 to-coral-600 text-white"
            )}>
              {message.role === "user" ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>

            {/* Content */}
            <div className="flex flex-col space-y-2 w-full">
              {message.role === "user" ? (
                // USER MESSAGE
                <div className="bg-navy-800 p-4 rounded-2xl rounded-tl-none border border-navy-700 shadow-lg text-slate-200 leading-relaxed relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-700"></div>
                  <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-wider">Recebido</p>
                  <p className="italic opacity-90">"{message.content}"</p>
                </div>
              ) : (
                // AI RESPONSE
                <div className="w-full space-y-4">
                  {/* Analysis Card - REAL da IA */}
                  {message.analysis && (
                    <div className="bg-navy-800/50 border border-navy-700 rounded-xl p-4 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-coral-500/10 rounded-lg">
                            <Zap className="w-4 h-4 text-coral-500" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest text-coral-500">Análise do Coach</span>
                        </div>
                        <div className={`text-xs font-bold px-2 py-1 rounded bg-navy-900 border border-navy-700 ${message.analysis.score >= 70 ? 'text-green-400' :
                          message.analysis.score >= 40 ? 'text-yellow-400' :
                            'text-blue-400'
                          }`}>
                          {message.analysis.score}% Interesse
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Sentimento</p>
                          <p className="text-sm text-white font-medium">{message.analysis.sentiment}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Nível de Risco</p>
                          <p className={`text-sm font-medium ${message.analysis.risk === 'Alto' ? 'text-red-400' :
                            message.analysis.risk === 'Médio' ? 'text-yellow-400' :
                              'text-green-400'
                            }`}>
                            {message.analysis.risk}
                          </p>
                        </div>
                      </div>

                      <div className="bg-navy-900/80 p-3 rounded-lg border border-navy-700">
                        <p className="text-xs text-slate-300 italic">
                          "<span className="font-semibold text-coral-400">Dica:</span> {message.analysis.advice}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  <div className="space-y-3">
                    {message.options?.map((option, idx) => (
                      <div
                        key={idx}
                        className="bg-navy-800 border border-navy-600 p-4 rounded-xl shadow-lg hover:border-coral-500/50 transition-all group relative overflow-hidden cursor-pointer hover:bg-navy-750"
                        onClick={() => onCopy(option)}
                      >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-coral-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <p className="text-slate-100 pr-8 font-medium relative z-10 leading-relaxed selection:bg-coral-500/30">
                          {option}
                        </p>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 text-slate-500 hover:text-coral-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-navy-700"
                        >
                          {copied === option ? <span className="text-green-500 font-bold text-xs">OK</span> : <Copy className="w-4 h-4" />}
                        </Button>

                        <div className="mt-3 flex justify-end items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity relative z-10">
                          <span className="text-[10px] uppercase font-bold text-coral-400 px-2 py-0.5 bg-navy-900 rounded-md border border-navy-700 shadow-inner">
                            Opção {idx + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {isGenerating && (
        <div className="flex justify-end w-full">
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2 bg-navy-800 px-4 py-3 rounded-2xl rounded-tr-none border border-navy-600 shadow-lg">
              <span className="text-xs font-bold text-coral-500 animate-pulse mr-2">ANALISANDO INTENÇÃO...</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-coral-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-coral-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-coral-500 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

MessageDisplay.displayName = "MessageDisplay";
