import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Lesson } from '../types';
import { DocumentService, type DocumentSource, type DocumentSearchResult } from '../services/DocumentService';
import { BookmarkService } from '../services/BookmarkService';
import './DocumentViewer.css';

// DocumentViewer — V1 simulated viewer implementation.
// Uses DocumentService for document source, metadata, and search.
// Provides page navigation, honest delivery notices, page bookmarks, and text search.

interface DocumentViewerProps {
  lesson: Lesson;
  userId: string;
  courseId: string;
  initialPage?: number;
}

export function DocumentViewer({ lesson, userId, courseId, initialPage = 1 }: DocumentViewerProps) {
  const [docSource, setDocSource] = useState<DocumentSource | null>(null);
  const totalPages = docSource?.pageCount ?? lesson.pageCount ?? 40;
  const [currentPage, setCurrentPage] = useState<number>(() =>
    Math.max(1, Math.min(initialPage, totalPages))
  );
  const [zoom, setZoom] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isPageBookmarked, setIsPageBookmarked] = useState<boolean>(() =>
    BookmarkService.isPageBookmarked(userId, lesson.id, initialPage)
  );

  // Load document source via DocumentService
  useEffect(() => {
    let cancelled = false;
    DocumentService.getDocumentSource(lesson.id, courseId)
      .then(src => {
        if (cancelled) return;
        setDocSource(src);
      })
      .catch(err => {
        console.error('[DocumentViewer] Failed to load document:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [lesson.id, courseId]);

  const searchResults = useMemo<DocumentSearchResult[]>(() => {
    if (!docSource || !searchQuery.trim()) return [];
    return DocumentService.searchDocument(docSource, searchQuery);
  }, [docSource, searchQuery]);

  const goTo = useCallback((page: number) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
    setIsPageBookmarked(BookmarkService.isPageBookmarked(userId, lesson.id, target));
  }, [totalPages, userId, lesson.id]);

  const handleTogglePageBookmark = useCallback(() => {
    const active = BookmarkService.togglePage(
      userId,
      lesson.id,
      courseId,
      lesson.subjectId,
      currentPage
    );
    setIsPageBookmarked(active);
  }, [userId, lesson.id, courseId, lesson.subjectId, currentPage]);

  const currentPageContent = docSource?.pages?.[currentPage - 1];

  return (
    <div className="doc-viewer">
      {/* Toolbar */}
      <div className="doc-viewer__toolbar">
        <div className="doc-viewer__nav">
          <button
            className="btn btn--icon"
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            title="Previous page"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 3L5 8l5 5"/>
            </svg>
          </button>
          <span className="doc-viewer__page-indicator">
            Page
            <input
              type="number"
              className="doc-viewer__page-input"
              value={currentPage}
              min={1}
              max={totalPages}
              onChange={e => goTo(Number(e.target.value))}
              aria-label="Page number"
            />
            of {totalPages}
          </span>
          <button
            className="btn btn--icon"
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            title="Next page"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 3l5 5-5 5"/>
            </svg>
          </button>
        </div>

        {/* Page Bookmark Button */}
        <button
          className={`btn btn--sm doc-viewer__bookmark-btn ${isPageBookmarked ? 'doc-viewer__bookmark-btn--active' : ''}`}
          onClick={handleTogglePageBookmark}
          aria-label={isPageBookmarked ? `Remove bookmark for page ${currentPage}` : `Bookmark page ${currentPage}`}
          title={isPageBookmarked ? `Page ${currentPage} is bookmarked` : `Bookmark page ${currentPage}`}
        >
          {isPageBookmarked ? `🔖 Page ${currentPage} Bookmarked` : `📌 Bookmark Page ${currentPage}`}
        </button>

        <div className="doc-viewer__zoom">
          <button
            className="btn btn--icon"
            onClick={() => setZoom(z => Math.max(60, z - 10))}
            aria-label="Zoom out"
            title="Zoom out"
          >−</button>
          <span className="doc-viewer__zoom-label">{zoom}%</span>
          <button
            className="btn btn--icon"
            onClick={() => setZoom(z => Math.min(180, z + 10))}
            aria-label="Zoom in"
            title="Zoom in"
          >+</button>
        </div>

        {/* Search Input */}
        <div className="doc-viewer__search">
          <input
            type="search"
            className="doc-viewer__search-input"
            placeholder="Search document…"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            aria-label="Search document text"
          />
          {searchQuery && (
            <button
              className="doc-viewer__search-clear"
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Honest Delivery Status */}
        <div className="doc-viewer__toolbar-note" title="Simulated delivery in local demo">
          📄 Demo document — protected delivery is not connected
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showSearchResults && searchQuery.trim().length > 0 && (
        <div className="doc-viewer__search-panel" role="region" aria-label="Search results">
          <div className="doc-viewer__search-header">
            <span>
              {searchResults.length > 0
                ? `${searchResults.length} matching page${searchResults.length === 1 ? '' : 's'} for "${searchQuery}"`
                : `No matching text found for "${searchQuery}"`}
            </span>
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => setShowSearchResults(false)}
              aria-label="Close search results"
            >
              ✕ Close
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="doc-viewer__search-list">
              {searchResults.map(res => (
                <button
                  key={res.pageNumber}
                  className={`doc-viewer__search-item ${res.pageNumber === currentPage ? 'doc-viewer__search-item--current' : ''}`}
                  onClick={() => {
                    goTo(res.pageNumber);
                    setShowSearchResults(false);
                  }}
                >
                  <div className="doc-viewer__search-item-meta">
                    <span className="badge badge--document">Page {res.pageNumber}</span>
                    <strong className="doc-viewer__search-item-title">{res.sectionTitle}</strong>
                  </div>
                  <div className="doc-viewer__search-item-snippet">{res.snippet}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="doc-viewer__search-empty">
              <p>No results found in this document.</p>
              <span className="doc-viewer__search-hint">
                Tip: Try clinical search terms like <em>nerve</em>, <em>artery</em>, <em>muscle</em>, <em>clinical</em>, <em>histological</em>, or <em>imaging</em>.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Document Area */}
      <div className="doc-viewer__area" style={{ zoom: zoom / 100 }}>
        <div className="doc-viewer__page-mock">
          {/* Document Content */}
          <div className="doc-viewer__page-content">
            <div className="doc-viewer__page-header">
              <span className="doc-viewer__page-course-badge">Med-Learn Study Material</span>
              <h2 className="doc-viewer__page-heading">
                {currentPageContent?.sectionTitle ?? `Section ${currentPage}`}
              </h2>
            </div>

            <div className="doc-viewer__page-body">
              {currentPageContent ? (
                <>
                  {currentPageContent.paragraphs.map((p, i) => (
                    <p key={i} className="doc-viewer__paragraph">{p}</p>
                  ))}

                  <div className="doc-viewer__figure-card">
                    <div className="doc-viewer__figure-icon">{currentPageContent.figureIcon ?? '🫁'}</div>
                    <p className="doc-viewer__figure-label">{currentPageContent.figureCaption}</p>
                  </div>

                  {currentPageContent.clinicalCorrelate && (
                    <div className="doc-viewer__clinical-box">
                      <strong>🩺 Clinical Point:</strong> {currentPageContent.clinicalCorrelate}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="doc-viewer__text-line"
                      style={{ width: `${75 + Math.sin(i * 2.2) * 20}%` }}
                    />
                  ))}
                  <div className="doc-viewer__figure-placeholder">
                    <div className="doc-viewer__figure-icon">🫁</div>
                    <p className="doc-viewer__figure-label">Figure {currentPage}.1 — Medical illustration</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="doc-viewer__page-footer">
            <span>{lesson.title}</span>
            <span className="doc-viewer__page-num">Page {currentPage} of {totalPages}</span>
          </div>
        </div>
      </div>

      <div className="doc-viewer__v1-note">
        Demo study document · Simulated local viewer (protected delivery is not connected)
      </div>
    </div>
  );
}
