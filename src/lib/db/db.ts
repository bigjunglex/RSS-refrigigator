import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js'
import { existsSync } from 'node:fs';

//ci tests fix
if (existsSync('.env')) {
  process.loadEnvFile()
}

const connection = process.env.DATABASE_URL as string
export const db = drizzle(connection, { schema })

