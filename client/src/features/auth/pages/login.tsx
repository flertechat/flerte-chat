import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { APP_TITLE } from "@/shared/constants/app";
import { useLocation } from "wouter";
import { Flame } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setLocation("/app");
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setLocation("/app");
    },
  });

  const googleLoginMutation = trpc.auth.googleLogin.useMutation({
    onSuccess: (data) => {
      console.log("[Google Login] Success! User:", data.user);
      console.log("[Google Login] Token:", data.token);
      console.log("[Google Login] Saving token to localStorage...");
      localStorage.setItem("token", data.token);
      console.log("[Google Login] Redirecting to /app...");
      setLocation("/app");
    },
    onError: (error) => {
      console.error("[Google Login] Error:", error);
      alert("Erro no login: " + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      registerMutation.mutate({ email, password, name });
    } else {
      loginMutation.mutate({ email, password });
    }
  };

  const loading = loginMutation.isPending || registerMutation.isPending || googleLoginMutation.isPending;
  const error = loginMutation.error?.message || registerMutation.error?.message || googleLoginMutation.error?.message;

  return (
    <div className="min-h-screen dark bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Flame className="w-16 h-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-foreground">{APP_TITLE}</h1>
          <p className="text-muted-foreground mt-2">
            Sua arma secreta para quebrar o gelo
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-card-foreground">
            {isSignUp ? "Criar Conta" : "Entrar"}
          </h2>

          {/* Google Login */}
          <div className="mb-6 flex justify-center">
            <GoogleLogin
              onSuccess={credentialResponse => {
                console.log("[Google Button] Credential received");
                if (credentialResponse.credential) {
                  console.log("[Google Button] Calling googleLogin mutation...");
                  googleLoginMutation.mutate({ idToken: credentialResponse.credential });
                } else {
                  console.error("[Google Button] No credential in response");
                }
              }}
              onError={() => {
                console.error("[Google Button] Login failed");
                alert("Erro ao fazer login com Google. Tente novamente.");
              }}
              theme="filled_black"
              shape="pill"
              width="100%"
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Ou continue com email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  className="w-full px-4 py-3 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                  placeholder="Seu nome"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                placeholder="seu@email.com"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                placeholder="••••••••"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg"
            >
              {loading ? "Carregando..." : isSignUp ? "Cadastrar" : "Entrar"}
            </Button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp
                ? "Já tem conta? Entrar"
                : "Não tem conta? Cadastrar"}
            </button>
          </div>

          {/* Voltar para Home */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setLocation("/")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Voltar para Home
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Ao continuar, você concorda com nossos{" "}
          <a href="/terms" className="text-primary hover:underline">
            Termos
          </a>{" "}
          e{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacidade
          </a>
        </p>
      </div>
    </div>
  );
}
