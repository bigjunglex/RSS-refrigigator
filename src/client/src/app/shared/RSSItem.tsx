type PostProp = { post:Post; isAdded:boolean }

export function RSSItem( { post, isAdded }:PostProp) {

    return (
        <li className="post">
            <h4>📌 {post.title}</h4>
            <h5>📅 {post.createdAt}</h5>
            <a href={post.url}>🌐 {post.url} </a>
            <p>📝 {post.description} </p>
            <button> { isAdded ? "🚫" : "🌟" } </button>
        </li>
    )
}
