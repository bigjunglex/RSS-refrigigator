import { Link } from "../Router";
import './Nav.css'

export type NavProps = { authStatus: { check:boolean, name: string | null} }

export function Nav({ authStatus }:NavProps) {
    return (
        <nav>
            <Link to="/login" children={authStatus.check ? `${authStatus.name}` : 'Login'} />
            <Link to="/" children='Browse' />
            <Link to="/favorites" children='Favorite' />
            <Link to="/feeds" children='Feeds' />
        </nav>
    )
}