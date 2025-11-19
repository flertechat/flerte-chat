import { useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface UseMessageGenerationParams {
  onSuccess: (options: string[]) => void;
  onCreditsUpdate: () => void;
}

export const useMessageGeneration = ({
  onSuccess,
  onCreditsUpdate,
}: UseMessageGenerationParams) => {
  const [, setLocation] = useLocation();

  const generateMutation = trpc.flerte.generateMessage.useMutation({
    onSuccess: (data: any) => {
      const generatedOptions = data.messages || [];
      const optionsContent = generatedOptions.map((m: any) => m.content);

      onSuccess(optionsContent);
      onCreditsUpdate();
      toast.success("3 respostas geradas!");
    },
    onError: (error: any) => {
      if (error.message === "NO_CREDITS") {
        toast.error("Seus créditos acabaram!");
        setLocation("/plans");
      } else {
        toast.error("Erro ao gerar mensagem: " + error.message);
      }
    },
  });

  const generate = useCallback(
    (context: string, tone: "natural" | "bold" | "funny", length: "normal" | "short") => {
      generateMutation.mutate({
        context: context.trim(),
        tone,
        length,
      });
    },
    [generateMutation]
  );

  return {
    generate,
    isGenerating: generateMutation.isPending,
  };
};
