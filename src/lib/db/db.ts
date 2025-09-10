import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js'
process.loadEnvFile()

const connection = process.env.DATABASE_URL as string
export const db = drizzle(connection, { schema })

