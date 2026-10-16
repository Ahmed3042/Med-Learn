import { useState } from 'react';
import { NotesService } from '../services/NotesService';
import type { Note } from '../types';
import './NoteEditor.css';

interface NoteEditorProps {
  userId: string;
  courseId?: string;
  subjectId?: string;
  lessonId?: string;
  /** Called after any create, update, or delete so the parent can refresh counts. */
  onNoteChange?: () => void;
}

export function NoteEditor({ userId, courseId, subjectId, lessonId, onNoteChange }: NoteEditorProps) {
  const [notes, setNotes] = useState<Note[]>(() =>
    lessonId
      ? NotesService.getForLesson(userId, lessonId)
      : NotesService.getAll(userId).slice(0, 5)
  );
  const [editing, setEditing] = useState<Note | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  function refresh() {
    const updated = lessonId
      ? NotesService.getForLesson(userId, lessonId)
      : NotesService.getAll(userId).slice(0, 5);
    setNotes(updated);
    onNoteChange?.();
  }

  function handleCreate() {
    if (!title.trim() && !content.trim()) return;
    NotesService.create({ userId, title: title.trim() || 'Untitled note', content, courseId, subjectId, lessonId });
    setTitle('');
    setContent('');
    setCreating(false);
    refresh();
  }

  function handleUpdate() {
    if (!editing) return;
    NotesService.update(userId, editing.id, { title: title.trim(), content });
    setEditing(null);
    setTitle('');
    setContent('');
    refresh();
  }

  function startEdit(note: Note) {
    setEditing(note);
    setTitle(note.title);
    setContent(note.content);
    setCreating(false);
  }

  function handleDelete(noteId: string) {
    NotesService.delete(userId, noteId);
    if (editing?.id === noteId) {
      setEditing(null);
      setTitle('');
      setContent('');
    }
    refresh();
  }

  function cancelEdit() {
    setEditing(null);
    setCreating(false);
    setTitle('');
    setContent('');
  }

  return (
    <div className="note-editor">
      {/* Existing notes */}
      {notes.length === 0 && !creating && !editing && (
        <div className="note-editor__empty">
          <span>✏️</span>
          <p>No notes for this lesson yet.</p>
        </div>
      )}

      {notes.map(note => (
        <div key={note.id} className={`note-item ${editing?.id === note.id ? 'note-item--editing' : ''}`}>
          <div className="note-item__header">
            <span className="note-item__title">{note.title}</span>
            <div className="note-item__actions">
              <button className="btn btn--icon" onClick={() => startEdit(note)} aria-label="Edit note">✏️</button>
              <button className="btn btn--icon" onClick={() => handleDelete(note.id)} aria-label="Delete note">🗑</button>
            </div>
          </div>
          {editing?.id !== note.id && (
            <p className="note-item__content">{note.content}</p>
          )}
          <div className="note-item__date">{new Date(note.updatedAt).toLocaleDateString()}</div>
        </div>
      ))}

      {/* Editor */}
      {(creating || editing) && (
        <div className="note-form">
          <input
            className="input"
            style={{ marginBottom: 'var(--space-3)' }}
            placeholder="Note title…"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className="textarea"
            placeholder="Write your note here…"
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{ minHeight: 120 }}
          />
          <div className="note-form__actions">
            <button className="btn btn--primary btn--sm" onClick={editing ? handleUpdate : handleCreate}>
              {editing ? 'Update' : 'Save Note'}
            </button>
            <button className="btn btn--ghost btn--sm" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      )}

      {!creating && !editing && (
        <button className="btn btn--secondary btn--sm note-editor__add" onClick={() => setCreating(true)}>
          + Add Note
        </button>
      )}
    </div>
  );
}
