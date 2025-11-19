import React from 'react';
import { PLANS } from '../../shared/constants';
import { PlanTier } from '../../shared/types';
import { SparklesIcon, CheckIcon } from '../../shared/components/Icons';

interface PlansPageProps {
  onSubscribe: (planId: PlanTier) => void;
}

export const PlansPage: React.FC<PlansPageProps> = ({ onSubscribe }) => {
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-4">Escolha seu Poder</h2>
        <p className="text-slate-600 dark:text-slate-300">Invista no seu carisma. Cancele quando quiser.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {PLANS.map((plan) => {
          const isPopular = plan.id === 'pro_monthly';
          return (
            <div 
              key={plan.id} 
              className={`relative flex flex-col bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-lg border-2 transition-transform hover:-translate-y-2 ${
                isPopular ? 'border-coral-500 scale-105 z-10' : 'border-transparent hover:border-slate-200 dark:hover:border-navy-600'
              }`}
            >
              {isPopular && (
                 <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-coral-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                   Mais Popular
                 </div>
              )}
              <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">{plan.name}</h3>
              <div className="text-3xl font-extrabold text-coral-500 mb-4">{plan.price}<span className="text-sm font-normal text-slate-400">/{plan.interval}</span></div>
              
              <div className="flex-1 space-y-3 mb-8">
                 <div className="flex items-center text-sm dark:text-slate-300 font-semibold">
                   <SparklesIcon className="w-4 h-4 mr-2 text-coral-500" />
                   {plan.creditsText}
                 </div>
                 {plan.features.map((feat, i) => (
                   <div key={i} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                     <CheckIcon className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                     {feat}
                   </div>
                 ))}
              </div>

              <button 
                onClick={() => onSubscribe(plan.id)}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  isPopular 
                    ? 'bg-coral-500 hover:bg-coral-600 text-white shadow-lg shadow-coral-500/30' 
                    : 'bg-slate-100 dark:bg-navy-700 hover:bg-slate-200 dark:hover:bg-navy-600 text-slate-900 dark:text-white'
                }`}
              >
                {plan.id === 'free' ? 'Plano Atual' : 'Assinar'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};