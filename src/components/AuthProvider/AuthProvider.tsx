'use client';
import { createContext, useState, useEffect, ReactNode } from 'react';

// Типы
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  auth_date?: string;
  hash?: string;
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
          [key: string]: any;
        };
      };
    };
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const login = () => {
    console.log('Пользователь должен быть авторизован автоматически через Telegram WebApp');
  };

  useEffect(() => {
    const authenticateUser = async () => {
      if (typeof window !== 'undefined') {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.ready();
          const initData = window.Telegram.WebApp.initDataUnsafe;
          console.log('initDataUnsafe:', initData);

          if (initData && initData.user) {
            const secureCheckEnabled = false; // <- 👉 true = проверка через сервер, false = отключена

            if (secureCheckEnabled) {
              // ✅ ПРОВЕРКА ЧЕРЕЗ API (защищённый режим)
              try {
                const response = await fetch('/api/auth', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(initData),
                });

                const data = await response.json();
                if (response.ok && data.status === 'success') {
                  setUser(initData.user);
                } else {
                  console.error('Ошибка авторизации на сервере:', data.message);
                }
              } catch (error) {
                console.error('Ошибка при выполнении запроса авторизации:', error);
              } finally {
                setLoading(false);
              }
            } else {
              // ✅ УПРОЩЁННЫЙ РЕЖИМ (для тестов/разработки)
              setUser(initData.user);
              setLoading(false);
            }
          } else {
            console.log('Пользователь не найден в Telegram WebApp, устанавливаю тестовые данные');
            setUser({
              id: 123456,
              first_name: 'Тестовый',
              last_name: 'Пользователь',
              username: 'test_user',
            });
            setLoading(false);
          }
        } else {
          console.log('Telegram WebApp не найден');
          setLoading(false);
        }
      }
    };

    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
