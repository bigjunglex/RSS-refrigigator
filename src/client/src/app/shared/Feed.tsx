
type FeedProps = {
    feed: Feed;
    handler: (feed:Feed) => void;
}

export function Feed({ feed, handler }: FeedProps ) {
    const isFollowed = feed.isFollowed
    return (
        <li className="feed">
            <h4>📌 {feed.name}</h4>
            <h5>📅 {feed.createdAt}</h5>
            <a href={feed.url}>🌐 {feed.url} </a>
            <button onClick={() => handler(feed)}>{isFollowed ? 'Unfollow' : 'Follow'}</button>
        </li>
    )
}