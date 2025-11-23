# Repository Guidelines

## Project Structure & Module Organization

- `src/` is the single TypeScript workspace: `server.ts` and `browser.ts` boot entry points plus shared helpers (`shared.ts`, `buffer.ts`), and a static `index.html` for the browser demo.
- `src/index.ts` hosts the Node-powered Avro example, while `src/browser.ts` is bundled into `dist/` (via `npm run build:browser` using esbuild) for the front-end showcase.
- Playwright specs live under `e2e/` and mirror the user flow exercised by the browser bundle; `dist/` is generated and not checked in.
- Root files (`package.json`, `tsconfig.json`, `biome.json`, `README.md`) describe dependencies, compilation, formatting, and the public overview, so keep them aligned with the code changes.

## Build, Test, and Development Commands

- `npm install` – installs dependencies.
- `npm run build:browser` – bundles `src/browser.ts` to `dist/` with source maps (esbuild).
- `npm start` – builds the browser bundle and serves `src/server.ts` on `http://127.0.0.1:3000`; used for local demos.
- `npm run test:node` – executes the Node.js Avro example (`src/index.ts`) via Node + ts-node register shim.
- `npm run test:e2e` – runs the browser build then `playwright test`, exercising `e2e/example.spec.ts`.
- `biome check .` / `biome format . --write` – enforces linting and formatting; include them in pre-commit or CI steps.

## Coding Style & Naming Conventions

- TypeScript files use ES modules (`type": "module"`) with default 2-space indentation inherited from Biome’s TypeScript configuration; keep imports sorted (external before local) and prefer descriptive names (`runAvroExample`, `userSchema`).
- Shared helpers live next to the domains they touch (e.g., `shared.ts` for cross-context logic) and the browser bundle targets `dist/` with the same naming as the source files.
- Trust Biome as the formatter/linter; run `biome format . --write` before committing and `biome check .` in CI to catch deviations from the project’s style.

## Testing Guidelines

- Unit/logic verification happens via `bun run src/index.ts`, so keep example data (the `User` schema and buffer) small and deterministic.
- End-to-end validation is handled by Playwright in `e2e/example.spec.ts`; follow its existing structure (`test('description', async ({ page }) => { ... })`) and keep new specs inside `e2e/`.
- Name specs to describe the user journey (`example.spec.ts` style) and rely on `bunx playwright test` to run the suite.
- Rebuild the browser bundle before Playwright runs to ensure the latest assets are served; the `test:e2e` script already chains both steps.

## Commit & Pull Request Guidelines

- Repository lacks a prior git history, but follow conventional best practices: use short, imperative commit messages (e.g., `Add browser Avro demo`). Mention scope when useful (`docs:`, `feat:`, etc.).
- Pull requests should include a clear description of the change, testing steps (commands executed), and any related issue or ticket numbers. Attach screenshots only if UI changes and note whether the browser bundle/rebuild is required.
