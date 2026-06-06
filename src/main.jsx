import React, { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import './dashboard/dashboard.css'
import Home from './pages/Home'
import PostPage from './pages/PostPage'
import SeedPreview from './pages/SeedPreview'
import Loading from './pages/Loading'

// The dashboard (editor + TipTap) is a heavy, rarely-loaded bundle — split it
// out so the public newsletter stays lean.
const Dashboard = lazy(() => import('./dashboard/Dashboard'))
const Editor = lazy(() => import('./dashboard/Editor'))

const withSuspense = (el) => <Suspense fallback={<Loading />}>{el}</Suspense>

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/p/:slug', element: <PostPage /> },
  { path: '/seed-preview', element: <SeedPreview /> },
  { path: '/dashboard', element: withSuspense(<Dashboard />) },
  { path: '/dashboard/new', element: withSuspense(<Editor />) },
  { path: '/dashboard/:id', element: withSuspense(<Editor />) },
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
