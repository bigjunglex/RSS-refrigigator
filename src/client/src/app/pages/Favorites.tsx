import { useEffect, useState } from "react"
import { Route } from "../router/Router"
import './Browse/Browse.css'
import { API_BASE } from "../config"
import { RSSItem } from "../shared/RSSItem"
import { addFavorite, removeFavorite } from "../utils/helpers"


type FavoritesProps = { authStatus: boolean; }

export function Favorites({ authStatus, } : FavoritesProps) {
    const [posts, setPosts] = useState<Post[] | null>(null)

    async function getFavPosts() {
        const raw = await fetch(`${API_BASE}/feeds/posts/favorites`, {
            credentials: 'include'
        })
        if (raw.status !== 200) {
            console.log(raw.status)
            return null;
        }
        const data = await raw.json() as Post[]
        return data.map(post => ({...post, isAdded: true }))
    }
    
    function favBtnHandler(post:Post) {
        if(!posts) {
            return;
        }
        
        const postIdx = posts?.findIndex(item => item.id === post.id)

        if(postIdx < 0) {
            return;
        }

        let isAdded = !!post.isAdded
        const callback = () => setPosts(prev => {
            if (!prev) return prev
            return [...prev.slice(0, postIdx), {...post, isAdded: !isAdded}, ...prev.slice(postIdx + 1)]
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

    useEffect(() => {
        getFavPosts()
        .then(data => setPosts(data))
        .catch((e:any) => e instanceof Error ? console.log(e.message) : console.log(e))
    }, [])
    

    if (!authStatus) {
        return (
            <Route path={'/favorites'}>
                <h1>Login to manage favorite posts.</h1>
            </Route>
        )
    }

    return (
        <Route path={'/favorites'}>
            <div className="browse">
                {
                    posts && posts.length > 0
                        ? posts.map(post => <RSSItem key={post.id} post={post} clickHandler={favBtnHandler}/>)
                        : <h1>No posts added yet</h1>
                }
            </div>
        </Route>
    )
}

