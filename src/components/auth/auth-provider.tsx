"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "player" | "organizer" | "admin";
}

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: AuthUser | null;
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
