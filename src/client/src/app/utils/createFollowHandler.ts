import type { Dispatch, SetStateAction } from "react";
import { followFeed, unfollowFeed } from "./helpers";

export function createFollowHandler(
    feeds: Feed[] | null | undefined,
    setFeeds: Dispatch<SetStateAction<Feed[] | null | undefined>>,
    setTrigger:Dispatch<SetStateAction<boolean>>,
) {
    return function followBtnHandler(feed:Feed) {
        if (!feeds) { return; }
        const postIdx = feeds?.findIndex(item => item.id === feed.id)
        if (postIdx < 0) { return; }
        
        let isFollowed = feed.isFollowed
        const updatedFeed = { ...feed, isFollowed: !isFollowed }


        const callback = () => setFeeds(prev => {
            if (!prev) return prev
            return [...prev.slice(0, postIdx), updatedFeed, ...prev.slice(postIdx + 1)]
        })

        try {
            if (isFollowed) {
                unfollowFeed(feed, callback).then(() => console.log('%s unfollowed', feed.url))
            } else {
                followFeed(feed, callback).then(() => console.log('%s followed', feed.url))
            }
            setTrigger(p => !p)
        } catch (error) {
            const msg = error instanceof Error ? error.message  : '[ERROR]: @followBtnHandler'
            console.log('Rollback on error [- %s -]', msg)
            isFollowed = !isFollowed
            callback()
        }
    }
}
