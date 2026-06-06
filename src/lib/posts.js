// Firestore CRUD for the `posts` collection. A post document is the post object
// from postSchema (sans `id`, which is the doc id) plus server timestamps.
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { seedPost } from './seedPost'

const COL = 'posts'

const withId = (snap) => ({ id: snap.id, ...snap.data() })
const stripId = ({ id, ...rest }) => rest

export async function listPosts() {
  const snap = await getDocs(query(collection(db, COL), orderBy('updatedAt', 'desc')))
  return snap.docs.map(withId)
}

export async function getPost(id) {
  const snap = await getDoc(doc(db, COL, id))
  return snap.exists() ? withId(snap) : null
}

export async function getPostBySlug(slug) {
  const snap = await getDocs(query(collection(db, COL), where('slug', '==', slug), limit(1)))
  return snap.empty ? null : withId(snap.docs[0])
}

// Most recently published post. Sorted client-side to avoid a composite index.
export async function latestPublished() {
  const snap = await getDocs(query(collection(db, COL), where('status', '==', 'published')))
  if (snap.empty) return null
  const posts = snap.docs.map(withId)
  posts.sort((a, b) => (ms(b.publishedAt) || ms(b.updatedAt)) - (ms(a.publishedAt) || ms(a.updatedAt)))
  return posts[0]
}

const ms = (ts) => (ts?.toMillis ? ts.toMillis() : ts ? new Date(ts).getTime() : 0)

// Create or update. Returns the doc id.
export async function savePost(post) {
  const data = stripId(post)
  data.updatedAt = serverTimestamp()
  if (post.status === 'published' && !post.publishedAt) data.publishedAt = serverTimestamp()
  if (post.id) {
    await setDoc(doc(db, COL, post.id), data, { merge: true })
    return post.id
  }
  data.createdAt = serverTimestamp()
  const r = await addDoc(collection(db, COL), data)
  return r.id
}

export async function deletePost(id) {
  await deleteDoc(doc(db, COL, id))
}

// Upsert the canonical "current newsletter" seed (idempotent by slug).
export async function seedCurrentNewsletter() {
  const seed = seedPost()
  const existing = await getPostBySlug(seed.slug)
  const id = await savePost(existing ? { ...seed, id: existing.id } : seed)
  return id
}
