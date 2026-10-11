# 🌐 Netlify Frontend Deployment Guide — Tizly

This guide walks you step-by-step through deploying the **Tizly React + Vite Frontend** to **[Netlify](https://netlify.com)** and linking it with your deployed **Render Backend** and **Firebase Auth**.

---

## 📋 Architecture Overview

- **Framework:** React 19 + Vite 6
- **Routing:** React Router v7 with Netlify Single Page Application (SPA) redirects (`/* -> /index.html 200`)
- **Authentication:** Firebase Web Client SDK
- **Backend API:** Axios client dynamically configured via `VITE_BACKEND_URL`
- **File Uploads:** Direct-to-Supabase Storage via backend CDN bridge

---

## 🛠️ Step 1: Prerequisites

Before deploying, make sure you have:
1. Pushed code in GitHub repository: `yukti-ctrl/Tizly` (branch `main`).
2. A free [Netlify account](https://www.netlify.com).
3. Your live **Render Backend URL** (e.g. `https://tizly-backend.onrender.com`).
4. Your Firebase Web App configuration keys (found in [Firebase Console](https://console.firebase.google.com) -> Project Settings -> General -> Your apps -> Web app config).

---

## 🚀 Step 2: Connect Repository to Netlify

1. Log into the [Netlify Dashboard](https://app.netlify.com).
2. Click **Add new site** and select **Import an existing project**.
3. Choose **GitHub** and authorize Netlify to access your repositories.
4. Select the repository: **`yukti-ctrl/Tizly`**.

---

## ⚙️ Step 3: Configure Build & Directory Settings

Netlify automatically reads the pre-configured [netlify.toml](file:///c:/Users/gaura/Downloads/Tizly/netlify.toml) file in your repository. Confirm that the settings match:

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Base directory** | `frontend` | Specifies the frontend project subdirectory |
| **Build command** | `npm run build` | Compiles Vite production bundle into `dist` |
| **Publish directory** | `frontend/dist` | Directory containing production HTML/JS/CSS |

*(Note: SPA routing redirects are already configured in `netlify.toml` and `frontend/public/_redirects` to ensure page refreshes on `/shop`, `/vetcare`, `/community`, `/cart`, and `/profile` work without 404s!)*

---

## 🔑 Step 4: Configure Environment Variables

Click on **Environment variables** (or **Add environment variables**) on the deployment setup screen. Enter each of the following keys:

| Key | Value / Example | Source |
| :--- | :--- | :--- |
| `VITE_BACKEND_URL` | `https://<your-service-name>.onrender.com` | **Your live Render Backend URL** (without trailing slash) |
| `VITE_FIREBASE_API_KEY` | `AIzaSyBUERhNW1A3G5MjIjC0zNqvga0u0vfAOwc` | Firebase Project Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `tizly-9da17.firebaseapp.com` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | `tizly-9da17` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET`| `tizly-9da17.firebasestorage.app` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `982726502489` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | `1:982726502489:web:1762e24bbb1ed2bd6c6948` | Firebase Web App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-QB989MLZ50` | Firebase Google Analytics ID |

---

## 🚀 Step 5: Deploy the Site

1. Click **Deploy tizly** (or **Deploy site**).
2. Netlify will install npm packages, execute `npm run build`, and publish the assets.
3. Once completed (usually 45–90 seconds), Netlify assigns you a live URL like:
   ```
   https://tizly.netlify.app
   ```
   *(You can change the subdomain under **Site configuration** -> **Change site name**).*

---

## 🔒 Step 6: Authorize Netlify Domain in Firebase (CRITICAL)

For Google Sign-In and Firebase Authentication to work on your new Netlify domain:

1. Open the [Firebase Console](https://console.firebase.google.com).
2. Select your project: **`tizly-9da17`**.
3. In the left navigation, click **Authentication** -> **Settings** tab.
4. Click on **Authorized domains**.
5. Click **Add domain** and enter your Netlify hostname (e.g., `tizly.netlify.app` or `your-site-name.netlify.app`).
6. Click **Save**.

---

## 🧪 Step 7: Verification & Testing Checklist

Open your live Netlify URL and test the following features:

1. **Public Browsing:**
   - [x] Browse `/shop` and filter by category ("Vet Care", "Food", "Toys").
   - [x] View `/vetcare` doctors and clinic slots.
   - [x] View `/community` posts without logging in.
   - [x] Add items to the guest cart (`/cart`).
2. **Authentication:**
   - [x] Sign in using Google or Email/Password.
   - [x] Verify your avatar/initials appear in the top navbar and `/profile`.
3. **Role-Based Permissions:**
   - [x] **Admin:** Access Admin Analytics and change user roles in `/profile`.
   - [x] **Vet Doctor:** Add vet products, edit clinic bio, and view appointment bookings.
   - [x] **Seller:** List products with images from `/shop`.
   - [x] **Pet Parent (User):** Share community moments with images and book appointments.
4. **Image Upload:**
   - [x] Create a new product or community post with an image and confirm it uploads to Supabase Storage.
