import { useEffect, useState } from "react"
import { Route } from "../../router/Router"
import './Browse.css'
import { VirtualPostList } from "../../utils/VirtualList"
import { useFavorite } from "../../utils/useFavorite"
import { getPosts } from "../../utils/helpers"


export function Browse({ authStatus, posts, setPosts, trigger, setTrigger } : PostsView) {
	const [offset, setOffset] = useState(0)
	const [limit, buffer] = [30, 10]
	const [loading, setLoading] = useState(false)
	const [isMore, setIsMore] = useState(true)
	const favBtnHandler = useFavorite(posts, setPosts, setTrigger)

	useEffect(() => {
		if (loading || !isMore) return;
		setLoading(true)
		
		getPosts(limit, offset, authStatus)
			.then(data => {
				setPosts((prev:Post[]) => [...prev || [], ...data || []])
				if (data && data.length < limit) {
					setIsMore(false)
				}
			})
			.catch(e => console.log(`${e instanceof Error ? e.message : e}`))
			.finally(() => setLoading(false));		

	}, [trigger, offset])

	const botIntersect = () => {
		console.log('intersected')
		setOffset(p => p + limit)
	}

	
	return (
		<Route path={'/'}>
			<>
				<div className="browse">
					<VirtualPostList
						posts={posts as Post[]}
						buffer={buffer}
						onBot={botIntersect}
						favBtnHandler={favBtnHandler}
					/>
				</div>
			</>
		</Route>
	)
}

