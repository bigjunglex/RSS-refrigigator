import request from 'supertest';
import { describe, it, vitest, beforeAll, afterAll, expect } from 'vitest';
import { clearTestDB, setupEnv, setupTestDB } from '../utils';
import { existsSync } from 'fs';

if (existsSync('.env')) process.loadEnvFile();

describe('User Pipe line: ', async () => {
    let testDBref:string;
    
    vitest.resetModules();
    const testEnv = setupEnv('./.env.test') 
    testEnv.DATABASE_URL = setupTestDB(testEnv.DATABASE_URL)
    testDBref = testEnv.DATABASE_URL

    for (const key of Object.keys(testEnv)) {
        process.env[key] = testEnv[key];

    }

    const { handleRegister } = await import('src/RSScli/commands/cmd-handlers');
    const { readConfig } = await import('src/config');
    const createApp = (await import('src/server')).default;
    
    const [name, password] = ['bigtestv6', 'testTest']

    const app = createApp()
    let cookies: string | string[];

    it('#1 Creates valid user through CLI', async () => {
        await handleRegister('', name, password);
        //should not throw
    })
    
    it('#2 Logs in through api', async () => {
        const res = await request(app).post('/api/login').send({ name, password })
        const code = res.statusCode
        cookies = res.headers['set-cookie']

        console.log(cookies)

        expect(res.body['name']).toBe(name)
        expect(code).toBe(200)
        expect(cookies.length).toBe(2)
    })
    

    it('#3 goes through check with new tokens', async () => {
        const res = await request(app).get('/api/check').set('Cookie', cookies as string[])
        const code = res.statusCode
        expect(code).toBe(200)
    })

    it('#4 logouts with new tokens', async () => {
        const res = await request(app).post('/api/logout').set('Cookie', cookies as string[]);
        const code = res.statusCode;
        const current = new Date().toISOString().substring(0, 4)
        console.log(res.text)
        expect(code).toBe(200)
        expect(res.text.substring(0, 4)).toBe(current)
    })


    it('#5 fails to pass check with revoked tokens', async () => {
        const res = await request(app).get('/api/check').set('Cookie', cookies[1])
        const code = res.statusCode
        expect(code).toBe(500)
    })

    afterAll(() => {
        clearTestDB(testDBref)
    })

})