# Architecture Overview

This document describes the backend architecture as implemented today.

## System Shape

EchoRoom uses a client-server architecture:

- Frontend: Next.js app in `frontend/`
- Backend: Express + TypeScript API in `backend/src`
- Data: Hybrid storage model
  - Persistent auth data in MongoDB via Prisma (`User`, `RefreshToken`)
  - In-memory arrays for ideas, experiments, outcomes, reflections, and comments

## Backend Runtime

- Entry point: `backend/src/index.ts`
- HTTP server: Express
- JSON parsing: `express.json()`
- CORS: allows `http://localhost:3000` and `http://localhost:3001`
- Health route: `GET /health`

Mounted route groups:

- `/auth`
- `/ideas`
- `/experiments`
- `/outcomes`
- `/reflections`
- `/ideas/:ideaId/comments`

Note: `insights` route files exist in the codebase but are not currently mounted in `index.ts`.

## Layers

Current backend layering is:

- Routes/controllers: HTTP validation and response shaping
- Services: domain logic
- Data sources:
  - Prisma client in `src/lib/prisma.ts` for auth data
  - In-memory data modules for most domain entities

## Authentication and Authorization

Auth implementation exists and is active for `/auth` routes:

- Password hashing with `bcryptjs`
- Access tokens (JWT, 15m)
- Refresh tokens persisted in MongoDB

Middleware available:

- `authenticate`
- `optionalAuth`
- role/permission guards in `middleware/permissions.ts`

Current route usage:

- Comments `POST` uses `optionalAuth`
- Most domain routes (`ideas`, `experiments`, `outcomes`, `reflections`) are currently public and do not enforce auth middleware yet

## State and Persistence Behavior

Important current behavior:

- Auth users and refresh tokens persist in MongoDB
- Ideas/experiments/outcomes/reflections/comments are reset on backend restart
- This means account data survives restarts, but core collaboration data does not

## Domain Notes

- Ideas include state transitions (`draft -> proposed -> experiment -> outcome -> reflection`) and optimistic locking via `version`
- Experiments include progress derived from status (`planned`, `in-progress`, `completed`)
- Outcomes block experiment deletion when an outcome exists
- Reflections enforce required structured fields and score ranges

## Architectural Gaps (Current)

- No unified persistence across all domains
- Auth and permission middleware not consistently applied to domain routes
- Some code paths and docs still reference planned modules that are not wired into the server

This architecture is functional for local development and feature iteration, but persistence and access-control alignment are the next major backend milestone.
