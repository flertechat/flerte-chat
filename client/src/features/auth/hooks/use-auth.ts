import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { trpc } from "@/lib/trpc";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/login" } =
    options ?? {};

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for custom JWT token (Google login) using trpc.auth.me
  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: false, // We'll manually trigger this
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[useAuth] Checking authentication...");

      // First, check for custom JWT token in localStorage
      const customToken = localStorage.getItem("token");
      console.log("[useAuth] Custom token in localStorage:", customToken ? "Found" : "Not found");

      if (customToken) {
        // Try to fetch user data with custom token
        try {
          console.log("[useAuth] Fetching user with custom token...");
          const userData = await meQuery.refetch();
          console.log("[useAuth] User data from custom token:", userData.data);

          if (userData.data) {
            // Create a mock Supabase user object for compatibility
            const mockUser = {
              id: userData.data.id.toString(),
              email: userData.data.email || "",
              user_metadata: { name: userData.data.name },
            } as User;
            setUser(mockUser);
            setLoading(false);
            console.log("[useAuth] Authentication successful with custom token");
            return;
          }
        } catch (error) {
          console.error("[useAuth] Custom token validation failed:", error);
          // If custom token is invalid, clear it
          localStorage.removeItem("token");
        }
      }

      // Fallback to Supabase authentication
      console.log("[useAuth] Checking Supabase session...");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("[useAuth] Supabase session:", session ? "Found" : "Not found");
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkAuth();

    // Listen for Supabase auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("[useAuth] Supabase auth state changed:", session ? "Authenticated" : "Not authenticated");
      // Only update if we don't have a custom token
      if (!localStorage.getItem("token")) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    console.log("[useAuth] Logging out...");
    localStorage.removeItem("token");
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    console.log("[useAuth] Redirecting to login - user not authenticated");
    window.location.href = redirectPath;
  }, [redirectOnUnauthenticated, redirectPath, loading, user]);

  return {
    user,
    loading,
    error: null,
    isAuthenticated: Boolean(user),
    refresh: () => supabase.auth.getSession(),
    logout,
  };
}
