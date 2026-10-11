# 🚀 Render Backend Deployment Guide — Tizly

This guide walks you step-by-step through deploying the **Tizly Flask Backend** to **[Render](https://render.com)** connected to **Supabase PostgreSQL & Storage** and **Firebase Auth**.

---

## 📋 Architecture Overview

- **Runtime:** Python 3.11 with Gunicorn (`wsgi:app`)
- **Framework:** Flask 3 + Flask-SQLAlchemy + Flask-CORS
- **Database:** Supabase PostgreSQL (Managed cloud database)
- **Storage:** Supabase Storage bucket (`tizly-media`)
- **Authentication:** Firebase Admin SDK (token verification & role sync)

---

## 🛠️ Step 1: Prerequisites

Before deploying, ensure you have:
1. A GitHub account with the pushed repository: `yukti-ctrl/Tizly` (branch `main`).
2. A free [Render account](https://render.com).
3. Your Supabase project details:
   - **Database Connection URI:** `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
   - **Supabase API URL:** `https://[ref].supabase.co`
   - **Supabase Anon / Service Key**
4. Your Firebase Admin Service Account JSON (`backend/firebase-service-account.json`).

---

## 🚀 Step 2: Create a Web Service on Render

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** in the top navigation bar and select **Web Service**.
3. Choose **Build and deploy from a Git repository**.
4. Select or search for your repository: **`yukti-ctrl/Tizly`**.
5. Configure the service settings:

| Setting | Value | Explanation |
| :--- | :--- | :--- |
| **Name** | `tizly-backend` | Your service name (will form `https://tizly-backend.onrender.com`) |
| **Region** | Closest to your users (e.g. `Frankfurt`, `Oregon`, `Singapore`) | Low latency |
| **Branch** | `main` | Automatic deployment branch |
| **Root Directory** | `backend` | **Crucial:** isolates the Python project from frontend |
| **Runtime** | `Python 3` | Render Python environment |
| **Build Command** | `pip install -r requirements.txt` | Installs Flask, SQLAlchemy, Psycopg, Firebase Admin |
| **Start Command** | `gunicorn wsgi:app` | Production WSGI application server |
| **Instance Type** | `Free` | Free tier |

---

## 🔑 Step 3: Configure Environment Variables

Scroll down to the **Environment Variables** section on Render and click **Add Environment Variable**. Add the following keys:

| Key | Value / Example | Purpose |
| :--- | :--- | :--- |
| `PYTHON_VERSION` | `3.11.9` | Locks Python version for stability |
| `SECRET_KEY` | *(Generate a random 32-character string)* | Flask session signature key |
| `SUPABASE_DB_URL` | `postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres` | Live Supabase PostgreSQL database URL |
| `SUPABASE_URL` | `https://[YOUR-PROJECT-REF].supabase.co` | Supabase API endpoint |
| `SUPABASE_KEY` | `eyJhbGciOi...` | Supabase Anon or Service Role Key |
| `SUPABASE_BUCKET` | `tizly-media` | Supabase Storage bucket for product & post images |
| `ADMIN_UIDS` | `m08MbSPATEYJUyvqHWAv0SHfEAC2,7EaJqaKIcGQFXUys3gyhyFV4Ffv2` | Comma-separated Firebase UIDs with permanent admin rights |
| `ADMIN_REGISTRATION_CODE` | `TIZLY_ADMIN_2026` | Secret passkey for admin registration |

---

## 🛡️ Step 4: Configure Firebase Admin Credentials

Render needs your Firebase Service Account credentials to verify user ID tokens and synchronize user roles. You can use **either** of these two methods:

### Option A: Secret File (Recommended)
1. On your Render Web Service page, go to the **Secret Files** tab on the left menu.
2. Click **Add Secret File**.
3. Set **Filename** to:
   ```text
   /etc/secrets/firebase-service-account.json
   ```
4. Open your local `backend/firebase-service-account.json` file, copy its entire contents, and paste it into the editor box.
5. Click **Save**.
*(The backend's `extensions.py` automatically checks `/etc/secrets/firebase-service-account.json` on Render!)*

---

### Option B: Raw Environment Variable
If you prefer using an environment variable instead of a file:
1. In the **Environment Variables** tab, add a new variable:
   - **Key:** `FIREBASE_CREDENTIALS_JSON`
   - **Value:** Paste the raw JSON text from `firebase-service-account.json` into this field.
2. Click **Save Changes**.

---

## 🩺 Step 5: Verify Deployment & Health Check

1. Click **Create Web Service** (or **Manual Deploy -> Deploy latest commit**).
2. Wait 2–3 minutes for the build and container launch to finish.
3. Once the status shows **Live**, open your public Render URL in your browser:

### 1. Root Welcome Route:
```
https://<your-service-name>.onrender.com/
```
**Expected Response:**
```json
{
  "api": "Tizly Backend API",
  "status": "online",
  "version": "2.0.0"
}
```

### 2. Live Health & Database Check:
```
https://<your-service-name>.onrender.com/health
```
**Expected Response:**
```json
{
  "database": "PostgreSQL (Supabase)",
  "status": "healthy",
  "supabase_storage": true
}
```

---

## 💡 Pro-Tips for Render Free Tier

1. **Spin-down Behavior:** Render Free tier web services spin down after 15 minutes of inactivity. The first request after sleep may take ~30–45 seconds to wake up (cold start).
2. **Uptime Ping:** You can keep the service awake during demo hours by setting up a free monitor on [UptimeRobot](https://uptimerobot.com) pinging `https://<your-service-name>.onrender.com/health` every 10 minutes.
3. **Database Migrations:** The database tables and seed data are already created in your Supabase project. If you ever need to re-seed, run `python seed.py` with your Supabase credentials locally.
