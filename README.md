# ComfyHome — COS30043 Interface Design Development

A furniture e-commerce web app built with Vue 3 (frontend) and Express + PostgreSQL (backend).

> **Note:** The payment system in this project does not involve a real payment gateway. Stripe is integrated only for real-life payment simulation, so no charges are actually made. 

## Prerequisites

- [Node.js](https://nodejs.org/) v20.19.0 or higher
- [PostgreSQL](https://www.postgresql.org/) running locally

---

## Local Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
```

Run migrations, then seed:

```bash
npm run migrate
npm run seed
```

Start the dev server:

```bash
npm run dev
```

Backend runs at `http://localhost:3000`.

### 2. Frontend

In a separate terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## Deployment (Render + NeonDB)

### Database — NeonDB

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string from **Connection Details**:
   `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`
3. Run migrations and seed against NeonDB from your local terminal:

```powershell
# Comment out all `DB_*` and paste connection string to .env's DATABASE_URL
DATABASE_URL=postgresql://...
cd backend
npm run migrate
npm run seed
```
---

### Backend — Render Web Service

| Setting | Value |
|---|---|
| Root directory | `backend` |
| Build command | `npm install` |
| Start command | `npm run start` |
| Health check path | `/` |

**Environment variables (set in Render dashboard):**

| Key | Value |
|---|---|
| `DATABASE_URL` | NeonDB connection string |
| `JWT_SECRET` | Your generated secret |
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `FRONTEND_URL` | `https://your-frontend.onrender.com` |

---

### Frontend — Render Static Site

| Setting | Value |
|---|---|
| Root directory | `frontend` |
| Build command | `npm install && npm run build` |
| Publish directory | `dist` |

**Build-time environment variables (set in Render dashboard):**

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |

---

## Seeded Test Account

After running `npm run seed`, every seeded user's password is `password`.
