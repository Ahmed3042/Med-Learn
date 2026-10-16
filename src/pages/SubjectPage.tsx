import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useRequiredUser } from '../contexts/useAuth';
import type { Course, Subject } from '../types';
import { CourseService } from '../services/CourseService';
import { ProgressService } from '../services/ProgressService';
import './SubjectPage.css';

export function SubjectPage() {
  const { courseId, subjectId } = useParams<{ courseId: string; subjectId: string }>();
  const course = courseId ? CourseService.getCourse(courseId) : undefined;
  const subject = subjectId ? CourseService.getSubject(subjectId) : undefined;
  if (!course || !subject) return <Navigate to="/courses" replace />;
  return <SubjectContent course={course} subject={subject} />;
}

function SubjectContent({ course, subject }: { course: Course; subject: Subject }) {
  const user = useRequiredUser();

  const modules = useMemo(() => CourseService.getModulesForSubject(subject.id), [subject.id]);

  return (
    <div className="subject-page animate-fade-in">
      <div className="page-header">
        <div className="subject-page__breadcrumb">
          <Link to="/courses">Courses</Link>
          <span>›</span>
          <Link to={`/courses/${course.id}`}>{course.title}</Link>
          <span>›</span>
          <span>{subject.title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
          <div className="subject-page__dot" style={{ background: subject.color }} />
          <h1>{subject.title}</h1>
        </div>
        {subject.description && <p className="page-header__subtitle">{subject.description}</p>}
      </div>

      <div className="page-content">
        {modules.map(module => {
          const lessons = CourseService.getLessonsForModule(module.id);
          const completedCount = lessons.filter(l =>
            ProgressService.isLessonComplete(user.id, course.id, l.id)
          ).length;

          return (
            <div key={module.id} className="card subject-module">
              <div className="subject-module__header">
                <div>
                  <h2 className="subject-module__title">{module.title}</h2>
                  {module.description && <p className="subject-module__desc">{module.description}</p>}
                </div>
                <div className="subject-module__progress">
                  <span style={{ color: subject.color, fontWeight: 700 }}>
                    {completedCount}/{lessons.length}
                  </span>
                  <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>lessons</span>
                </div>
              </div>

              <div className="subject-module__lessons">
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
                          <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>{lesson.durationMinutes} min</span>
                        )}
                        {lesson.pageCount && (
                          <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>{lesson.pageCount} pages</span>
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
    </div>
  );
}
