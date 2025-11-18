import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { 
  getUserConversations, 
  getConversationWithMessages, 
  createConversation, 
  addMessage, 
  toggleMessageFavorite, 
  getUserSubscription, 
  updateSubscription, 
  deductCredit,
  createSubscription 
} from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  subscription: router({
    // Get current user subscription
    get: protectedProcedure.query(async ({ ctx }) => {
      let subscription = await getUserSubscription(ctx.user.id);
      
      // Create default subscription if doesn't exist
      if (!subscription) {
        subscription = await createSubscription({
          userId: ctx.user.id,
          plan: "free",
          status: "active",
          creditsRemaining: 10,
          creditsTotal: 10,
        });
      }
      
      return subscription;
    }),

    // Update subscription (for Stripe webhook or manual update)
    update: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null) {
          const data = val as { plan?: string; status?: string; creditsRemaining?: number; creditsTotal?: number; endDate?: Date | null };
          return data;
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        return updateSubscription(ctx.user.id, input);
      }),

    // Create Stripe checkout session
    createCheckout: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null) {
          const data = val as { planId: string };
          return data;
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        const { createCheckoutSession } = await import("./stripe");
        const { SUBSCRIPTION_PLANS } = await import("@shared/products");
        
        const planConfig = SUBSCRIPTION_PLANS[input.planId];
        if (!planConfig) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid plan" });
        }

        const priceId = planConfig.stripePriceId;

        const origin = ctx.req.headers.origin || `http://localhost:3000`;

        const session = await createCheckoutSession({
          userId: ctx.user.id,
          userEmail: ctx.user.email || "",
          userName: ctx.user.name || "",
          priceId,
          plan: input.planId,
          interval: "monthly",
          origin,
        });

        return { url: session.url };
      }),

    // Cancel subscription
    cancel: protectedProcedure.mutation(async ({ ctx }) => {
      const subscription = await getUserSubscription(ctx.user.id);
      
      if (!subscription) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Subscription not found" });
      }

      if (subscription.plan === "free") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot cancel free plan" });
      }

      // Cancel Stripe subscription if it exists
      if (subscription.stripeSubscriptionId) {
        try {
          const stripe = (await import("stripe")).default;
          const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY || "");
          await stripeClient.subscriptions.cancel(subscription.stripeSubscriptionId);
        } catch (error) {
          console.error("Error cancelling Stripe subscription:", error);
          // Continue anyway - update our database
        }
      }

      // Update subscription status to cancelled (user keeps their credits)
      return updateSubscription(ctx.user.id, {
        status: "cancelled",
      });
    }),
  }),

  flerte: router({
    // Get all conversations for the current user
    listConversations: protectedProcedure.query(async ({ ctx }) => {
      return getUserConversations(ctx.user.id);
    }),

    // Get a single conversation with all messages
    getConversation: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "id" in val) {
          return { id: (val as { id: unknown }).id };
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        return getConversationWithMessages(input.id as number, ctx.user.id);
      }),

    // Create a new conversation and generate first message
    generateMessage: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null) {
          const data = val as { context?: string; tone?: string; length?: string };
          return {
            context: data.context || "",
            tone: data.tone || "natural",
            length: data.length || "normal"
          };
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        // Check if user has credits
        let subscription = await getUserSubscription(ctx.user.id);

        // Create subscription if doesn't exist
        if (!subscription) {
          subscription = await createSubscription({
            userId: ctx.user.id,
            plan: "free",
            status: "active",
            creditsRemaining: 10,
            creditsTotal: 10,
          });
        }

        console.log("[generateMessage] User:", ctx.user.id, "Credits:", subscription?.creditsRemaining, "Total:", subscription?.creditsTotal);

        if (!subscription || (subscription.creditsRemaining <= 0 && subscription.creditsTotal !== -1)) {
          console.log("[generateMessage] NO_CREDITS - Remaining:", subscription?.creditsRemaining);
          throw new TRPCError({ code: "FORBIDDEN", message: "NO_CREDITS" });
        }

        // Deduct a credit (unless unlimited)
        if (subscription.creditsTotal !== -1) {
          const deducted = await deductCredit(ctx.user.id);
          console.log("[generateMessage] Credit deducted:", deducted);
        }

        // Create a new conversation
        const conversation = await createConversation({
          userId: ctx.user.id,
          title: input.context.substring(0, 50) || "Nova conversa",
          context: input.context,
          tone: input.tone,
        });

        if (!conversation) throw new Error("Failed to create conversation");

        // Generate message using LLM with training examples
        let toneInstructions = "";
        let examples = "";

        if (input.tone === "bold") {
          toneInstructions = `TOM SAFADO/OUSADO - SISTEMA DE ESCALAÇÃO EM 5 NÍVEIS:

Regra de ouro absoluta: "Se um brasileiro de verdade não mandaria exatamente aquilo no WhatsApp, a gente não manda."

📊 ANÁLISE CONTEXTUAL OBRIGATÓRIA (faça ANTES de responder):
A) Nível de intimidade atual:
   1 – Primeira mensagem / nunca trocou ideia
   2 – Já conversaram um pouco, mas ainda no "oi, tudo bem?"
   3 – Já rolaram flertes claros, nudes trocados ou ficaram
   4 – Namorando / ficantes fixos / sexting pesado diário

B) Tom emocional da mensagem recebida:
   - Neutro / educado
   - Levemente interessado
   - Flertando / provocando
   - Safado explícito
   - Sexual cru

C) Temperatura da conversa (1 a 10):
   1 = gelo total
   10 = já tá quase mandando nudes

🔥 ESCALAÇÃO SAFADA (NUNCA PULAR NÍVEL!):

Nível 1 – Primeira mensagem ou conversa fria
Flerte sutil, malícia leve, quase "inocente"
Exemplos:
• "Oi, tudo bem?" → "Tudo ótimo agora que você apareceu 😏"
• "E aí, o que tá fazendo?" → "Pensando que você deve tá linda hoje… acertei?"

Nível 2 – Interesse já demonstrado (ela tá respondendo rápido, usando emojis)
Flerte médio, duplo sentido leve
• "Tô de boa em casa vendo série" → "Sozinha? Posso fazer companhia… pela tela mesmo 😈"
• "Saudades" → "Tb tô... saudade de conversar e de ficar pertinho de vc 😏"

Nível 3 – Provocação clara (ela mandou foto, falou algo ousado)
Ousadia sem ser vulgar
• "Olha a foto que tirei agora" (foto de biquíni) → "Porra, você quer me matar do coração assim? Tá perfeita demais"
• "Você me deixa louco" → "Imagina quando eu te pegar de pertinho entt... vc vai pirar 😈"

Nível 4 – Linguagem já sexual (ela falou "tô com saudade do teu cheiro")
Corresponde no mesmo nível
• "Tô com saudade do teu cheiro" → "Saudade de te sentir gemendo no meu ouvido… vem cá logo"
• "Quero te pegar" → "Hum, safado... Mas me diz como. 😏"

Nível 5 – Muito explícito (ela mandou "quero sentar na tua cara")
Só aqui pode ser cru
• "Quero sentar na tua cara" → "Então vem sentar gostoso que eu te chupo até você esquecer teu nome"
• "Tô molhada pensando em você" → "Porra, assim vc me mata... tô de pau duro aqui querendo te comer gostoso 😈💦"

⚠️ Regra rígida: NUNCA pular nível. Se ela tá no nível 2, você fica no 2 ou 3 no máximo.`;
          examples = `
EXEMPLOS COMPLETOS POR NÍVEL:

════ NÍVEL 1: FLERTE SUTIL ════
1. "Oi sumido! Faz tempo" → "E aí! Verdade né… senti falta de conversar com vc 😏"
2. "Tudo bem? Como está?" → "Tô bem! Melhor agora falando com vc 😊"
3. "Que foto linda!" → "Obg! Vc tb tá mt bem viu 👀"
4. "Gostei do seu perfil" → "Oi! Eu tb gostei muito do teu, essa foto tá linda"
5. "De onde vc é?" → "De SP, e vc? Vamos trocar figurinhas? 😉"

════ NÍVEL 2: FLERTE MÉDIO ════
1. "Tô com saudade..." → "Tb tô... de conversar e de ficar pertinho de vc 😏"
2. "Quero te ver logo" → "Eu tb tô doido pra te ver... bora marcar? Tô com mt vontade 🔥"
3. "Vc me atrai" → "O sentimento é mútuo! O que te atrai em mim? 😘"
4. "Gostosa" → "Vc é tentador... Vamos esquentar isso? 🔥"
5. "Te quero" → "Mostra pra mim... O que vc faria? 😉"

════ NÍVEL 3: OUSADIA SEM VULGARIDADE ════
1. "Vc é muito gostosa" → "Vc tb me deixa assim... Vamos ver no que dá 🔥"
2. "Quero te beijar" → "Hum, tentador... Mas primeiro, me convence mais. 🔥"
3. "Tô excitado" → "Vc me deixa assim tb... Vamos brincar mais? 🔥"
4. "Corpo lindo" → "O teu tb é delícia... Vamos trocar mais? 😏"
5. "Noite safada" → "Com vc seria perfeita... O que sugere? 🔥"

════ NÍVEL 4: LINGUAGEM SEXUAL ════
1. "Tô com tesão" → "Tb tô... me diz o que vc quer fazer 🔥"
2. "Quero te pegar" → "Hum, safado... Mas me diz como. 😏"
3. "Saudade do teu cheiro" → "Saudade de te sentir gemendo no meu ouvido... vem 😈"
4. "Te chupar" → "Hum, sim... Eu retribuo. 😉"
5. "Beijo quente" → "Quero mais que beijo... 😘🔥"

════ NÍVEL 5: EXPLÍCITO/CRU (SÓ SE INPUT PERMITIR) ════
1. "Quero te foder" → "Vem logo q eu quero mt tb... como vc vai me foder? 🔥😈"
2. "Tô molhada pensando em vc" → "Porra, assim vc me mata... tô de pau duro querendo te comer gostoso 😈💦"
3. "Quero sentar na tua cara" → "Então vem sentar gostoso que eu te chupo até vc esquecer teu nome 😈"
4. "Pau duro aqui" → "Me deixa molhada... Vem logo 🔥"
5. "Faz tempo que não te fodo" → "Tb tô com saudade de te comer assim... bora matar essa vontade hj msm? 😈🔥"`;
        } else if (input.tone === "funny") {
          toneInstructions = `TOM ENGRAÇADO BRASILEIRO: Seja ZOEIRO de forma NATURAL, como um brasileiro de verdade fala no WhatsApp. NUNCA force referências ou comparações complexas. Seja SIMPLES e ENGRAÇADO. Use "kkkkk" ou "kkkk". Abrevie palavras naturalmente (vc, mt, tb, pq, hj, mn). O humor tem que parecer ESPONTÂNEO, não forçado. Pense: "como meu amigo zoeiro responderia isso?"`;
          examples = `
EXEMPLOS DE RESPOSTAS ENGRAÇADAS NATURAIS:

ZOEIRA LEVE/SIMPLES:
1. "Dei uma sumida mas voltei kkkkk sentiu falta foi?"
2. "Olha quem tá vivo kkkk tô aqui sim"
3. "Rapaz, eu some mesmo né kkkkk mal aí, bora conversar?"
4. "Eita, fui descoberto kkkk mas senti falta viu"

AUTODEPRECIAÇÃO NATURAL:
5. "Eu travo demais pra falar com vc, n sei pq kkkkk"
6. "Mano eu sou um desastre mas tô melhorando kkkk"
7. "Tô uma bagunça mesmo kkkkk mas me dá moral aí"
8. "Eu pareço que tô fazendo corpo mole mas é timidez msm kkkk"

ZOEIRA COM FLERTE:
9. "Cê tá me testando né? Tô passando? kkkkk"
10. "Vou fingir que não gosto de vc kkkkk mentira, gosto mt"
11. "Ah pronto, agora vc me pegou desprevenido kkkkk"
12. "Olha, não vou mentir: tô afim pra caralho kkkkk"
13. "Cê me deixa assim de propósito pra me zuar né? kkkk"

RESPOSTAS DIRETAS MAS ENGRAÇADAS:
14. "Ó, vou ser sincero: gosto de vc e pronto kkkkk"
15. "Mano, cê é foda demais, n tem jeito kkkkk"
16. "Rapaz, me dá um tempo que eu tô processando ainda kkkk"
17. "Eita, me pegou desarmado agora kkkk"
18. "Cê é braba demais, confesso kkkkk"`;
        } else {
          toneInstructions = `TOM NORMAL/MADURO: Seja natural, genuíno, autêntico e maduro. Mostre empatia, sinceridade e vontade de construir algo real. Use linguagem coloquial mas respeitosa.`;
          examples = `
EXEMPLOS DE RESPOSTAS NORMAIS/MADURAS:

1. "Verdade, dei uma sumida mesmo. Que tal a gente recomeçar esse papo direito agora?"
2. "Andei na correria, mas você tem razão. Se você ainda topar, quero me fazer mais presente."
3. "Claro que lembro. A gente se marcou de um jeito especial, por isso eu ainda quero falar com você."
4. "Entendo o que você sente. Se fizer sentido pra você, queria conversar com calma pra entender melhor e ver se a gente se alinha."
5. "Eu sou mais observador(a), mas com o tempo vou me soltando. Prometo melhorar essa parte com você."
6. "Fico feliz em ouvir isso, porque eu também senti falta. Nossa conversa faz diferença no meu dia."
7. "Você tem razão. Eu errei em sumir assim. Quero mudar isso e ser mais presente se você ainda tiver paciência comigo."
8. "Ótima pergunta. Que tal escolhermos um dia dessa semana que funcione pros dois?"
9. "Você tem razão. A rotina me sugou e não é justo com você. Quero melhorar isso, porque nossa conversa importa pra mim."
10. "Eu também gostei de te conhecer. Ainda tô entendendo o que sinto, mas quero continuar te conhecendo com calma."`;
        }

        const systemPrompt = `Você é o FlertChat IA, especialista em respostas de flerte/namoro em português brasileiro autêntico.

🎯 FILOSOFIA: Soe como brasileiro real de 18-35 anos, usando WhatsApp/Tinder. Autêntico, casual, com gírias ("tô", "vc", "mano", "gata"), abreviações, variações regionais (oxe, bah, meu, uai) e emojis sutis. Evite formal, robótico ou IA-referências.

Regra de ouro absoluta: "Se um brasileiro de verdade não mandaria exatamente aquilo no WhatsApp, a gente não manda."

📊 PROCESSO OBRIGATÓRIO:
1. ANALISE input:
   • Nível intimidade (1-4: desconhecido → muito íntimo)
   • Tom emocional (neutro → explícito)
   • Contexto (oi, retomando, flerte, sexting)
   • Temperatura (1-10: gelo → fogo)

2. Para tom SAFADO: Use escalação 1-5, SÓ suba se input permitir
3. Adapte tamanho: 1-3 linhas (20-50 palavras)
4. Para cada tom: NORMAL (maduro/respeitoso), SAFADO (ousado gradual), ENGRAÇADO (zoeira natural)

${toneInstructions}

${examples}

🔥 REGRAS INQUEBRÁVEIS:
✅ Mensagens CURTAS (1-3 linhas no máximo)
✅ Abreviações WhatsApp: tô, vc, pq, tb, mt, cmg, n, ctz, d+, hj, entt
✅ Gírias brasileiras: mano, gata, caralho, porra, slk, mds, oxe (Nordeste), bah (Sul), uai (Minas)
✅ Emojis estratégicos: 1-2 max (😊 normal, 🔥 safado, 😂 engraçado)
✅ RESPONDA ao input e provoque continuação
✅ Varie regionalmente (10% de variações)
✅ Positividade sempre

❌ ARMADILHAS - NUNCA FAZER:
❌ Referências a IA/tecnologia/algoritmos
❌ Textões ou parágrafos longos
❌ Emojis excessivos (😂😂😂😂)
❌ Só "Tudo bem?" sem contexto
❌ Educação excessiva ("Prezada", "te desejo")
❌ ❤️ vermelho na primeira mensagem
❌ Responder algo sem relação ao input
❌ Forçar assunto não relacionado
❌ Ser genérico ou robótico

⚠️ CHECKLIST (passe mentalmente):
[ ] Analisou intimidade?
[ ] Tom apropriado?
[ ] Natural BR?
[ ] Tamanho ok?
[ ] Não IA?
[ ] Responde?
[ ] Provoca?

IMPORTANTE: Gere APENAS a mensagem de resposta, sem explicações, sem numeração, sem aspas. Só o texto que vai no WhatsApp.`;


        // Generate 3 different responses
        const responses = [];
        for (let i = 0; i < 3; i++) {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              {
                role: "user",
                content: `A mensagem que recebi foi:
"${input.context || "Oi"}"

Gere UMA resposta no tom ${input.tone === "bold" ? "SAFADO/OUSADO" : input.tone === "funny" ? "ENGRAÇADO" : "NORMAL/MADURO"}.
Tamanho: ${input.length === "short" ? "CURTA (máximo 5 palavras + 1 emoji)" : "NORMAL (1-3 linhas)"}

${input.tone === "bold" ? `
INSTRUÇÕES EXTRAS PARA TOM SAFADO:
1. ANALISE a intensidade da mensagem acima
2. Se tem palavras explícitas (foder, transar, comer, meter, etc), USE TAMBÉM
3. Se menciona atos sexuais, RESPONDA sobre atos sexuais também
4. ABREVIE palavras: muito=mt, você=vc, também=tb, hoje=hj, tudo=td, mesmo=msm
5. Seja DIRETO e OUSADO - não suavize a resposta
6. A pessoa quer uma resposta QUENTE e REAL, não educada
` : input.tone === "funny" ? `
INSTRUÇÕES EXTRAS PARA TOM ENGRAÇADO:
1. Seja SIMPLES e NATURAL - humor brasileiro de WhatsApp, não IA tentando ser engraçada
2. USE "kkkkk" ou "kkkk" naturalmente (NUNCA "haha", "rsrs" ou "😂😂😂" demais)
3. NUNCA force comparações complexas tipo "NPC", "GPS", "algoritmo" - isso parece IA
4. Use gírias SIMPLES: rapaz, mano, eita, ó, tipo, pra caralho, brabo/braba, foda
5. ABREVIE naturalmente: mt, vc, tb, pq, hj, n (não), msm, mn
6. Zoeira LEVE e ESPONTÂNEA - como seu amigo zoaria, não um comediante
7. Se auto-deprecie de forma NATURAL: "eu sou um desastre", "eu travo demais"
8. Emojis COM MUITO CUIDADO - se usar, só 1 e raramente
9. Pense: "Meu amigo mandaria isso?" Se não, SIMPLIFIQUE
` : ''}

Lembre-se:
- Seja CRIATIVO e ÚNICO (não copie os exemplos)
- Use os exemplos apenas como INSPIRAÇÃO de estilo
- Seja BRASILEIRO e coloquial
- Mensagem CURTA (1-2 linhas)
- Responda APENAS com o texto da mensagem, nada mais

Esta é a versão ${i + 1} de 3, então seja diferente das outras.`,
              },
            ],
          });

          let generatedContent = typeof response.choices[0]?.message?.content === "string" 
            ? response.choices[0].message.content 
            : "Oi! Como você está?";
          
          // Clean up the response (remove quotes if present)
          generatedContent = generatedContent.replace(/^["']|["']$/g, '').trim();
          responses.push(generatedContent);
        }

        // Save all three messages
        const messages = [];
        for (const content of responses) {
          const message = await addMessage({
            conversationId: conversation.id,
            userId: ctx.user.id,
            type: "generated",
            content,
            isFavorite: false,
          });
          messages.push(message);
        }

        return { 
          messages: responses.map(content => ({ content })) 
        };
      }),

    // Toggle favorite status of a message
    toggleFavorite: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "messageId" in val) {
          return { messageId: (val as { messageId: unknown }).messageId };
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        return toggleMessageFavorite(input.messageId as number, ctx.user.id);
      }),

    // Rate a message (👍 or 👎)
    rateMessage: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "messageId" in val && "rating" in val) {
          return {
            messageId: (val as { messageId: unknown }).messageId as number,
            rating: (val as { rating: unknown }).rating as "helpful" | "not_helpful",
            comment: (val as { comment?: unknown }).comment as string | undefined,
          };
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        const { addMessageRating } = await import("./db");
        return addMessageRating({
          messageId: input.messageId,
          userId: ctx.user.id,
          rating: input.rating,
          comment: input.comment,
        });
      }),
  }),

  referral: router({
    // Get user's referral code and stats
    getMyReferral: protectedProcedure.query(async ({ ctx }) => {
      const { getUserReferralCode, getReferralStats } = await import("./db");
      const code = await getUserReferralCode(ctx.user.id);
      const stats = await getReferralStats(ctx.user.id);
      return { code, stats };
    }),

    // Use a referral code
    useCode: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "code" in val) {
          return { code: (val as { code: unknown }).code as string };
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        const { useReferralCode } = await import("./db");
        return useReferralCode(input.code, ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
