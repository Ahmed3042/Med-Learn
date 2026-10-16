import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { CourseService } from '../services/CourseService';
import { BookmarkService } from '../services/BookmarkService';
import './BookmarksPage.css';

export function BookmarksPage() {
  const { user } = useAuth();
  if (!user) return null;
  return <BookmarksContent userId={user.id} />;
}

function BookmarksContent({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState(() => BookmarkService.getAll(userId));

  const grouped = useMemo(() => {
    const map: Record<string, typeof bookmarks> = {};
    bookmarks.forEach(bm => {
      if (!map[bm.courseId]) map[bm.courseId] = [];
      map[bm.courseId].push(bm);
    });
    return map;
  }, [bookmarks]);

  function handleRemove(bookmarkId: string) {
    BookmarkService.remove(userId, bookmarkId);
    setBookmarks(BookmarkService.getAll(userId));
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bookmarks-page animate-fade-in">
        <div className="page-header">
          <h1>Bookmarks</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state__icon">🔖</div>
          <h2 className="empty-state__title">No bookmarks yet</h2>
          <p className="empty-state__desc">
            When you bookmark a lesson or a specific document page, it will appear here for quick access.
          </p>
          <Link to="/courses" className="btn btn--primary">Browse Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-page animate-fade-in">
      <div className="page-header">
        <h1>Bookmarks</h1>
        <p className="page-header__subtitle">{bookmarks.length} saved lessons and document pages</p>
      </div>
      <div className="page-content">
        {Object.entries(grouped).map(([courseId, bms]) => {
          const course = CourseService.getCourse(courseId);
          if (!course) return null;
          return (
            <div key={courseId} className="bookmarks-group">
              <div className="bookmarks-group__header">
                <span>{course.icon}</span>
                <h2>{course.title}</h2>
                <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                  {bms.length} bookmark{bms.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="card" style={{ overflow: 'hidden' }}>
                {bms.map(bm => {
                  const lesson = CourseService.getLesson(bm.lessonId);
                  if (!lesson) return null;

                  const targetUrl = `/courses/${bm.courseId}/lessons/${bm.lessonId}${
                    bm.documentPage ? `?page=${bm.documentPage}` : ''
                  }`;

                  return (
                    <div key={bm.id} className="bookmark-entry">
                      <Link
                        to={targetUrl}
                        className="bookmark-entry__content"
                        title={bm.documentPage ? `Reopen at page ${bm.documentPage}` : 'Open lesson'}
                      >
                        <div className="bookmark-entry__icon" style={{ color: course.color }}>
                          {bm.documentPage ? '📄' : '🔖'}
                        </div>
                        <div className="bookmark-entry__info">
                          <div className="bookmark-entry__title">
                            {lesson.title}
                            {bm.documentPage && (
                              <span
                                className="badge badge--document"
                                style={{ marginLeft: 'var(--space-2)', fontSize: '11px' }}
                              >
                                Page {bm.documentPage}
                              </span>
                            )}
                          </div>
                          <div className="bookmark-entry__meta">
                            <span className={`badge badge--${lesson.type}`}>
                              {bm.documentPage ? `document · page ${bm.documentPage}` : lesson.type}
                            </span>
                            {lesson.durationMinutes && (
                              <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                                {lesson.durationMinutes} min
                              </span>
                            )}
                            <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                              Saved {new Date(bm.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <button
                        className="btn btn--icon"
                        onClick={() => handleRemove(bm.id)}
                        aria-label={`Remove bookmark for ${lesson.title}${bm.documentPage ? ` page ${bm.documentPage}` : ''}`}
                        title="Remove bookmark"
                      >
                        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M3 3l10 10M13 3L3 13" />
                        </svg>
                      </button>
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
