import React, { useState } from 'react';
import { User } from '../../shared/types';
import { PLANS } from '../../shared/constants';

interface SubscriptionPageProps {
  user: User;
  onCancel: () => void;
}

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ user, onCancel }) => {
  const currentPlan = PLANS.find(p => p.id === user.plan) || PLANS[0];
  const [confirmCancel, setConfirmCancel] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">Gerenciar Assinatura</h2>
      
      <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-navy-700 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wide mb-1">Plano Atual</p>
            <h3 className="text-2xl font-bold text-coral-500">{currentPlan.name}</h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
            {user.subscriptionStatus === 'active' ? 'ATIVO' : 'CANCELADO'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-slate-50 dark:bg-navy-900 rounded-xl">
            <p className="text-xs text-slate-500 mb-1">Créditos</p>
            <p className="text-xl font-bold dark:text-white">{user.credits > 1000 ? '∞' : user.credits}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-navy-900 rounded-xl">
            <p className="text-xs text-slate-500 mb-1">Renovação</p>
            <p className="text-xl font-bold dark:text-white">12/12/2025</p>
          </div>
        </div>

        {user.plan !== 'free' && (
          <div className="border-t border-slate-200 dark:border-navy-700 pt-6">
             {!confirmCancel ? (
               <button 
                 onClick={() => setConfirmCancel(true)}
                 className="text-red-500 hover:text-red-600 text-sm font-medium underline"
               >
                 Cancelar renovação automática
               </button>
             ) : (
               <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                 <p className="text-red-600 dark:text-red-400 text-sm mb-3 font-medium">Tem certeza? Você perderá os benefícios ao fim do ciclo atual.</p>
                 <div className="flex gap-3">
                   <button onClick={onCancel} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold">Sim, cancelar</button>
                   <button onClick={() => setConfirmCancel(false)} className="px-4 py-2 bg-transparent text-slate-600 dark:text-slate-300 text-sm">Voltar</button>
                 </div>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};