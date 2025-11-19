import { lazy, Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/shared/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/shared/constants/app";
import { trpc } from "@/lib/trpc";
import { Loader2, LogOut, CreditCard, MessageSquare, Moon } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { useFlertMessages } from "../hooks/useFlertMessages";
import { useMessageGeneration } from "../hooks/useMessageGeneration";
import { WelcomeMessage } from "../components/WelcomeMessage";
import { MessageDisplay } from "../components/MessageDisplay";
import { MessageInput } from "../components/MessageInput";
import { DashboardSimpleFooter } from "../components/DashboardSimpleFooter";

// Lazy load modais para melhor performance
const ContactModal = lazy(() =>
  import("../components/ContactModal").then((m) => ({ default: m.ContactModal }))
);
const HistoryModal = lazy(() =>
  import("../components/HistoryModal").then((m) => ({ default: m.HistoryModal }))
);

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { cycleTheme } = useTheme();
  const [context, setContext] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [tone, setTone] = useState<"natural" | "bold" | "funny">("bold");
  const [messageLength, setMessageLength] = useState<"normal" | "short">("normal");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    setMessagesFromConversation,
  } = useFlertMessages();

  const creditsQuery = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 30000, // Cache por 30s
    refetchOnWindowFocus: false,
  });

  const conversationsQuery = trpc.flerte.listConversations.useQuery(undefined, {
    enabled: isAuthenticated && showHistoryModal,
  });

  const getConversationMutation = trpc.flerte.getConversation.useMutation({
    onSuccess: (data: any) => {
      if (data && data.messages) {
        setContext(data.context || "");
        setTone(data.tone || "bold");

        const generatedOptions = data.messages.map((m: any) => m.content);
        setMessagesFromConversation(data.context || "", generatedOptions);
        setShowHistoryModal(false);

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    },
    onError: (error: any) => {
      toast.error("Erro ao carregar conversa: " + error.message);
    },
  });

  const { generate, isGenerating } = useMessageGeneration({
    onSuccess: (options) => {
      addAssistantMessage(options);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onCreditsUpdate: () => creditsQuery.refetch(),
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Até logo!");
      setLocation("/");
    },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleGenerate = useCallback(() => {
    if (!context.trim()) {
      toast.error("Digite a mensagem que você recebeu");
      return;
    }

    const availableCredits = creditsQuery.data?.creditsRemaining || 0;
    if (availableCredits < 1) {
      toast.error("Você não tem créditos disponíveis. Escolha um plano para continuar.");
      setLocation("/plans");
      return;
    }

    addUserMessage(context);
    setContext("");
    generate(context.trim(), tone, messageLength);
  }, [context, tone, messageLength, creditsQuery.data, addUserMessage, generate, setLocation]);

  const handleCopy = useCallback((message: string) => {
    navigator.clipboard.writeText(message);
    setCopied(message);
    toast.success("Mensagem copiada!");
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleGenerate();
      }
    },
    [handleGenerate]
  );

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const credits = creditsQuery.data?.creditsRemaining ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container max-w-5xl mx-auto px-3 md:px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <img src={APP_LOGO} alt="Logo" className="w-7 h-7 md:w-8 md:h-8 object-contain logo-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base md:text-xl text-foreground block app-title">
                  {APP_TITLE}
                </span>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary text-primary-foreground">
                  {creditsQuery.data?.plan || "Free"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground italic hidden sm:inline">
                "Sua arma secreta para quebrar o gelo"
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
            <Button
              onClick={cycleTheme}
              variant="ghost"
              size="sm"
              className="gap-1 md:gap-2 px-2 md:px-3"
              title="Mudar tema"
            >
              <Moon className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Button>
            <Button
              onClick={() => setShowHistoryModal(true)}
              variant="outline"
              size="sm"
              className="gap-1 md:gap-2 px-2 md:px-3"
            >
              <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline text-xs md:text-sm">Histórico</span>
            </Button>
            <Button
              onClick={() => setLocation("/subscription")}
              variant="outline"
              size="sm"
              className="gap-1 md:gap-2 px-2 md:px-3 bg-primary hover:bg-primary/90 text-primary-foreground border-primary"
              title="Gerenciar assinatura"
            >
              <CreditCard className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="font-bold text-xs md:text-sm">{credits}</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="gap-1 md:gap-2 px-2 md:px-3"
            >
              <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline text-xs md:text-sm">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 container max-w-5xl mx-auto px-3 md:px-4 py-4 md:py-8 flex flex-col">
        {messages.length === 0 ? (
          <WelcomeMessage
            tone={tone}
            onToneChange={setTone}
            messageLength={messageLength}
            onLengthChange={setMessageLength}
          />
        ) : (
          <>
            <MessageDisplay
              messages={messages}
              copied={copied}
              onCopy={handleCopy}
              onGenerateMore={handleGenerate}
              isGenerating={isGenerating}
              context={context}
            />
            <div ref={messagesEndRef} />
          </>
        )}

        {/* Input Area */}
        <MessageInput
          ref={textareaRef}
          context={context}
          onContextChange={setContext}
          onGenerate={handleGenerate}
          onKeyPress={handleKeyPress}
          isGenerating={isGenerating}
          credits={credits}
          showToneSelector={messages.length > 0}
          tone={tone}
          onToneChange={setTone}
        />
      </main>

      {/* Simple Footer */}
      <DashboardSimpleFooter />

      {/* Modals com Lazy Loading */}
      <Suspense fallback={null}>
        {showContactModal && (
          <ContactModal open={showContactModal} onOpenChange={setShowContactModal} />
        )}
        {showHistoryModal && (
          <HistoryModal
            open={showHistoryModal}
            onOpenChange={setShowHistoryModal}
            conversations={conversationsQuery.data}
            isLoading={conversationsQuery.isLoading}
            onSelectConversation={(id) => getConversationMutation.mutate({ id })}
          />
        )}
      </Suspense>
    </div>
  );
}
