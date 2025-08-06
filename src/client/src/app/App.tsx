import { Router, } from './router/Router'
import { Nav } from './shared/Nav/Nav'
import { Browse } from './pages/Browse/Browse'
import { Login } from './pages/Login'


function App() {

	return (
		<div className='app-wrap'>
			<Router>
				<Nav/>
				<Browse />
				<Login />
			</Router>
		</div>
	)
}

export default App
