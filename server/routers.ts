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
      .query(async ({ ctx, input }) => {
        return getConversationWithMessages(input.id as number, ctx.user.id);
      }),

    // Create a new conversation and generate first message
    generateMessage: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null) {
          const data = val as { context?: string; tone?: string };
          return { context: data.context || "", tone: data.tone || "natural" };
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        // Check if user has credits
        const subscription = await getUserSubscription(ctx.user.id);
        if (!subscription || (subscription.creditsRemaining <= 0 && subscription.creditsTotal !== -1)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "NO_CREDITS" });
        }

        // Deduct a credit (unless unlimited)
        if (subscription.creditsTotal !== -1) {
          await deductCredit(ctx.user.id);
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
          toneInstructions = `TOM SAFADO/OUSADO: Seja atrevido, sensual e provocador. Use linguagem coloquial, flerte descarado, insinuações e confiança. Mostre interesse de forma direta mas charmosa.`;
          examples = `
EXEMPLOS DE RESPOSTAS SAFADAS/OUSADAS:

1. "Saudade de conversar… e, se eu for sincero(a), saudade de você inteirinho(a) também."
2. "Talvez eu não demonstre tão bem, mas eu tô muito mais afim do que você imagina."
3. "Fofo(a) agora, mas posso ser perigosamente encantador(a) se você deixar."
4. "Tô tentando sim… a pergunta é: tô indo bem ou preciso me esforçar mais?"
5. "Então deixa eu subir de nível: que tal a gente marcar algo fora da tela pra equilibrar essas atitudes?"
6. "Se depender de mim, a resposta é: o mais rápido possível. Me diz quando você tá livre que eu vou."
7. "Sinto sim. Talvez até mais do que eu demonstro. Se você deixar, quero explorar isso com você."
8. "Falo muito sério. E se depender de mim, esse 'te ver' vira 'te ver mais vezes'."
9. "Saudade de perto eu também sinto… principalmente da sua presença do meu lado."
10. "Tô afim de algo que não seja raso. E, se for com você, melhor ainda."`;
        } else if (input.tone === "funny") {
          toneInstructions = `TOM ENGRAÇADO: Use humor, piadas, memes e referências pop. Seja criativo, leve e divertido. Faça a pessoa rir com comparações inusitadas e gírias atuais.`;
          examples = `
EXEMPLOS DE RESPOSTAS ENGRAÇADAS:

1. "Eu sumi, mas voltei mais interessante que nunca 😂 bora colocar o papo em dia?"
2. "Meu sinal de Wi-Fi social deu uma bugada, mas já normalizei e tô de volta 😅"
3. "Esquecer de você seria bug do sistema, e o meu ainda tá funcionando direitinho 😂"
4. "Com todo mundo eu falo, com você eu travo… culpa sua de ser interessante demais 😂"
5. "Olha ela mexendo com meu coração de novo 😌 também senti falta do nosso papo."
6. "Eu pareço atualização de app: sumo, mas quando volto trago melhorias 😬"
7. "Olha aí a pergunta que eu tava esperando desde 1900 e bolinha 😂"
8. "Minha bateria social deu uma descarregada, mas tô plugando de novo agora 😅"
9. "Eu gostei tanto que o algoritmo da minha cabeça só recomenda você agora 😳"
10. "Às vezes eu entro no modo avião sem avisar, mas já tô ligando o Wi‑Fi de novo 😅"`;
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

        const systemPrompt = `Você é um especialista em conversas de flerte e namoro brasileiro. Sua tarefa é gerar APENAS UMA mensagem de resposta que pareça escrita por uma pessoa REAL conversando no WhatsApp/Instagram, NÃO por IA.

${toneInstructions}

${examples}

REGRAS OBRIGATÓRIAS:
✅ Mensagens CURTAS (1-2 linhas, máximo 3)
✅ Use linguagem BRASILEIRA coloquial (tipo "tô", "pra", "tá", "né", "kkk")
✅ Seja AUTÊNTICO e humano, nunca pareça robô
✅ Use emojis COM MODERAÇÃO (1-2 no máximo, ou nenhum)
✅ Adapte ao contexto da mensagem recebida
✅ Seja criativo e VARIE as respostas (não repita os exemplos exatamente)
✅ NUNCA comece com "Oi" ou "Olá" - vá direto ao ponto da resposta

❌ NUNCA use linguagem formal ou rebuscada
❌ NUNCA faça mensagens longas ou textões
❌ NUNCA use chavões de IA tipo "Como posso ajudar"
❌ NUNCA repita os exemplos literalmente

IMPORTANTE: Gere APENAS a mensagem de resposta, sem explicações, sem numeração, sem aspas extras. Apenas o texto que a pessoa vai enviar.`;

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
  }),
});

export type AppRouter = typeof appRouter;
