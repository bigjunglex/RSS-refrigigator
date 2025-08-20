import { useEffect, useState } from "react";
import './Feeds.css'
import { getFeeds } from "../../utils/helpers";
import { Route } from "../../router/Router";
import { Feed } from "../../shared/Feed";

type FeedProps = Pick<PostsView, 'authStatus'>

export function Feeds({ authStatus }:FeedProps) {
    const [feeds, setFeeds] = useState<Feed[] | null>()

    useEffect(() => {
        getFeeds(authStatus)
            .then(data => setFeeds(data))
            .catch(e => console.log(`${e instanceof Error ? e.message : e}`))
    
    },[authStatus])

    function manageFollows(feed:Feed) {
        console.log(feed.isFollowed)
    }

    return (
        <Route path={'/feeds'}>
            <ul>
                { feeds ? feeds.map((feed: Feed) => <Feed key={feed.id} feed={feed} handler={manageFollows}/>) : null }
            </ul>
        </Route>
    )
}