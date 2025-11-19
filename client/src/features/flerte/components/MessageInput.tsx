import { memo, forwardRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Send, Shield, Sparkles } from "lucide-react";
import { ToneSelector } from "./ToneSelector";

interface MessageInputProps {
  context: string;
  onContextChange: (value: string) => void;
  onGenerate: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isGenerating: boolean;
  credits: number;
  showToneSelector: boolean;
  tone: "natural" | "bold" | "funny";
  onToneChange: (tone: "natural" | "bold" | "funny") => void;
}

export const MessageInput = memo(
  forwardRef<HTMLTextAreaElement, MessageInputProps>(
    (
      {
        context,
        onContextChange,
        onGenerate,
        onKeyPress,
        isGenerating,
        credits,
        showToneSelector,
        tone,
        onToneChange,
      },
      ref
    ) => {
      return (
        <div className="p-4 bg-navy-800 border-t border-navy-700 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
          {/* Controls Row */}
          {showToneSelector && (
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
              <ToneSelector tone={tone} onToneChange={onToneChange} compact />
            </div>
          )}

          {/* Input Field */}
          <div className="relative flex items-end gap-2">
            <Textarea
              ref={ref}
              value={context}
              onChange={(e) => onContextChange(e.target.value)}
              placeholder="Cole a mensagem aqui..."
              className="w-full bg-navy-900 text-white rounded-2xl border border-navy-700 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 p-4 min-h-[60px] max-h-[120px] resize-none text-sm shadow-inner placeholder:text-slate-600 transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onGenerate();
                }
              }}
            />
            <Button
              onClick={onGenerate}
              disabled={isGenerating || !context.trim()}
              className="h-[60px] w-[60px] flex items-center justify-center bg-coral-500 hover:bg-coral-600 disabled:bg-navy-700 disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded-2xl shadow-lg shadow-coral-500/30 transition-all transform hover:scale-105 active:scale-95 group"
            >
              {isGenerating ? (
                <span className="animate-spin text-xl">✨</span>
              ) : (
                <Send className="w-6 h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              )}
            </Button>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Dados criptografados
            </span>
            <span className={`text-xs font-bold flex items-center gap-1 ${credits === 0 ? 'text-red-500' : 'text-slate-400'}`}>
              <Sparkles className="w-3 h-3" />
              {credits > 1000 ? '∞ Créditos' : `${credits} restantes`}
            </span>
          </div>
        </div>
      );
    }
  )
);

MessageInput.displayName = "MessageInput";
