# 🔐 Google Auth Setup (Environment Configuration Only)

This project uses Google OAuth for authentication.

To enable Google login, you must configure the following environment variables:

```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

---

## 1️⃣ Create Google OAuth Credentials

1. Go to: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Create a new project (or use an existing one).
3. Navigate to:

   ```
   APIs & Services → Credentials
   ```
4. Click:

   ```
   Create Credentials → OAuth Client ID
   ```
5. Select:

   ```
   Web Application
   ```

---

## 2️⃣ Configure Redirect URI

Since the backend runs on **port 5000**, add this:

### Authorized Redirect URI:

```
http://localhost:5000/auth/google/callback
```

⚠️ The redirect URI must exactly match the backend callback route.

If it doesn’t match, Google will throw a **redirect_uri_mismatch** error.

---

## 3️⃣ Copy Credentials

After creation, Google will provide:

* Client ID
* Client Secret

---

## 4️⃣ Add to Project `.env` File

Create or update your `.env` file:

```
GOOGLE_CLIENT_ID=your_actual_client_id
GOOGLE_CLIENT_SECRET=your_actual_client_secret
```

Then restart the server.

---

## ⚠️ Important Notes

* Do NOT commit real credentials to GitHub.
* Ensure `.env` is listed in `.gitignore`.
* Restart the backend after updating environment variables.

---
