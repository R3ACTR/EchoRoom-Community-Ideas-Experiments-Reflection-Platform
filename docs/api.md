# EchoRoom API Documentation

This document reflects the API currently implemented in `backend/src/index.ts`.

## Base URL

- Local: `http://localhost:5000`

## Response Conventions

Most endpoints return:

```json
{
  "success": true,
  "data": {}
}
```

Some routes return resource-specific keys (`idea`, `ideas`, `comments`, `comment`) instead of `data`.

## Health

### `GET /health`

Response:

```json
{
  "success": true,
  "message": "Backend is running"
}
```

## Authentication

Auth is implemented with JWT access token + persisted refresh token.

### `POST /auth/register`

Body:

```json
{
  "email": "user@example.com",
  "username": "alice",
  "password": "password123"
}
```

Rules:

- all fields required
- password min length: 8

Response `201`:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "username": "alice",
      "role": "MEMBER"
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

### `POST /auth/login`

Body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response `200`: same `data.user` + `data.tokens` shape as register.

### `POST /auth/refresh`

Body:

```json
{
  "refreshToken": "..."
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### `POST /auth/logout`

Body:

```json
{
  "refreshToken": "..."
}
```

Response:

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Ideas

Base path: `/ideas`

### `GET /ideas`

Returns published ideas (excludes `draft`).

Response:

```json
{
  "success": true,
  "ideas": []
}
```

### `GET /ideas/all`

Returns all ideas (including drafts).

### `GET /ideas/drafts`

Returns only draft ideas.

### `GET /ideas/:id`

Returns one idea by numeric ID.

### `POST /ideas`

Creates a proposed idea.

Body:

```json
{
  "title": "Idea title",
  "description": "Idea description",
  "complexity": "MEDIUM"
}
```

`complexity` is optional (`LOW | MEDIUM | HIGH`).

### `POST /ideas/drafts`

Creates a draft idea.

### `PUT /ideas/:id`

Updates draft fields with optimistic locking.

Body:

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "version": 1
}
```

### `PATCH /ideas/:id/publish`

Publishes a draft by transitioning it to `proposed`.

Body:

```json
{
  "version": 1
}
```

### `PATCH /ideas/:id/status`

Transitions idea status with optimistic locking.

Body:

```json
{
  "status": "experiment",
  "version": 2
}
```

Allowed status chain:

- `draft -> proposed -> experiment -> outcome -> reflection`

### `DELETE /ideas/:id`

Deletes an idea.

## Comments

Nested under ideas:

- `GET /ideas/:ideaId/comments`
- `POST /ideas/:ideaId/comments`

### `GET /ideas/:ideaId/comments`

Response:

```json
{
  "success": true,
  "comments": []
}
```

### `POST /ideas/:ideaId/comments`

Body:

```json
{
  "content": "Great idea"
}
```

Auth behavior:

- `optionalAuth` middleware is used
- with bearer token, user identity is taken from token
- without token, fallback identity is used:
  - `userId: "anonymous"`
  - `username: "Community Member"`

Response `201`:

```json
{
  "success": true,
  "comment": {}
}
```

## Experiments

Base path: `/experiments`

### `GET /experiments`

Returns all experiments with computed `progress`:

- `planned` => `0`
- `in-progress` => `50`
- `completed` => `100`

### `GET /experiments/:id`

Returns one experiment with computed `progress`.

### `POST /experiments`

Body (required fields):

```json
{
  "title": "...",
  "description": "...",
  "hypothesis": "...",
  "successMetric": "...",
  "falsifiability": "...",
  "status": "planned",
  "endDate": "2026-03-10",
  "linkedIdeaId": 1
}
```

`status` must be one of: `planned | in-progress | completed`.

### `PUT /experiments/:id`

Partial update. If current experiment status is already `completed`, status changes are blocked.

### `DELETE /experiments/:id`

Deletes experiment unless an outcome exists for that experiment.

## Outcomes

Base path: `/outcomes`

### `POST /outcomes`

Body:

```json
{
  "experimentId": 1,
  "result": "Success",
  "notes": "Observed lower drop-off"
}
```

### `GET /outcomes`

Returns all outcomes with an added `experimentTitle` field.

### `GET /outcomes/:experimentId`

Returns outcomes for a given experiment ID.

### `PUT /outcomes/:id`

Updates only the `result` field.

Body:

```json
{
  "result": "Failed"
}
```

## Reflections

Base path: `/reflections`

### `POST /reflections`

Creates a structured reflection.

Body shape:

```json
{
  "outcomeId": 1,
  "context": {
    "emotionBefore": 3,
    "confidenceBefore": 6
  },
  "breakdown": {
    "whatHappened": "...",
    "whatWorked": "...",
    "whatDidntWork": "..."
  },
  "growth": {
    "lessonLearned": "...",
    "nextAction": "..."
  },
  "result": {
    "emotionAfter": 4,
    "confidenceAfter": 8
  },
  "tags": ["ux", "onboarding"],
  "evidenceLink": "https://example.com/proof",
  "visibility": "public"
}
```

Validation:

- required: `outcomeId`, `context`, `breakdown`, `growth`, `result`, `visibility`
- `emotionBefore` and `emotionAfter`: 1-5
- `confidenceBefore` and `confidenceAfter`: 1-10
- key text fields must be non-empty

### `GET /reflections`

Returns all reflections.

### `GET /reflections/id/:id`

Returns one reflection by reflection ID.

### `GET /reflections/:outcomeId`

Returns reflections for an outcome ID.

## Persistence Notes

Current persistence is mixed:

- Persistent: auth users and refresh tokens (MongoDB via Prisma)
- Non-persistent: ideas, experiments, outcomes, reflections, comments (in-memory only)

A backend restart clears all non-persistent domain data.
