import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from '../../shared/components/Icons';

export const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 text-center">
      <div className="bg-white dark:bg-navy-800 p-8 rounded-3xl shadow-2xl max-w-md w-full border border-green-100 dark:border-navy-700">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckIcon className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Tudo Pronto!</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Seu plano foi ativado com sucesso. Seus créditos já estão disponíveis para você arrasar no flerte.
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all"
        >
          Voltar para o Chat
        </button>
      </div>
    </div>
  );
};