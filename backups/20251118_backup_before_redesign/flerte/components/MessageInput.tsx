import { memo, forwardRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { ToneSelector } from "./ToneSelector";
import { useLocation } from "wouter";

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
      const [, setLocation] = useLocation();

      return (
        <div className="bg-card rounded-2xl md:rounded-3xl shadow-xl border-2 border-border p-4 md:p-6">
          {showToneSelector && (
            <div className="mb-3 md:mb-4">
              <ToneSelector tone={tone} onToneChange={onToneChange} compact />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-end">
            <Textarea
              ref={ref}
              value={context}
              onChange={(e) => onContextChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder="Cole aqui a mensagem que você recebeu..."
              className="flex-1 min-h-[80px] resize-none border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary rounded-xl md:rounded-2xl text-sm sm:text-base md:text-lg"
            />
            <Button
              onClick={onGenerate}
              disabled={!context.trim() || isGenerating || credits === 0}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 rounded-xl md:rounded-2xl font-bold shadow-lg w-full sm:w-auto"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 md:w-6 md:h-6 sm:mr-0 md:mr-0" />
                  <span className="ml-2 sm:hidden">Gerar Respostas</span>
                </>
              )}
            </Button>
          </div>

          {credits === 0 && (
            <div className="mt-3 md:mt-4 text-center">
              <p className="text-red-600 font-semibold mb-2 text-sm md:text-base">
                Você não tem mais créditos!
              </p>
              <Button
                onClick={() => setLocation("/plans")}
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-sm md:text-base"
              >
                Ver Planos
              </Button>
            </div>
          )}

          <div className="mt-3 md:mt-4 text-center text-xs sm:text-sm text-gray-500">
            Créditos restantes: <span className="font-bold text-rose-600">{credits}</span>
          </div>
        </div>
      );
    }
  )
);

MessageInput.displayName = "MessageInput";
