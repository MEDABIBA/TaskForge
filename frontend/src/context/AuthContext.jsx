import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, usersApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.refresh().then(async (ok) => {
      if (ok) {
        try {
          const userData = await usersApi.me();
          setUser(userData);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    });
  }, []);

  async function login(email, password) {
    const userData = await authApi.login(email, password);
    setUser(userData);
  }

  async function register(email, password, name) {
    const userData = await authApi.register(email, password, name);
    setUser(userData);
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
