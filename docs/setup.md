# Setup Guide

## Frontend

```bash
cd frontend
npm install
npm run dev

```
Runs at:
http://localhost:3000

## Backend
 ```bash
 cd backend
npm install
npm run dev
```
Runs at:
http://localhost:5000

# NOTES

- No authentication is required

- No database is required

- Features are intentionally minimal
---

## Backend Setup (Local Development)

This section explains how to run the backend locally for development.

### Prerequisites
- Node.js (v18 or later recommended)
- npm
- MongoDB Atlas account

### Install Dependencies
```bash
cd backend
npm install

---

## Backend npm Scripts

The backend includes several npm scripts that are commonly used during local development and database management.

### `npm run dev`
Starts the backend development server using the configured environment variables.

Use this command when running the backend locally for development.

### `npm run prisma:push`
Syncs the Prisma schema with the connected database.

Use this command after updating the Prisma schema or when setting up the database for the first time.

### `npm run prisma:studio`
Opens Prisma Studio, a visual interface for browsing and inspecting the database.

Use this command to view or debug database records during development.
---

## Common Backend Errors & Fixes

### Prisma: `DATABASE_URL` not found

**Cause**
- The `.env` file is missing or placed in the wrong directory.

**Fix**
- Ensure `.env` exists inside the `backend/` folder
- Verify it contains a valid `DATABASE_URL`
- Restart the dev server after updating `.env`

---

### MongoDB authentication failed

**Cause**
- Incorrect MongoDB username or password
- IP address not allowed in MongoDB Atlas Network Access

**Fix**
- Double-check the database username and password in MongoDB Atlas
- Ensure your IP address is whitelisted in **Network Access**
- Confirm the credentials match those used in `DATABASE_URL`

---

### `ts-node` / `Unexpected token export` errors

**Cause**
- Incorrect Node.js version or mismatched module settings

**Fix**
- Use Node.js LTS (recommended)
- Run the backend from the `backend/` directory
- Restart the server after dependency changes