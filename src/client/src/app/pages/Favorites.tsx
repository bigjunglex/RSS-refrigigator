import { useEffect, useState } from "react"
import { Route } from "../router/Router"
import './Browse/Browse.css'
import { API_BASE } from "../config"
import { RSSItem } from "../shared/RSSItem"
import { useFavorite } from "../utils/useFavorite"


type FavoritesProps = { authStatus: boolean; }

export function Favorites({ authStatus, } : FavoritesProps) {
    const [posts, setPosts] = useState<Post[] | null | undefined>(null)
    const handler = useFavorite(posts, setPosts)

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
                <ul>
                    {
                        posts && posts.length > 0
                            ? posts.map(post => <RSSItem key={post.id} post={post} clickHandler={handler} />)
                            : <h1>No posts added yet</h1>
                    }
                </ul>
            </div>
        </Route>
    )
}

