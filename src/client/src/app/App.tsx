import { Router, } from './router/Router'
import { Nav } from './shared/Nav'
import { Home } from './pages/Home'
import { Browse } from './pages/Browse'



function App() {

	return (
		<div className='app-wrap'>
			<Router>
				<Nav/>
				<Home />
				<Browse />
			</Router>
		</div>
	)
}







export default App
