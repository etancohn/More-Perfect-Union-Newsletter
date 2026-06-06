import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PostView from '../post/PostView'
import Loading from './Loading'
import { getPostBySlug } from '../lib/posts'

// `/p/:slug` — renders a specific post by slug.
export default function PostPage() {
  const { slug } = useParams()
  const [state, setState] = useState({ status: 'loading', post: null })

  useEffect(() => {
    let live = true
    setState({ status: 'loading' })
    getPostBySlug(slug)
      .then((post) => live && setState({ status: post ? 'ok' : 'missing', post }))
      .catch(() => live && setState({ status: 'missing' }))
    return () => {
      live = false
    }
  }, [slug])

  if (state.status === 'loading') return <Loading />
  if (state.status === 'ok') return <PostView post={state.post} />

  return (
    <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center' }}>
        <p>That edition couldn’t be found.</p>
        <Link to="/">← Back to the latest edition</Link>
      </div>
    </div>
  )
}
