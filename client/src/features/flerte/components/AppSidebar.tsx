import { memo } from "react";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Badge } from "@/shared/components/ui/badge";
import {
    Plus,
    LogOut,
    Moon,
    Sun,
    CreditCard,
    Loader2,
    Gamepad2,
    MessageSquare
} from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/shared/constants/app";
import { useTheme } from "@/shared/contexts/ThemeContext";

interface Conversation {
    id: number;
    context: string | null;
    tone: string | null;
    createdAt: Date;
}

interface AppSidebarProps {
    conversations?: Conversation[];
    isLoading: boolean;
    onSelectConversation: (id: number) => void;
    onNewChat: () => void;
    onLogout: () => void;
    onManageSubscription: () => void;
    credits: number;
    plan: string;
    className?: string;
    onNavigateToRoleplay?: () => void;
    isRoleplayActive?: boolean;
}

export const AppSidebar = memo(({
    conversations,
    isLoading,
    onSelectConversation,
    onNewChat,
    onLogout,
    onManageSubscription,
    credits,
    plan,
    className = "",
    onNavigateToRoleplay,
    isRoleplayActive
}: AppSidebarProps) => {
    const { colorTheme, cycleTheme } = useTheme();

    return (
        <div className={`flex flex-col h-full bg-navy-800 text-white border-r border-navy-700 ${className}`}>
            {/* Header */}
            <div className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <img src={APP_LOGO} alt="Logo" className="w-8 h-8 object-contain logo-pulse" />
                    <span className="font-bold text-xl app-title tracking-tight bg-gradient-to-r from-coral-500 to-purple-500 bg-clip-text text-transparent">
                        {APP_TITLE}
                    </span>
                </div>

                <Button
                    onClick={onNewChat}
                    className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-coral-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nova Conversa
                </Button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-hidden px-3 md:px-4">
                <div className="mb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Menu
                </div>

                <div className="space-y-1 mb-6">
                    <Button
                        variant="ghost"
                        onClick={onNewChat}
                        className={`w-full justify-start h-10 rounded-xl transition-colors ${!isRoleplayActive ? 'bg-navy-700 text-coral-500' : 'text-slate-400 hover:bg-navy-700/50 hover:text-white'}`}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat Principal
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={onNavigateToRoleplay}
                        className={`w-full justify-start h-10 rounded-xl transition-colors ${isRoleplayActive ? 'bg-navy-700 text-coral-500' : 'text-slate-400 hover:bg-navy-700/50 hover:text-white'}`}
                    >
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Simulador de Date
                        <Badge className="ml-auto bg-coral-500/20 text-coral-400 text-[10px] border-none px-1.5 py-0 h-4">NOVO</Badge>
                    </Button>
                </div>

                <div className="mb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Histórico
                </div>

                <ScrollArea className="h-[calc(100%-180px)] pr-3">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-coral-500" />
                        </div>
                    ) : conversations?.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            <p>Nenhuma conversa ainda.</p>
                        </div>
                    ) : (
                        <div className="space-y-2 pb-4">
                            {conversations?.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    onClick={() => onSelectConversation(conversation.id)}
                                    className="w-full text-left p-3 rounded-xl hover:bg-navy-700/50 transition-all group border border-transparent hover:border-navy-700"
                                >
                                    <p className="font-medium text-sm line-clamp-2 mb-1 text-white group-hover:text-coral-500 transition-colors">
                                        {conversation.context || "Nova conversa"}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span className={`uppercase font-bold text-[10px] px-1.5 py-0.5 rounded bg-navy-900 ${conversation.tone === 'bold' ? 'text-rose-500' :
                                            conversation.tone === 'funny' ? 'text-orange-500' :
                                                'text-blue-500'
                                            }`}>
                                            {conversation.tone === "bold" ? "SAFADO" :
                                                conversation.tone === "funny" ? "ENGRAÇADO" : "NORMAL"}
                                        </span>
                                        <span>
                                            {new Date(conversation.createdAt).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric"
                                            })}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t border-navy-700 bg-navy-900/50 backdrop-blur-sm">
                <div className="space-y-3">
                    {/* Plan & Credits */}
                    <div className="flex items-center justify-between bg-navy-900 p-3 rounded-xl border border-navy-700">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400">Plano Atual</span>
                            <span className="font-bold text-sm">{plan}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-coral-500" />
                            <span className="font-bold text-coral-500">{credits}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <Button
                        variant="ghost"
                        onClick={cycleTheme}
                        className="w-full justify-start h-10 rounded-xl hover:bg-navy-700 text-slate-400 hover:text-white transition-colors"
                    >
                        {colorTheme === 'dark' ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
                        Alternar Tema
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={onLogout}
                        className="w-full justify-start h-10 rounded-xl hover:bg-red-900/20 text-slate-400 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Sair da Conta
                    </Button>
                </div>
            </div>
        </div>
    );
});

AppSidebar.displayName = "AppSidebar";
