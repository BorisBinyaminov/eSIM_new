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
        initData: string;           // signed payload
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
  loading: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);

  // toggle to false only for local dev (skips server check)
  const secureCheckEnabled = true;

  useEffect(() => {
    const initAuth = async () => {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        const initData     = window.Telegram.WebApp.initData;
        const unsafeUser   = window.Telegram.WebApp.initDataUnsafe.user;

        console.debug("Telegram WebApp initData:", initData);
        console.debug("Telegram WebApp initDataUnsafe.user:", unsafeUser);

        if (unsafeUser) {
          if (secureCheckEnabled) {
            try {
              const resp = await fetch("/auth/telegram", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initData }),
              });
              console.debug("/auth/telegram response status:", resp.status);

              if (!resp.ok) {
                console.error("Auth failed:", await resp.text());
              } else {
                const data = await resp.json();
                console.debug("/auth/telegram response JSON:", data);
                setUser({
                  id: data.user.telegram_id,
                  first_name: data.user.username,
                  photo_url: data.user.photo_url,
                  // NOTE: you can pull last_login if you need
                });
              }
            } catch (err) {
              console.error("Network error during auth:", err);
            }
          } else {
            console.warn("Secure check disabled — using unsafeUser directly");
            setUser(unsafeUser);
          }
        } else {
          console.warn("No Telegram user found — setting test user");
          setUser({
            id: 123456,
            first_name: "Тестовый",
            username: "test_user",
            photo_url: undefined,
          });
        }
      } else {
        console.warn("Not in Telegram WebApp context — skipping auth");
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = () => {
    console.log("Manual login not supported in Telegram Mini App");
  };
  const logout = () => {
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
