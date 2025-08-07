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


