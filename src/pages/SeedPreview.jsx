import PostView from '../post/PostView'
import { seedPost } from '../lib/seedPost'

// Offline preview of the bundled seed post — renders the newsletter without
// Firebase. Useful for local design checks before the database is configured.
export default function SeedPreview() {
  return <PostView post={seedPost()} />
}
