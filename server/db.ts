import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, subscriptions, conversations, messages, transactions, referrals, messageRatings, InsertSubscription, InsertConversation, InsertMessage, InsertTransaction, InsertReferral, InsertMessageRating } from "../drizzle/schema";
import { ENV } from './_core/env';
import { nanoid } from 'nanoid';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      console.log("[Database] Connecting to database...");
      _client = postgres(process.env.DATABASE_URL);
      _db = drizzle(_client);
      console.log("[Database] Successfully connected to database");
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
    }
  } else if (!process.env.DATABASE_URL) {
    console.error("[Database] DATABASE_URL not found in environment variables");
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "password"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      // @ts-ignore
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      // @ts-ignore
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// --- New Auth Functions ---

export async function createUser(user: InsertUser) {
  const db = await getDb();
  if (!db) {
    console.error("[Database] Database not available when creating user");
    throw new Error("Database not available");
  }

  // Generate openId if not present (for email/password auth)
  const userWithOpenId = {
    ...user,
    openId: user.openId || nanoid(),
    loginMethod: user.loginMethod || 'email',
  };

  console.log("[Database] Attempting to create user:", { email: userWithOpenId.email, openId: userWithOpenId.openId });

  try {
    const result = await db.insert(users).values(userWithOpenId).returning();
    console.log("[Database] User created successfully in DB:", result[0]);
    return result[0];
  } catch (error) {
    console.error("[Database] Error creating user:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.error("[Database] Cannot get user by email: database not available");
    return undefined;
  }
  console.log("[Database] Searching for user by email:", email);
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  console.log("[Database] User search result:", result[0] ? `Found user ${result[0].id}` : "User not found");
  return result[0];
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

// Subscription helpers
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(subscriptions).values(data);
  return getUserSubscription(data.userId);
}

export async function updateSubscription(userId: number, data: Partial<InsertSubscription>) {
  const db = await getDb();
  if (!db) return null;

  await db.update(subscriptions).set(data).where(eq(subscriptions.userId, userId));
  return getUserSubscription(userId);
}

export async function deductCredit(userId: number) {
  const db = await getDb();
  if (!db) return false;

  const subscription = await getUserSubscription(userId);
  if (!subscription || subscription.creditsRemaining <= 0) {
    return false;
  }

  await db.update(subscriptions)
    .set({ creditsRemaining: subscription.creditsRemaining - 1 })
    .where(eq(subscriptions.userId, userId));

  // Log transaction
  await db.insert(transactions).values({
    userId,
    type: "credit_used",
    amount: 1,
    description: "Geração de mensagem",
  });

  return true;
}

export async function decrementCredits(userId: number) {
  return deductCredit(userId);
}

// Conversation helpers
export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.createdAt));
}

// Alias for router compatibility
export const getConversations = getUserConversations;

export async function getConversationWithMessages(conversationId: number, userId?: number) {
  const db = await getDb();
  if (!db) return null;

  const query = db.select().from(conversations).where(eq(conversations.id, conversationId));

  // If userId is provided, verify ownership (optional but good practice)
  // But the original function required userId. Let's keep it flexible or strict.
  // The router checks ownership separately.

  const conversation = await query.limit(1);

  if (conversation.length === 0) return null;

  const conversationMessages = await db.select().from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);

  return {
    ...conversation[0],
    messages: conversationMessages,
  };
}

// Alias for router compatibility
export const getConversation = async (conversationId: number) => {
  // Note: Original required userId, but router calls it with just ID and checks ownership later.
  // We need to adapt.
  const db = await getDb();
  if (!db) return null;
  const res = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1);
  return res[0];
};

export async function createConversation(userId: number, title?: string) {
  const db = await getDb();
  if (!db) return null;

  const data: InsertConversation = {
    userId,
    title: title || "Nova conversa",
    context: "",
    tone: "natural"
  };

  const result = await db.insert(conversations).values(data).returning();
  return result.length > 0 ? result[0] : null;
}

// Message helpers
export async function addMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(messages).values(data).returning();
  return result.length > 0 ? result[0] : null;
}

export async function getMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

export async function toggleMessageFavorite(messageId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const message = await db.select().from(messages)
    .where(and(eq(messages.id, messageId), eq(messages.userId, userId)))
    .limit(1);

  if (message.length === 0) return null;

  const newFavoriteStatus = !message[0].isFavorite;
  await db.update(messages)
    .set({ isFavorite: newFavoriteStatus })
    .where(eq(messages.id, messageId));

  const updated = await db.select().from(messages).where(eq(messages.id, messageId)).limit(1);
  return updated.length > 0 ? updated[0] : null;
}

// Transaction helpers
export async function createTransaction(data: InsertTransaction) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(transactions).values(data);
  return true;
}

// Referral helpers
export async function getUserReferralCode(userId: number): Promise<string> {
  const db = await getDb();
  if (!db) return '';

  // Check if user already has a referral code
  const existing = await db.select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0].code;
  }

  // Generate a unique code
  const code = nanoid(10).toUpperCase();

  // Create new referral entry
  await db.insert(referrals).values({
    referrerId: userId,
    code,
    status: 'pending',
  });

  return code;
}

export async function getReferralStats(userId: number) {
  const db = await getDb();
  if (!db) return { totalReferrals: 0, totalCreditsEarned: 0 };

  const refs = await db.select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId));

  const totalReferrals = refs.filter(r => r.status === 'completed').length;
  const totalCreditsEarned = refs.reduce((sum, r) => sum + r.creditsEarned, 0);

  return { totalReferrals, totalCreditsEarned };
}

export async function useReferralCode(code: string, userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Find the referral code
  const referral = await db.select()
    .from(referrals)
    .where(eq(referrals.code, code))
    .limit(1);

  if (referral.length === 0) {
    throw new Error('Código de indicação inválido');
  }

  const ref = referral[0];

  // Check if already used
  if (ref.referredId !== null) {
    throw new Error('Este código já foi usado');
  }

  // Check if user is trying to use their own code
  if (ref.referrerId === userId) {
    throw new Error('Você não pode usar seu próprio código');
  }

  // Update referral
  await db.update(referrals)
    .set({
      referredId: userId,
      status: 'completed',
      creditsEarned: 20, // Reward for referrer
      usedAt: new Date(),
    })
    .where(eq(referrals.id, ref.id));

  // Add credits to referrer
  const referrerSub = await getUserSubscription(ref.referrerId);
  if (referrerSub) {
    await db.update(subscriptions)
      .set({
        creditsRemaining: referrerSub.creditsRemaining + 20,
      })
      .where(eq(subscriptions.userId, ref.referrerId));

    // Log transaction for referrer
    await createTransaction({
      userId: ref.referrerId,
      type: 'credit_added',
      amount: 20,
      description: 'Créditos ganhos por indicação',
    });
  }

  // Add credits to new user
  const userSub = await getUserSubscription(userId);
  if (userSub) {
    await db.update(subscriptions)
      .set({
        creditsRemaining: userSub.creditsRemaining + 10,
      })
      .where(eq(subscriptions.userId, userId));

    // Log transaction for new user
    await createTransaction({
      userId,
      type: 'credit_added',
      amount: 10,
      description: 'Bônus por usar código de indicação',
    });
  }

  return {
    success: true,
    message: 'Código aplicado! Você ganhou 10 créditos grátis! 🎉',
  };
}

// Message Rating helpers
export async function addMessageRating(data: InsertMessageRating) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(messageRatings).values(data);
  return true;
}
