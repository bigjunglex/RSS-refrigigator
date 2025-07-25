import { defineConfig } from "drizzle-kit";
process.loadEnvFile()

const dbUrl = String(process.env.DATABASE_URL)

export default defineConfig({
    schema: "src/lib/db/schema.ts",
    out: "./drizzle",
    dialect: 'sqlite',
    dbCredentials: {
        url: dbUrl,
    },
});