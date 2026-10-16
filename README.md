# Med-Learn

Windows desktop app (Tauri + React + TypeScript) for university medical students. This is **V1** — a clean, $0-cost foundation that can grow into the full platform (web, mobile, instructor dashboard).

## What's in V1

- Login (demo auth, local session)
- Dashboard with progress, "continue learning" and bookmarks
- Courses → Subjects → Modules → Lessons navigation
- Lesson page with video and document viewers (placeholders, see below)
- Progress tracking, bookmarks, and notes (stored locally)
- Profile and settings (theme, font size, local data reset)

## Tech stack (all free / open source)

| Layer      | Choice                     |
| ---------- | -------------------------- |
| Desktop    | Tauri 2 (Rust)             |
| UI         | React 19 + TypeScript      |
| Build      | Vite                       |
| Routing    | react-router-dom           |
| Styling    | Plain CSS with design tokens |
| Lint       | Oxlint                     |

No paid APIs, hosting, or databases are used. All data is mock data plus `localStorage`.

## Getting started

Prerequisites: Node.js 20+, and for the desktop shell the [Rust toolchain](https://rustup.rs) plus the WebView2 runtime (preinstalled on Windows 11).

```bash
npm install

npm run dev           # web preview at http://localhost:5173
npm run tauri:dev     # desktop window with hot reload
npm run build         # type-check + production web build
npm run tauri:build   # Windows installer (.msi / .exe)
npm run lint
```

**Demo login:** `ahmed@medlearn.com` / `demo1234`

## Architecture

```
src/
  components/   Sidebar, VideoPlayer, DocumentViewer, NoteEditor
  contexts/     AuthContext (useAuth, useRequiredUser)
  data/         mockData.ts — courses, subjects, modules, lessons
  layouts/      AppLayout (sidebar + routed content)
  pages/        One file (+ CSS) per screen
  services/     All data access — the only layer that touches storage
  types/        Canonical domain types
src-tauri/      Rust shell, window config, CSP
```

Rules of thumb:

- Pages and components call **services**; they never read `localStorage` directly.
- Pages under `RequireAuth` use `useRequiredUser()`; routes that may not resolve (course/lesson params) are split into a thin wrapper plus a content component so hooks always run unconditionally.

## Replacement points (future work)

Each service documents what to swap in when a real backend exists. Components do not need to change.

| Service            | V1 (now)                    | Later                                  |
| ------------------ | --------------------------- | -------------------------------------- |
| `AuthService`      | Demo credentials + local session | Supabase Auth (free tier) + entitlements |
| `ProgressService`  | `localStorage`              | Supabase tables with sync              |
| `BookmarkService`  | `localStorage`              | Supabase tables with sync              |
| `NotesService`     | `localStorage`              | Supabase tables with sync              |
| `VideoService` / `VideoPlayer` | Simulated playback | Protected streaming (e.g. Bunny Stream) |
| `DocumentService` / `DocumentViewer` | Placeholder pages | Protected PDF delivery (e.g. Cloudflare R2 + PDF.js) |

## Security notes

- The demo credentials are for local development only. Never ship real credentials or API keys in the client.
- Client-side checks cannot stop determined content leakage. Real entitlement checks, signed URLs, and watermarking must be enforced server-side when the backend is added.
- The Tauri CSP in `src-tauri/tauri.conf.json` restricts network access to the app itself plus Google Fonts; tighten or extend it deliberately when adding backends.
