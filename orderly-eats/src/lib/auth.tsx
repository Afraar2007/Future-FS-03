import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface User {
  name: string;
  email: string;
  role: "customer" | "admin";
}

interface AuthContextValue {
  user: User | null;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const KEY = "tandoor-user-v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize state from localStorage immediately
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Sync on mount in case localStorage changed
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        // Only update if different from current state
        if (JSON.stringify(parsed) !== JSON.stringify(user)) {
          setUser(parsed);
        }
      }
    } catch {
      /* ignore */
    }
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      signIn: (email, name) => {
        const u: User = {
          email,
          name: name ?? email.split("@")[0],
          role: email.toLowerCase().includes("admin") ? "admin" : "customer",
        };
        setUser(u);
        try {
          window.localStorage.setItem(KEY, JSON.stringify(u));
        } catch {
          /* ignore */
        }
      },
      signOut: () => {
        setUser(null);
        try {
          window.localStorage.removeItem(KEY);
        } catch {
          /* ignore */
        }
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
