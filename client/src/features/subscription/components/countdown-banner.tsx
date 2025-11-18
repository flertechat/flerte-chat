import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Define o tempo final (24 horas a partir de agora, mas reseta a meia-noite)
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0); // Meia-noite do próximo dia

      const difference = tomorrow.getTime() - now.getTime();

      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white py-2 md:py-3 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>

      <div className="container max-w-7xl mx-auto px-3 md:px-4 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 text-center">
          <div className="flex items-center gap-2 font-bold text-xs md:text-sm">
            <Clock className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
            <span className="uppercase tracking-wide">Oferta Relâmpago</span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xs md:text-sm font-semibold">Termina em:</span>
            <div className="flex gap-1 md:gap-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1 min-w-[2.5rem] md:min-w-[3rem]">
                <span className="text-lg md:text-2xl font-black">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs block leading-none opacity-90">HRS</span>
              </div>
              <span className="text-lg md:text-2xl font-black self-center">:</span>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1 min-w-[2.5rem] md:min-w-[3rem]">
                <span className="text-lg md:text-2xl font-black">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs block leading-none opacity-90">MIN</span>
              </div>
              <span className="text-lg md:text-2xl font-black self-center">:</span>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1 min-w-[2.5rem] md:min-w-[3rem]">
                <span className="text-lg md:text-2xl font-black">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs block leading-none opacity-90">SEG</span>
              </div>
            </div>
          </div>

          <span className="text-xs md:text-sm font-bold bg-yellow-400 text-gray-900 px-3 py-1 rounded-full">
            50% OFF
          </span>
        </div>
      </div>
    </div>
  );
}
