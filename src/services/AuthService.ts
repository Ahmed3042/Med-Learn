// AuthService — local V1 implementation.
//
// FUTURE REPLACEMENT: Replace localAuth with Supabase Auth.
// The interface (login, logout, getSession, getCurrentUser) must stay the same.
// UI components only call these functions and never know the source.
//
// SECURITY NOTE: V1 uses demo credentials only. No real secrets.
// When Supabase is integrated:
//   - Remove DEMO_CREDENTIALS entirely
//   - Replace localAuth.login with supabase.auth.signInWithPassword
//   - Replace getSession with supabase.auth.getSession
//   - JWT validation moves to Supabase + Cloudflare Worker boundary

import type { AuthSession, User } from '../types';
import { StorageService } from './StorageService';
import { DEMO_USER } from '../data/mockData';

const SESSION_KEY = 'auth:session';

// Demo credentials — local simulation only, never for production
const DEMO_CREDENTIALS = {
  email: 'ahmed@medlearn.com',
  password: 'demo1234',
};

function createDemoSession(user: User): AuthSession {
  return {
    user,
    // Placeholder token — will be a real JWT from Supabase in production
    token: `demo-token-${user.id}-${Date.now()}`,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days demo expiry
  };
}

export const AuthService = {
  async login(email: string, password: string): Promise<AuthSession> {
    // Simulate network delay for realism
    await new Promise(res => setTimeout(res, 600));

    if (
      email.toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      const session = createDemoSession(DEMO_USER);
      StorageService.set<AuthSession>(SESSION_KEY, session);
      return session;
    }

    throw new Error('Invalid email or password');
  },

  async logout(): Promise<void> {
    StorageService.remove(SESSION_KEY);
  },

  getSession(): AuthSession | null {
    const session = StorageService.get<AuthSession>(SESSION_KEY);
    if (!session) return null;

    // Enforce demo-session expiration: validate expiresAt and user payload
    if (!session.expiresAt || !session.user || typeof session.expiresAt !== 'string') {
      StorageService.remove(SESSION_KEY);
      return null;
    }

    const expiryTime = new Date(session.expiresAt).getTime();
    if (isNaN(expiryTime) || expiryTime <= Date.now()) {
      StorageService.remove(SESSION_KEY);
      return null;
    }

    return session;
  },

  getCurrentUser(): User | null {
    const session = AuthService.getSession();
    return session?.user ?? null;
  },

  isAuthenticated(): boolean {
    return AuthService.getSession() !== null;
  },
};
