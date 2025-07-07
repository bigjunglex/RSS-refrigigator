/**
 * script to connect to postgress through cli for debugging
 */

import { readConfig } from './src/config'
import { spawn } from 'node:child_process'

const cmd = `psql ${readConfig().dbUrl}`;

// console.log(cmd)
const db = spawn(cmd, {shell: true, stdio: [0, 0, 0]})

process.on('SIGINT', () => { db.kill() })
process.on('SIGTERM', () => { db.kill() })
process.on('SIGTSTP', () => { db.kill() })