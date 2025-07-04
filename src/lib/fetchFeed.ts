import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

export type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};


export async function fetchFeed(feedUrl: string) {
    const res = await (await fetch(feedUrl, {
        headers: {
            'User-Agent': 'rssgator',
            accept: 'aplication/rss+xml',
        }
    })).text()
    const parser = new XMLParser()

    try {
        const output = {} as RSSFeed;
        const channel = parser.parse(res).rss?.channel
        if (!channel) throw new Error('[FEED]: no channel field in target url');
        output.channel['title'] = channel.title
        output.channel['link'] = channel.link
        output.channel['description'] = channel.description
        output.channel['item'] = []
        if (Array.isArray(channel.item)) {
            output.channel['item'] = channel.item.filter((i: any) => validateItem(i)).map((i: any) => formatItem(i))
        }

        return output
    } catch (error) {
        throw new Error('[PARSING]: error during XML parsing')
    }
}

function validateItem(item: any) {
    return typeof item === 'object' && item.title && item.link && item.description && item.pubDate
}

function formatItem(item: any) {
    return {
        title: item.title,
        link: item.link, 
        description: item.description,
        pubDate: item.pubDate
    } as RSSItem
}
