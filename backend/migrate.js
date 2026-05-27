import dotenv from "dotenv";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

dotenv.config();

// Build DATABASE_URL from individual vars if not already set
if (!process.env.DATABASE_URL) {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
  process.env.DATABASE_URL = `postgresql://${DB_USER}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const bin = join(__dirname, "node_modules", "node-pg-migrate", "bin", "node-pg-migrate.js");
const args = ["--migrations-dir", "migrations", ...process.argv.slice(2)];

try {
  execFileSync(process.execPath, [bin, ...args], { stdio: "inherit", env: process.env });
} catch {
  process.exit(1);
}
