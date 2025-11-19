import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { PLANS } from '../constants';
import { LogoIcon, MoonIcon, SunIcon, MenuIcon, SparklesIcon, UserIcon, LogOutIcon } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, isDark, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-navy-700 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate(user ? '/dashboard' : '/')}>
            <div className="bg-coral-500 p-1.5 rounded-lg text-white">
              <LogoIcon className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-coral-500 to-purple-500 bg-clip-text text-transparent">
              FlerteChat
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors">
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            
            {!user ? (
              <>
                <button onClick={() => navigate('/plans')} className="text-slate-600 dark:text-slate-300 hover:text-coral-500 font-medium">Planos</button>
                <button onClick={() => navigate('/login')} className="px-4 py-2 bg-navy-900 dark:bg-white text-white dark:text-navy-900 rounded-lg font-semibold hover:opacity-90 transition-all">
                  Entrar
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button onClick={() => navigate('/plans')} className="flex flex-col items-end">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Plano {PLANS.find(p => p.id === user.plan)?.name}</span>
                  <div className="flex items-center space-x-1 text-coral-500 font-bold text-sm">
                    <SparklesIcon className="w-3 h-3" />
                    <span>{user.credits > 1000 ? 'Ilimitado' : user.credits}</span>
                  </div>
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-navy-700" />
                <button onClick={() => navigate('/subscription')} className="p-2 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-full text-slate-600 dark:text-slate-300">
                  <UserIcon className="w-5 h-5" />
                </button>
                <button onClick={onLogout} className="p-2 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-full text-slate-600 dark:text-slate-300">
                  <LogOutIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-4">
             <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors">
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 dark:text-white">
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 p-4 space-y-4 shadow-lg">
            {!user ? (
              <>
                <button onClick={() => { navigate('/plans'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-700 dark:text-slate-200 font-medium">Planos</button>
                <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="block w-full px-4 py-2 bg-coral-500 text-white rounded-lg font-bold text-center">Entrar</button>
              </>
            ) : (
              <>
                <div className="px-4 py-2 flex justify-between items-center border-b border-slate-200 dark:border-navy-700 pb-4">
                  <span className="font-medium text-slate-700 dark:text-white">Créditos Restantes</span>
                  <span className="font-bold text-coral-500">{user.credits > 1000 ? 'Ilimitado' : user.credits}</span>
                </div>
                <button onClick={() => { navigate('/subscription'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-700 dark:text-slate-200">Minha Assinatura</button>
                <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-red-500">Sair</button>
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-grow bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 relative overflow-hidden">
         {/* Background Blobs */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-900/20 rounded-full blur-3xl" />
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-coral-500/10 dark:bg-coral-900/20 rounded-full blur-3xl" />
         </div>
         <div className="relative z-10 w-full h-full">
           {children}
         </div>
      </main>
    </div>
  );
};