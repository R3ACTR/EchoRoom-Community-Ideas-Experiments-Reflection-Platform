# EchoRoom Backend

Backend service for EchoRoom, built with Express + TypeScript.

## Current Status

The backend is no longer a minimal scaffold. It currently includes:

- Auth system with JWT access tokens and refresh tokens
- Prisma + MongoDB integration for auth persistence (`User`, `RefreshToken`)
- Domain APIs for ideas, comments, experiments, outcomes, and reflections
- State transition and optimistic-locking rules for ideas

## Important Data Behavior

Storage is currently hybrid:

- Persistent in MongoDB (via Prisma): auth users and refresh tokens
- In-memory only: ideas, comments, experiments, outcomes, reflections

On restart, in-memory data is reset.

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
```

Server default: `http://localhost:5000`

Health check:

```bash
curl http://localhost:5000/health
```

## Scripts

- `npm run dev` - Run backend with ts-node
- `npm run build` - Compile TypeScript to `dist/`
- `npm run start` - Run compiled server
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

## Known Gaps

- Domain resources are not yet persisted via Prisma
- Auth/permissions middleware is not consistently enforced across domain routes
- Insights route files exist but are not mounted in the active server
