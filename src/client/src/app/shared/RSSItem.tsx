import { forwardRef } from "react";

type PostProp = { post:Post; isAdded:boolean }

export const RSSItem = forwardRef<HTMLLIElement, PostProp>(({ post, isAdded }, ref) => {
    const desc = new DOMParser().parseFromString(String(post.description), 'text/html')
    let formatted = desc.body.textContent ?? ''
    let link = null

    // Hackernews feeds hardcode fix
    if (desc.body.textContent === 'Comments') {
      const end = String(post.description).indexOf('>') - 1
      link = String(post.description).slice(9, end)
    }

    return (
      <li ref={ref} className="post">
        <h4>📌 {post.title}</h4>
        <h5>📅 {post.createdAt}</h5>
        <a href={post.url}>🌐 {post.url} </a>
        {link ? (
          <a href={link}> 💬 Comments </a>
        ) : (
          <p>📝 {formatted?.length > 0 ? formatted : post.description}</p>
        )}
        <button> {isAdded ? '🚫' : '🌟'} </button>
      </li>
    )
  }
)