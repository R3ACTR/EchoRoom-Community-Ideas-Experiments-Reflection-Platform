# Contributing to EchoRoom

Thanks for contributing to EchoRoom.

This project is active and evolving. Please use current behavior as the source of truth, especially for backend persistence and auth.

## Code of Conduct

All contributors must follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Project Snapshot

EchoRoom includes:

- Frontend in `frontend/` (Next.js)
- Backend in `backend/` (Express + TypeScript)
- Docs in `docs/`

Current backend data model is hybrid:

- Persistent: auth users and refresh tokens (Prisma + MongoDB)
- In-memory: ideas, experiments, outcomes, reflections, comments

When changing behavior, update documentation in the same PR.

## Good Contribution Areas

- Persistence migration to Prisma for domain entities
- Auth and permission enforcement on write routes
- API consistency and error handling improvements
- Frontend integration with backend auth
- Tests (service, route, and integration)
- Documentation quality and accuracy

## Contribution Workflow

1. Find or open an issue.
2. Confirm scope and assumptions in the issue thread.
3. Create a focused branch from `main`.
4. Implement changes with tests and docs.
5. Open a PR with clear summary and validation notes.

## Development Setup

- Frontend setup: `frontend/README.md`
- Backend setup: `backend/SETUP.md`
- API reference: `docs/api.md`
- Architecture: `docs/architecture.md`

## PR Expectations

Each PR should include:

- Linked issue (if available)
- What changed and why
- How it was tested
- Any API/schema/documentation changes

For UI changes, include screenshots. For backend changes, include request/response examples when helpful.

## Quality Bar

Before opening a PR:

- Run relevant tests locally
- Build succeeds for changed package(s)
- No unrelated refactors mixed into the same PR
- Docs updated when behavior changes

## Docs Requirement

If you change API behavior, route mounting, setup steps, or architecture assumptions, update:

- `docs/api.md`
- `docs/architecture.md`
- `backend/README.md` and/or `backend/SETUP.md` (if setup/runtime changed)
- `ROADMAP.md` if milestone status changes

## Communication

If you are blocked:

- Comment in the issue with concrete blocker details
- Propose one or two options to unblock
- Ask maintainers for direction early

## Branch and Review Rules

- Do not push directly to `main`
- Keep commits focused and descriptive
- Address review comments with code or clear rationale

Consistent, small, well-tested PRs are preferred over large multi-topic changes.
