import { memo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Loader2, MessageSquare } from "lucide-react";

interface Conversation {
  id: number;
  context: string | null;
  tone: string | null;
  createdAt: Date;
}

interface HistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversations?: Conversation[];
  isLoading: boolean;
  onSelectConversation: (id: number) => void;
}

export const HistoryModal = memo(({
  open,
  onOpenChange,
  conversations,
  isLoading,
  onSelectConversation,
}: HistoryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
          )}

          {conversations && conversations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma conversa ainda</p>
              <p className="text-sm">Comece gerando sua primeira mensagem!</p>
            </div>
          )}

          {conversations?.map((conversation) => (
            <div
              key={conversation.id}
              className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-200 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(conversation.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-gray-700 font-medium line-clamp-2">{conversation.context || "Sem contexto"}</p>
                </div>
                <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 ml-2">
                  {conversation.tone === "bold"
                    ? "😏 Safado"
                    : conversation.tone === "funny"
                    ? "😄 Engraçado"
                    : "🙂 Normal"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
});

HistoryModal.displayName = "HistoryModal";
