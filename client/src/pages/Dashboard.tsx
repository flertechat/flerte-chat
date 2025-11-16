import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  LogOut,
  Copy,
  Check,
  Sparkles,
  Send,
  CreditCard,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  options?: string[]; // For AI generated options
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [context, setContext] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [tone, setTone] = useState<"natural" | "bold" | "funny">("bold");
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

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleGenerate = () => {
    if (!context.trim()) {
      toast.error("Digite a mensagem que você recebeu");
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
    const logoutMutation = trpc.auth.logout.useMutation();
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Até logo!");
        setLocation("/");
      },
    });
  };

  const credits = creditsQuery.data?.creditsRemaining ?? 0;
  const plan = creditsQuery.data?.plan || "free";

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{APP_LOGO}</span>
            <span className="font-bold text-xl text-gray-800">{APP_TITLE}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/plans")}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span className="font-bold text-rose-600">{credits} créditos</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8 flex flex-col">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="mb-8">
              <div className="text-6xl mb-4 animate-pulse">{APP_LOGO}</div>
              <h1 className="text-4xl font-black text-gray-800 mb-4">
                Nunca Mais Fique Sem Resposta
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Cole a mensagem que você recebeu, escolha o tom e receba 3 respostas irresistíveis!
              </p>
            </div>
            
            {/* Tone Selector */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-700 mb-3">Escolha o tom:</p>
              <div className="flex gap-3">
                {toneOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTone(option.id as any)}
                    className={`px-6 py-3 rounded-2xl font-bold text-white transition-all ${
                      tone === option.id
                        ? `bg-gradient-to-r ${option.color} scale-110 shadow-lg`
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  >
                    <span className="text-2xl mr-2">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto mb-4 space-y-6">
            {messages.map((message, index) => (
              <div key={index}>
                {message.role === "user" && (
                  <div className="flex justify-start mb-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl rounded-tl-sm px-6 py-4 max-w-[80%] shadow-md border border-gray-200">
                      <p className="text-gray-800 italic text-lg">"{message.content}"</p>
                    </div>
                  </div>
                )}
                
                {message.role === "assistant" && message.options && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent flex-1"></div>
                      <span className="text-rose-600 font-bold text-lg">Responda:</span>
                      <div className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent flex-1"></div>
                    </div>
                    
                    {message.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className="bg-white rounded-3xl px-6 py-5 shadow-lg border-2 border-rose-100 hover:border-rose-300 transition-all hover:scale-[1.02] group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-gray-800 text-lg flex-1">{option}</p>
                          <button
                            onClick={() => handleCopy(option)}
                            className="flex-shrink-0 p-3 rounded-full bg-rose-50 hover:bg-rose-100 transition-colors"
                            title="Copiar"
                          >
                            {copied === option ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <Copy className="w-5 h-5 text-rose-600" />
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
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-6">
          {messages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Tom:</p>
              <div className="flex gap-3">
                {toneOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTone(option.id as any)}
                    className={`px-4 py-2 rounded-xl font-bold text-white transition-all text-sm ${
                      tone === option.id
                        ? `bg-gradient-to-r ${option.color} scale-105 shadow-md`
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  >
                    <span className="text-lg mr-1">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Cole aqui a mensagem que você recebeu..."
              className="flex-1 min-h-[80px] resize-none border-2 border-gray-200 focus:border-rose-400 rounded-2xl text-lg"
            />
            <Button
              onClick={handleGenerate}
              disabled={!context.trim() || generateMutation.isPending || credits === 0}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-6 rounded-2xl font-bold shadow-lg"
            >
              {generateMutation.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </Button>
          </div>
          
          {credits === 0 && (
            <div className="mt-4 text-center">
              <p className="text-red-600 font-semibold mb-2">
                Você não tem mais créditos!
              </p>
              <Button
                onClick={() => setLocation("/plans")}
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
              >
                Ver Planos
              </Button>
            </div>
          )}
          
          <div className="mt-4 text-center text-sm text-gray-500">
            Créditos restantes: <span className="font-bold text-rose-600">{credits}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
