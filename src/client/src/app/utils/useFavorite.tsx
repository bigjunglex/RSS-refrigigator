import { type SetStateAction, type Dispatch } from "react";
import { addFavorite, removeFavorite } from "./helpers";


export function useFavorite( posts: Post[] | null | undefined, setPosts: Dispatch<SetStateAction<Post[]| null | undefined>> ) {
    return function favBtnHandler(post:Post) {
        if (!posts) { return; }
        let isAdded = post.isAdded
        const postIdx = posts?.findIndex(item => item.id === post.id)
        if (postIdx < 0) { return; }
        
        const callback = () => setPosts(prev => {
            if (!prev) return prev
            return [...prev.slice(0, postIdx), { ...post, isAdded: !isAdded }, ...prev.slice(postIdx + 1)]
        })
        
        try {
            if (isAdded) {
                removeFavorite(String(post.id), callback).then(() => console.log('%s removed', post.title))
            } else {
                addFavorite(String(post.id), callback).then(() => console.log('%s added', post.title))
            }
        } catch (error) {
            console.log()
            isAdded = !isAdded
            callback()
        }
    }
}
