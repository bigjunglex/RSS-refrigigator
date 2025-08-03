import { useState } from "react"
import { Route } from "../router/Router"
import { RSSItem } from "../shared/RSSItem"

export function Browse() {
    const [posts, setPosts] = useState<Post[] | null>()


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
		<Route path={'/browse'}>
			<div className="browse">
				<button onClick={getPosts}>get Posts</button>
				<ul>
					{posts?.map(post => <RSSItem post={post} isAdded={false} />)}
				</ul>
			</div>
		</Route>
	)
}

