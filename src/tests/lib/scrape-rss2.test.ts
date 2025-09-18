import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchFeed } from "src/lib/fetchFeed";
import type { RSSItem } from "src/lib/fetchFeed";
import { fetchMock } from "../utils";

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[] | RSSItem;
    };
};


afterEach(() => vi.resetAllMocks())

describe('[UNIT]: parsing of RSS 2.0', () => {
    it('valid xml, single item', async  () => {
        const rss = `
            <rss version="2.0">
            <channel>
                <item>
                  <title>BIG TEST</title>
                  <link>http://test.com/index.html</link>
                  <description>real test only</description>
                  <pubDate>Sun, 19 May 2077 15:21:36 GMT</pubDate>
                </item>
            </channel>
            </rss>
        `
        fetchMock(rss)
        const out:RSSFeed = await fetchFeed('trueurl/api'); 
        //@ts-ignore
        expect(out.channel.item.title).toBe('BIG TEST')
    });

    it('valid xml, multiple items', async () => {
        const rss = `
            <rss version="2.0">
            <channel>
                <item>
                  <title>BIG TEST</title>
                  <link>http://test.com/index.html</link>
                  <description>real test only</description>
                  <pubDate>Sun, 19 May 2077 15:21:36 GMT</pubDate>
                </item>
                <item>
                  <title>BIG TEST NUMBAH 2</title>
                  <link>http://test.com/index.html</link>
                  <description>real test only</description>
                  <pubDate>Sun, 19 May 2077 15:21:36 GMT</pubDate>
                </item>
            </channel>
            </rss>
        `
        fetchMock(rss)
        const out:RSSFeed = await fetchFeed('trueurl/api');
        //@ts-ignore
        expect(out.channel.item[1].title).toBe('BIG TEST NUMBAH 2')
    })

    it('invalid xml, no channel tag', async () => {
        const rss = `
            <rss version="2.0">
                <item>
                  <title>BIG TEST</title>
                  <link>http://test.com/index.html</link>
                  <description>real test only</description>
                  <pubDate>Sun, 19 May 2077 15:21:36 GMT</pubDate>
                </item>
            </rss>
        `
        fetchMock(rss)
        await expect(fetchFeed('boulderthrower')).rejects.toThrow();
    })

    it('invalid xml, no root rss', async () => {
        const rss = `
            <channel>
                <item>
                  <title>BIG TEST</title>
                  <link>http://test.com/index.html</link>
                  <description>real test only</description>
                  <pubDate>Sun, 19 May 2077 15:21:36 GMT</pubDate>
                </item>
            </channel>
        `
        fetchMock(rss)
        await expect(fetchFeed('boulderthrower')).rejects.toThrow();
    })

    it('valid xml, parsing items without title', async () => {
        const rss = `
            <rss version="2.0">
            <channel>
                <item>
                  <link>http://test.com/index.html</link>
                  <description>real test only</description>
                  <pubDate>Sun, 19 May 2077 15:21:36 GMT</pubDate>
                </item>
            </channel>
            </rss>
        `
        fetchMock(rss)
        const out = await fetchFeed('notitlezbig')
        //@ts-ignore
        expect(out.channel.item.description).toBe('real test only')
    })
})