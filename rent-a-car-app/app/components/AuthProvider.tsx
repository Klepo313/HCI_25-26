"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name?: string;
  username?: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  setUserFromExternal: (user: {
    id: string | number;
    email: string;
    name?: string;
    username?: string;
  }) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("rac_user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_BASE || "";

  const login = async (emailOrUsername: string, password: string) => {
    // Use DummyJSON auth: POST {AUTH_BASE}/auth/login with { username, password }
    const username = emailOrUsername;
    const res = await fetch(`${AUTH_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Login failed");
    }

    const data = await res.json();

    // DummyJSON returns fields like id, username, email, firstName, lastName, accessToken
    const nameParts = [data.firstName, data.lastName].filter(Boolean);
    const fullName = nameParts.length
      ? nameParts.join(" ")
      : data.username || undefined;
    const nextUser: User = {
      id: data.id?.toString?.() ?? "",
      name: fullName,
      email: data.email,
      username: data.username,
    };

    // Persist user and token (token optional)
    setUser(nextUser);
    try {
      const payload: any = { user: nextUser };
      if (data.accessToken) payload.token = data.accessToken;
      localStorage.setItem("rac_user", JSON.stringify(payload.user));
      if (payload.token) localStorage.setItem("rac_token", payload.token);
    } catch (e) {
      // ignore
    }

    return nextUser;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("rac_user");
      localStorage.removeItem("rac_token");
    } catch (e) {
      // ignore
    }
    router.push("/");
  };

  const setUserFromExternal = (u: {
    id: string | number;
    email: string;
    name?: string;
    username?: string;
  }) => {
    const nextUser: User = {
      id: u.id.toString(),
      email: u.email,
      name: u.name,
      username: u.username,
    };
    setUser(nextUser);
    try {
      localStorage.setItem("rac_user", JSON.stringify(nextUser));
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUserFromExternal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
