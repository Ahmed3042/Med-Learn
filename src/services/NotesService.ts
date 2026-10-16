// NotesService — persists student notes locally.
//
// FUTURE REPLACEMENT: Replace with Supabase table (notes).
// Notes may also support real-time sync via Supabase Realtime.

import type { Note } from '../types';
import { StorageService } from './StorageService';

const notesKey = (userId: string) => `notes:${userId}`;

function generateId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const NotesService = {
  getAll(userId: string): Note[] {
    const notes = StorageService.get<Note[]>(notesKey(userId)) ?? [];
    // Most recent first
    return notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  getById(userId: string, noteId: string): Note | undefined {
    return NotesService.getAll(userId).find(n => n.id === noteId);
  },

  getForLesson(userId: string, lessonId: string): Note[] {
    return NotesService.getAll(userId).filter(n => n.lessonId === lessonId);
  },

  create(data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const notes = StorageService.get<Note[]>(notesKey(data.userId)) ?? [];
    const now = new Date().toISOString();
    const note: Note = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    notes.push(note);
    StorageService.set(notesKey(data.userId), notes);
    return note;
  },

  update(userId: string, noteId: string, patch: Partial<Pick<Note, 'title' | 'content'>>): Note | null {
    const notes = StorageService.get<Note[]>(notesKey(userId)) ?? [];
    const idx = notes.findIndex(n => n.id === noteId);
    if (idx === -1) return null;
    notes[idx] = { ...notes[idx], ...patch, updatedAt: new Date().toISOString() };
    StorageService.set(notesKey(userId), notes);
    return notes[idx];
  },

  delete(userId: string, noteId: string): void {
    const notes = (StorageService.get<Note[]>(notesKey(userId)) ?? []).filter(n => n.id !== noteId);
    StorageService.set(notesKey(userId), notes);
  },
};
