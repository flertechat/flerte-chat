# FlertChat 💬

Sistema de geração de respostas de flerte com IA usando GPT-4.

## 🚀 Deploy no Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/flertechat/flerte-chat)

### Passo a passo:

1. **Crie uma conta**: https://railway.app/
2. **Novo Projeto**: Clique em "New Project"
3. **Deploy from GitHub repo**: Selecione `flertechat/flerte-chat`
4. **Configure as variáveis de ambiente** (veja abaixo)
5. **Deploy!**

## 🔑 Variáveis de Ambiente Necessárias

```bash
# Database
DATABASE_URL=postgresql://...

# OpenAI/LLM
BUILT_IN_FORGE_API_KEY=sk-proj-...
BUILT_IN_FORGE_API_URL=https://api.openai.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Supabase
SUPABASE_SERVICE_KEY=eyJhbGci...
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# App
NODE_ENV=production
PORT=3000
VITE_APP_TITLE=FlertChat
```

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm run dev

# Build
pnpm run build

# Produção
pnpm run start
```

## 📦 Stack

- **Frontend**: React 19 + Vite + TailwindCSS
- **Backend**: Express + tRPC
- **Database**: PostgreSQL (Supabase) + Drizzle ORM
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **LLM**: OpenAI GPT-4

## 🎯 Features

- ✅ Geração de respostas em 3 tons: Safado, Engraçado, Maduro
- ✅ Sistema de créditos e assinaturas
- ✅ Autenticação com Supabase
- ✅ Histórico de conversas
- ✅ Favoritar mensagens
- ✅ Sistema de referral

## 📝 License

MIT
