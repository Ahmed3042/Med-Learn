// BookmarkService — persists lesson and page bookmarks locally.
//
// FUTURE REPLACEMENT: Replace with Supabase table (bookmarks).
// Use RLS to ensure users only see their own bookmarks.

import type { Bookmark } from '../types';
import { StorageService } from './StorageService';

const bookmarksKey = (userId: string) => `bookmarks:${userId}`;

function generateId(): string {
  return `bm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const BookmarkService = {
  getAll(userId: string): Bookmark[] {
    return StorageService.get<Bookmark[]>(bookmarksKey(userId)) ?? [];
  },

  isBookmarked(userId: string, lessonId: string, documentPage?: number): boolean {
    const bookmarks = BookmarkService.getAll(userId);
    return bookmarks.some(b =>
      b.lessonId === lessonId &&
      (documentPage === undefined ? b.documentPage === undefined : b.documentPage === documentPage)
    );
  },

  isLessonBookmarked(userId: string, lessonId: string): boolean {
    return BookmarkService.isBookmarked(userId, lessonId, undefined);
  },

  isPageBookmarked(userId: string, lessonId: string, page: number): boolean {
    return BookmarkService.isBookmarked(userId, lessonId, page);
  },

  add(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
    const bookmarks = BookmarkService.getAll(bookmark.userId);
    // Prevent accidental duplicates
    const existing = bookmarks.find(b =>
      b.lessonId === bookmark.lessonId &&
      (bookmark.documentPage === undefined ? b.documentPage === undefined : b.documentPage === bookmark.documentPage)
    );
    if (existing) {
      return existing;
    }

    const newBookmark: Bookmark = {
      ...bookmark,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    bookmarks.push(newBookmark);
    StorageService.set(bookmarksKey(bookmark.userId), bookmarks);
    return newBookmark;
  },

  remove(userId: string, bookmarkId: string): void {
    const bookmarks = BookmarkService.getAll(userId).filter(b => b.id !== bookmarkId);
    StorageService.set(bookmarksKey(userId), bookmarks);
  },

  toggleLesson(userId: string, lessonId: string, courseId: string, subjectId: string): boolean {
    const bookmarks = BookmarkService.getAll(userId);
    const existing = bookmarks.find(b => b.lessonId === lessonId && b.documentPage === undefined);
    if (existing) {
      BookmarkService.remove(userId, existing.id);
      return false; // removed
    } else {
      BookmarkService.add({ userId, lessonId, courseId, subjectId });
      return true; // added
    }
  },

  togglePage(userId: string, lessonId: string, courseId: string, subjectId: string, page: number): boolean {
    const bookmarks = BookmarkService.getAll(userId);
    const existing = bookmarks.find(b => b.lessonId === lessonId && b.documentPage === page);
    if (existing) {
      BookmarkService.remove(userId, existing.id);
      return false; // removed
    } else {
      BookmarkService.add({ userId, lessonId, courseId, subjectId, documentPage: page });
      return true; // added
    }
  },
};
