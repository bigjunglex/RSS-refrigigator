import { useEffect, useState, type FormEventHandler } from "react";
import './Feeds.css'
import { addNewFeed, getFeeds } from "../../utils/helpers";
import { Route } from "../../shared/Router";
import { Feed } from "../../shared/Feed";
import { createFollowHandler } from "../../utils/createFollowHandler";

type FeedProps = Pick<PostsView, 'authStatus' | 'setTrigger'>
type FeedForm = { name:string | undefined; url:string | undefined }

export default function Feeds({ authStatus, setTrigger}:FeedProps) {
    const [feeds, setFeeds] = useState<Feed[] | null>();
    const [input, setInput] = useState<FeedForm>({ name: '', url: ''});
    const handler = createFollowHandler(feeds, setFeeds, setTrigger);

    useEffect(() => {
        if (!authStatus.isChecked) return;
        getFeeds(authStatus.check)
            .then(data => setFeeds(data))
            .catch(e => console.log(`${e instanceof Error ? e.message : e}`))
    
    },[authStatus])

    const addFeed:FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const [name, url] = [formData.get('name'), formData.get('url')];
        
        if(!name || !url ) return;
        
        const newEntry = await addNewFeed(String(name), String(url))
        console.log(newEntry)
        setInput({ name: '', url: ''})
        setFeeds(p => p ? [newEntry, ...p] : null)
    }

    return (
        <Route path={'/feeds'}>
            <div className="feed-wrap">
                <form onSubmit={addFeed}>
                    <div className="inputs">
                        <input
                            className="search-bar"
                            type="text"
                            name="name"
                            placeholder="feed's name"
                            value={input.name}
                            onChange={(e) => setInput(p => ({ ...p, name: e.target.value }))}
                            />
                        <input
                            className="search-bar"
                            type="url"
                            name="url"
                            placeholder="feed's url"
                            value={input.url}
                            onChange={(e) => setInput(p => ({ ...p, url: e.target.value }))}
                            />
                    </div>
                    <div className="buttons">
                        <button title="add Feed" type="submit">+</button>
                        <button title="reset form" type="reset">↺</button>
                    </div>
                </form>
                <ul className="feed-ul">
                    {feeds ? feeds.map((feed: Feed) => <Feed key={feed.id} feed={feed} handler={handler} />) : null}
                </ul>
            </div>
        </Route>
    )
}