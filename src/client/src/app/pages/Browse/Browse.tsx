import { useEffect, useState } from "react"
import { Route } from "../../router/Router"
import './Browse.css'
import { VirtualPostList } from "../../utils/VirtualList"
import { createFavoriteHandler } from "../../utils/createFavoriteHandler"
import { getPosts } from "../../utils/helpers"


export function Browse({ authStatus, posts, setPosts, trigger, setTrigger, followTrigger } : PostsView) {
	const [offset, setOffset] = useState(0)
	const [limit, buffer] = [30, 10]
	const [loading, setLoading] = useState(false)
	const [isMore, setIsMore] = useState(true)

	const favBtnHandler = createFavoriteHandler(posts, setPosts, setTrigger)

	//fetch on offset + favTrigger
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

	// initial fetch + refetch related posts after auth delay OR feed follow changes
	useEffect(() => {
		if (loading) return;
		setLoading(true)
		
		getPosts(limit, offset, authStatus)
			.then(data => { setPosts(data) })
			.catch(e => console.log(`${e instanceof Error ? e.message : e}`))
			.finally(() => setLoading(false));		

	}, [authStatus, followTrigger])

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

