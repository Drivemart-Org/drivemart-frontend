"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, removeToken } from "@/actions/auth";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshAuth: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to fetch user state", e);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signOut = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshAuth: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
