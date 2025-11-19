import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { supabaseAdmin } from "./supabase";
import * as db from "../db";
import { verifyToken } from "./session";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

async function authenticateSupabaseRequest(req: CreateExpressContextOptions["req"]): Promise<User | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !supabaseUser) {
      return null;
    }

    let user = await db.getUserByOpenId(supabaseUser.id);

    if (!user) {
      await db.upsertUser({
        openId: supabaseUser.id,
        email: supabaseUser.email ?? null,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || null,
        loginMethod: 'supabase',
        lastSignedIn: new Date(),
      });

      user = await db.getUserByOpenId(supabaseUser.id);
    } else {
      await db.upsertUser({
        openId: supabaseUser.id,
        lastSignedIn: new Date(),
      });
    }

    return user || null;
  } catch (error) {
    return null;
  }
}

async function authenticateCustomRequest(req: CreateExpressContextOptions["req"]): Promise<User | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  // Verify JWT
  const payload = await verifyToken(token);
  if (!payload) return null;

  // Get user
  const user = await db.getUserById(payload.userId);
  return user || null;
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // 1. Try Custom Auth first (since it's local and faster)
  try {
    user = await authenticateCustomRequest(opts.req);
  } catch (e) { }

  // 2. If not found, try Supabase (legacy/fallback)
  if (!user) {
    try {
      user = await authenticateSupabaseRequest(opts.req);
    } catch (e) { }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
