import { useEffect, useState } from "react"
import { Route } from "../../router/Router"
import './Browse.css'
import { VirtualPostList } from "../../utils/VirtualList"
import { useFavorite } from "../../utils/useFavorite"
import { getPosts } from "../../utils/helpers"


export function Browse({ authStatus, posts, setPosts, trigger, setTrigger } : PostsView) {
	const [offset, setOffset] = useState(0)
	const [limit, buffer] = [30, 10]
	const favBtnHandler = useFavorite(posts, setPosts, setTrigger)

	useEffect(() => {
		console.log(trigger, offset)
		getPosts(limit, offset, authStatus)
			.then(data => setPosts(data))
			.catch(e => console.log(`${e instanceof Error ? e.message : e}`))
	}, [trigger, offset])

	const topIntersect = () => {
		const estimatedOffset = offset - limit
		if (estimatedOffset < 0) return;
		setOffset(estimatedOffset)
	}
	const botIntersect = () => {
		if (posts && posts.length < limit ) return;
		setOffset(offset + limit)
	}

	
	return (
		<Route path={'/'}>
			<>
				<div className="browse">
					<VirtualPostList
						posts={posts as Post[]}
						buffer={buffer}
						onBot={botIntersect}
						onTop={topIntersect}
						favBtnHandler={favBtnHandler}
					/>
				</div>
			</>
		</Route>
	)
}

