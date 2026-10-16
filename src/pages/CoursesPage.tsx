import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRequiredUser } from '../contexts/useAuth';
import { CourseService } from '../services/CourseService';
import { ProgressService } from '../services/ProgressService';
import './CoursesPage.css';

export function CoursesPage() {
  const user = useRequiredUser();

  const courses = useMemo(
    () => CourseService.getEnrolledCourses(user.enrolledCourseIds),
    [user.enrolledCourseIds]
  );

  return (
    <div className="courses-page animate-fade-in">
      <div className="page-header">
        <h1>My Courses</h1>
        <p className="page-header__subtitle">{courses.length} courses enrolled for {user.year}</p>
      </div>

      <div className="page-content">
        <div className="courses-list">
          {courses.map(course => {
            const pct = ProgressService.getCourseCompletionPercent(user.id, course.id, course.totalLessons);
            const instructor = CourseService.getInstructor(course.instructorId);
            return (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="course-list-card card card--hoverable"
              >
                <div className="course-list-card__accent" style={{ background: course.color }} />
                <div className="course-list-card__icon" style={{ background: course.color + '18', color: course.color }}>
                  {course.icon}
                </div>
                <div className="course-list-card__body">
                  <div className="course-list-card__top">
                    <div>
                      <h2 className="course-list-card__title">{course.title}</h2>
                      <p className="course-list-card__desc">{course.description}</p>
                    </div>
                    <div className="course-list-card__badge">
                      <span className="badge badge--video">{course.year}</span>
                    </div>
                  </div>
                  <div className="course-list-card__meta">
                    <span>📖 {course.totalLessons} lessons</span>
                    <span>🗂 {course.subjectIds.length} subjects</span>
                    {instructor && <span>👤 {instructor.name}</span>}
                  </div>
                  <div className="course-list-card__progress">
                    <div className="progress-bar">
                      <div className="progress-bar__fill" style={{ width: `${pct}%`, background: course.color }} />
                    </div>
                    <span className="course-list-card__pct" style={{ color: course.color }}>{pct}%</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
