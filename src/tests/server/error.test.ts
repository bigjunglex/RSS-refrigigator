import request from 'supertest';
import { describe, it, vitest, beforeAll, afterAll } from 'vitest';
import { setupEnv } from '../utils';
import createApp from 'src/server';
import { existsSync } from 'fs';

if (existsSync('.env')) process.loadEnvFile();

const OGenv = process.env;
const app = createApp();


beforeAll(() => {
    vitest.resetModules()
    const testEnv = setupEnv('./.env.test') 
    process.env = {...OGenv, ...testEnv}
})

afterAll(() => {
    process.env = OGenv
})

describe('base errors', () => {

    it('gets 500 on /api/check', () => {
        return request(app)
            .get('/api/check')
            .expect(500)
    });

    it('get 500 on unauthorized favorites', () => {
        return request(app)
            .get('/api/feeds/posts/favorites')
            .expect(500)
    })
    
})