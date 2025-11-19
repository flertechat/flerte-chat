import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { hashPassword, verifyPassword } from "./_core/auth";
import { generateToken } from "./_core/session";
import { invokeLLM } from "./_core/llm";
import { stripe, createCheckoutSession } from "./stripe";
import { MessageAnalysis } from "@shared/types";
import { nanoid } from "nanoid";

export const appRouter = router({
  auth: router({
    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createUser, getUserByEmail } = await import("./db");
        const existing = await getUserByEmail(input.email);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Email already in use" });
        }
        const hashedPassword = await hashPassword(input.password);
        const user = await createUser({
          email: input.email,
          password: hashedPassword,
          name: input.name || input.email.split("@")[0],
          openId: nanoid(), // Generate openId explicitly to satisfy type
          loginMethod: "email",
        });
        const token = await generateToken(user.id);
        return { user, token };
      }),

    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { getUserByEmail } = await import("./db");
        const user = await getUserByEmail(input.email);

        if (!user || !user.password) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }

        const isValid = await verifyPassword(input.password, user.password);
        if (!isValid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }

        const token = await generateToken(user.id);
        return { user, token };
      }),

    googleLogin: publicProcedure
      .input(z.object({ idToken: z.string() }))
      .mutation(async ({ input }) => {
        const { OAuth2Client } = await import("google-auth-library");
        const { createUser, getUserByEmail } = await import("./db");

        const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID;
        if (!googleClientId) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Google Client ID not configured" });
        }

        const client = new OAuth2Client(googleClientId);
        let payload;
        try {
          const ticket = await client.verifyIdToken({
            idToken: input.idToken,
            audience: googleClientId,
          });
          payload = ticket.getPayload();
        } catch (error) {
          console.error("Google token verification error:", error);
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Google Token" });
        }

        if (!payload || !payload.email) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Google Token Payload" });
        }

        const { email, sub: openId, name } = payload;
        console.log("[Google Auth] Payload received:", { email, openId, name });

        let user = await getUserByEmail(email);
        console.log("[Google Auth] Existing user check:", user ? `Found user ${user.id}` : "No existing user");

        if (!user) {
          console.log("[Google Auth] Creating new user with Google auth");
          user = await createUser({
            email,
            name: name || email.split("@")[0],
            openId: `google_${openId}`,
            loginMethod: "google",
          });
          console.log("[Google Auth] New user created:", user.id);
        }

        const token = await generateToken(user.id);
        console.log("[Google Auth] Token generated successfully for user:", user.id);
        console.log("[Google Auth] Returning user and token to client");
        return { user, token };
      }),

    logout: publicProcedure.mutation(() => {
      return { success: true };
    }),

    me: protectedProcedure.query(async ({ ctx }) => {
      const { getUserById } = await import("./db");
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const user = await getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      return user;
    }),
  }),

  subscription: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const { getUserSubscription, createSubscription } = await import("./db");
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      let subscription = await getUserSubscription(ctx.user.id);
      if (!subscription) {
        subscription = await createSubscription({
          userId: ctx.user.id,
          plan: "free",
          creditsRemaining: 5,
          creditsTotal: 5,
          status: "active",
        });
      }
      return subscription;
    }),

    createCheckout: protectedProcedure
      .input(z.object({
        planId: z.string(),
        interval: z.enum(["weekly", "monthly"]).optional().default("monthly"),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        const { getUserSubscription } = await import("./db");
        const { SUBSCRIPTION_PLANS } = await import("@shared/products");

        const planConfig = SUBSCRIPTION_PLANS[input.planId];
        if (!planConfig) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid plan" });
        }

        const session = await createCheckoutSession({
          userId: ctx.user.id,
          userEmail: ctx.user.email || "",
          userName: ctx.user.name || "User",
          priceId: planConfig.stripePriceId,
          plan: input.planId,
          interval: input.interval as "weekly" | "monthly",
          origin: ctx.req.headers.origin || "http://localhost:3000",
        });

        return { url: session.url };
      }),

    cancel: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const { getUserSubscription, updateSubscription } = await import("./db");
      const subscription = await getUserSubscription(ctx.user.id);

      if (!subscription) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Subscription not found" });
      }

      if (subscription.plan === "free") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot cancel free plan" });
      }

      if (subscription.stripeSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        } catch (error) {
          console.error("Error cancelling Stripe subscription:", error);
        }
      }

      await updateSubscription(ctx.user.id, {
        status: "cancelled",
        // cancelAtPeriodEnd is not in schema, ignoring for now or should add to schema
      });

      return { success: true };
    }),
  }),

  flerte: router({
    getConversations: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const { getConversations } = await import("./db");
      return getConversations(ctx.user.id);
    }),

    getConversation: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        const { getMessages, getConversation } = await import("./db");
        const conversation = await getConversation(input.conversationId);

        if (!conversation || conversation.userId !== ctx.user.id) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        const messages = await getMessages(input.conversationId);
        return { ...conversation, messages };
      }),

    createConversation: protectedProcedure
      .input(z.object({ title: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        const { createConversation } = await import("./db");
        return createConversation(ctx.user.id, input.title);
      }),

    generateMessage: protectedProcedure
      .input(z.object({
        conversationId: z.number().optional(),
        context: z.string(),
        tone: z.enum(["natural", "bold", "funny"]),
        length: z.enum(["short", "normal", "long"]).optional().default("normal"),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        const {
          getUserSubscription,
          decrementCredits,
          createConversation,
          addMessage,
          getConversation
        } = await import("./db");

        const subscription = await getUserSubscription(ctx.user.id);
        // creditsRemaining check
        if (!subscription || (subscription.creditsRemaining !== -1 && subscription.creditsRemaining <= 0)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient credits" });
        }

        let conversation;
        if (input.conversationId) {
          conversation = await getConversation(input.conversationId);
          if (!conversation || conversation.userId !== ctx.user.id) {
            throw new TRPCError({ code: "NOT_FOUND" });
          }
        } else {
          conversation = await createConversation(ctx.user.id, input.context.substring(0, 30) + "...");
        }

        if (!conversation) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        if (subscription.creditsRemaining !== -1) {
          await decrementCredits(ctx.user.id);
        }

        await addMessage({
          conversationId: conversation.id,
          userId: ctx.user.id,
          type: "user",
          content: input.context,
          isFavorite: false,
        });

        // ... tone logic ...
        let toneInstructions = "";
        if (input.tone === "bold") {
          toneInstructions = `TOM SAFADO/OUSADO - SISTEMA DE ESCALAÇÃO EM 5 NÍVEIS:
          1. Elogio Físico Indireto
          2. Insinuação de Interesse
          3. Elogio Físico Direto
          4. Proposta de Encontro
          5. Tensão Sexual Explícita
          Seja OUSADO, DIRETO e use gírias.`;
        } else if (input.tone === "funny") {
          toneInstructions = `TOM ENGRAÇADO BRASILEIRO: Seja ZOEIRO de forma NATURAL. Use kkkkk.`;
        } else {
          toneInstructions = `TOM NORMAL/MADURO: Seja natural, genuíno e autêntico.`;
        }

        const systemPrompt = `Você é o FlertChat IA, especialista em respostas de flerte.
        FILOSOFIA: Soe como brasileiro real.
        ${toneInstructions}
        Gere APENAS a mensagem de resposta.`;

        let analysis: MessageAnalysis = {
          score: 50,
          sentiment: "neutral",
          risk: "low",
          advice: "Seja autêntico.",
          mood: "Neutro",
          strategy: "Flerte sutil"
        };

        try {
          const analysisPrompt = `Analise a mensagem: "${input.context}". Retorne JSON: {score, sentiment, risk, advice, mood, strategy}.`;
          const analysisRes = await invokeLLM({
            messages: [
              { role: "system", content: "Retorne APENAS JSON válido." },
              { role: "user", content: analysisPrompt }
            ],
            response_format: { type: "json_object" }
          });

          const content = analysisRes.choices[0].message.content || "{}";
          // Handle content being string or array (though invokeLLM usually returns string for text model)
          const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
          const parsed = JSON.parse(contentStr);
          if (parsed.score) analysis = { ...analysis, ...parsed };
        } catch (e) {
          console.error("Analysis error", e);
        }

        const responses = [];
        for (let i = 0; i < 3; i++) {
          const res = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Mensagem: "${input.context}". Gere opção ${i + 1} de 3.` }
            ]
          });
          let text = res.choices[0].message.content || "Erro ao gerar.";
          if (typeof text !== 'string') text = JSON.stringify(text);
          text = text.replace(/^["']|["']$/g, '').trim();
          responses.push(text);
        }

        for (const content of responses) {
          await addMessage({
            conversationId: conversation.id,
            userId: ctx.user.id,
            type: "generated",
            content,
            isFavorite: false,
          });
        }

        return {
          analysis,
          messages: responses.map(content => ({ content }))
        };
      }),

    roleplay: protectedProcedure
      .input(z.object({
        message: z.string(),
        history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional(),
        persona: z.enum(["hard_to_get", "shy", "funny", "romantic", "direct"])
      }))
      .mutation(async ({ input }) => {
        const { message, history = [], persona } = input;

        const personas = {
          hard_to_get: "Você é a 'Difícil'. É cética, responde curto, faz testes.",
          shy: "Você é 'Tímida'. Fica envergonhada, usa emojis fofos (🙈), demora pra se soltar.",
          funny: "Você é a 'Zoeira'. Faz piada de tudo, usa memes, ri alto (kkkkk).",
          romantic: "Você é a 'Romântica'. Acredita em amor, é carinhosa e intensa.",
          direct: "Você é 'Direta'. Sabe o que quer, é ousada e provocativa."
        };

        const systemPrompt = `Você é uma IA simulando um DATE REAL no WhatsApp.
        PERSONA: ${personas[persona]}
        
        OBJETIVO:
        1. RESPONDER como a persona.
        2. AVALIAR a mensagem do usuário (Coach).
        
        FORMATO JSON:
        {
          "response": "Sua resposta...",
          "feedback": {
            "score": 0-100,
            "comment": "Dica curta..."
          }
        }`;

        const conversation = history.map(h => `${h.role === 'user' ? 'Ele' : 'Você'}: ${h.content}`).join('\n');
        const prompt = `${conversation}\nEle: ${message}\n\nResponda e avalie:`;

        const completion = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content || "{}";
        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
        const result = JSON.parse(contentStr);

        return {
          message: result.response,
          feedback: result.feedback
        };
      }),

    toggleFavorite: protectedProcedure
      .input(z.object({ messageId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        const { toggleMessageFavorite } = await import("./db");
        return toggleMessageFavorite(input.messageId, ctx.user.id);
      }),

    rateMessage: protectedProcedure
      .input(z.object({
        messageId: z.number(),
        rating: z.enum(["helpful", "not_helpful"]),
        comment: z.string().optional()
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
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
    getMyReferral: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const { getUserReferralCode, getReferralStats } = await import("./db");
      const code = await getUserReferralCode(ctx.user.id);
      const stats = await getReferralStats(ctx.user.id);
      return { code, stats };
    }),

    useCode: protectedProcedure
      .input(z.object({ code: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        const { useReferralCode } = await import("./db");
        return useReferralCode(input.code, ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
