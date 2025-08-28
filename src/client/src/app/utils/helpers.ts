import { API_BASE } from "../config"


export async function checkAuth():Promise<AuthCheckReturn> {
    try {
        const res = await fetch(`${API_BASE}/check`, { credentials: 'include' })
        if ( res.status !== 200 ) throw new Error(`Fetch error with ${res.status}`)
        const payload = await res.json();
        return { check:true, name: payload?.name, isChecked: true }
    } catch (error) {
        if(error instanceof Error) { console.error(error) }
        return { check:false, name:null, isChecked: true }
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


export async function getSearch(query:string):Promise<Post[]> {
    const noSpace = query.replace(' ', '-')
    try {
        const res = await fetch(`${API_BASE}/search?query=${noSpace}`);
        if (res.status !== 200) throw new Error(`[SEARCH]: response: ${res.status}`);
        const data = await res.json() as Post[]
        return data
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
        }
        return []
    }
}

export async function addNewFeed(name:string, url:string) {
    try {
        const body = JSON.stringify({ name:name, url:url });
        console.log(body)
        const res = await fetch(`${API_BASE}/feeds/add`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body,
        });
        if (res.status !== 200) throw new Error(`[ADDFEED]: server response ${res.status}`)
        const entry = (await res.json()).entry
        return entry
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
        }
        return null
    }
}