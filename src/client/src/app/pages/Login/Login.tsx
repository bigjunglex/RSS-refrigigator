import { type Dispatch, type FormEvent, type SetStateAction} from "react";
import { Route } from "../../shared/Router";
import './Login.css'
import type { AuthCheckReturn } from "../../utils/helpers";
import { API_BASE } from "../../config";


type LoginProps = {handler: Dispatch<SetStateAction<AuthCheckReturn>>; authStatus: boolean}

export function Login({ handler, authStatus } : LoginProps) {

    async function logout() {
        const res = await fetch(`${API_BASE}/logout`, {
            method: 'POST',
            credentials: 'include'
        })

        if (res.status === 200) {
            handler({name:null, check:false})
            console.log('logout successfull')
        }
    }

    if (authStatus) {
        return (
            <Route path={'/login'}>
                <button className="logout-btn" onClick={logout}>⚠️ Logout ⚠️</button>
            </Route>
        )
    }

    async function logSubmit(e:FormEvent<HTMLFormElement>){
        e.preventDefault();
        const form = e.currentTarget
        const data = new FormData(form)
        const body = JSON.stringify(Object.fromEntries(data));
        
        const res = await fetch(`${API_BASE}/login`, {
            headers: {
                'Content-Type':'application/json'
            },
            credentials: "include",
            method:'POST',
            body: body
        })
        const json = await res.json()
        if (res.status === 200) handler({ name: json.name, check: true });
        console.log(json)
    }
    return (
        <Route path={'/login'}>
            <div className="loginWrapper">
                <h1>login page</h1>
                <form onSubmit={logSubmit}>
                    <label htmlFor="name">name</label>
                    <input type="text" id="name" name="name" />

                    <label htmlFor="password">password</label>
                    <input type="password" id="password" name="password" />
                    <button type="submit">done</button>
                </form>
            </div>
        </Route>
    )
}