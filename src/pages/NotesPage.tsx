import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { CourseService } from '../services/CourseService';
import { NotesService } from '../services/NotesService';
import type { Note } from '../types';
import './NotesPage.css';

export function NotesPage() {
  const { user } = useAuth();
  if (!user) return null;
  return <NotesContent userId={user.id} />;
}

function NotesContent({ userId }: { userId: string }) {
  const [notes, setNotes] = useState<Note[]>(() => NotesService.getAll(userId));
  const [selected, setSelected] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);

  function refresh() {
    setNotes(NotesService.getAll(userId));
  }

  function handleSelect(note: Note) {
    setSelected(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
    setCreating(false);
  }

  function handleSave() {
    if (!selected && !creating) return;
    const wasCreating = creating;
    if (wasCreating) {
      NotesService.create({
        userId,
        title: editTitle.trim() || 'Untitled note',
        content: editContent,
      });
      setCreating(false);
    } else if (selected) {
      // Preserves existing courseId, subjectId, and lessonId
      NotesService.update(userId, selected.id, {
        title: editTitle.trim() || 'Untitled note',
        content: editContent,
      });
    }
    setIsEditing(false);
    const updated = NotesService.getAll(userId);
    setNotes(updated);
    if (wasCreating) {
      setSelected(updated[0] ?? null);
    } else if (selected) {
      setSelected(updated.find(n => n.id === selected.id) ?? null);
    }
  }

  function handleDelete(noteId: string) {
    NotesService.delete(userId, noteId);
    if (selected?.id === noteId) setSelected(null);
    refresh();
  }

  function startCreate() {
    setCreating(true);
    setSelected(null);
    setEditTitle('');
    setEditContent('');
    setIsEditing(true);
  }

  const filtered = notes.filter(
    n =>
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="notes-page animate-fade-in">
      {/* Sidebar */}
      <div className="notes-sidebar">
        <div className="notes-sidebar__header">
          <h1 style={{ fontSize: 'var(--text-lg)' }}>Notes</h1>
          <button className="btn btn--primary btn--sm" onClick={startCreate}>+ New</button>
        </div>
        <div className="notes-sidebar__search">
          <input
            type="search"
            className="input"
            style={{ height: 36 }}
            placeholder="Search notes…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search notes"
          />
        </div>
        <div className="notes-list">
          {filtered.length === 0 && (
            <div className="notes-empty">
              <span>📝</span>
              <p>{searchQuery ? 'No results' : 'No notes yet'}</p>
            </div>
          )}
          {filtered.map(note => {
            const course = note.courseId ? CourseService.getCourse(note.courseId) : null;
            return (
              <button
                key={note.id}
                className={`note-list-item ${selected?.id === note.id && !creating ? 'note-list-item--active' : ''}`}
                onClick={() => handleSelect(note)}
              >
                <div className="note-list-item__title">{note.title}</div>
                <div className="note-list-item__preview">{note.content.slice(0, 80) || 'No content'}</div>
                <div className="note-list-item__meta">
                  {course && <span style={{ color: course.color }}>{course.title}</span>}
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="notes-editor">
        {selected || creating ? (
          <>
            <div className="notes-editor__toolbar">
              {!isEditing ? (
                <>
                  <button className="btn btn--secondary btn--sm" onClick={() => setIsEditing(true)}>✏️ Edit</button>
                  {selected && (
                    <>
                      <button
                        className="btn btn--ghost btn--sm"
                        style={{ color: 'var(--color-danger)' }}
                        onClick={() => handleDelete(selected.id)}
                      >
                        🗑 Delete
                      </button>
                      {selected.lessonId && selected.courseId && CourseService.getLesson(selected.lessonId) && (
                        <Link
                          to={`/courses/${selected.courseId}/lessons/${selected.lessonId}`}
                          className="btn btn--ghost btn--sm"
                        >
                          → Go to lesson
                        </Link>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <button className="btn btn--primary btn--sm" onClick={handleSave}>Save</button>
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => {
                      setIsEditing(false);
                      setCreating(false);
                      if (!selected) setSelected(null);
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            <div className="notes-editor__body">
              {isEditing ? (
                <>
                  <input
                    className="notes-editor__title-input"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Note title…"
                    autoFocus
                  />
                  <textarea
                    className="notes-editor__content-input"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    placeholder="Start writing…"
                  />
                </>
              ) : selected ? (
                <>
                  <h2 className="notes-editor__title">{selected.title}</h2>
                  <div className="notes-editor__meta">
                    {selected.courseId && CourseService.getCourse(selected.courseId) && (
                      <span>📚 {CourseService.getCourse(selected.courseId)!.title}</span>
                    )}
                    {selected.subjectId && CourseService.getSubject(selected.subjectId) && (
                      <span>📂 {CourseService.getSubject(selected.subjectId)!.title}</span>
                    )}
                    {selected.lessonId && CourseService.getLesson(selected.lessonId) && (
                      <span>📖 {CourseService.getLesson(selected.lessonId)!.title}</span>
                    )}
                    <span className="text-muted">Updated {new Date(selected.updatedAt).toLocaleString()}</span>
                  </div>
                  <div className="notes-editor__content">
                    {selected.content || <span className="text-muted">No content</span>}
                  </div>
                </>
              ) : null}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">✏️</div>
            <h2 className="empty-state__title">
              {notes.length === 0 ? 'No notes yet' : 'Select a note'}
            </h2>
            <p className="empty-state__desc">
              {notes.length === 0
                ? 'Create your first note to start capturing your thoughts.'
                : 'Choose a note from the list to view or edit it.'}
            </p>
            <button className="btn btn--primary" onClick={startCreate}>+ Create Note</button>
          </div>
        )}
      </div>
    </div>
  );
}
