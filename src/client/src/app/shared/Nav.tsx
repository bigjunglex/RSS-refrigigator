import { Link } from "../router/Router";

export function Nav() {
    return (
        <nav>
            <Link to="/" children='Home' />
            <Link to="/browse" children='Browse' />
            <Link to="/feeds" children='Feeds' />
        </nav>
    )
}