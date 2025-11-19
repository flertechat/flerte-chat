import { lazy, Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { Loader2, Menu, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useFlertMessages } from "../hooks/useFlertMessages";
import { useMessageGeneration } from "../hooks/useMessageGeneration";
import { MessageDisplay } from "../components/MessageDisplay";
import { MessageInput } from "../components/MessageInput";
import { AppSidebar } from "../components/AppSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { APP_LOGO } from "@/shared/constants/app";

// Lazy load modais para melhor performance
const ContactModal = lazy(() =>
  import("../components/ContactModal").then((m) => ({ default: m.ContactModal }))
);

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout: supabaseLogout } = useAuth();
  const [, setLocation] = useLocation();
  const [context, setContext] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [tone, setTone] = useState<"natural" | "bold" | "funny">("bold");
  const [messageLength, setMessageLength] = useState<"normal" | "short">("normal");
  const [showContactModal, setShowContactModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    setMessagesFromConversation,
    clearMessages,
  } = useFlertMessages();

  const creditsQuery = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const conversationsQuery = trpc.flerte.getConversations.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const getConversationMutation = trpc.flerte.getConversation.useMutation({
    onSuccess: (data: any) => {
      if (data && data.messages) {
        setContext(data.context || "");
        setTone(data.tone || "bold");

        const generatedOptions = data.messages.map((m: any) => m.content);
        setMessagesFromConversation(data.context || "", generatedOptions);
        setMobileMenuOpen(false);

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
    onSuccess: (options, analysis) => {
      addAssistantMessage(options, analysis);
      conversationsQuery.refetch();
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onCreditsUpdate: () => creditsQuery.refetch(),
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      localStorage.removeItem("token");
      await supabaseLogout();
      toast.success("Até logo!");
      setLocation("/login");
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

  const handleNewChat = useCallback(() => {
    clearMessages();
    setContext("");
    setMobileMenuOpen(false);
    textareaRef.current?.focus();
  }, [clearMessages]);

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const handleNavigateToRoleplay = useCallback(() => {
    setLocation("/roleplay");
  }, [setLocation]);

  const credits = creditsQuery.data?.creditsRemaining ?? 0;
  const plan = creditsQuery.data?.plan || "Free";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const SidebarContent = (
    <AppSidebar
      conversations={conversationsQuery.data}
      isLoading={conversationsQuery.isLoading}
      onSelectConversation={(id) => getConversationMutation.mutate({ conversationId: id })}
      onNewChat={handleNewChat}
      onLogout={handleLogout}
      onManageSubscription={() => setLocation("/plans")}
      credits={credits}
      plan={plan}
      className="hidden md:flex w-80"
      onNavigateToRoleplay={handleNavigateToRoleplay}
      isRoleplayActive={false}
    />
  );

  return (
    <div className="flex h-screen bg-navy-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-80 h-full flex-shrink-0">
        {SidebarContent}
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 md:p-4">
        <div className="flex-1 flex flex-col bg-navy-900 md:rounded-2xl md:border md:border-navy-700 md:shadow-2xl overflow-hidden">
          {/* Mobile Header */}
          <header className="md:hidden flex items-center justify-between p-4 border-b border-navy-700 bg-navy-800/90 backdrop-blur-md z-10">
            <div className="flex items-center gap-2">
              <img src={APP_LOGO} alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg bg-gradient-to-r from-coral-500 to-purple-500 bg-clip-text text-transparent">FlerteChat</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setLocation("/plans")}
                className="bg-coral-500 hover:bg-coral-600 text-white font-bold px-3 py-1 text-xs"
              >
                UPGRADE
              </Button>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-white">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80 bg-navy-900 border-r border-navy-800">
                  <AppSidebar
                    conversations={conversationsQuery.data}
                    isLoading={conversationsQuery.isLoading}
                    onSelectConversation={(id) => {
                      getConversationMutation.mutate({ conversationId: id });
                      setMobileMenuOpen(false);
                    }}
                    onNewChat={handleNewChat}
                    onLogout={handleLogout}
                    onManageSubscription={() => setLocation("/plans")}
                    credits={credits}
                    plan={plan}
                    onNavigateToRoleplay={() => {
                      handleNavigateToRoleplay();
                      setMobileMenuOpen(false);
                    }}
                    isRoleplayActive={false}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </header>

          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col relative overflow-hidden bg-navy-900">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-70">
                    <div className="relative group cursor-pointer">
                      <div className="absolute inset-0 bg-coral-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                      <div className="w-24 h-24 bg-navy-800 border border-navy-700 rounded-full flex items-center justify-center relative z-10 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <Sparkles className="w-10 h-10 text-coral-500" />
                      </div>
                    </div>
                    <div className="max-w-sm px-4">
                      <p className="font-bold text-xl mb-2 text-white">Cole a mensagem do Crush</p>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        A IA vai analisar o sentimento oculto e criar <br />3 respostas estrategicamente perfeitas.
                      </p>
                    </div>
                  </div>
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
                    <div ref={messagesEndRef} className="h-4" />
                  </>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="z-10">
              <div className="max-w-3xl mx-auto w-full">
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
              </div>
            </div>
          </main>
        </div>

        {/* Modals com Lazy Loading */}
        <Suspense fallback={null}>
          {showContactModal && (
            <ContactModal open={showContactModal} onOpenChange={setShowContactModal} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
