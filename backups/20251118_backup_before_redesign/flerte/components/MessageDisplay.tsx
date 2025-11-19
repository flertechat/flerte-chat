import { memo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Copy, Check, Sparkles, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  options?: string[];
}

interface MessageDisplayProps {
  messages: Message[];
  copied: string | null;
  onCopy: (message: string) => void;
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
    <div className="flex-1 overflow-y-auto mb-3 md:mb-4 space-y-4 md:space-y-6">
      {messages.map((message, index) => (
        <div key={index}>
          {message.role === "user" && (
            <div className="flex justify-start mb-4 md:mb-6">
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl md:rounded-3xl rounded-tl-sm px-4 sm:px-5 md:px-6 py-3 md:py-4 max-w-[85%] md:max-w-[80%] shadow-md border border-border">
                <p className="text-card-foreground italic text-sm sm:text-base md:text-lg">
                  "{message.content}"
                </p>
              </div>
            </div>
          )}

          {message.role === "assistant" && message.options && (
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1"></div>
                <span className="text-primary font-bold text-sm sm:text-base md:text-lg">Responda:</span>
                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1"></div>
              </div>

              {message.options.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className="bg-card rounded-2xl md:rounded-3xl px-4 sm:px-5 md:px-6 py-4 md:py-5 shadow-lg border-2 border-primary/20 hover:border-primary/50 transition-all hover:scale-[1.02] group"
                >
                  <div className="flex items-start justify-between gap-3 md:gap-4">
                    <p className="text-card-foreground text-sm sm:text-base md:text-lg flex-1">
                      {option}
                    </p>
                    <button
                      onClick={() => onCopy(option)}
                      className="flex-shrink-0 p-2 md:p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                      title="Copiar"
                    >
                      {copied === option ? (
                        <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-center mt-6">
                <Button
                  onClick={onGenerateMore}
                  disabled={!context.trim() || isGenerating}
                  className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white px-8 py-6 rounded-full font-bold text-lg shadow-xl"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Gerar mais
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

MessageDisplay.displayName = "MessageDisplay";
