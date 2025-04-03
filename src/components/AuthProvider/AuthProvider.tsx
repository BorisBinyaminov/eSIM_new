'use client'
import { createContext, useState, useEffect, ReactNode } from 'react';

// Интерфейс для данных пользователя Telegram
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface AuthContextType {
  user: TelegramUser | null;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        initDataUnsafe: {
          user?: TelegramUser;
        };
      };
    };
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      const initData = window.Telegram.WebApp.initDataUnsafe;
      if (initData && initData.user) {
        setUser(initData.user);
      }
    }
  }, []);

  useEffect(() => {
    console.log("useEffect запущен");
  
    if (typeof window !== "undefined") {
      if (window.Telegram && window.Telegram.WebApp) {
        console.log("Telegram WebApp обнаружен");
        window.Telegram.WebApp.ready();
        const initData = window.Telegram.WebApp.initDataUnsafe;
        if (initData && initData.user) {
          setUser(initData.user);
        }
      } else {
        console.log("Telegram WebApp не найден, использую тестовые данные");
        setUser({
          id: 123456,
          first_name: "Тестовый",
          last_name: "Пользователь",
          username: "test_user",
        });
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const login = () => {
    console.log('Пользователь должен быть авторизован автоматически через Telegram WebApp');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
