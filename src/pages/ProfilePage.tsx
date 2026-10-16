import { useRequiredUser } from '../contexts/useAuth';
import type { Course } from '../types';
import { CourseService } from '../services/CourseService';
import { ProgressService } from '../services/ProgressService';
import { BookmarkService } from '../services/BookmarkService';
import { NotesService } from '../services/NotesService';
import './ProfilePage.css';

export function ProfilePage() {
  const user = useRequiredUser();

  const courses: Course[] = CourseService.getEnrolledCourses(user.enrolledCourseIds);
  const totalLessons = courses.reduce((s, c) => s + c.totalLessons, 0);
  const completedLessons = courses.reduce((s, c) => {
    return s + ProgressService.getProgress(user.id, c.id).completedLessonIds.length;
  }, 0);
  const bookmarkCount = BookmarkService.getAll(user.id).length;
  const noteCount = NotesService.getAll(user.id).length;
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="profile-page animate-fade-in">
      <div className="page-header">
        <h1>Profile</h1>
      </div>
      <div className="page-content">
        {/* Identity Card */}
        <div className="card profile-card">
          <div className="profile-card__avatar">{initials}</div>
          <div className="profile-card__info">
            <h2 className="profile-card__name">{user.name}</h2>
            <p className="profile-card__role">{user.faculty} · {user.year}</p>
            <p className="profile-card__email">{user.email}</p>
            <div className="profile-card__badge">
              <span className="badge badge--video">Medical Student</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          {[
            { label: 'Courses Enrolled', value: courses.length, icon: '📚' },
            { label: 'Lessons Completed', value: completedLessons, icon: '✅' },
            { label: 'Overall Progress', value: `${overallPct}%`, icon: '📊' },
            { label: 'Bookmarks', value: bookmarkCount, icon: '🔖' },
            { label: 'Notes Created', value: noteCount, icon: '✏️' },
          ].map(s => (
            <div key={s.label} className="card profile-stat">
              <div className="profile-stat__icon">{s.icon}</div>
              <div className="profile-stat__value">{s.value}</div>
              <div className="profile-stat__label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Enrolled Courses */}
        <div className="card profile-section">
          <h3 className="profile-section__title">Enrolled Courses</h3>
          {courses.map(course => {
            const instructor = CourseService.getInstructor(course.instructorId);
            const pct = ProgressService.getCourseCompletionPercent(user.id, course.id, course.totalLessons);
            return (
              <div key={course.id} className="profile-course-row">
                <span className="profile-course-row__icon" style={{ color: course.color }}>{course.icon}</span>
                <div className="profile-course-row__info">
                  <div className="profile-course-row__name">{course.title}</div>
                  {instructor && <div className="profile-course-row__instructor">{instructor.name}</div>}
                </div>
                <div className="progress-bar" style={{ flex: 1, maxWidth: 160 }}>
                  <div className="progress-bar__fill" style={{ width: `${pct}%`, background: course.color }} />
                </div>
                <span style={{ color: course.color, fontWeight: 700, fontSize: 'var(--text-sm)' }}>{pct}%</span>
              </div>
            );
          })}
        </div>

        <div className="card profile-section">
          <h3 className="profile-section__title">Account</h3>
          <div className="profile-info-row">
            <span className="profile-info-row__label">Name</span>
            <span>{user.name}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-row__label">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-row__label">Faculty</span>
            <span>{user.faculty}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-row__label">Year</span>
            <span>{user.year}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-row__label">Enrolled since</span>
            <span>{new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
