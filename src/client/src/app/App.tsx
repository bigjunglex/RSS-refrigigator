import { Router, } from './router/Router'
import { Nav } from './shared/Nav/Nav'
import { Browse } from './pages/Browse/Browse'
import { Login } from './pages/Login/Login'
import { useEffect, useState } from 'react'
import { checkAuth, type AuthCheckReturn } from './utils/helpers'
import { Favorites } from './pages/Favorites'

function App() {
	const [authStatus, setAuthStatus] = useState<AuthCheckReturn>({check:false, name: null})

	useEffect(() => {
		checkAuth().then(v => v ? setAuthStatus(v) : null)
	}, [])

	return (
		<div className='app-wrap'>
			<Router>
				<Nav/>
				<Browse authStatus={authStatus.check} />
				<Login handler={setAuthStatus} authStatus={authStatus.check} />
				<Favorites authStatus={authStatus.check} />
			</Router>
		</div>
	)
}

export default App
