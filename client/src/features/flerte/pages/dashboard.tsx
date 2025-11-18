import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { APP_LOGO, APP_TITLE } from "@/shared/constants/app";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  LogOut,
  Copy,
  Check,
  Sparkles,
  Send,
  CreditCard,
  Mail,
  Phone,
  User,
  MessageSquare,
  Star,
  Moon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useTheme } from "@/shared/contexts/ThemeContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  options?: string[]; // For AI generated options
}

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { cycleTheme } = useTheme();
  const [context, setContext] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [tone, setTone] = useState<"natural" | "bold" | "funny">("bold");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toneOptions = [
    { id: "bold", label: "Safado", icon: "😏", color: "from-rose-500 to-pink-600" },
    { id: "natural", label: "Normal", icon: "🙂", color: "from-blue-500 to-cyan-600" },
    { id: "funny", label: "Engraçado", icon: "😄", color: "from-yellow-500 to-orange-600" },
  ];

  const creditsQuery = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const conversationsQuery = trpc.flerte.listConversations.useQuery(undefined, {
    enabled: isAuthenticated && showHistoryModal,
  });

  const generateMutation = trpc.flerte.generateMessage.useMutation({
    onSuccess: (data: any) => {
      const generatedOptions = data.messages || [];
      const optionsContent = generatedOptions.map((m: any) => m.content);
      
      // Add assistant message with options
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "",
          options: optionsContent,
        }
      ]);
      
      creditsQuery.refetch();
      toast.success("3 respostas geradas!");
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
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

  const handleGenerate = () => {
    if (!context.trim()) {
      toast.error("Digite a mensagem que você recebeu");
      return;
    }

    // Verificar créditos disponíveis
    const availableCredits = creditsQuery.data?.creditsRemaining || 0;
    console.log("[handleGenerate] Available credits:", availableCredits);
    if (availableCredits < 1) {
      toast.error("Você não tem créditos disponíveis. Escolha um plano para continuar.");
      setLocation("/plans");
      return;
    }

    // Add user message to chat
    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: context.trim(),
      }
    ]);

    // Clear input
    setContext("");

    // Generate responses
    generateMutation.mutate({
      context: context.trim(),
      tone,
    });
  };

  const handleCopy = (message: string) => {
    navigator.clipboard.writeText(message);
    setCopied(message);
    toast.success("Mensagem copiada!");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };



  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link
    const subject = encodeURIComponent(`Contato de ${contactForm.name}`);
    const body = encodeURIComponent(
      `Nome: ${contactForm.name}\nTelefone: ${contactForm.phone}\nEmail: ${contactForm.email}\n\nMensagem:\n${contactForm.message}`
    );
    
    window.location.href = `mailto:pauloromulo2000k@gmail.com?subject=${subject}&body=${body}`;
    
    toast.success("Abrindo seu cliente de email...");
    setShowContactModal(false);
    setContactForm({ name: "", phone: "", email: "", message: "" });
  };

  const credits = creditsQuery.data?.creditsRemaining ?? 0;
  const plan = creditsQuery.data?.plan || "free";

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
                <span className="font-bold text-base md:text-xl text-foreground block app-title">{APP_TITLE}</span>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary text-primary-foreground">
                  {creditsQuery.data?.plan || "Free"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground italic hidden sm:inline">"Sua arma secreta para quebrar o gelo"</span>
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
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-3 md:px-4">
            <div className="mb-6 md:mb-8">
              <img src={APP_LOGO} alt="Logo" className="w-16 h-16 md:w-24 md:h-24 object-contain mb-3 md:mb-4 logo-pulse mx-auto" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3 md:mb-4">
                Nunca Mais Fique Sem Resposta
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl">
                Cole a mensagem que você recebeu, escolha o tom e receba 3 respostas irresistíveis!
              </p>
            </div>

            {/* Tone Selector */}
            <div className="mb-6 md:mb-8 w-full max-w-md">
              <p className="text-xs sm:text-sm font-semibold text-foreground mb-3">Escolha o tom:</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {toneOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTone(option.id as any)}
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
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto mb-3 md:mb-4 space-y-4 md:space-y-6">
            {messages.map((message, index) => (
              <div key={index}>
                {message.role === "user" && (
                  <div className="flex justify-start mb-4 md:mb-6">
                    <div className="bg-card/60 backdrop-blur-sm rounded-2xl md:rounded-3xl rounded-tl-sm px-4 sm:px-5 md:px-6 py-3 md:py-4 max-w-[85%] md:max-w-[80%] shadow-md border border-border">
                      <p className="text-card-foreground italic text-sm sm:text-base md:text-lg">"{message.content}"</p>
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
                          <p className="text-card-foreground text-sm sm:text-base md:text-lg flex-1">{option}</p>
                          <button
                            onClick={() => handleCopy(option)}
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
                        onClick={handleGenerate}
                        disabled={!context.trim() || generateMutation.isPending}
                        className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white px-8 py-6 rounded-full font-bold text-lg shadow-xl"
                      >
                        {generateMutation.isPending ? (
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
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="bg-card rounded-2xl md:rounded-3xl shadow-xl border-2 border-border p-4 md:p-6">
          {messages.length > 0 && (
            <div className="mb-3 md:mb-4">
              <p className="text-xs sm:text-sm font-semibold text-foreground mb-2 md:mb-3">Tom:</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {toneOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTone(option.id as any)}
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
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-end">
            <Textarea
              ref={textareaRef}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Cole aqui a mensagem que você recebeu..."
              className="flex-1 min-h-[80px] resize-none border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary rounded-xl md:rounded-2xl text-sm sm:text-base md:text-lg"
            />
            <Button
              onClick={handleGenerate}
              disabled={!context.trim() || generateMutation.isPending || credits === 0}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 rounded-xl md:rounded-2xl font-bold shadow-lg w-full sm:w-auto"
            >
              {generateMutation.isPending ? (
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
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={APP_LOGO} alt="Logo" className="w-8 h-8 object-contain logo-pulse" />
                <span className="font-bold text-xl app-title">{APP_TITLE}</span>
              </div>
              <p className="text-gray-400 text-sm italic mb-4">
                "Sua arma secreta para quebrar o gelo"
              </p>
              <p className="text-gray-400 text-sm">
                © 2025 FlerteChat. Todos os direitos reservados.
              </p>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-lg mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="mailto:pauloromulo2000k@gmail.com"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email de Suporte
                  </a>
                </li>

                <li>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Contate-nos
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => setLocation("/privacy")}
                    className="hover:text-white transition-colors"
                  >
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation("/terms")}
                    className="hover:text-white transition-colors"
                  >
                    Termos e Condições
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation("/faq")}
                    className="hover:text-white transition-colors"
                  >
                    Perguntas Frequentes
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold text-lg mb-4">Empresa</h3>
              <p className="text-gray-400 text-sm mb-2">FlerteChat</p>
              <p className="text-gray-400 text-sm">
                Transformando conversas em conexões reais desde 2025.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Entre em Contato
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Preencha o formulário abaixo e entraremos em contato em breve!
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Seu nome"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  required
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Mensagem
              </label>
              <Textarea
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Como podemos ajudar?"
                className="min-h-[120px]"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-6"
            >
              <Send className="w-5 h-5 mr-2" />
              Enviar Mensagem
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Histórico de Conversas
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Veja todas as suas conversas anteriores
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            {conversationsQuery.isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
              </div>
            )}
            
            {conversationsQuery.data && conversationsQuery.data.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma conversa ainda</p>
                <p className="text-sm">Comece gerando sua primeira mensagem!</p>
              </div>
            )}
            
            {conversationsQuery.data?.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-200 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => {
                  // Carregar conversa
                  trpc.flerte.getConversation.useQuery({ id: conversation.id });
                  setShowHistoryModal(false);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">
                      {new Date(conversation.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-gray-700 font-medium line-clamp-2">
                      {conversation.context}
                    </p>
                  </div>
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 ml-2">
                    {conversation.tone === 'bold' ? '😏 Safado' : conversation.tone === 'funny' ? '😄 Engraçado' : '🙂 Normal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
