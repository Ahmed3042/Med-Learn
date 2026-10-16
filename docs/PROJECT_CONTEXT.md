# Med-Learn — Project Context Transfer

_Last updated: 16 October 2026_

Use this document to continue the Med-Learn project in a new chat. It consolidates the project vision, decisions, implementation direction, constraints, build plan, and open questions from the prior conversation. Treat provider pricing, free-tier limits, model availability, and platform capabilities as items to re-check before relying on them; they can change.

## 1. Project vision

Med-Learn is a medical-learning platform for university medical students. The long-term product should make it easy to study structured medical courses with video lectures, documents, progress tracking, notes, bookmarks, and later quizzes and flashcards. The platform may eventually support student accounts and course access entitlements, plus instructor/admin tools.

The original concept emphasized a large catalog of high-yield lectures and large clinical learning documents, with safeguards against account sharing and unauthorized redistribution. The launch strategy was changed to **start with a small, usable product at zero cost while finding the first customers**, rather than paying to host a large catalog before demand is proven. The product should grow in stages and costs should be considered only when there is real usage and a customer-supported reason to add services.

## 2. Current decisions

- **Build the desktop application first.** The latest explicit sequencing request was to start with the desktop app.
- **Initial target: Windows desktop.** Use Tauri 2 as the desktop shell.
- **Keep the UI reusable.** Build the main interface as React + TypeScript + Vite, so a web version can be deployed later without maintaining a separate front end. The desktop app should package its built UI instead of merely opening a hosted web page.
- **Website next, mobile later.** GitHub Pages was named as the intended early website host. Android/iOS are later stages, after the desktop and web experience are understood. Do not let the future mobile path expand the first desktop milestone.
- **No real cloud backend for the initial prototype.** Use clearly labelled mock data and local persistence. Do not add cloud accounts, media hosting, payments, or paid services to this first milestone.
- **Use service boundaries.** UI pages should call services rather than directly accessing local storage or binding themselves to a future provider.
- **Keep billing and access entitlements separate in the eventual data model.** Payments are out of scope now; when introduced, an enrollment/entitlement should express access, while payment records remain separate.
- **Treat anti-piracy as deterrence and traceability, not a promise of perfect prevention.** No browser or desktop client can make displayed or delivered content impossible to copy.

## 3. Current workspace state

The project workspace already contains a Med-Learn V1 codebase. Its README describes:

- Tauri 2 + Rust desktop shell;
- React 19 + TypeScript + Vite interface;
- demo login and local session;
- dashboard, courses/subjects/modules/lessons navigation;
- placeholder video and document viewing;
- locally persisted progress, bookmarks, and notes;
- profile/settings and theme options;
- local mock data and `localStorage` behind service modules.

The README lists these commands: `npm install`, `npm run dev`, `npm run tauri:dev`, `npm run build`, `npm run tauri:build`, and `npm run lint`. It gives demo credentials `ahmed@medlearn.com` / `demo1234`. Treat these as repository documentation, not as proof that every command/build has been verified. The working tree already contains changes and untracked project files; preserve them. This context-transfer task does not authorize replacing or restructuring the app.

Relevant current structure includes `src/pages`, `src/components`, `src/services`, `src/data`, `src/types`, `src/contexts`, and `src-tauri`. The project README is at the repository root. This transfer document is separate at `docs/PROJECT_CONTEXT.md`.

## 4. Architecture direction

### First milestone: local Windows desktop prototype

```text
React + TypeScript + Vite
          │
          ├── packaged by Tauri 2 → Windows desktop app
          │
          └── later build output → GitHub Pages website

Local demo data + replaceable service interfaces
```

For the desktop installer, package the frontend with Tauri. Do not make the desktop app depend on GitHub Pages being online. GitHub Pages is static hosting and is not the authentication, database, or secret-bearing API layer.

### Possible later production direction (not committed)

The earlier architecture discussion considered:

- **Supabase** for PostgreSQL, authentication, and row-level security (RLS);
- **Cloudflare Workers** for server-side authorization and token/session operations;
- **Cloudflare R2** for private document storage;
- **Upstash Redis** for temporary playback/session locks, not ordinary durable application data;
- **Bunny Stream** for hosted/transcoded video, if its current cost and terms fit;
- **PDF.js** for document rendering.

This is a set of future candidates, not a requirement to integrate them now. Re-check terms, pricing, quotas, commercial-use restrictions, and current product capabilities before adoption. Do not place server secrets in web or desktop client code. Any public client key must be designed for public exposure and backed by server-side authorization/RLS.

A future high-level request path could be:

```text
Client → authenticated authorization layer → entitlement/session check
       → temporary access to private document/video delivery
```

Possible persistent data areas later include profiles/roles, faculties and academic years, subjects, modules, lessons, courses, enrollments/entitlements, media metadata, lesson progress, bookmarks, notes, device/session records, and security events. Keep the curriculum hierarchy flexible: Faculty/College → Year/Phase → Subject → Module → Lesson.

## 5. Anti-piracy: realistic limits and design principles

The original proposal included single-device playback locks, expiring media access, private storage, and visible dynamic watermarks. The later architecture review corrected several assumptions:

- **A PDF viewer is not DRM.** PDF.js must receive document bytes to render them. A motivated user can inspect network traffic, capture rendered pages, take screenshots, or photograph the screen. Hiding a download button or drawing pages to canvas is only friction, not a guarantee.
- **Video controls are also imperfect.** Signed/short-lived playback access, domain/referrer restrictions, and provider controls may deter casual copying, but screen recording and external cameras remain possible. DRM is a later, cost-dependent option, not a day-one feature.
- **Concurrency checks are useful but not infallible.** A server-side lock with a session ID, device ID, heartbeat, and TTL can limit simultaneous viewing. A second session can replace the active lock; the first client can stop when its heartbeat is rejected. Design for network failures, stale locks, account recovery, and support cases.
- **Watermark to deter and trace.** A student-specific watermark can include a shortened account identifier and/or opaque session identifier, with position changes over time. Do not put a full IP address on screen; it is sensitive and is not needed for attribution. Apply this only when real content and an appropriate privacy notice exist.
- **Keep secrets server-side.** Never ship provider private keys, database service-role keys, or signing secrets in Vite/browser/Tauri frontend code.
- **Set the objective correctly:** make unauthorized sharing harder, more attributable, and revocable—not mathematically impossible.

Before a real launch, privacy, data-retention, account-sharing, and content licensing choices need review. Medical content should also carry source/author/version/review metadata so corrections and updates can be tracked.

## 6. Cost constraints

The current goal is **$0 spend until customers**, especially for the first desktop milestone. Use free/open-source local tools already available; avoid starting subscriptions or entering payment details for services. Local builds may still require free downloads and a compatible Windows development environment.

Do not add during the first milestone:

- paid APIs, hosting, databases, authentication, analytics, or design kits;
- payment gateways, subscriptions, or billing;
- Bunny Stream or any paid video delivery;
- production DRM;
- external AI APIs;
- Redis or other cloud session infrastructure;
- real student accounts or production content delivery.

A free tier is not a permanent cost guarantee. Review current terms and usage limits before any future hosted rollout. GitHub Pages is for static frontend assets, not private course media or backend secrets.

## 7. Antigravity model recommendation

The prior conversation’s exact recommendation for the first major Antigravity implementation task was:

> **Claude Sonnet 4.6 (Thinking)**

For small follow-up fixes, it suggested **Gemini 3.8 Flash** as a lighter option. These names and free-plan availability are preserved from that conversation; confirm they still appear in Antigravity’s model selector and that the account’s current plan permits the intended use before starting. If unavailable, choose a currently available strong coding model with a reasoning/thinking mode for the main implementation and a faster economical model for minor fixes.

## 8. Copy-ready Antigravity implementation prompt

Use this as the first implementation request in Antigravity after opening the Med-Learn repository. The existing workspace already has a scaffold, so instruct the agent to inspect and continue it rather than overwrite it.

```text
You are the lead engineer continuing the existing Med-Learn repository. First inspect the current files and README. Preserve working user changes and existing code. Do not replace the project with a fresh scaffold unless a specific blocker makes that necessary; explain the blocker before making broad changes.

PRODUCT
Med-Learn is a professional medical-learning application for university medical students. The long-term product may have a web client and later mobile clients, but the immediate milestone is the Windows desktop app. Build on the repository’s React + TypeScript + Vite frontend and Tauri 2 shell. The desktop app must package its UI locally and must not depend on a GitHub Pages URL to start.

COST LIMIT
The milestone must use $0-cost local development only. Do not add paid services, subscriptions, paid APIs, real cloud databases/auth, payment processing, paid hosting, video hosting, DRM, analytics, or external AI APIs. Keep all data mock/demo data and local persistence. Do not introduce secrets or fake API keys.

STACK
Use the existing React, TypeScript, Vite, Tauri 2, Rust, and CSS setup. Prefer the dependencies already present. Do not add dependencies without a concrete need. Use open-source/free assets or CSS/SVG/vector shapes; do not copy copyrighted artwork.

SCOPE
Make a coherent desktop V1 for demonstrating:
- demo login/logout, clearly marked as local demo authentication;
- dashboard with continue learning, courses, recent lessons, progress, and useful quick actions;
- course → subject → module → lesson navigation;
- video lesson screen using a local sample only if small and legally usable, otherwise a polished placeholder;
- document lesson screen using a local demo document or polished placeholder;
- local progress, last-opened lesson, bookmarks, and notes that survive restart;
- profile and settings, including a usable light/dark theme if already supported;
- clear empty, loading, and error states where relevant.

Use realistic but clearly fictional/demo educational data. Example areas: Anatomy, Histology, Physiology, and Pathology. Keep the hierarchy flexible: Faculty → Year → Subject → Module → Lesson. Do not claim that demo content is real medical advice or protected content.

ARCHITECTURE
Keep mock data out of presentation components. Pages/components should use typed services/hooks. Continue or improve the existing service boundary for authentication, courses, video, documents, progress, bookmarks, notes, and local storage as needed. The local implementations should be straightforward and replaceable later by server-backed implementations without rewriting the UI. Avoid unnecessary abstractions and giant files.

DESIGN
Create a polished, calm, professional academic interface: clear hierarchy, readable typography, intentional spacing, restrained medical-inspired colors, and responsive desktop behavior. Avoid a generic admin dashboard, clutter, childish visuals, dead links, and meaningless statistics. Every visible navigation item and button should work or be clearly disabled with an explanation. Include keyboard focus states and sensible accessible labels.

SECURITY AND HONESTY
This is a local demo, not production security. Do not claim that PDFs or video cannot be copied. Do not add client-side secrets. Leave concise documentation at the future integration boundaries for Supabase Auth/PostgreSQL/RLS, a server-side authorization layer, private document/video delivery, session checks, and watermark deterrence; do not implement these services now.

QUALITY AND DELIVERY
Before editing, summarize the existing app structure and propose a small sequence of changes. Then implement in reviewable stages and show the changed files. Preserve unrelated user work. Update the README only if needed to match actual behavior and setup. Run the project’s existing lint/build commands only when appropriate, report the exact results, and do not claim success for commands that were not run. Fix any issues caused by your changes. Do not commit or publish anything unless explicitly asked.
```

## 9. Setup and guided workflow

The earlier setup guidance was:

1. **Check the machine before installing anything.** Open Command Prompt (`cmd.exe`) if PowerShell’s `npm.ps1` policy has caused trouble. Check `node -v`, `npm.cmd -v`, `git --version`, `rustc --version`, and `cargo --version`. The earlier plan assumed Node and Git were already installed; do not reinstall them if they work.
2. **Confirm the Windows Rust toolchain.** The prior guidance used `rustup default stable-msvc`. Tauri desktop builds also need Microsoft C++ Build Tools/Visual Studio Build Tools with the Windows development components and the Windows WebView runtime. Let setup errors identify missing prerequisites; install only what the official Tauri setup requires.
3. **Use the existing project repository.** The original fresh-project plan suggested creating a GitHub repository named `medlearn-desktop`, cloning it, and opening it in Antigravity. The current workspace already has a repository and app files, so continue in the existing Med-Learn project rather than creating a duplicate repository.
4. **Open the project folder in Antigravity.** Select Claude Sonnet 4.6 (Thinking), if currently available, and provide the copy-ready prompt above as the initial scoped task.
5. **Review before accepting broad changes.** Ask Antigravity to explain its file plan, inspect the focused changes, and keep work in manageable stages. Preserve existing work and avoid large rewrites.
6. **Run locally.** The repository README documents `npm install`, `npm run dev` for browser preview, and `npm run tauri:dev` for the desktop window. Use the desktop command to verify the actual Tauri shell; browser preview alone does not prove the desktop build works.
7. **Build an installer only after the app is ready.** README documents `npm run build` and `npm run tauri:build`. Confirm the generated installer and launch it locally. Do not claim the build is verified unless it has actually completed.
8. **Use Git checkpoints.** After reviewing each coherent stage, inspect `git status`, stage only intended files, commit with a descriptive message, and push only if desired. Do not stage unrelated existing changes.
9. **Keep website deployment for its own milestone.** When ready, configure the Vite base path and a GitHub Actions workflow for GitHub Pages, accounting for the repository subpath and client-side routing. Keep private content and secrets out of Pages.

## 10. Roadmap and milestones

### Milestone 0 — Existing V1 foundation

Inspect the current code, preserve the existing work, and establish which features and commands really work. Fix only concrete gaps necessary for the Windows desktop demo. Keep local mock data and no cloud spend.

### Milestone 1 — Demonstrable desktop learning loop

A student can sign in with demo credentials, find a course, navigate to a lesson, view the video/document demo experience, save a note/bookmark, and return to see persisted progress. Verify navigation and local persistence across app restart.

### Milestone 2 — Desktop packaging and quality

Resolve Windows prerequisites, run the Tauri desktop app, produce and launch a Windows installer, and document setup. Keep a reviewable Git checkpoint. No production content or backend yet.

### Milestone 3 — Public web version

Reuse the frontend for a static GitHub Pages deployment. Separate public marketing pages from the student app routes if useful. Do not assume Pages provides authentication, private storage, or server-side secrets. Reassess backend needs before real users or private course content.

### Milestone 4 — First real multi-user backend (decision required)

Only when customer validation justifies it, select and verify current provider terms. Candidate design: Supabase Auth/PostgreSQL/RLS for durable data and entitlements; a server-side Worker/API for sensitive checks; private storage for documents; a video provider selected with cost modeling. Migrate service implementations rather than rewriting UI.

### Milestone 5 — Learning/security expansion

Consider quizzes, flashcards, content version/review metadata, instructor/admin workflows, session/device controls, security event review, and visible forensic watermarks. Add features based on actual student needs and operating capacity.

### Milestone 6 — Mobile

Decide whether to extend Tauri 2 or use a separate mobile client sharing domain types/API/service contracts. Validate mobile-specific navigation, document rendering, media playback, and app-store needs before committing to a technology.

## 11. Explicitly out of scope for the first milestone

- Real authentication, cloud sync, student accounts, and production authorization;
- GitHub Pages deployment (planned later; no need for the desktop prototype);
- Supabase, Workers, R2, Redis, Bunny Stream, or other hosted integrations;
- payments, pricing decisions, subscriptions, coupons, or invoices;
- production video catalog, bulk document storage, or hundreds of GB of media;
- DRM or claims of uncopyable content;
- AI tutor/diagnosis, live classes, social features, recommendations, or a huge question bank;
- a complete instructor/admin portal;
- mobile implementation;
- unrelated refactoring or application changes while creating this handoff document.

## 12. Unresolved decisions for the next project chat

1. Does the current desktop V1 work end-to-end, and which parts are placeholders or incomplete?
2. Is the app name “Med-Learn” final, and what brand identity/logo should be used?
3. Which medical faculty/country/curriculum and academic year structure should shape real course content?
4. Should the public website and student application be one deployment/repository or separate routes/sites?
5. What is the first real user validation goal (students, course, lessons, and success measure)?
6. What content is owned/licensed for use, and how will faculty review/update dates and versions be managed?
7. What account-sharing policy is acceptable (one active stream, a small device allowance, or manual account review), and what support/recovery path is needed?
8. Which real backend/provider set fits current terms, location, data requirements, and expected traffic once there are customers?
9. What privacy notice, watermark data, retention periods, and jurisdictional requirements apply before collecting student data?
10. Which mobile approach is preferable after web/desktop validation?

## 13. Guidance for the next chat

Start by reading this file and the current root README, then inspect only the relevant existing code. Ask for clarification only on decisions that block the next concrete step. Keep the $0 constraint active, preserve the current working tree, and distinguish recommendations from verified repository facts. Do not implement the later cloud architecture prematurely.
