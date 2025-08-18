import { Router, } from './router/Router'
import { Nav } from './shared/Nav/Nav'
import { Browse } from './pages/Browse/Browse'
import { Login } from './pages/Login/Login'
import { useEffect, useState } from 'react'
import { checkAuth, type AuthCheckReturn } from './utils/helpers'
import { Favorites } from './pages/Favorites'


function App() {
	const [authStatus, setAuthStatus] = useState<AuthCheckReturn>({check:false, name: null})
	const [favPosts, setFavPosts] = useState<Post[] | null | undefined>(null)
	const [posts, setPosts] = useState<Post[] | null | undefined>(null)
	const [trigger, setTrigger] = useState(true)

	useEffect(() => {
		checkAuth().then(status => status ? setAuthStatus(status) : null)
	}, [])

	return (
		<div className='app-wrap'>
			<Router>
				<Nav authStatus={authStatus} />
				<Browse 
					authStatus={authStatus.check}
					posts={posts}
					setPosts={setPosts}
					trigger={trigger}
					setTrigger={setTrigger}
				/>
				<Login handler={setAuthStatus} authStatus={authStatus.check} />
				<Favorites
					authStatus={authStatus.check}
					posts={favPosts}
					setPosts={setFavPosts}
					trigger={trigger}
					setTrigger={setTrigger}
				/>
			</Router>
		</div>
	)
}

export default App
