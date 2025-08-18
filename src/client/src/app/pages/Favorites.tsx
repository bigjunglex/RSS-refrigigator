import { useEffect } from "react"
import { Route } from "../router/Router"
import './Browse/Browse.css'
import { RSSItem } from "../shared/RSSItem"
import { useFavorite } from "../utils/useFavorite"
import { getFavPosts } from "../utils/helpers"


export function Favorites({ authStatus, posts, setPosts, trigger, setTrigger} : PostsView) {
    const handler = useFavorite(posts, setPosts, setTrigger)

    useEffect(() => {
        getFavPosts()
        .then(data => setPosts(data))
        .catch((e:any) => e instanceof Error ? console.log(e.message) : console.log(e))
    }, [trigger])
    

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
                            ? posts.map(post => {
                                return post.isAdded ? <RSSItem key={post.id} post={post} clickHandler={handler} /> : null
                            })
                            : <h1>No posts added yet</h1>
                    }
                </ul>
            </div>
        </Route>
    )
}

