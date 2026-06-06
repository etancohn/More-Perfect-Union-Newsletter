import PostView from '../post/PostView'
import { seedPost } from '../lib/seedPost'

// `/` — for now, always renders the bundled seed post (the polished default
// example), regardless of what's published. Specific editions live at `/p/:slug`.
export default function Home() {
  return <PostView post={seedPost()} />
}
