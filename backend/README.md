# EchoRoom Backend

Backend service for EchoRoom, built with Express + TypeScript.

## Current Status

The backend is no longer a minimal scaffold. It currently includes:

- Auth system with JWT access tokens and refresh tokens
- Prisma + MongoDB integration for auth persistence (`User`, `RefreshToken`)
- Domain APIs for ideas, comments, experiments, outcomes, and reflections
- State transition and optimistic-locking rules for ideas

## Important Data Behavior

Storage is persisted in MongoDB via Prisma for:

- auth users and refresh tokens
- ideas, comments, experiments, outcomes, reflections

Only synthesized insights remain in-memory.

## Tech Stack

- Node.js + TypeScript
- Express
- Prisma ORM
- MongoDB
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)

## Run Locally

```bash
cd backend
npm install
npm run prisma:generate
npm run dev

Server default: `http://localhost:5000`

 docs/add-common-errors-fixes

---


### Health Check Endpoint

**GET /health**
=======
Health check:

```bash
curl http://localhost:5000/health
```
 main

## Scripts

 docs/add-common-errors-fixes


- `npm run dev` - Run backend with ts-node
- `npm run build` - Compile TypeScript to `dist/`
- `npm run start` - Run compiled server
- `npm run seed:ideas` - Optional: seed 180 demo ideas into MongoDB
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run Prisma migrate (dev)
- `npm run prisma:push` - Push Prisma schema to DB
- `npm run prisma:studio` - Open Prisma Studio
- `npm run test:experiments-contract` - Build and run experiments service contract test

## API Surface

Mounted route groups in `src/index.ts`:

- `/health`
- `/auth`
- `/ideas`
- `/ideas/:ideaId/comments`
- `/experiments`
- `/outcomes`
- `/reflections`

Detailed endpoint docs: `../docs/api.md`

## Repo Structure
 main

```text
backend/
  prisma/
    schema.prisma
  src/
    controllers/
    data/
    lib/
    middleware/
    routes/
    services/
    index.ts
  README.md
  SETUP.md
```

docs/add-common-errors-fixes
## Common Errors & Fixes

This section lists common setup and runtime issues contributors may encounter when working on the backend, along with quick fixes.

### Prisma client not generated

**Symptom**
- Server fails to start
- Errors related to missing Prisma client

## Known Gaps

- Auth/permissions middleware is not consistently enforced across domain routes
- Insights route files exist but are not mounted in the active server

## Seeding

The backend does not seed idea data automatically at runtime.
Use `npm run seed:ideas` only when you explicitly want local demo data.

Optional count override:
 main

**Fix**
```bash
 docs/add-common-errors-fixes
npm run prisma:generate

 docs/add-env-vars-table
---

## Environment Variables

The backend depends on the following environment variables to run correctly.
Make sure these are defined in your `.env` file before starting the server.

| Variable       | Required | Description |
|----------------|----------|-------------|
| JWT_SECRET     | ✅       | Used to sign and verify JWT access tokens |
| DATABASE_URL   | ✅       | MongoDB connection string used by Prisma |

SEED_IDEAS_COUNT=250 npm run seed:ideas
```
 main
 main
