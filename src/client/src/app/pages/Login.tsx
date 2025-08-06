import { type FormEvent} from "react";
import { Route } from "../router/Router";

export function Login() {
    async function logSubmit(e:FormEvent<HTMLFormElement>){
        e.preventDefault();
        const form = e.currentTarget
        const data = new FormData(form)
        const body = JSON.stringify(Object.fromEntries(data));
        
        const res = await fetch('http://localhost:8080/api/login', {
            headers: {
                'Content-Type':'application/json'
            },
            credentials: "include",
            method:'POST',
            body: body
        })
        const json = await res.json()
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