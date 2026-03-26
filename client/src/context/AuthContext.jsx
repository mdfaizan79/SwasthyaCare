import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/apiClient';

const AuthContext = createContext(null);

function parseStoredUser() {
  const raw = localStorage.getItem('sc_user');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(parseStoredUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sc_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sc_user');
    }
  }, [user]);

  const login = async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password });
    const payload = data?.data;

    localStorage.setItem('sc_access_token', payload.accessToken);
    localStorage.setItem('sc_refresh_token', payload.refreshToken);
    setUser(payload.user);

    return payload.user;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    const payload = data?.data;

    localStorage.setItem('sc_access_token', payload.accessToken);
    localStorage.setItem('sc_refresh_token', payload.refreshToken);
    setUser(payload.user);

    return payload.user;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('sc_refresh_token');

    try {
      await api.post('/auth/logout', { refreshToken });
    } catch {
      // Ignore logout network errors.
    }

    localStorage.removeItem('sc_access_token');
    localStorage.removeItem('sc_refresh_token');
    localStorage.removeItem('sc_user');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
