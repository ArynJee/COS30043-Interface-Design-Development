# ComfyHome — COS30043 Interface Design Development

A furniture e-commerce web app built with Vue 3 (frontend) and Express + PostgreSQL (backend).

## Prerequisites

- [Node.js](https://nodejs.org/) v20.19.0 or higher
- [PostgreSQL](https://www.postgresql.org/) running locally

---

## Local Setup

### 1. Backend

```bash
cd backend
cp .env.example .env   # Windows: copy .env.example .env
npm install
```

Edit `backend/.env` with your local Postgres credentials:

```env
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=comfyhome

JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">

PORT=3000
FRONTEND_URL=http://localhost:5173

STRIPE_SECRET_KEY=sk_test_...
```

Run migrations, then seed:

```bash
npm run migrate   # creates all tables
npm run seed      # resets and populates with sample data
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
cp .env.example .env   # Windows: copy .env.example .env
npm install
npm run dev
```

`frontend/.env` should contain:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Frontend runs at `http://localhost:5173`.

---

## Database Migrations

Migrations live in `backend/migrations/` and are managed with [node-pg-migrate](https://github.com/salsita/node-pg-migrate).

| Command | What it does |
|---|---|
| `npm run migrate` | Apply all pending migrations |
| `npm run migrate:down` | Roll back the last migration |
| `npm run migrate:create -- describe_change` | Scaffold a new migration file |

---

## Deployment (Render + NeonDB)

### Database — NeonDB

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string from **Connection Details**:
   `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`
3. Run migrations and seed against NeonDB from your local terminal:

```powershell
# PowerShell
$env:DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
cd backend
npm run migrate
npm run seed
```

```bash
# Bash / Git Bash
DATABASE_URL="postgresql://..." npm run migrate
DATABASE_URL="postgresql://..." npm run seed
```

> `DATABASE_URL` takes priority over individual `DB_*` vars. Your local `.env` is unaffected since this only sets the variable for the current terminal session.

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

> Do **not** set `PORT` — Render injects it automatically.

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

> `VITE_*` variables are baked into the bundle at build time by Vite — static site deployment works fine as long as these are set before the build runs.

---

## NPM Scripts

### Backend (`cd backend`)

| Script | Description |
|---|---|
| `npm run dev` | Start with hot-reload (local only) |
| `npm run start` | Run migrations then start server (used by Render) |
| `npm run migrate` | Apply all pending migrations |
| `npm run migrate:down` | Roll back the last migration |
| `npm run seed` | Reset and re-seed the database |

### Frontend (`cd frontend`)

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production (`dist/`) |
| `npm run lint` | Lint with ESLint |

---

## Seeded Test Account

After running `npm run seed`, every seeded user's password is `password`.
