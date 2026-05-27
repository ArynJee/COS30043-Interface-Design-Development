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
```

Initialise the database tables (run once):

```bash
node src/db/initDb.js
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

## Seeded test account

After running the seed, any seeded user's password is `password`.
