import { Link } from "../../router/Router";
import './Nav.css'

export function Nav() {
    return (
        <nav>
            <Link to="/" children='Browse' />
            <Link to="/feeds" children='Feeds' />
            <Link to="/login" children='Login' />
            <Link to="/favorites" children='🌟' />
        </nav>
    )
}