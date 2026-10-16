import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom';
import { useRequiredUser } from '../contexts/useAuth';
import type { Course, Lesson } from '../types';
import { CourseService } from '../services/CourseService';
import { ProgressService } from '../services/ProgressService';
import { BookmarkService } from '../services/BookmarkService';
import { NotesService } from '../services/NotesService';
import { VideoPlayer } from '../components/VideoPlayer';
import { DocumentViewer } from '../components/DocumentViewer';
import { NoteEditor } from '../components/NoteEditor';
import './LessonPage.css';

export function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get('page');
  const targetPage = pageParam ? parseInt(pageParam, 10) : undefined;

  const lesson = lessonId ? CourseService.getLesson(lessonId) : undefined;
  const course = courseId ? CourseService.getCourse(courseId) : undefined;

  if (!lesson || !course) return <Navigate to="/courses" replace />;

  // key resets all per-lesson state when navigating prev/next
  return (
    <LessonContent
      key={lesson.id}
      lesson={lesson}
      course={course}
      initialPage={targetPage && !isNaN(targetPage) ? targetPage : undefined}
    />
  );
}

function LessonContent({
  lesson,
  course,
  initialPage,
}: {
  lesson: Lesson;
  course: Course;
  initialPage?: number;
}) {
  const user = useRequiredUser();

  const subject = CourseService.getSubject(lesson.subjectId);
  const module = CourseService.getModule(lesson.moduleId);
  const { prev, next } = CourseService.getAdjacentLessons(lesson);

  const [isComplete, setIsComplete] = useState<boolean>(() =>
    ProgressService.isLessonComplete(user.id, course.id, lesson.id)
  );
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() =>
    BookmarkService.isLessonBookmarked(user.id, lesson.id)
  );
  const [showNotes, setShowNotes] = useState(false);

  // Track the note count reactively so the Notes button badge stays current
  const [noteCount, setNoteCount] = useState<number>(() =>
    NotesService.getForLesson(user.id, lesson.id).length
  );

  // Track last opened lesson for "Continue Learning"
  useEffect(() => {
    ProgressService.setLastOpened(user.id, course.id, lesson.id);
  }, [user.id, course.id, lesson.id]);

  const toggleComplete = useCallback(() => {
    if (isComplete) {
      ProgressService.markLessonIncomplete(user.id, course.id, lesson.id);
    } else {
      ProgressService.markLessonComplete(user.id, course.id, lesson.id);
    }
    setIsComplete(prevDone => !prevDone);
  }, [isComplete, user.id, course.id, lesson.id]);

  const toggleBookmark = useCallback(() => {
    const added = BookmarkService.toggleLesson(user.id, lesson.id, course.id, lesson.subjectId);
    setIsBookmarked(added);
  }, [user.id, lesson.id, course.id, lesson.subjectId]);

  // Callback passed to NoteEditor so it can signal when a note is saved
  const handleNoteChange = useCallback(() => {
    setNoteCount(NotesService.getForLesson(user.id, lesson.id).length);
  }, [user.id, lesson.id]);

  return (
    <div className="lesson-page">
      {/* Top Bar */}
      <div className="lesson-topbar">
        <div className="lesson-breadcrumb">
          <Link to="/courses">Courses</Link>
          <span>›</span>
          <Link to={`/courses/${course.id}`}>{course.title}</Link>
          {subject && (
            <>
              <span>›</span>
              <Link to={`/courses/${course.id}/subjects/${subject.id}`}>{subject.title}</Link>
            </>
          )}
          <span>›</span>
          <span className="lesson-breadcrumb__current">{lesson.title}</span>
        </div>

        <div className="lesson-topbar__actions">
          <button
            className={`btn btn--ghost btn--sm lesson-action ${isBookmarked ? 'lesson-action--active' : ''}`}
            onClick={toggleBookmark}
            aria-label={isBookmarked ? 'Remove lesson bookmark' : 'Bookmark this lesson'}
            title={isBookmarked ? 'Remove lesson bookmark' : 'Bookmark lesson'}
          >
            {isBookmarked ? '🔖' : '📌'} {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
          <button
            className={`btn btn--ghost btn--sm lesson-action ${showNotes ? 'lesson-action--active' : ''}`}
            onClick={() => setShowNotes(s => !s)}
            aria-label="Toggle notes panel"
            title="Notes"
          >
            ✏️ Notes {noteCount > 0 && `(${noteCount})`}
          </button>
          <button
            className={`btn btn--sm ${isComplete ? 'lesson-action--complete btn--secondary' : 'btn--primary'}`}
            onClick={toggleComplete}
            aria-pressed={isComplete}
          >
            {isComplete ? '✓ Completed' : 'Mark Complete'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="lesson-layout">
        <div className="lesson-main">
          {/* Lesson Header */}
          <div className="lesson-header">
            <div className="lesson-header__meta">
              {module && <span className="lesson-module-label">{module.title}</span>}
              <span className={`badge badge--${lesson.type}`}>{lesson.type}</span>
              {lesson.durationMinutes && (
                <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                  ⏱ {lesson.durationMinutes} min
                </span>
              )}
              {lesson.pageCount && (
                <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                  📄 {lesson.pageCount} pages
                </span>
              )}
            </div>
            <h1 className="lesson-title">{lesson.title}</h1>
            {lesson.description && <p className="lesson-description">{lesson.description}</p>}
          </div>

          {/* Media Content */}
          <div className="lesson-content">
            {lesson.type === 'video' && (
              <VideoPlayer
                lesson={lesson}
                userId={user.id}
                courseId={course.id}
              />
            )}
            {lesson.type === 'document' && (
              <DocumentViewer
                key={`${lesson.id}-${initialPage || 1}`}
                lesson={lesson}
                userId={user.id}
                courseId={course.id}
                initialPage={initialPage}
              />
            )}
          </div>

          {/* Prev / Next Navigation */}
          <div className="lesson-nav">
            {prev ? (
              <Link to={`/courses/${course.id}/lessons/${prev.id}`} className="lesson-nav__btn card card--hoverable">
                <span className="lesson-nav__dir">← Previous</span>
                <span className="lesson-nav__title">{prev.title}</span>
                <span className={`badge badge--${prev.type}`}>{prev.type}</span>
              </Link>
            ) : <div />}
            {next ? (
              <Link to={`/courses/${course.id}/lessons/${next.id}`} className="lesson-nav__btn lesson-nav__btn--next card card--hoverable">
                <span className="lesson-nav__dir">Next →</span>
                <span className="lesson-nav__title">{next.title}</span>
                <span className={`badge badge--${next.type}`}>{next.type}</span>
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* Notes Sidebar */}
        {showNotes && (
          <aside className="lesson-notes-panel animate-slide-in">
            <div className="lesson-notes-panel__header">
              <h3>Notes</h3>
              <button
                className="btn btn--icon"
                onClick={() => setShowNotes(false)}
                aria-label="Close notes"
              >✕</button>
            </div>
            <div className="lesson-notes-panel__body">
              <NoteEditor
                userId={user.id}
                courseId={course.id}
                subjectId={lesson.subjectId}
                lessonId={lesson.id}
                onNoteChange={handleNoteChange}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
