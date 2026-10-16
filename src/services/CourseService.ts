// CourseService — curriculum data service for courses, subjects, modules, lessons, and instructors.
//
// V1: backed by local mock data.
// FUTURE REPLACEMENT: Replace with API or Supabase client queries.
// Pages and components consume only this service interface.

import type { Course, Subject, Module, Lesson, Instructor } from '../types';
import {
  COURSES,
  COURSE_LIST,
  SUBJECTS,
  SUBJECT_LIST,
  MODULES,
  MODULE_LIST,
  LESSONS,
  LESSON_LIST,
  INSTRUCTORS,
  getLessonsForModule as mockGetLessonsForModule,
  getModulesForSubject as mockGetModulesForSubject,
  getSubjectsForCourse as mockGetSubjectsForCourse,
  getLessonsForCourse as mockGetLessonsForCourse,
  getAdjacentLessons as mockGetAdjacentLessons,
} from '../data/mockData';

export const CourseService = {
  // Courses
  getAllCourses(): Course[] {
    return COURSE_LIST;
  },

  getCourse(id: string): Course | undefined {
    return COURSES[id];
  },

  getEnrolledCourses(enrolledIds: string[]): Course[] {
    return enrolledIds.map(id => COURSES[id]).filter((c): c is Course => Boolean(c));
  },

  // Subjects
  getAllSubjects(): Subject[] {
    return SUBJECT_LIST;
  },

  getSubject(id: string): Subject | undefined {
    return SUBJECTS[id];
  },

  getSubjectsForCourse(courseId: string): Subject[] {
    return mockGetSubjectsForCourse(courseId);
  },

  // Modules
  getAllModules(): Module[] {
    return MODULE_LIST;
  },

  getModule(id: string): Module | undefined {
    return MODULES[id];
  },

  getModulesForSubject(subjectId: string): Module[] {
    return mockGetModulesForSubject(subjectId);
  },

  // Lessons
  getAllLessons(): Lesson[] {
    return LESSON_LIST;
  },

  getLesson(id: string): Lesson | undefined {
    return LESSONS[id];
  },

  getLessonsForModule(moduleId: string): Lesson[] {
    return mockGetLessonsForModule(moduleId);
  },

  getLessonsForCourse(courseId: string): Lesson[] {
    return mockGetLessonsForCourse(courseId);
  },

  getAdjacentLessons(lesson: Lesson): { prev?: Lesson; next?: Lesson } {
    return mockGetAdjacentLessons(lesson);
  },

  // Instructors
  getInstructor(id: string): Instructor | undefined {
    return INSTRUCTORS[id];
  },

  getInstructors(): Record<string, Instructor> {
    return INSTRUCTORS;
  },
};
