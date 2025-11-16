# Flerte Chat - TODO

## Backend
- [x] Configurar schema do banco de dados com tabelas de créditos, assinaturas, conversas e mensagens
- [x] Implementar helpers do banco de dados para gerenciar usuários, créditos e assinaturas
- [x] Criar routers tRPC para autenticação
- [x] Criar routers tRPC para geração de mensagens de flerte usando LLM
- [x] Criar routers tRPC para gerenciamento de assinaturas e créditos
- [x] Implementar lógica de dedução de créditos ao gerar mensagens
- [x] Adicionar integração com Stripe para pagamentos

## Frontend
- [x] Migrar página Home (landing page) do projeto original
- [x] Migrar página Dashboard (geração de mensagens) do projeto original
- [x] Migrar página Plans (planos e assinaturas) do projeto original
- [x] Configurar rotas no App.tsx
- [x] Ajustar tema e cores do projeto
- [x] Copiar componentes UI necessários do projeto original

## Sistema de Créditos
- [x] Usuários novos começam com 10 créditos (plano Free)
- [x] Cada geração de mensagem consome 1 crédito
- [x] Bloquear geração quando créditos chegarem a 0
- [x] Redirecionar para página de planos quando sem créditos
- [x] Atualizar créditos após compra de plano

## Planos de Assinatura
- [x] Plano Free: 10 mensagens grátis
- [x] Plano Pro Semanal: R$ 9,90 - 50 mensagens
- [x] Plano Pro Mensal: R$ 29,90 - 200 mensagens
- [x] Plano Premium Semanal: R$ 19,90 - ilimitado
- [x] Plano Premium Mensal: R$ 59,90 - ilimitado

## Integração Stripe
- [x] Configurar produtos e preços no Stripe
- [x] Implementar fluxo de checkout
- [x] Criar webhook para processar pagamentos
- [x] Atualizar assinatura e créditos após pagamento bem-sucedido

## Testes
- [x] Testar cadastro e login de usuário
- [x] Testar geração de mensagens e consumo de créditos
- [x] Testar bloqueio quando créditos acabam
- [x] Testar fluxo de upgrade de plano
- [x] Testar atualização de créditos após pagamento

## Melhorias da Landing Page
- [x] Adicionar chat demonstrativo no topo com exemplo safado
- [x] Buscar e adicionar imagens atraentes de pessoas flertando
- [x] Criar seção de prova social com depoimentos
- [x] Melhorar CTAs para serem mais persuasivos
- [x] Adicionar seção "Como Funciona" com passos visuais
- [x] Adicionar seção de estatísticas/resultados

## Senso de Urgência
- [x] Adicionar cronômetro regressivo na página de planos
- [x] Adicionar badge de oferta limitada
- [x] Adicionar mensagem de escassez

## Melhorias do Chat
- [x] Redesenhar interface do chat com design moderno
- [x] Implementar chat contínuo que mantém histórico de mensagens
- [x] Adicionar botão de copiar em cada resposta gerada
- [x] Melhorar layout responsivo para mobile
- [x] Adicionar animações suaves nas interações
- [x] Preservar contexto das mensagens anteriores na geração
