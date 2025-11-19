import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Send, ArrowLeft, Sparkles, MessageCircle, Trophy, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PersonaType } from "@/shared/types";
import { cn } from "@/lib/utils";

const PERSONAS: { id: PersonaType; name: string; emoji: string; description: string; color: string }[] = [
    { id: "hard_to_get", name: "A Difícil", emoji: "😤", description: "Não se impressiona fácil. Vai testar sua paciência.", color: "bg-red-500" },
    { id: "shy", name: "A Tímida", emoji: "🙈", description: "Doce e envergonhada. Precisa de gentileza.", color: "bg-pink-400" },
    { id: "funny", name: "A Zoeira", emoji: "😂", description: "Faz piada de tudo. Se levar a sério, perdeu.", color: "bg-yellow-500" },
    { id: "romantic", name: "A Romântica", emoji: "🥰", description: "Intensa e sonhadora. Adora clichês.", color: "bg-purple-500" },
    { id: "direct", name: "A Direta", emoji: "🔥", description: "Sabe o que quer. Sem joguinhos.", color: "bg-orange-500" },
];

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    feedback?: {
        score: number;
        comment: string;
    };
}

export default function RoleplayPage() {
    const [, setLocation] = useLocation();
    const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const roleplayMutation = trpc.flerte.roleplay.useMutation({
        onSuccess: (data) => {
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: data.message,
                    feedback: data.feedback
                }
            ]);
        },
        onError: (error) => {
            toast.error("Erro ao responder: " + error.message);
        }
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim() || !selectedPersona) return;

        const userMsg = inputValue;
        setInputValue("");

        setMessages(prev => [...prev, { role: "user", content: userMsg }]);

        roleplayMutation.mutate({
            message: userMsg,
            persona: selectedPersona,
            history: messages.map(m => ({ role: m.role, content: m.content }))
        });
    };

    if (!selectedPersona) {
        return (
            <div className="min-h-screen bg-navy-900 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => setLocation("/app")}
                        className="mb-8 text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o Chat
                    </Button>

                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
                            Simulador de Date <span className="text-coral-500">IA</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Escolha uma personalidade e treine suas habilidades de flerte sem riscos.
                            A IA vai avaliar cada resposta sua.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PERSONAS.map((persona) => (
                            <Card
                                key={persona.id}
                                className="bg-navy-800 border-navy-700 hover:border-coral-500 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group"
                                onClick={() => setSelectedPersona(persona.id)}
                            >
                                <div className="p-6 text-center">
                                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${persona.color} bg-opacity-20 group-hover:scale-110 transition-transform`}>
                                        {persona.emoji}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{persona.name}</h3>
                                    <p className="text-slate-400 text-sm">{persona.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const currentPersona = PERSONAS.find(p => p.id === selectedPersona)!;

    return (
        <div className="flex flex-col h-screen bg-navy-900">
            {/* Header */}
            <header className="bg-navy-800 border-b border-navy-700 p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedPersona(null)}
                        className="text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${currentPersona.color} bg-opacity-20`}>
                            {currentPersona.emoji}
                        </div>
                        <div>
                            <h2 className="font-bold text-white">{currentPersona.name}</h2>
                            <span className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Online agora
                            </span>
                        </div>
                    </div>
                </div>
                <Badge variant="outline" className="border-coral-500 text-coral-500 hidden md:flex gap-2">
                    <Trophy className="w-3 h-3" /> Modo Treino
                </Badge>
            </header>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Welcome Message */}
                    <div className="flex justify-center">
                        <div className="bg-navy-800/50 text-slate-400 text-xs px-4 py-2 rounded-full">
                            Você iniciou um date simulado com {currentPersona.name}. Boa sorte!
                        </div>
                    </div>

                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 ${msg.role === 'user'
                                    ? 'bg-coral-500 text-white rounded-br-none'
                                    : 'bg-navy-800 text-slate-200 rounded-tl-none border border-navy-700'
                                }`}>
                                {msg.content}
                            </div>

                            {/* Feedback Card (Only for assistant messages that have feedback) */}
                            {msg.role === 'assistant' && msg.feedback && (
                                <div className="mt-2 ml-2 animate-in fade-in slide-in-from-left-4">
                                    <div className="bg-navy-950/50 border border-navy-700 rounded-lg p-3 max-w-sm backdrop-blur-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sparkles className="w-3 h-3 text-yellow-400" />
                                            <span className="text-xs font-bold text-slate-300">Análise do Coach</span>
                                            <Badge className={cn("ml-auto text-[10px] h-5",
                                                msg.feedback.score >= 80 ? "bg-green-500/20 text-green-400" :
                                                    msg.feedback.score >= 50 ? "bg-yellow-500/20 text-yellow-400" :
                                                        "bg-red-500/20 text-red-400"
                                            )}>
                                                Nota: {msg.feedback.score}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-400 italic">
                                            "{msg.feedback.comment}"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {roleplayMutation.isPending && (
                        <div className="flex items-start gap-2">
                            <div className="bg-navy-800 rounded-2xl rounded-tl-none p-4 border border-navy-700">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-navy-800 border-t border-navy-700">
                <div className="max-w-3xl mx-auto flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Digite sua resposta..."
                        className="bg-navy-900 border-navy-600 text-white focus:border-coral-500"
                        disabled={roleplayMutation.isPending}
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || roleplayMutation.isPending}
                        className="bg-coral-500 hover:bg-coral-600 text-white w-12 h-10 p-0"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
