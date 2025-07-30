import { useState} from 'react'
import { Login } from './pages/Login'
import { RSSItem }  from './shared/RSSItem'

function App() {
	const [posts, setPosts] = useState<Post[] | null>()


	async function getPosts() {
		const raw = await fetch('http://localhost:8080/api/feeds/posts/followed?limit=10&offset=0', {
			credentials:'include'
		})
		console.log(raw)
		if(raw.status !== 200) {
			alert(raw.status)
		}
		const data = await raw.json() as Post[]
		setPosts(data)
	}

	return (
		<>
			<Login />
			<button onClick={getPosts}>getPosts</button>
			<ul>
				{posts?.map(post => <RSSItem post={post} isAdded={false}/> )}
			</ul>
		</>
	)
}

export default App
