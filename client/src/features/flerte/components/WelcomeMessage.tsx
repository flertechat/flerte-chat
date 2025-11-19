import { memo } from "react";
import { APP_LOGO } from "@/shared/constants/app";
import { ToneSelector } from "./ToneSelector";
import { MessageLengthSelector } from "./MessageLengthSelector";

interface WelcomeMessageProps {
  tone: "natural" | "bold" | "funny";
  onToneChange: (tone: "natural" | "bold" | "funny") => void;
  messageLength: "normal" | "short";
  onLengthChange: (length: "normal" | "short") => void;
}

export const WelcomeMessage = memo(({
  tone,
  onToneChange,
  messageLength,
  onLengthChange
}: WelcomeMessageProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-3 md:px-4">
      <div className="mb-6 md:mb-8">
        <img
          src={APP_LOGO}
          alt="Logo"
          className="w-16 h-16 md:w-24 md:h-24 object-contain mb-3 md:mb-4 logo-pulse mx-auto"
        />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3 md:mb-4">
          Nunca Mais Fique Sem Resposta
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl">
          Cole a mensagem que você recebeu, escolha o tom e receba 3 respostas irresistíveis!
        </p>
      </div>

      <ToneSelector tone={tone} onToneChange={onToneChange} />
      <MessageLengthSelector messageLength={messageLength} onLengthChange={onLengthChange} />
    </div>
  );
});

WelcomeMessage.displayName = "WelcomeMessage";
