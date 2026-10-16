// App-wide React context for auth state.
// Components call useAuth() — they never import AuthService directly.

import React, { useState, useCallback } from 'react';
import type { User } from '../types';
import { AuthService } from '../services/AuthService';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // getSession() is synchronous (local storage), so restore the session during
  // initial state instead of in an effect. When AuthService becomes async
  // (real backend), switch back to an effect + isLoading state.
  const [user, setUser] = useState<User | null>(() => AuthService.getSession()?.user ?? null);
  const isLoading = false;

  const login = useCallback(async (email: string, password: string) => {
    const session = await AuthService.login(email, password);
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


