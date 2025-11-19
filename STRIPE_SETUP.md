# Configuração do Stripe para FlerteChat

Para que o checkout funcione, você precisa criar os planos no seu painel do Stripe e atualizar os IDs no código.

## 1. Acesse o Stripe
Vá para https://dashboard.stripe.com/products

## 2. Crie os Produtos

### Produto: Pro
- **Nome**: FlerteChat Pro
- **Preço 1**: R$ 9,90 / semana (Recorrente) -> Copie o ID (ex: `price_...`)
- **Preço 2**: R$ 29,90 / mês (Recorrente) -> Copie o ID (ex: `price_...`)

### Produto: Premium
- **Nome**: FlerteChat Premium
- **Preço 1**: R$ 19,90 / semana (Recorrente) -> Copie o ID (ex: `price_...`)
- **Preço 2**: R$ 59,90 / mês (Recorrente) -> Copie o ID (ex: `price_...`)

## 3. Atualize o Código
Abra o arquivo `shared/products.ts` e substitua os IDs:

```typescript
export const SUBSCRIPTION_PLANS = {
  // ...
  proWeekly: {
    // ...
    stripePriceId: "COLE_AQUI_O_ID_DO_PRO_SEMANAL", // R$ 9,90
  },
  proMonthly: {
    // ...
    stripePriceId: "COLE_AQUI_O_ID_DO_PRO_MENSAL", // R$ 29,90
  },
  premiumWeekly: {
    // ...
    stripePriceId: "COLE_AQUI_O_ID_DO_PREMIUM_SEMANAL", // R$ 19,90
  },
  premiumMonthly: {
    // ...
    stripePriceId: "COLE_AQUI_O_ID_DO_PREMIUM_MENSAL", // R$ 59,90
  },
};
```

## 4. Reinicie o Servidor
Após salvar o arquivo, o servidor deve recarregar automaticamente. Tente fazer o checkout novamente.
