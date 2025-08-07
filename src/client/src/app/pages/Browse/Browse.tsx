import { useState, useRef } from "react"
import { Route } from "../../router/Router"
import { RSSItem } from "../../shared/RSSItem"
import './Browse.css'
import { API_BASE } from "../../config"

type BrowseProps = { authStatus: boolean; }

export function Browse({ authStatus } : BrowseProps) {
    const [posts, setPosts] = useState<Post[] | null>()
	const [offset, setOffset] = useState(0)
	const [containerRef, itemRef, watcherRef ] = Array(3).map(() => useRef(null))

	
	async function getPosts() {
		const endpoint = authStatus ? 'feeds/posts/followed?limit=100&offset=0' : 'posts'
		const raw = await fetch(`${API_BASE}/${endpoint}`, {
			credentials:'include'
		})
		console.log(raw)
		if(raw.status !== 200) {
			alert(raw.status)
			return;
		}
		const data = await raw.json() as Post[]
		setPosts(data)
	}

	return (
		<Route path={'/'}>
			<>
				<div className="browse">
				<button className="gepost" onClick={getPosts}>get Posts</button>
					<ul>
						{posts?.map((post, i) => <RSSItem key={i} post={post} isAdded={false} />)}
					</ul>
				</div>
			</>
		</Route>
	)
}

