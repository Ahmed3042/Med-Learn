// ProgressService — tracks lesson completion and video progress.
//
// FUTURE REPLACEMENT: Replace with Supabase table queries.
// The interface must remain the same; only the implementation changes.
// Consider adding optimistic updates + sync queue when moving to Supabase.

import type { Progress } from '../types';
import { StorageService } from './StorageService';

function progressKey(userId: string, courseId: string) {
  return `progress:${userId}:${courseId}`;
}

function lastOpenedKey(userId: string) {
  return `progress:lastOpened:${userId}`;
}

export const ProgressService = {
  getProgress(userId: string, courseId: string): Progress {
    const stored = StorageService.get<Progress>(progressKey(userId, courseId));
    return (
      stored ?? {
        userId,
        courseId,
        completedLessonIds: [],
        videoProgress: {},
        updatedAt: new Date().toISOString(),
      }
    );
  },

  markLessonComplete(userId: string, courseId: string, lessonId: string): void {
    const progress = ProgressService.getProgress(userId, courseId);
    if (!progress.completedLessonIds.includes(lessonId)) {
      progress.completedLessonIds.push(lessonId);
    }
    progress.updatedAt = new Date().toISOString();
    StorageService.set(progressKey(userId, courseId), progress);
  },

  markLessonIncomplete(userId: string, courseId: string, lessonId: string): void {
    const progress = ProgressService.getProgress(userId, courseId);
    progress.completedLessonIds = progress.completedLessonIds.filter(id => id !== lessonId);
    progress.updatedAt = new Date().toISOString();
    StorageService.set(progressKey(userId, courseId), progress);
  },

  saveVideoProgress(userId: string, courseId: string, lessonId: string, seconds: number): void {
    const progress = ProgressService.getProgress(userId, courseId);
    progress.videoProgress[lessonId] = seconds;
    progress.updatedAt = new Date().toISOString();
    StorageService.set(progressKey(userId, courseId), progress);
  },

  getVideoProgress(userId: string, courseId: string, lessonId: string): number {
    const progress = ProgressService.getProgress(userId, courseId);
    return progress.videoProgress[lessonId] ?? 0;
  },

  setLastOpened(userId: string, courseId: string, lessonId: string): void {
    StorageService.set(lastOpenedKey(userId), { courseId, lessonId });
  },

  getLastOpened(userId: string): { courseId: string; lessonId: string } | null {
    return StorageService.get(lastOpenedKey(userId));
  },

  getCourseCompletionPercent(userId: string, courseId: string, totalLessons: number): number {
    if (totalLessons === 0) return 0;
    const progress = ProgressService.getProgress(userId, courseId);
    return Math.round((progress.completedLessonIds.length / totalLessons) * 100);
  },

  isLessonComplete(userId: string, courseId: string, lessonId: string): boolean {
    const progress = ProgressService.getProgress(userId, courseId);
    return progress.completedLessonIds.includes(lessonId);
  },
};
