// StorageService — thin wrapper around localStorage.
// All keys are namespaced to avoid collisions.
// When Supabase replaces local storage, this file can be adapted or removed.

const NS = 'medlearn:';

export const StorageService = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(NS + key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(NS + key, JSON.stringify(value));
    } catch (err) {
      console.error('[StorageService] Failed to write:', key, err);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(NS + key);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(NS))
      .forEach(k => localStorage.removeItem(k));
  },
};
