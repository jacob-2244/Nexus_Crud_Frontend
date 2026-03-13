// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/User";
import { MenuItem } from "@/hooks/useMenu";

interface AuthContextType {
  user: User | null;
  token: string | null;
  menu: MenuItem[];
  login: (userData: User, menuData: MenuItem[], token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
      // No token — not logged in
      setIsLoading(false);
      return;
    }

    // CRITICAL: Always verify the token with the backend on every page load.
    // We NEVER trust the role/user stored in localStorage directly.
    // If someone edits localStorage, the token still has the original role
    // signed by the server — so /auth/me will return the real role.
    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          // Token invalid or expired — force logout
          clearSession();
          return;
        }

        const verifiedUser: User = await res.json();

        // Use the backend-verified user, ignore anything in localStorage user object
        setUser(verifiedUser);
        setToken(storedToken);

        // Update localStorage user with the verified data
        localStorage.setItem("currentUser", JSON.stringify(verifiedUser));
      })
      .catch(() => {
        // Network error — fall back to cached user but keep token
        // Menu will still be fetched fresh via useMenu hook
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          try { setUser(JSON.parse(storedUser)); } catch { clearSession(); }
        } else {
          clearSession();
        }
        setToken(storedToken);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const clearSession = () => {
    setUser(null);
    setToken(null);
    setMenu([]);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentMenu");
    localStorage.removeItem("authToken");
  };

  const login = (userData: User, menuData: MenuItem[], authToken: string) => {
    setUser(userData);
    setMenu(menuData);
    setToken(authToken);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("currentMenu", JSON.stringify(menuData));
    localStorage.setItem("authToken", authToken);
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        menu,
        login,
        logout,
        isAuthenticated: user !== null && token !== null,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};