import { useEffect, useRef } from "react";
import { RSSItem } from "../shared/RSSItem";

type VirtualPostProps = {
    posts: Post[];
    onTop: Function;
    onBot: Function;
    buffer:number;
}



export function VirtualPostList({ posts, onTop, onBot, buffer }:VirtualPostProps) {
    const watcherBotRef = useRef<HTMLLIElement>(null)
    const watcherTopRef = useRef<HTMLLIElement>(null)
    const itemRef = useRef<HTMLLIElement>(null)
    const containerRef = useRef<HTMLUListElement>(null)

    useEffect(() => {
        const obsOptions: IntersectionObserverInit = { root: containerRef.current, threshold: 0.5, }
        const topWatcher = new IntersectionObserver((entries, _o) => {
            entries.forEach(entry => {
                if (entry.boundingClientRect.top < 0 && entry.isIntersecting) {
                    onTop()
                }

            })
        }, obsOptions)

        const botWatcher = new IntersectionObserver((entries, _o) => {
            entries.forEach(entry => {
                const {bottom, height} = entry.boundingClientRect
                if (bottom > height && entry.isIntersecting) {
                    onBot()
                }
            })
        }, obsOptions)
        
        containerRef.current?.addEventListener('click', (e:MouseEvent) => console.log('x: %s | y: %s', e.clientX, e.clientY))

        if(watcherBotRef.current && watcherTopRef.current) {
            topWatcher.observe(watcherTopRef.current)
            botWatcher.observe(watcherBotRef.current)
        }

        return () => {
            topWatcher.disconnect()
            botWatcher.disconnect()
            containerRef.current?.removeEventListener('click', (e:MouseEvent) => console.log('x: %s | y: %s', e.clientX, e.clientY))
        }
    }, [posts])

    return (
        <ul ref={containerRef}>
            {
                posts?.map((post, i, arr) => {
                    let ref = null
                    if (i === 0) ref = itemRef
                    if (i === buffer) ref = watcherTopRef
                    if (i === arr.length - buffer - 1) ref = watcherBotRef
                    return <RSSItem ref={ref} key={i} post={post} isAdded={false} />
                })
            }
        </ul>
    )
}