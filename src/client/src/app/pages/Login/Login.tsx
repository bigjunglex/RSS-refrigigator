import { type Dispatch, type FormEvent, type SetStateAction} from "react";
import { Route } from "../../shared/Router";
import './Login.css'
import { API_BASE } from "../../config";
import { Glitch } from "../../shared/Glich/Gltich";



type LoginProps = {handler: Dispatch<SetStateAction<AuthCheckReturn>>; authStatus: {check: boolean; name: string | null}}

export default function Login({ handler, authStatus } : LoginProps) {

    async function logout() {
        const res = await fetch(`${API_BASE}/logout`, {
            method: 'POST',
            credentials: 'include'
        })

        if (res.status === 200) {
            handler({ name:null, check:false, isChecked: true })
            console.log('logout successfull')
        }
    }

    if (authStatus.check) {
        return (
            <Route path={'/login'}>
                <div className="login-wrapper">
                    <Glitch />
                    <h1>{authStatus.name}</h1>
                    <button className="logout-btn" onClick={logout}>⚠️ Logout ⚠️</button>
                </div>
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
        if (res.status === 200) handler({ name: json.name, check: true, isChecked: true});
        console.log(json)
    }
    return (
        <Route path={'/login'}>
            <div className="login-wrapper">
                <Glitch />
                <form id="login-form" onSubmit={logSubmit}>
                    <input type="text" id="name" name="name" placeholder="Username"/>
                    <input type="password" id="password" name="password" placeholder="Password"/>
                    <button type="submit">done</button>
                </form>
            </div>
        </Route>
    )
}