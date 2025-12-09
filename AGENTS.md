# Repository Guidelines

## Project Structure & Modules
- Top-level: `public/` (static assets), `sanity/` (CMS config), `src/` (app code), config at repo root (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, etc.).
- `src/app`: App Router pages/layouts; key routes include `/` (`page.tsx`), `/news` + `/news/[slug]`, `/section/[category]`, `/about`, admin area (`/admin` with authors, categories, new, settings), API routes (`api/preview`, `api/revalidate`, `api/disable-draft`), shared shell (`layout.tsx`, `globals.css`, `error.tsx`, `not-found.tsx`).
- `src/components`: UI building blocks; admin tools (article-form, authors-manager, categories-manager, image-upload, rich-editor, ticker-manager), content/UI pieces (article-card, portable-text), layout (header, footer, ticker), primitives (`ui/button`).
- `src/lib`: Domain helpers and Sanity integration; admin actions, portable-text converter, TipTap extensions; shared constants/data/utils; Sanity client/fetch/image/mappers/queries/write-client modules.
- `src/assets`: Project images under `src/assets/images`; prefer `next/image` and local assets over hotlinking.
- `src/types`: Shared TypeScript interfaces and types used across app/lib/components.

## Setup, Build, and Run
- Install: `npm install` (npm lockfile; Node 18+).
- Dev server: `npm run dev` (http://localhost:3000).
- Build: `npm run build`; start output with `npm run start`.
- Lint: `npm run lint` (ESLint + Next.js rules).
- Keep `NEXT_PUBLIC_USE_SANITY="true"` in every deployed environment. Setting it to `false` enables the fallback seed data and renders a yellow warning banner across the site; only toggle locally for offline work.

## Planning 
- Always explain your findings in simple english. 
- When you generate a plan always explain the step in simple english , and add a why section and benefit section for each step. 
- when you plan consider how the changes will affect the rest of the codebase. 

## Coding Style & Naming
- TypeScript in `strict` mode; favor `const` and typed props.
- Components are functional; kebab-case filenames, PascalCase exports.
- Styling uses Tailwind; group classes by layout → color → effects. Use `clsx`/`tailwind-merge` for conditional classes.
- Formatting: 2-space indent, single quotes, imports ordered (React/Next, then aliases).

## Testing Guidelines
- No automated tests yet—always run `npm run lint` before commits. If you add tests, co-locate under `src/**/__tests__` (e.g., `component.spec.tsx`) and note any missing coverage in the PR.

## Commit & Pull Request Practices
- Commits: short, imperative summaries (matches current history; Conventional is optional).
- PRs: ensure `npm run lint` (and any added tests) pass; add UI screenshots/GIFs when layouts change; link related issues; keep scope focused.

## Configuration & Security
- Keep secrets in local `.env` (untracked); mirror values in hosting config. Public client vars must start with `NEXT_PUBLIC_`.
- Store static assets in `public` or `src/assets`; avoid hotlinking external media.

## Implementation Checklist
- Run `npm run lint` often; before handoff also run `npm run build` for a full type-check. Note any intentional skips.
- If you introduce tests, add an `npm test` script and place specs in `src/**/__tests__`; call out gaps until coverage exists.
- New env flags go in `.env.example`; access via `process.env` (public keys prefixed `NEXT_PUBLIC_`); never commit real secrets.
- Changes to shared helpers or data in `src/lib` should include updated types in `src/types` and, when logic is added, a small spec or documented manual check.
- Add global or app-wide typings in `src/types` or `global.d.ts`, and import via `@/` to keep paths consistent.
- If lint/TS errors surface outside your change, mention them in the PR summary instead of suppressing with `any` or broad ignores.
- The Authors admin page exposes a “Reassign & Delete” flow; always reassign articles before deleting an author with references (the delete button stays disabled until references drop to zero).
