import { useState } from "react"
import { Route } from "../../router/Router"
import './Browse.css'
import { API_BASE } from "../../config"
import { VirtualPostList } from "../../utils/VirtualList"

type BrowseProps = { authStatus: boolean; }

export function Browse({ authStatus } : BrowseProps) {
    const [posts, setPosts] = useState<Post[] | null>()
	const [offset, setOffset] = useState(0)

	async function getPosts() {
		const endpoint = authStatus ? `feeds/posts/followed?limit=100&offset=${offset}` : 'posts'
		const raw = await fetch(`${API_BASE}/${endpoint}`, {
			credentials: 'include'
		})
		console.log(raw)
		if (raw.status !== 200) {
			alert(raw.status)
			return;
		}
		const data = await raw.json() as Post[]
		setPosts(data)
	}

	const topIntersect = () => console.log('top intersection')
	const botIntersect = () => console.log('bot intersection')

	return (
		<Route path={'/'}>
			<>
				<div className="browse">
					<button className="getpost" onClick={getPosts}>get Posts</button>
					<VirtualPostList posts={posts as Post[]} buffer={5} onBot={botIntersect} onTop={topIntersect} />
				</div>
			</>
		</Route>
	)
}

