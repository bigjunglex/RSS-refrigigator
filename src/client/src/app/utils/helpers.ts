import { API_BASE } from "../config"

export type AuthCheckReturn = {check:boolean; name: string | null;}

export async function checkAuth():Promise<AuthCheckReturn>{
    try {
        const res = await fetch(`${API_BASE}/check`, { credentials: 'include' })
        if (res.status !== 200 ) {
            return {check: false, name: null }
        }
        
        const payload = await res.json();
        return {check:true, name: payload?.name}

    } catch (error) {
        if(error instanceof Error) {
            console.error(error)
        }
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

