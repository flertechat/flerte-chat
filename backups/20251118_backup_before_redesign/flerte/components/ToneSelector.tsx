import { memo } from "react";

interface ToneSelectorProps {
  tone: "natural" | "bold" | "funny";
  onToneChange: (tone: "natural" | "bold" | "funny") => void;
  compact?: boolean;
}

const toneOptions = [
  { id: "bold", label: "Safado", icon: "😏", color: "from-rose-500 to-pink-600" },
  { id: "natural", label: "Normal", icon: "🙂", color: "from-blue-500 to-cyan-600" },
  { id: "funny", label: "Engraçado", icon: "😄", color: "from-yellow-500 to-orange-600" },
] as const;

export const ToneSelector = memo(({ tone, onToneChange, compact = false }: ToneSelectorProps) => {
  if (compact) {
    return (
      <div>
        <p className="text-xs sm:text-sm font-semibold text-foreground mb-2 md:mb-3">Tom:</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {toneOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onToneChange(option.id as any)}
              className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-white transition-all text-xs sm:text-sm ${
                tone === option.id
                  ? `bg-gradient-to-r ${option.color} scale-105 shadow-md`
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <span className="text-base sm:text-lg mr-1">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 md:mb-6 w-full max-w-md">
      <p className="text-xs sm:text-sm font-semibold text-foreground mb-3">Escolha o tom:</p>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {toneOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onToneChange(option.id as any)}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-white transition-all text-sm sm:text-base ${
              tone === option.id
                ? `bg-gradient-to-r ${option.color} scale-105 sm:scale-110 shadow-lg`
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <span className="text-xl sm:text-2xl mr-1.5 sm:mr-2">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
});

ToneSelector.displayName = "ToneSelector";
