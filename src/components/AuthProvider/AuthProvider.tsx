"use client";

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

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

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

const AuthContext = createContext<AuthContextType>({
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

  const secureCheckEnabled = true; // toggle false for local testing

  useEffect(() => {
    const initAuth = async () => {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
        const telegramUser = initDataUnsafe?.user;

        if (telegramUser) {
          if (secureCheckEnabled) {
            try {
              const response = await fetch("/auth/telegram", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: telegramUser.id,
                  first_name: telegramUser.first_name,
                  last_name: telegramUser.last_name,
                  username: telegramUser.username,
                  photo_url: telegramUser.photo_url,
                }),
              });

              if (response.ok) {
                const data = await response.json();
                setUser(data);
              } else {
                console.error("Failed to authenticate user", await response.text());
              }
            } catch (error) {
              console.error("Auth request failed:", error);
            }
          } else {
            // Insecure fallback (dev only)
            setUser({
              id: telegramUser.id,
              first_name: telegramUser.first_name,
              last_name: telegramUser.last_name,
              username: telegramUser.username,
              photo_url: telegramUser.photo_url,
            });
          }
        }
      } else {
        // Fallback test user (non-Telegram environment)
        setUser({
          id: 123456,
          first_name: "Тестовый",
          last_name: "Пользователь",
          username: "test_user",
        });
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = () => {
    // Telegram Mini App does not support custom login flow
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
export { AuthContext };
