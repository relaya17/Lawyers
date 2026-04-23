import React, { createContext, useCallback, useContext, useState } from 'react';
import { Alert } from 'react-native';

const API = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  accessToken: null,
  loading: false,
  signIn: async () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    loading: false,
  });

  const signIn = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as {
        error?: string;
        accessToken?: string;
        user?: AuthUser;
      };
      if (!res.ok) {
        throw new Error(data.error || `שגיאה ${res.status}`);
      }
      if (!data.accessToken || !data.user) {
        throw new Error('תשובה לא תקינה מהשרת');
      }
      setState({ user: data.user, accessToken: data.accessToken, loading: false });
    } catch (err) {
      setState((s) => ({ ...s, loading: false }));
      Alert.alert('כניסה נכשלה', (err as Error).message);
      throw err;
    }
  }, []);

  const signOut = useCallback(() => {
    setState({ user: null, accessToken: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
