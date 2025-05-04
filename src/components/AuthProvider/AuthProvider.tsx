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
    const initAuth = async () => {
      console.debug("[Auth] Starting initAuth");
      if (window.Telegram && window.Telegram.WebApp) {
        console.debug("[Auth] Telegram WebApp detected");
        window.Telegram.WebApp.ready();

        const rawInitData = window.Telegram.WebApp.initData;
        const unsafeUser = window.Telegram.WebApp.initDataUnsafe?.user;
        console.debug("[Auth] initDataUnsafe.user =", unsafeUser);
        console.debug("[Auth] raw initData =", rawInitData);

        if (unsafeUser) {
          if (secureCheckEnabled) {
            console.debug("[Auth] secureCheckEnabled, posting to backend");
            try {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL;
              const response = await fetch("http://localhost:5000/auth/telegram", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initData: window.Telegram.WebApp.initData }),
              });
              const data = await response.json();
              console.debug("[Auth] backend response:", data);
              if (response.ok && data.success) {
                console.debug("[Auth] Setting real Telegram user from backend");
                setUser(data.user);
              } else {
                console.error(
                  "[Auth] Authentication failed on backend:",
                  data
                );
                // fallback to unsafe
                setUser(unsafeUser);
              }
            } catch (err) {
              console.error("[Auth] Network error:", err);
              // fallback to unsafe
              setUser(unsafeUser);
            }
          } else {
            console.warn(
              "[Auth] secureCheckEnabled=false, using unsafe user for dev"
            );
            setUser(unsafeUser);
          }
        } else {
          console.warn("[Auth] initDataUnsafe.user missing, cannot auth");
          setUser(null);
        }
      } else {
        console.warn("[Auth] Telegram WebApp not found, using test stub");
        setUser({
          id: 123456,
          first_name: "Тестовый",
          last_name: "Пользователь",
          username: "test_user",
        });
      }
      setLoading(false);
      console.debug("[Auth] initAuth done");
    };

    initAuth();
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
