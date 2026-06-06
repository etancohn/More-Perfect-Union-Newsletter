import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PostView from '../post/PostView'
import Loading from './Loading'
import { firebaseReady } from '../lib/firebase'
import { latestPublished } from '../lib/posts'

// `/` — renders the most recently published post.
export default function Home() {
  const [state, setState] = useState({ status: 'loading', post: null, error: null })

  useEffect(() => {
    if (!firebaseReady) {
      setState({ status: 'unconfigured' })
      return
    }
    let live = true
    latestPublished()
      .then((post) => live && setState({ status: post ? 'ok' : 'empty', post }))
      .catch((error) => live && setState({ status: 'error', error }))
    return () => {
      live = false
    }
  }, [])

  if (state.status === 'loading') return <Loading />
  if (state.status === 'ok') return <PostView post={state.post} />

  return (
    <Empty>
      {state.status === 'unconfigured' && (
        <p>
          Firebase isn’t configured yet. Add your web config to <code>.env</code> (see{' '}
          <code>.env.example</code>), then restart the dev server.
        </p>
      )}
      {state.status === 'empty' && (
        <p>
          No published newsletter yet. Head to the <Link to="/dashboard">dashboard</Link> and click
          “Seed current newsletter” to publish the first one.
        </p>
      )}
      {state.status === 'error' && <p>Couldn’t load the newsletter: {String(state.error?.message || state.error)}</p>}
    </Empty>
  )
}

function Empty({ children }) {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        padding: '40px',
        fontFamily: 'system-ui, sans-serif',
        color: '#33333c',
        lineHeight: 1.6,
      }}
    >
      <div style={{ maxWidth: 520 }}>{children}</div>
    </div>
  )
}
