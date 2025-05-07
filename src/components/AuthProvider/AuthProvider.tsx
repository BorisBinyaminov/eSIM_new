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
        close: () => void;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    const rawUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    console.log("📦 initData from Mini App:", initData);
    console.log("👤 rawUser from initDataUnsafe:", rawUser);

    const sendToBackend = async () => {
      if (!initData || !rawUser) {
        console.error("❌ Telegram init data missing");
        window.Telegram?.WebApp?.close(); // Close if user info is not available
        return;
      }

      try {
        const res = await fetch("https://mini.torounlimitedvpn.com/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
        });

        if (!res.ok) {
          console.error("❌ Auth failed with status:", res.status);
          window.Telegram?.WebApp?.close();
          return;
        }

        const data = await res.json();
        console.log("✅ Auth success:", data);
      } catch (err) {
        console.error("❌ Auth request error:", err);
        window.Telegram?.WebApp?.close();
      } finally {
        setLoading(false);
      }
    };

    sendToBackend();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}

export const useAuth = (): AuthContextType => useContext(AuthContext);
