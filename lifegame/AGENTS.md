# Repository Guidelines

These guidelines keep contributions consistent and predictable for the lifegame project. If something is unclear or missing, open an issue before submitting a PR.

## Project Structure & Module Organization

- Source: `src/` for application code (modules by feature, e.g., `src/core/`, `src/ui/`).
- Tests: `tests/` mirroring `src/` (e.g., `tests/core/`, `tests/ui/`).
- Assets: `assets/` for images, configs, and sample data.
- Scripts/Tooling: `scripts/` for dev utilities; keep cross‑platform where possible.

Example layout:
```
src/
tests/
assets/
scripts/
```

## Build, Test, and Development Commands

Use a Makefile or package scripts for convenience. Examples:
- `make setup`: install dependencies and prepare local env.
- `make run`: start the app locally (e.g., run CLI or dev server).
- `make test`: run the full test suite with coverage.

If using language-native tools, prefer:
- Python: `pytest -q`, `ruff check`, `black .`
- Node.js: `npm test`, `npm run lint`, `npm run dev`

## Coding Style & Naming Conventions

- Indentation: Python 4 spaces; JS/TS 2 spaces.
- Names: modules/files kebab- or snake-case; classes PascalCase; functions/vars camelCase (Python: snake_case).
- Keep functions small and pure; document non-obvious logic with short docstrings.
- Run formatters/linters before committing (e.g., Black/Ruff or Prettier/ESLint).

## Testing Guidelines

- Framework: mirror project language (e.g., `pytest`, `vitest/jest`).
- Structure: one test file per module. Name as `test_*.py` or `*.spec.ts`.
- Coverage: aim ≥80% lines; include edge cases and failure paths.
- Run locally: `make test` or the language-native test command above.

## Commit & Pull Request Guidelines

- Commits: follow Conventional Commits (e.g., `feat: add toroidal grid`, `fix: correct tick update`).
- Scope small; commit early and often with meaningful messages.
- PRs: include description, rationale, screenshots/GIFs for UI, and linked issues (`Closes #123`).
- Checks must pass (lint, tests, type checks) before review.

## Security & Configuration Tips

- Never commit secrets; use `.env` and provide `.env.example`.
- Keep `.gitignore` current (e.g., virtualenvs, `node_modules`, build artifacts).
- Validate external input; avoid unchecked file and network operations.

