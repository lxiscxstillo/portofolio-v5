# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server at localhost:5173
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
npm install --legacy-peer-deps  # Use this flag if peer dependency conflicts arise
```

No test framework is configured.

## Environment Variables

Create a `.env` file with:

```
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
```

## Architecture Overview

Personal portfolio site with a public-facing portfolio and a protected admin dashboard.

**Tech stack:** React 18 + Vite, React Router v6, Tailwind CSS, Supabase (auth + PostgreSQL + realtime), Framer Motion / GSAP / AOS for animations.

### Routing (`src/App.jsx`)

- `/` — Landing page (Home, About, Projects, Certificates, Contact sections)
- `/project/:slug` — Project detail page (lazy-loaded)
- `/login` — Admin login
- `/dashboard/*` — Protected admin area (`ProtectedRoute` checks Supabase auth + `profiles.role`)
- `*` — 404 page

Major route components are lazy-loaded via `React.lazy()`.

### Data Layer (`src/supabase.js`)

All data operations go through the Supabase JS client — no REST calls, no Redux. Component-local `useState`/`useEffect` hooks fetch directly from Supabase tables:

- **projects** — `title, description, img, link, github, features (JSONB), tech_stack (JSONB), is_published, order_index`
- **certificates** — `img`
- **portfolio_comments** — `content, user_name, profile_image, is_pinned`; realtime subscriptions enabled
- **profiles** — `username, role` (admin/user); used by `ProtectedRoute`

Row-Level Security (RLS) enforces authorization at the DB level — public users can read and insert (non-pinned) comments; admins have full access.

### Styling

Primary: Tailwind CSS utility classes. Custom global CSS (scroll animations, blob keyframes, custom scrollbar) lives in `src/index.css`. Component-scoped styles use `styled-components` or `@emotion/styled` where needed. The design is dark-themed (`bg-[#030014]`).

### Admin Dashboard (`src/Pages/dashboard/`)

Three sub-pages for managing Projects, Certificates, and Comments — all perform direct Supabase CRUD. Project images and certificate images are stored in Supabase Storage buckets (`project-images`, `certificate-images`).

### Deployment

Configured for Vercel (`vercel.json` rewrites all routes to `index.html` for SPA behavior).
