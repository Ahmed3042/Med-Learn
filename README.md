# Med-Learn

A React + TypeScript application for university medical students, shipped as both a **Windows desktop app** (Tauri) and a **GitHub Pages static web demo**.

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

npm run dev           # web dev server at http://localhost:5173
npm run tauri:dev     # desktop window with hot reload

npm run build         # type-check + production web build (base path = /)
npm run build:web     # production web build for GitHub Pages (/Med-Learn/ base)
npm run preview:web   # preview the GitHub Pages build locally

npm run lint
npm run tauri:build   # Windows installer (.msi / .exe)
```

**Demo login:** `ahmed@medlearn.com` / `demo1234`

> **Demo only.** All data is stored locally in your browser. There is no cloud
> sync, real authentication service, or backend. See *Security notes* below.

## GitHub Pages deployment

The app is a single-page application (React Router). GitHub Pages serves static
files, so direct navigation to a deep route like `/Med-Learn/dashboard` would
return a 404 without special handling. This project uses the
[spa-github-pages](https://github.com/rafgraph/spa-github-pages) redirect
technique:

1. `public/404.html` — encodes the requested path as a query-string and
   redirects to the root.
2. `index.html` — decodes the query-string back to the real URL and hands it to
   React Router via `history.replaceState`.

All asset URLs and the React Router `basename` are set from `VITE_BASE_PATH`,
which is already wired in `vite.config.ts` and `src/main.tsx`.

### Routing trade-off

GitHub Pages project sites are hosted at a sub-path
(`https://username.github.io/Med-Learn/`). BrowserRouter requires
`basename={import.meta.env.BASE_URL}` (already set) so all `<Link>` and
`navigate()` calls work correctly. Direct deep-link refreshes use the 404.html
bounce described above — there is no round-trip to a server; the redirect
happens entirely in the browser. The URL in the address bar looks normal after
the bounce.

### Automated deployment (GitHub Actions)

A workflow at `.github/workflows/pages.yml` is already prepared. It:

1. Installs dependencies and lints.
2. Builds with `VITE_BASE_PATH=/Med-Learn/`.
3. Adds `.nojekyll` and uploads the `dist/` folder as a Pages artifact.
4. Deploys via the official `deploy-pages` action.

**One-time setup the repo owner must do before the workflow can publish:**

1. Go to **Settings → Pages** in the GitHub repository.
2. Under *Source*, select **GitHub Actions** (not *Deploy from a branch*).
3. Save. The next push to `main` will trigger the workflow and publish the site.

> The workflow is committed and ready, but it cannot publish until GitHub Pages
> is enabled. Nothing is deployed by this PR.

### Building the web bundle manually

```bash
# Linux / macOS / Git Bash
VITE_BASE_PATH=/Med-Learn/ npm run build

# Windows PowerShell  (cross-env is installed as a dev dependency)
npm run build:web
```

The output lands in `dist/`. Serve it with any static host — the only
requirement is that 404 responses serve the `404.html` file you just built
(GitHub Pages does this automatically).

If you deploy to a different repository name, change `/Med-Learn/` to
`/<repo-name>/` everywhere (the npm script, the workflow env var, and the
`pathSegmentsToKeep = 1` value in `public/404.html` stays the same for any
GitHub project site).

## Architecture

```
src/
  components/   Sidebar, VideoPlayer, DocumentViewer, NoteEditor
  contexts/     AuthContext (useAuth, useRequiredUser)
  data/         mockData.ts — courses, subjects, modules, lessons
  layouts/      AppLayout (sidebar + routed content, responsive drawer on mobile)
  pages/        One file (+ CSS) per screen
  services/     All data access — the only layer that touches storage
  types/        Canonical domain types
src-tauri/      Rust shell, window config, CSP
public/
  404.html      GitHub Pages SPA redirect
  .nojekyll     Prevents Jekyll from stripping _assets/
.github/
  workflows/
    pages.yml   Automated GitHub Pages deployment workflow
```

Rules of thumb:

- Pages and components call **services**; they never read `localStorage` directly.
- Pages under `RequireAuth` use `useRequiredUser()`; routes that may not resolve (course/lesson params) are split into a thin wrapper plus a content component so hooks always run unconditionally.

## Responsive layout

- **≥960 px** — classic desktop layout: fixed sidebar + scrollable main content panel (same as the Tauri window).
- **<960 px** — top bar with hamburger button; sidebar slides in as an off-canvas drawer with a backdrop overlay.
- **Login page** — stacks vertically on phones (≤600 px); brand panel stays visible on tablets.

The Tauri `minWidth: 960` config keeps the desktop window in the desktop layout.

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

- **Demo only.** The credentials (`ahmed@medlearn.com` / `demo1234`) are public and hardcoded. They provide no real access control — anyone who opens DevTools can inspect or bypass the check.
- All progress, bookmarks, and notes are stored in `localStorage` in the visitor's own browser. There is no server, no cloud database, and no sharing between devices.
- Client-side checks cannot stop determined content leakage. Real entitlement checks, signed URLs, and watermarking must be enforced server-side when a backend is added.
- The Tauri CSP in `src-tauri/tauri.conf.json` restricts network access to the app itself plus Google Fonts; tighten or extend it deliberately when adding backends.
