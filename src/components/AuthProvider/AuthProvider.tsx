"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
          };
        };
        ready: () => void;
      };
    };
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface AuthContextType {
  user: TelegramUser | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Toggle to true in production
  const secureCheckEnabled = true;

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    const rawUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  
    console.log("📦 initData from Mini App:", initData);
    console.log("👤 rawUser from initDataUnsafe:", rawUser);
  
    if (rawUser) {
      setUser(rawUser); // ✅ This is what was missing
    }
  
    const sendToBackend = async () => {
      if (!initData) return;
      try {
        const res = await fetch("http://localhost:5000/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
        });
        const data = await res.json();
        console.log("✅ Auth response:", data);
      } catch (err) {
        console.error("❌ Auth error", err);
      } finally {
        setLoading(false);
      }
    };
  
    sendToBackend();
  }, []);
  

  const login = () => {
    // no-op for WebApp
  };
  const logout = () => {
    console.debug("[Auth] logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
