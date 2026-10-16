import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRequiredUser } from '../contexts/useAuth';
import type { Course } from '../types';
import { CourseService } from '../services/CourseService';
import { ProgressService } from '../services/ProgressService';
import { BookmarkService } from '../services/BookmarkService';
import './DashboardPage.css';

export function DashboardPage() {
  const user = useRequiredUser();

  const courseList = useMemo<Course[]>(
    () => CourseService.getEnrolledCourses(user.enrolledCourseIds),
    [user.enrolledCourseIds]
  );

  const progressByCourse = useMemo(
    () =>
      courseList.map(course => ({
        course,
        pct: ProgressService.getCourseCompletionPercent(user.id, course.id, course.totalLessons),
        completedCount: ProgressService.getProgress(user.id, course.id).completedLessonIds.length,
      })),
    [courseList, user.id]
  );

  const lastOpened = useMemo(() => ProgressService.getLastOpened(user.id), [user.id]);
  const lastLesson = lastOpened ? CourseService.getLesson(lastOpened.lessonId) : null;
  const lastCourse = lastOpened ? CourseService.getCourse(lastOpened.courseId) : null;

  const bookmarks = useMemo(() => BookmarkService.getAll(user.id), [user.id]);

  const totalLessons = courseList.reduce((sum, c) => sum + c.totalLessons, 0);
  const completedLessons = progressByCourse.reduce((sum, { completedCount }) => sum + completedCount, 0);
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const [hour] = useState(() => new Date().getHours());
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard animate-fade-in">
      {/* Welcome Banner */}
      <div className="dashboard__welcome">
        <div>
          <h1 className="dashboard__greeting">{greeting}, {user.name.split(' ')[0]} 👋</h1>
          <p className="dashboard__subline">
            {user.faculty} · {user.year} · {user.enrolledCourseIds.length} courses enrolled
          </p>
        </div>
        <div className="dashboard__overall">
          <svg viewBox="0 0 44 44" width="60" height="60" aria-hidden="true">
            <circle cx="22" cy="22" r="18" fill="none" stroke="var(--border)" strokeWidth="4" />
            <circle
              cx="22" cy="22" r="18"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - overallPct / 100)}`}
              transform="rotate(-90 22 22)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <text x="22" y="26" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--text-primary)">
              {overallPct}%
            </text>
          </svg>
          <div>
            <div className="dashboard__overall-label">Overall Progress</div>
            <div className="dashboard__overall-detail">{completedLessons} of {totalLessons} lessons</div>
          </div>
        </div>
      </div>

      <div className="dashboard__body">
        {/* Continue Learning */}
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Continue Learning</h2>
          {lastLesson && lastCourse ? (
            <Link
              to={`/courses/${lastCourse.id}/lessons/${lastLesson.id}`}
              className="continue-card card card--hoverable"
            >
              <div className="continue-card__icon" style={{ background: lastCourse.color + '22', color: lastCourse.color }}>
                {lastCourse.icon}
              </div>
              <div className="continue-card__content">
                <div className="continue-card__course">{lastCourse.title}</div>
                <div className="continue-card__lesson">{lastLesson.title}</div>
                <div className="continue-card__meta">
                  <span className={`badge badge--${lastLesson.type}`}>{lastLesson.type}</span>
                  {lastLesson.durationMinutes && (
                    <span className="continue-card__duration">⏱ {lastLesson.durationMinutes} min</span>
                  )}
                </div>
              </div>
              <span className="continue-card__cta">Resume →</span>
            </Link>
          ) : (
            <div className="card empty-card">
              <span style={{ fontSize: '2rem' }}>📖</span>
              <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
                You haven't started a lesson yet.{' '}
                <Link to="/courses">Browse your courses →</Link>
              </p>
            </div>
          )}
        </section>

        {/* My Courses */}
        <section className="dashboard__section">
          <div className="dashboard__section-header">
            <h2 className="dashboard__section-title">My Courses</h2>
            <Link to="/courses" className="dashboard__see-all">See all →</Link>
          </div>
          <div className="course-grid">
            {progressByCourse.map(({ course, pct }) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="course-card card card--hoverable"
              >
                <div className="course-card__header" style={{ background: course.color + '18' }}>
                  <span className="course-card__icon">{course.icon}</span>
                  <span className="course-card__pct" style={{ color: course.color }}>{pct}%</span>
                </div>
                <div className="course-card__body">
                  <h3 className="course-card__title">{course.title}</h3>
                  <p className="course-card__desc">{course.description}</p>
                  <div className="progress-bar">
                    <div className="progress-bar__fill" style={{ width: `${pct}%`, background: course.color }} />
                  </div>
                  <div className="course-card__meta">
                    <span>{course.totalLessons} lessons</span>
                    <span>{course.subjectIds.length} subjects</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Row */}
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Quick Stats</h2>
          <div className="stats-row">
            {[
              { label: 'Enrolled', value: courseList.length, icon: '📚' },
              { label: 'Completed', value: completedLessons, icon: '✅' },
              { label: 'Bookmarks', value: bookmarks.length, icon: '🔖' },
              { label: 'Progress', value: `${overallPct}%`, icon: '📊' },
            ].map(stat => (
              <div key={stat.label} className="stat-card card">
                <div className="stat-card__icon">{stat.icon}</div>
                <div className="stat-card__value">{stat.value}</div>
                <div className="stat-card__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Course Progress Breakdown */}
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Course Progress</h2>
          <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {progressByCourse.map(({ course, pct, completedCount }) => (
              <Link key={course.id} to={`/courses/${course.id}`} className="course-progress-row">
                <span className="course-progress-row__icon">{course.icon}</span>
                <div className="course-progress-row__info">
                  <div className="course-progress-row__name">{course.title}</div>
                  <div className="progress-bar" style={{ marginTop: 6 }}>
                    <div className="progress-bar__fill" style={{ width: `${pct}%`, background: course.color }} />
                  </div>
                </div>
                <div className="course-progress-row__pct">
                  <span style={{ color: course.color, fontWeight: 700 }}>{pct}%</span>
                  <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>{completedCount}/{course.totalLessons}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Bookmarks */}
        {bookmarks.length > 0 && (
          <section className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">Recent Bookmarks</h2>
              <Link to="/bookmarks" className="dashboard__see-all">See all →</Link>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {bookmarks.slice(0, 5).map(bm => {
                const lesson = CourseService.getLesson(bm.lessonId);
                const course = CourseService.getCourse(bm.courseId);
                if (!lesson || !course) return null;
                const targetUrl = `/courses/${bm.courseId}/lessons/${bm.lessonId}${
                  bm.documentPage ? `?page=${bm.documentPage}` : ''
                }`;
                return (
                  <Link
                    key={bm.id}
                    to={targetUrl}
                    className="bookmark-row"
                  >
                    <span className="bookmark-row__icon" style={{ color: course.color }}>{course.icon}</span>
                    <div className="bookmark-row__info">
                      <div className="bookmark-row__lesson">
                        {lesson.title}
                        {bm.documentPage && (
                          <span
                            className="badge badge--document"
                            style={{ marginLeft: 'var(--space-2)', fontSize: '10px' }}
                          >
                            P.{bm.documentPage}
                          </span>
                        )}
                      </div>
                      <div className="bookmark-row__course">{course.title}</div>
                    </div>
                    <span className={`badge badge--${lesson.type}`}>
                      {bm.documentPage ? `page ${bm.documentPage}` : lesson.type}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
