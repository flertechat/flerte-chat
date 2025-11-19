import { memo } from "react";

interface MessageLengthSelectorProps {
  messageLength: "normal" | "short";
  onLengthChange: (length: "normal" | "short") => void;
}

export const MessageLengthSelector = memo(({ messageLength, onLengthChange }: MessageLengthSelectorProps) => {
  return (
    <div className="mb-6 md:mb-8 w-full max-w-md">
      <p className="text-xs sm:text-sm font-semibold text-foreground mb-3">Tamanho da resposta:</p>
      <div className="flex gap-2 sm:gap-3">
        <button
          onClick={() => onLengthChange("normal")}
          className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold transition-all text-sm sm:text-base ${
            messageLength === "normal"
              ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white scale-105 shadow-lg"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <span className="text-xl sm:text-2xl mr-1.5 sm:mr-2">📝</span>
          Normal
        </button>
        <button
          onClick={() => onLengthChange("short")}
          className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold transition-all text-sm sm:text-base ${
            messageLength === "short"
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white scale-105 shadow-lg"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <span className="text-xl sm:text-2xl mr-1.5 sm:mr-2">⚡</span>
          Curta (máx 5 palavras)
        </button>
      </div>
    </div>
  );
});

MessageLengthSelector.displayName = "MessageLengthSelector";
