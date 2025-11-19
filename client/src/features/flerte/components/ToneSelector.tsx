import { memo } from "react";

interface ToneSelectorProps {
  tone: "natural" | "bold" | "funny";
  onToneChange: (tone: "natural" | "bold" | "funny") => void;
  compact?: boolean;
}

const toneOptions = [
  { id: "bold", label: "Safado", emoji: "😏" },
  { id: "natural", label: "Normal", emoji: "🙂" },
  { id: "funny", label: "Engraçado", emoji: "😄" },
] as const;

export const ToneSelector = memo(({ tone, onToneChange, compact = false }: ToneSelectorProps) => {
  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {toneOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onToneChange(option.id as any)}
            className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${tone === option.id
                ? 'bg-coral-500 text-white border-coral-500 shadow-lg shadow-coral-500/20 transform scale-105'
                : 'bg-navy-900 text-slate-400 border-navy-700 hover:bg-navy-700 hover:text-slate-200'
              }`}
          >
            <span className="mr-1.5 text-sm">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 w-full max-w-md">
      <p className="text-sm font-medium text-muted-foreground mb-3">Escolha o tom:</p>
      <div className="flex flex-wrap gap-3">
        {toneOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onToneChange(option.id as any)}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${tone === option.id
                ? 'bg-coral-500 text-white shadow-lg scale-105'
                : 'bg-navy-900 text-slate-400 border border-navy-700 hover:bg-navy-700 hover:text-slate-200'
              }`}
          >
            <span className="text-xl">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
});

ToneSelector.displayName = "ToneSelector";
