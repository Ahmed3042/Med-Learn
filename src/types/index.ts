// Core domain types for Med-Learn
// These are the canonical data shapes used throughout the app.
// When Supabase is integrated, these will map to database row types.

export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  faculty: string;
  year: string;
  enrolledCourseIds: string[];
  createdAt: string;
}

export type LessonType = 'video' | 'document' | 'quiz' | 'mixed';

export interface Lesson {
  id: string;
  moduleId: string;
  subjectId: string;
  courseId: string;
  title: string;
  type: LessonType;
  description?: string;
  durationMinutes?: number; // for video lessons
  pageCount?: number;        // for document lessons
  order: number;
  // Future: videoId for Bunny Stream, documentKey for R2
  videoPlaceholder?: boolean;
  documentPlaceholder?: boolean;
}

export interface Module {
  id: string;
  subjectId: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessonIds: string[];
}

export interface Subject {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  color: string; // for UI accent
  order: number;
  moduleIds: string[];
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  instructorId: string;
  faculty: string;
  year: string;
  color: string;     // brand color for this course
  icon: string;      // emoji or svg symbol
  totalLessons: number;
  subjectIds: string[];
  createdAt: string;
}

export interface Progress {
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  // video progress: lessonId -> seconds watched
  videoProgress: Record<string, number>;
  lastOpenedLessonId?: string;
  lastOpenedCourseId?: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  subjectId: string;
  // For document bookmarks: optional page
  documentPage?: number;
  note?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  courseId?: string;
  subjectId?: string;
  lessonId?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth session - simplified for V1 local auth
// Will be replaced by Supabase Session when backend is introduced
export interface AuthSession {
  user: User;
  token: string; // placeholder JWT-like token for future use
  expiresAt: string;
}
