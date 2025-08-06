import { useState, useRef } from "react"
import { Route } from "../../router/Router"
import { RSSItem } from "../../shared/RSSItem"
import './Browse.css'

export function Browse() {
    const [posts, setPosts] = useState<Post[] | null>()
	const [offset, setOffset] = useState(0)
	const [containerRef, itemRef, watcherRef ] = Array(3).map(() => useRef(null))

	
	async function getPosts() {
		const raw = await fetch('http://localhost:8080/api/posts', {
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

