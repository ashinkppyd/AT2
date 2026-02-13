import React, { useEffect, useState } from 'react'
import './Blog.css'
import Footer from '../components/Footer'

function Blog() {
  const [banner, setBanner] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    setBanner({
      image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3"
    })

    setPosts([
      {
        id: 1,
        title: "The Art of Timeless Precision",
        excerpt: "Luxury watches are not accessories — they are statements of discipline, legacy, and refined taste.",
        image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade",
        date: "January 20, 2025",
        author: "Aurum Editorial"
      }
    ])
  }, [])

  if (!banner) return null

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <img src={banner.image} alt="banner" />
        <div className="blog-hero-text">
          <h1>AT2</h1>
          <p>We don’t sell watches… we sell punctual style.</p>
        </div>
      </section>

      <section className="blog-list">
        {posts.map((post, i) => (
          <article key={post.id} className={`blog-post ${i % 2 === 0 ? 'left' : 'right'}`}>
            <div className="blog-image">
              <img src={post.image} alt={post.title} />
            </div>
            <div className="blog-info">
              <h2>{post.title}</h2>
              <p className="blog-meta">{post.date} | by Ashin KP</p>
              <p>{post.excerpt}</p>
              <a href="#">Read More →</a>
            </div>
          </article>
        ))}
      </section>

      <Footer />
    </div>
  )
}

export default Blog
