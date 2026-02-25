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

✅ That’s it  
✅ Do not change anything else  
✅ Do not move existing text

---

## 🧠 What changed? (Simple explanation)

Before:
- README said `/health` exists
- But didn’t say **status code**

After:
- README clearly says:
  - Method: `GET`
  - Status code: `200 OK`
  - Example response

This solves the issue 💯

---

## 🟢 Step 5: Save the file

Just **save `README.md`**

---

## 🟢 Step 6: Commit the change

In Git Bash:

```bash
git add README.md
git commit -m "docs: add HTTP status code for health endpoint"

Contribution Areas

API design

State transitions

Validation logic

Documentation

Testing

Start small and build thoughtfully 🚀


---

