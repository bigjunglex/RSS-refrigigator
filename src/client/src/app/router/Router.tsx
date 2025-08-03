import { useContext, useState, createContext, type ReactNode, useEffect } from "react";

type Navigate = (to:string) => void
type RouterContext = { currentPath: string; navigate: Navigate }

export const routerContext = createContext<RouterContext>({currentPath: '', navigate: (to:string) => null})

export function Router({ children }: {children: ReactNode}) {
    const [path, setPath] = useState(window.location.pathname)

    const navigate:Navigate = (to:string, params?: string) => {
        window.history.pushState({ params: params }, '', to)
        console.log(window.location.pathname)
        setPath(to)
    }

    useEffect(() => {
        const handler = () => setPath(window.location.pathname)

        window.addEventListener('popstate', handler)
        return () => window.removeEventListener('popstate', handler)
    }, [])

    return (
        <routerContext.Provider value={{currentPath: path, navigate: (to:string) => navigate(to)}}>
            {children}
        </routerContext.Provider>
    )
}

export function Route({path, children}: {path:String, children:ReactNode}) {
    const { currentPath } = useContext(routerContext);
    return currentPath === path ?  children  : null 
}

export function Link({ children, to }: {children: ReactNode, to:string}) {
    const { navigate, currentPath } = useContext(routerContext)
    const isActive = to === currentPath
    const linkClick = (e:React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        navigate(to)
    }
    return (
        <div className={isActive ? 'active-link-wrap' : 'link-wrap'}>
            <a href={to} onClick={linkClick}>
                {children}
            </a>
        </div>
    )
}