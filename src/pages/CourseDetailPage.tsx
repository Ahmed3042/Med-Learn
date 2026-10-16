import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useRequiredUser } from '../contexts/useAuth';
import type { Course } from '../types';
import { CourseService } from '../services/CourseService';
import { ProgressService } from '../services/ProgressService';
import './CourseDetailPage.css';

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? CourseService.getCourse(courseId) : undefined;
  if (!course) return <Navigate to="/courses" replace />;
  return <CourseDetailContent course={course} />;
}

function CourseDetailContent({ course }: { course: Course }) {
  const user = useRequiredUser();

  const instructor = CourseService.getInstructor(course.instructorId);
  const subjects = useMemo(() => CourseService.getSubjectsForCourse(course.id), [course.id]);
  const pct = ProgressService.getCourseCompletionPercent(user.id, course.id, course.totalLessons);

  // Get the first incomplete lesson for the "Start/Continue" button
  const allLessons = useMemo(
    () =>
      subjects.flatMap(s =>
        CourseService.getModulesForSubject(s.id).flatMap(m =>
          CourseService.getLessonsForModule(m.id)
        )
      ),
    [subjects]
  );

  const nextLesson = allLessons.find(l => !ProgressService.isLessonComplete(user.id, course.id, l.id));
  const continueLesson =
    ProgressService.getLastOpened(user.id)?.lessonId === undefined
      ? nextLesson
      : allLessons.find(l => l.id === ProgressService.getLastOpened(user.id)?.lessonId) ?? nextLesson;

  return (
    <div className="course-detail animate-fade-in">
      {/* Header */}
      <div className="course-detail__header" style={{ borderBottom: `3px solid ${course.color}` }}>
        <div className="course-detail__breadcrumb">
          <Link to="/courses">My Courses</Link>
          <span>›</span>
          <span>{course.title}</span>
        </div>
        <div className="course-detail__hero">
          <div className="course-detail__icon" style={{ background: course.color + '20', color: course.color }}>
            {course.icon}
          </div>
          <div className="course-detail__info">
            <div className="course-detail__faculty">{course.faculty} · {course.year}</div>
            <h1 className="course-detail__title">{course.title}</h1>
            <p className="course-detail__desc">{course.longDescription ?? course.description}</p>
            <div className="course-detail__meta">
              {instructor && <span>👤 {instructor.name} · {instructor.title}</span>}
              <span>📖 {course.totalLessons} lessons</span>
              <span>🗂 {course.subjectIds.length} subjects</span>
            </div>
          </div>
          <div className="course-detail__actions">
            <div className="course-detail__progress-wrap">
              <div className="course-detail__progress-label">
                <span>Progress</span>
                <strong style={{ color: course.color }}>{pct}%</strong>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <div className="progress-bar__fill" style={{ width: `${pct}%`, background: course.color }} />
              </div>
            </div>
            {continueLesson && (
              <Link
                to={`/courses/${course.id}/lessons/${continueLesson.id}`}
                className="btn btn--primary"
                style={{ background: course.color }}
              >
                {pct === 0 ? '▶ Start Course' : '▶ Continue'}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Subjects / Lessons */}
      <div className="course-detail__body page-content">
        {subjects.map(subject => {
          const modules = CourseService.getModulesForSubject(subject.id);
          return (
            <div key={subject.id} className="subject-section">
              <div className="subject-section__header">
                <div className="subject-section__dot" style={{ background: subject.color }} />
                <div>
                  <h2 className="subject-section__title">{subject.title}</h2>
                  {subject.description && (
                    <p className="subject-section__desc">{subject.description}</p>
                  )}
                </div>
                <Link to={`/courses/${course.id}/subjects/${subject.id}`} className="btn btn--ghost btn--sm">
                  View Subject →
                </Link>
              </div>

              {modules.map(module => {
                const lessons = CourseService.getLessonsForModule(module.id);
                return (
                  <div key={module.id} className="module-section">
                    <div className="module-section__header">
                      <h3 className="module-section__title">{module.title}</h3>
                      <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                        {lessons.length} lessons
                      </span>
                    </div>
                    <div className="lesson-list">
                      {lessons.map((lesson, idx) => {
                        const done = ProgressService.isLessonComplete(user.id, course.id, lesson.id);
                        return (
                          <Link
                            key={lesson.id}
                            to={`/courses/${course.id}/lessons/${lesson.id}`}
                            className={`lesson-item ${done ? 'lesson-item--done' : ''}`}
                          >
                            <div className="lesson-item__num">{done ? '✓' : idx + 1}</div>
                            <div className="lesson-item__info">
                              <span className="lesson-item__title">{lesson.title}</span>
                              {lesson.description && (
                                <span className="lesson-item__desc">{lesson.description}</span>
                              )}
                            </div>
                            <div className="lesson-item__meta">
                              <span className={`badge badge--${lesson.type}`}>{lesson.type}</span>
                              {lesson.durationMinutes && (
                                <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                                  {lesson.durationMinutes} min
                                </span>
                              )}
                              {lesson.pageCount && (
                                <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                                  {lesson.pageCount} pages
                                </span>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
