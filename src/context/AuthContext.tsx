import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithPhone: (phone: string, password: string) => Promise<{ error?: string }>;
  signUpWithPhone: (phone: string, password: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession();
      if (mounted) {
        setSession(activeSession);
        setUser(activeSession?.user ?? null);
        setLoading(false);
      }
    };

    fetchSession();

    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
        setLoading(false);
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/dashboard" } });
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) return { error: "Supabase is not configured" };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!supabase) return { error: "Supabase is not configured" };
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/dashboard" } });
    return { error: error?.message };
  };

  const resetPassword = async (email: string) => {
    if (!supabase) return { error: "Supabase is not configured" };
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/auth/sign-in" });
    return { error: error?.message };
  };

  const signInWithPhone = async (phone: string, password: string) => {
    if (!supabase) return { error: "Supabase is not configured" };
    const { error } = await supabase.auth.signInWithPassword({ phone, password });
    return { error: error?.message };
  };

  const signUpWithPhone = async (phone: string, password: string) => {
    if (!supabase) return { error: "Supabase is not configured" };
    const { error } = await supabase.auth.signUp({ phone, password, options: { channel: 'sms' } });
    return { error: error?.message };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut, signInWithEmail, signUpWithEmail, signInWithPhone, signUpWithPhone, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
