import { useEffect, useRef } from "react";
import { RSSItem } from "../shared/RSSItem";

type VirtualPostProps = {
    posts: Post[];
    onBot: Function;
    buffer:number;
    favBtnHandler:( post: Post) => void;
}


/**
 * WARNING!
 * ugly placeholder, TODO: vix fith virtual list later
 **/
export default function VirtualPostList({ posts, onBot, buffer, favBtnHandler}:VirtualPostProps) {
    const watcherBotRef = useRef<HTMLLIElement>(null)
    const itemRef = useRef<HTMLLIElement>(null)
    const containerRef = useRef<HTMLUListElement>(null)

    useEffect(() => {
        const botWatcher = new IntersectionObserver((entries, _o) => {
            entries.forEach(entry => {
                const {bottom, height} = entry.boundingClientRect
                if (bottom > height && entry.isIntersecting) {
                    onBot()
                }
            })
        }, { root: containerRef.current, threshold: 0.5, })
        
        if (watcherBotRef.current) botWatcher.observe(watcherBotRef.current);
        return () => botWatcher.disconnect()

    }, [posts])

    // костыль, 
    const noDup = [...new Set(posts)]    

    return (
        <ul ref={containerRef}>
            {
                noDup?.map((post, i, arr) => {
                    let ref = null
                    if (i === 0) ref = itemRef
                    if (i === arr.length - buffer - 1) ref = watcherBotRef
                    return <RSSItem ref={ref} key={i} post={post} clickHandler={favBtnHandler} />
                })
            }
        </ul>
    )
}