
type FeedProps = {
    feed: Feed;
    handler: (feed:Feed) => void;
}

export function Feed({ feed, handler }: FeedProps ) {
    const isFollowed = feed.isFollowed
    const date = new Date(feed.createdAt).toDateString()
    const upDate = new Date(String(feed.last_fetched_at)).toDateString()

    return (
        <li className="feed">
            <h4>📌 {feed.name}</h4>
            <h5>📅 Added: {date}</h5>
            <h5> {`Last updated: ${upDate}`}</h5>
            <a href={feed.url}>🌐 {feed.url} </a>
            <button onClick={() => handler(feed)}>{isFollowed ? 'Unfollow' : 'Follow'}</button>
        </li>
    )
}