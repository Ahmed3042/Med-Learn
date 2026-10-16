import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRequiredUser } from '../contexts/useAuth';
import type { Course } from '../types';
import { CourseService } from '../services/CourseService';
import { ProgressService } from '../services/ProgressService';
import './ProgressPage.css';

export function ProgressPage() {
  const user = useRequiredUser();

  const courses = useMemo<Course[]>(
    () => CourseService.getEnrolledCourses(user.enrolledCourseIds),
    [user.enrolledCourseIds]
  );

  const totals = useMemo(() => {
    let total = 0;
    let done = 0;
    courses.forEach(c => {
      total += c.totalLessons;
      done += ProgressService.getProgress(user.id, c.id).completedLessonIds.length;
    });
    return { total, done };
  }, [courses, user.id]);

  return (
    <div className="progress-page animate-fade-in">
      <div className="page-header">
        <h1>Progress</h1>
        <p className="page-header__subtitle">
          {totals.done} of {totals.total} lessons completed across all courses
        </p>
      </div>

      <div className="page-content">
        {/* Overall */}
        <div className="card progress-page__overall">
          <div className="progress-page__overall-text">
            <h2>Overall Completion</h2>
            <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
              {totals.total - totals.done} lessons remaining
            </p>
          </div>
          <div className="progress-page__overall-ring">
            <svg viewBox="0 0 100 100" width="100" height="100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - (totals.total > 0 ? totals.done / totals.total : 0))}`}
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
              <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--text-primary)">
                {totals.total > 0 ? Math.round((totals.done / totals.total) * 100) : 0}%
              </text>
            </svg>
          </div>
        </div>

        {/* Per-Course */}
        {courses.map(course => {
          const subjects = CourseService.getSubjectsForCourse(course.id);
          const pct = ProgressService.getCourseCompletionPercent(user.id, course.id, course.totalLessons);
          const completedIds = ProgressService.getProgress(user.id, course.id).completedLessonIds;

          return (
            <div key={course.id} className="card progress-course">
              <div className="progress-course__header">
                <span className="progress-course__icon">{course.icon}</span>
                <div className="progress-course__title-group">
                  <Link to={`/courses/${course.id}`} className="progress-course__title">{course.title}</Link>
                  <div className="progress-bar" style={{ marginTop: 4 }}>
                    <div className="progress-bar__fill" style={{ width: `${pct}%`, background: course.color }} />
                  </div>
                </div>
                <span style={{ color: course.color, fontWeight: 700, flexShrink: 0 }}>{pct}%</span>
              </div>

              <div className="progress-subjects">
                {subjects.map(subject => {
                  const allLessons = CourseService.getModulesForSubject(subject.id).flatMap(m =>
                    CourseService.getLessonsForModule(m.id)
                  );
                  const doneCnt = allLessons.filter(l => completedIds.includes(l.id)).length;
                  const subjectPct = allLessons.length > 0 ? Math.round((doneCnt / allLessons.length) * 100) : 0;

                  return (
                    <div key={subject.id} className="progress-subject-row">
                      <div className="progress-subject-row__dot" style={{ background: subject.color }} />
                      <span className="progress-subject-row__name">{subject.title}</span>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-bar__fill" style={{ width: `${subjectPct}%`, background: subject.color }} />
                      </div>
                      <span className="progress-subject-row__stats" style={{ color: subject.color }}>
                        {doneCnt}/{allLessons.length}
                      </span>
                    </div>
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
