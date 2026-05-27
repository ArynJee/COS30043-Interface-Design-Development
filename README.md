# ComfyHome — COS30043 Interface Design Development

A furniture e-commerce web app built with Vue 3 (frontend) and Express + PostgreSQL (backend).

## Prerequisites

- [Node.js](https://nodejs.org/) v20.19.0 or higher
- [PostgreSQL](https://www.postgresql.org/) running locally

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder with your database connection:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=comfyhome
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_jwt_secret

# Optional but required when deploying (NeonDB / Render give you this)
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

> When `DATABASE_URL` is set it takes priority over the individual `DB_*` vars.

Run migrations to create all tables:

```bash
npm run migrate
```

Seed the database with sample data:

```bash
node src/db/seed.js
```

Start the backend dev server:

```bash
npm run dev
```

The backend runs at `http://localhost:3000` by default.

### 2. Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` by default. Open that URL in your browser to use the app.

## Database migrations

Migrations live in `backend/migrations/` and are managed with [node-pg-migrate](https://github.com/salsita/node-pg-migrate).

| Command | What it does |
|---|---|
| `npm run migrate` | Apply all pending migrations |
| `npm run migrate:down` | Roll back the last migration |
| `npm run migrate:create -- describe_change` | Scaffold a new migration file |

**Adding a schema change:** instead of writing a raw `ALTER TABLE` in the code, run `npm run migrate:create -- describe_change`, edit the generated file in `migrations/`, then run `npm run migrate`.

## Deployment (Render + NeonDB)

- Use **NeonDB** for the PostgreSQL database
- NeonDB gives you a single `DATABASE_URL` connection string — paste it into Render's environment variable settings.
- Set `JWT_SECRET` and any other env vars in Render's dashboard.
- Set the **Start Command** in Render to `npm start` — this runs migrations then starts the server on every deploy

## Seeded test account

After running the seed, any seeded user's password is `password`.
