import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, PlanTier } from './shared/types';
import { PLANS } from './shared/constants';
import { Layout } from './shared/components/Layout';

// Features
import { LandingPage } from './features/landing/LandingPage';
import { LoginPage } from './features/auth/LoginPage';
import { ChatDashboard } from './features/chat/ChatDashboard';
import { PlansPage } from './features/subscription/PlansPage';
import { SuccessPage } from './features/subscription/SuccessPage';
import { SubscriptionPage } from './features/subscription/SubscriptionPage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Check system preference initially
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const handleLogin = (mockUser: User) => {
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSubscribe = (planId: PlanTier) => {
    if (!user) {
      alert("Faça login primeiro!");
      return;
    }
    
    // Simulate redirect to stripe
    const win = window.open('', '_blank');
    if (win) {
      win.document.write('<h1>Stripe Checkout Mock...</h1><p>Processando pagamento...</p>');
      setTimeout(() => {
        win.close();
        const planDetails = PLANS.find(p => p.id === planId);
        const newCredits = planDetails?.isUnlimited ? 9999 : (planId.includes('monthly') ? 200 : 50);
        
        setUser(prev => prev ? { 
          ...prev, 
          plan: planId, 
          credits: newCredits,
          subscriptionStatus: 'active'
        } : null);
        
        window.location.hash = '#/success';
      }, 2000);
    }
  };

  const handleCancelSubscription = () => {
    setUser(prev => prev ? { ...prev, subscriptionStatus: 'canceled' } : null);
    alert("Assinatura cancelada. Seus créditos permanecem até o fim do ciclo.");
  };

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout} isDark={isDark} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
          
          <Route 
            path="/dashboard" 
            element={user ? <ChatDashboard user={user} updateUser={setUser} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/plans" 
            element={<PlansPage onSubscribe={handleSubscribe} />} 
          />
          
          <Route 
            path="/success" 
            element={user ? <SuccessPage /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/subscription" 
            element={user ? <SubscriptionPage user={user} onCancel={handleCancelSubscription} /> : <Navigate to="/login" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;