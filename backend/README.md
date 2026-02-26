# EchoRoom Backend

This is the backend service for EchoRoom.

Currently, this backend is a **minimal scaffold** intended for OSQ contributors.

---

## What Exists Right Now

- Express server
- Health check endpoint
- Folder structure for future expansion

---

## What Does NOT Exist Yet

- Authentication
- Database connection
- Business logic
- Permissions

These will be built collaboratively during OSQ.

---

## Running the Backend

```bash
npm install
npm run dev
http://localhost:5000/health


⚠️ **Do NOT edit or remove this**

---

## 🟢 Step 4: ADD this BELOW it (very important)

👉 Go to the **next empty line after the code block**  
👉 Paste the following **exactly as it is**

```md
### Health Check Endpoint

**GET /health**

**Response (200 OK):**
```json
{
  "status": "ok"
}



---

## Common Errors & Fixes

This section lists common setup and runtime issues contributors may encounter when working on the backend, along with quick fixes.

### Prisma client not generated

**Symptom**
- Server fails to start
- Errors related to missing Prisma client

**Fix**
```bash
npm run prisma:generate

