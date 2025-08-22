import { useEffect, useState } from "react";
import './Feeds.css'
import { getFeeds } from "../../utils/helpers";
import { Route } from "../../shared/Router";
import { Feed } from "../../shared/Feed";
import { createFollowHandler } from "../../utils/createFollowHandler";

type FeedProps = Pick<PostsView, 'authStatus' | 'setTrigger'>

export function Feeds({ authStatus, setTrigger}:FeedProps) {
    const [feeds, setFeeds] = useState<Feed[] | null>()
    const handler = createFollowHandler(feeds, setFeeds, setTrigger);

    useEffect(() => {
        getFeeds(authStatus)
            .then(data => setFeeds(data))
            .catch(e => console.log(`${e instanceof Error ? e.message : e}`))
    
    },[authStatus])

    return (
        <Route path={'/feeds'}>
            <ul className="feed-ul">
                { feeds ? feeds.map((feed: Feed) => <Feed key={feed.id} feed={feed} handler={handler} />) : null }
            </ul>
        </Route>
    )
}