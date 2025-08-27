import { useState, type ChangeEventHandler, type Dispatch, type FormEventHandler, type MouseEventHandler } from "react"
import { getSearch } from "../utils/helpers";

type SearchProps = Pick<PostsView, 'posts' | 'setPosts' | 'setTrigger'> & {
    setStop:Dispatch<React.SetStateAction<boolean>>
}

export function Search({ setPosts, setTrigger, setStop }:SearchProps) {
    const [input, setInput] = useState('');

    const inputHanlder:ChangeEventHandler<HTMLInputElement> = (e) => setInput(e.target.value);
    const submitHandler:FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement)
        const query = String(data.get('query')).replace(';', '')
        const res = await getSearch(query)
        if (res.length < 1) {
            alert(`Didn't find anything related to ${query}`)
            return;
        }
        setStop(true)
        setPosts(res)
    }
    const resetHandler:MouseEventHandler<HTMLButtonElement> = () => {
        setInput('')
        setTrigger((p:boolean) => !p)
        setStop(false)
    }

    
    return (
        <form id="search-bar" onSubmit={submitHandler} >
            <input
                type="text"
                name="query"
                value={input}
                onChange={inputHanlder}
                placeholder="Search..." 
            />
            <button type="submit">🔍</button>
            <button type='reset' onClick={resetHandler}>↺</button>
        </form>
    )
}