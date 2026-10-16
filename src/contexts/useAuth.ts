import { createContext, useContext } from 'react';
import type { User } from '../types';

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

// For pages rendered under <RequireAuth>, where a user is guaranteed.
export function useRequiredUser(): User {
  const { user } = useAuth();
  if (!user) throw new Error('useRequiredUser called without an authenticated user');
  return user;
}
