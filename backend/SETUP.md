# EchoRoom Backend Setup

This guide sets up the current backend in `backend/`.

## Prerequisites

- Node.js 18+
- npm
- MongoDB (local or cloud)

## 1. Install Dependencies

```bash
cd backend
npm install
```

## 2. Configure Environment

Create `backend/.env` with:

```env
PORT=5000
JWT_SECRET=replace-with-a-long-random-secret
```

Prisma datasource URL is currently hardcoded in `prisma/schema.prisma`:

```prisma
url = "mongodb://localhost:27017/echoroom?authSource=admin"
```

If you need a different database, update `schema.prisma` before generating/pushing.

## 3. Prepare Prisma Client

```bash
npm run prisma:generate
```

## 4. Push Prisma Schema

```bash
npm run prisma:push
```

This creates collections for Prisma models, including:

- `User`
- `RefreshToken`
- other defined models in schema

## 5. Start the Backend

```bash
npm run dev
```

Default URL:

- `http://localhost:5000`
- health check: `GET /health`

## Verify Auth Flow Quickly

Register:

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user1","password":"password123"}'
```

Login:

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Use refresh token:

```bash
curl -X POST http://localhost:5000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<token>"}'
```

## Current Persistence Reality

- Persistent: auth (`User`, `RefreshToken`) via Prisma + MongoDB
- In-memory only: ideas, comments, experiments, outcomes, reflections

Backend restart clears in-memory domain data.

## Common Issues

1. Prisma client errors
- Run `npm run prisma:generate` again after schema changes.

2. Database connection issues
- Ensure MongoDB is running and reachable at the URL in `schema.prisma`.

3. Auth token failures
- Ensure `JWT_SECRET` is set and stable while testing refresh/login flows.

## Useful Commands

- `npm run build`
- `npm run start`
- `npm run prisma:studio`
- `npm run test:experiments-contract`
