import { API_BASE } from "../config"

export type AuthCheckReturn = {check:boolean; name: string | null;}

export async function checkAuth():Promise<AuthCheckReturn> {
    try {
        const res = await fetch(`${API_BASE}/check`, { credentials: 'include' })
        if ( res.status !== 200 ) throw new Error(`Fetch error with ${res.status}`)
        const payload = await res.json();
        return {check:true, name: payload?.name}
    } catch (error) {
        if(error instanceof Error) { console.error(error) }
        return {check:false, name:null}
    }
}

/**
 * @param callback on successfull add 
 */
export async function addFavorite(postID: string, callback:Function) {
    try {
        const res = await fetch(`${API_BASE}/feeds/${postID}/favorite`, {
            credentials: 'include',
            method: 'POST'
        })
        if(res.status === 200) {
            callback()
        } else {
            throw new Error(`[FAVORITES] : didnt add ${postID}`)
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
        }
    }
}

/**
 * @param callback on successfull remove 
 */
export async function removeFavorite(postID: string, callback: Function) {
    try {
        const res = await fetch(`${API_BASE}/feeds/${postID}/favorite`, {
            credentials: 'include',
            method: 'DELETE'
        })
        if(res.status === 200) {
            callback()
        } else {
            throw new Error(`[FAVORITES] : didnt remove ${postID}`)
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
        }
    }
}

export async function getFavPosts() {
    const raw = await fetch(`${API_BASE}/feeds/posts/favorites`, {
        credentials: 'include'
    })
    if (raw.status !== 200) {
        console.log(raw.status)
        return null;
    }
    const data = await raw.json() as Post[]
    return data.map(post => ({ ...post, isAdded: true }))
}

export async function getPosts(limit: number, offset: number, authStatus: boolean) {
    const endpoint = authStatus ? `feeds/posts/followed?limit=${limit}&offset=${offset}` : `posts?limit=100&offset=${offset}`
    const raw = await fetch(`${API_BASE}/${endpoint}`, {
        credentials: 'include'
    })
    if (raw.status !== 200) {
        console.log(raw.status)
        return;
    }
    const data = await raw.json() as Post[]
    return data
}

export async function getFeeds(authStatus: boolean) {
    const endpoint = authStatus ? 'feeds/followed' :'feeds/' 
    const raw = await fetch(`${API_BASE}/${endpoint}`, {
        credentials: 'include'
    })
    if (raw.status !== 200) {
        console.log(raw.status)
        return;
    }
    const data = await raw.json() as Feed[]
    return data
}


export async function followFeed(feed: Feed, callback: Function) {
    const { id } = feed
    try {
        const res = await fetch(`${API_BASE}/feeds/${id}/follow`, {
            credentials: 'include',
            method: 'POST'
        })
        if (res.status === 200) {
            callback()
        } else {
            throw new Error(`[FOLLOWS] : didnt follow ${id}`)
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
        }
    }
}

export async function unfollowFeed(feed: Feed, callback: Function) {
    const { id } = feed
    try {
        const res = await fetch(`${API_BASE}/feeds/${id}/follow`, {
            credentials: 'include',
            method: 'DELETE'
        })
        if (res.status === 200) {
            callback()
        } else {
            throw new Error(`[FOLLOWS] : didnt unfollow ${id}`)
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
        }
    }
}