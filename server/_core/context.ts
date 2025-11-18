import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { supabaseAdmin } from "./supabase";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

async function authenticateSupabaseRequest(req: CreateExpressContextOptions["req"]): Promise<User | null> {
  // Extract JWT token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    // Verify JWT token with Supabase
    const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !supabaseUser) {
      console.warn('[Auth] Invalid Supabase token:', error?.message);
      return null;
    }

    // Get or create user in our database
    let user = await db.getUserByOpenId(supabaseUser.id);

    if (!user) {
      // First time login - create user in our database
      await db.upsertUser({
        openId: supabaseUser.id, // Use Supabase Auth UID as openId
        email: supabaseUser.email ?? null,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || null,
        loginMethod: 'supabase',
        lastSignedIn: new Date(),
      });

      user = await db.getUserByOpenId(supabaseUser.id);
    } else {
      // Update last signed in
      await db.upsertUser({
        openId: supabaseUser.id,
        lastSignedIn: new Date(),
      });
    }

    return user;
  } catch (error) {
    console.error('[Auth] Supabase authentication error:', error);
    return null;
  }
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await authenticateSupabaseRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
