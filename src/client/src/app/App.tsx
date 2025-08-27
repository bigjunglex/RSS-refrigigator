import { Router, } from './shared/Router'
import { Nav } from './shared/Nav/Nav'
import { Browse } from './pages/Browse/Browse'
import { Favorites } from './pages/Browse/Favorites'
import { Login } from './pages/Login/Login'
import { useEffect, useState } from 'react'
import { checkAuth } from './utils/helpers'
import { Feeds } from './pages/Feeds/Feeds'

const authPlaceholder:AuthCheckReturn = {
	check:false,
	name: null,
	isChecked: false
}

function App() {
	const [authStatus, setAuthStatus] = useState<AuthCheckReturn>(authPlaceholder)
	const [favPosts, setFavPosts] = useState<Post[] | null | undefined>(null)
	const [posts, setPosts] = useState<Post[] | null | undefined>(null)
	const [trigger, setTrigger] = useState(true)
	const [followTrigger, setFollowTrigger] = useState(true)

	useEffect(() => {
		checkAuth().then(status => status ? setAuthStatus(status) : null)
	}, [])

	return (
		<div className='app-wrap'>
			<Router>
				<Nav authStatus={authStatus} />
				<Browse 
					authStatus={authStatus}
					posts={posts}
					setPosts={setPosts}
					trigger={trigger}
					setTrigger={setTrigger}
					followTrigger={followTrigger}
					setFollowTrigger={setFollowTrigger}
				/>
				<Login handler={setAuthStatus} authStatus={authStatus} />
				<Favorites
					authStatus={authStatus}
					posts={favPosts}
					setPosts={setFavPosts}
					trigger={trigger}
					setTrigger={setTrigger}
				/>
				<Feeds
				 authStatus={authStatus}
				 setTrigger={setFollowTrigger}
				/>
			</Router>
		</div>
	)
}

export default App
