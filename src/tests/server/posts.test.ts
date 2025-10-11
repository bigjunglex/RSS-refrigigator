import { describe, it, vitest, afterAll, expect } from 'vitest';
import { clearTestDB, setupEnv, setupTestDB } from '../utils';
import { existsSync } from 'fs';
import request from 'supertest';

//Posts pipeline

if (existsSync('.env')) process.loadEnvFile();

describe('Posts logic + pipeline: ', async () => {
    let testDBref:string;
    
    vitest.resetModules();
    const testEnv = setupEnv('./.env.test') 
    testEnv.DATABASE_URL = setupTestDB(testEnv.DATABASE_URL)
    testDBref = testEnv.DATABASE_URL

    for (const key of Object.keys(testEnv)) {
        process.env[key] = testEnv[key];

    }

    const { handleRegister } = await import('src/RSScli/commands/cmd-handlers');
    const { createPost } = await import('src/lib/db/queries/posts');
    const { createFeed } = await import('src/lib/db/queries/feeds')

    const createApp = (await import('src/server')).default;
    let cookies: string | string[];
    const [name, password] = ['bigtestv12', 'testTest']
    const app = createApp()
    
    const user = await handleRegister('', name, password);
    const feed = await createFeed('test', 'testo', user)
    const targetPost = { title: 'not a test', url: 'for sure', feed_id: feed.id } 
    const post = await createPost(targetPost);

    it('#0 user setup works', async () => {
        const res = await request(app).post('/api/login').send({ name, password });
        const code = res.statusCode;
        cookies = res.headers['set-cookie'];

        expect(code).toBe(200);
        expect(cookies.length).toBe(2);
    })

    it('#1 get from @api/posts 1 post', async () => {
        const res = await request(app).get('/api/posts')
        const code = res.statusCode;
        const posts = res.body;
        const target = { title: posts[0].title, url: posts[0].url, feed_id: posts[0].feed_id }

        expect(posts.length).toBe(1);
        expect(code).toBe(200);
        expect(JSON.stringify(target)).toBe(JSON.stringify(targetPost))
    })

    it('#2 user adds post to favorites', async () => {
        const res = await request(app).post(`/api/feeds/${post.id}/favorite`).set('Cookie', cookies as string[]);
        const code = res.statusCode;
        expect(code).toBe(200);
    })

    it('#3 user gets post in faorites', async () => {
        const res = await request(app).get('/api/feeds/posts/favorites').set('Cookie', cookies as string[]);
        const code = res.statusCode;
        const posts = res.body;
        const target = { title: posts[0].title, url: posts[0].url, feed_id: posts[0].feed_id };

        expect(posts.length).toBe(1);
        expect(code).toBe(200);
        expect(JSON.stringify(target)).toBe(JSON.stringify(targetPost))
    })

    it('#4 user unfavorites target post', async () => {
        const res = await request(app).delete(`/api/feeds/${post.id}/favorite`).set('Cookie', cookies as string[]);
        const code = res.statusCode;
        expect(code).toBe(200);
    } )

    it('#5 user get 500 on favorites posts', async () => {
        const res = await request(app).get('/api/feeds/posts/favorites').set('Cookie', cookies as string[]);
        const code = res.statusCode;
        
        expect(code).toBe(500);
    })

    afterAll(() => {
        clearTestDB(testDBref)
    })

})