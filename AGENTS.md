# Repository Guidelines

## Project Structure & Modules
- `src/app`: App Router pages, layouts, and route handlers; route folders stay lowercase.
- `src/components`: Reusable UI pieces; files are kebab-case, exports PascalCase.
- `src/lib`: Data/constants and helpers; shared imports use the `@/` alias from `tsconfig.json`.
- `src/assets` and `public`: Local images and static assets—prefer these with `next/image`.
- `src/types`: Shared TypeScript types and interfaces.

## Setup, Build, and Run
- Install: `npm install` (npm lockfile; Node 18+).
- Dev server: `npm run dev` (http://localhost:3000).
- Build: `npm run build`; start output with `npm run start`.
- Lint: `npm run lint` (ESLint + Next.js rules).

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
