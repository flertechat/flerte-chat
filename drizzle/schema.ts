import { pgTable, serial, text, timestamp, varchar, boolean, integer, pgEnum } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  password: text("password"), // Hashed password
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscriptions table: stores user subscription information and credits
 */
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().unique(),
  plan: varchar("plan", { length: 50 }).notNull().default("free"), // "free", "pro_weekly", "pro_monthly", "premium_weekly", "premium_monthly"
  status: varchar("status", { length: 50 }).notNull().default("active"), // "active", "cancelled", "expired"
  creditsRemaining: integer("creditsRemaining").notNull().default(10), // Free users start with 10 credits
  creditsTotal: integer("creditsTotal").notNull().default(10), // Total credits for the plan
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"), // Null for free plan
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Conversations table: stores individual conversations/sessions
 */
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull().default("Nova conversa"),
  context: text("context"), // Optional context provided by user
  tone: varchar("tone", { length: 50 }).default("natural"), // natural, funny, bold
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Messages table: stores generated messages and responses
 */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversationId").notNull(),
  userId: integer("userId").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // "generated" or "user_input"
  content: text("content").notNull(),
  isFavorite: boolean("isFavorite").default(false).notNull(),
  feedback: varchar("feedback", { length: 20 }), // "helpful", "not_helpful", null
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Transactions table: stores payment and credit transactions
 */
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // "purchase", "credit_used", "credit_added"
  amount: integer("amount").notNull(), // Credits or money amount (in cents for money)
  description: text("description"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Referrals table: stores referral codes and rewards
 */
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrerId").notNull(), // User who shared the code
  referredId: integer("referredId"), // User who used the code (null until someone uses it)
  code: varchar("code", { length: 20 }).notNull().unique(), // Unique referral code
  creditsEarned: integer("creditsEarned").notNull().default(0), // Credits earned by referrer
  status: varchar("status", { length: 20 }).notNull().default("pending"), // "pending", "completed"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  usedAt: timestamp("usedAt"), // When the code was used
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Message Ratings table: stores user feedback on generated messages
 */
export const ratingEnum = pgEnum("rating", ["helpful", "not_helpful"]);

export const messageRatings = pgTable("messageRatings", {
  id: serial("id").primaryKey(),
  messageId: integer("messageId").notNull(),
  userId: integer("userId").notNull(),
  rating: ratingEnum("rating").notNull(), // 👍 or 👎
  comment: text("comment"), // Optional feedback comment
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MessageRating = typeof messageRatings.$inferSelect;
export type InsertMessageRating = typeof messageRatings.$inferInsert;
