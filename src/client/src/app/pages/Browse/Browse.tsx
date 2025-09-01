import { useEffect, useState } from "react"
import { Route } from "../../shared/Router"
import './Browse.css'
import { VirtualPostList } from "../../utils/VirtualList"
import { createFavoriteHandler } from "../../utils/createFavoriteHandler"
import { getPosts } from "../../utils/helpers"
import { Search } from "./Search"


export function Browse({ authStatus, posts, setPosts, trigger, setTrigger, followTrigger, setFollowTrigger } : PostsView) {
	const [offset, setOffset] = useState(0)
	const [limit, buffer] = [30, 10]
	const [loading, setLoading] = useState(false)
	const [isMore, setIsMore] = useState(true)
	const [stopObs, setStopObs] = useState(false)

	const favBtnHandler = createFavoriteHandler(posts, setPosts, setTrigger)

	//fetch on offset + favTrigger
	useEffect(() => {
		if (loading || !isMore || !authStatus.isChecked) return;
		setLoading(true)
		console.log('fires a offset fech')
		getPosts(limit, offset, authStatus.check)
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
		if (loading || !authStatus.isChecked) return;
		
		console.log('fires a base fech')
		setLoading(true)
		setOffset(0)
		
		getPosts(limit, 0, authStatus.check)
		.then(data => { setPosts(data) })
		.catch(e => console.log(`${e instanceof Error ? e.message : e}`))
		.finally(() => setLoading(false));		
		
	}, [authStatus, followTrigger])

	const botIntersect = () => {
		if(stopObs) return;
		setOffset(p => p + limit)
	}

	
	return (
		<Route path={'/'}>
			<>
				<div className="browse">
					<Search
						posts={posts}
						setPosts={setPosts}
						setTrigger={setFollowTrigger}
						setStop={setStopObs}
					/>
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

