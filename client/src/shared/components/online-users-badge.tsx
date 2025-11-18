import { useState, useEffect } from "react";
import { Users } from "lucide-react";

export function OnlineUsersBadge() {
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    // Gera um número "realista" de usuários online (entre 450-850)
    const baseUsers = 450;
    const variation = 400;

    const updateOnlineCount = () => {
      // Adiciona variação aleatória para simular flutuação real
      const randomVariation = Math.floor(Math.random() * variation);
      const count = baseUsers + randomVariation;
      setOnlineUsers(count);
    };

    // Atualiza imediatamente
    updateOnlineCount();

    // Atualiza a cada 8-12 segundos para parecer orgânico
    const interval = setInterval(() => {
      updateOnlineCount();
    }, 8000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 bg-green-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg animate-pulse-slow">
      <div className="relative">
        <Users className="w-4 h-4 md:w-5 md:h-5" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
      </div>
      <span className="text-xs md:text-sm font-bold">
        {onlineUsers.toLocaleString('pt-BR')} online agora
      </span>
    </div>
  );
}
