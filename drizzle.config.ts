import "dotenv/config";
import assert from "node:assert";
import { defineConfig } from "drizzle-kit";

assert(
  process.env.DATABASE_URL,
  "you need a DATABASE_URL env var set to run the migrations",
);

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
