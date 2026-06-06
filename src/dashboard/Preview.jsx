import { useMemo, useState } from 'react'
import PostView from '../post/PostView'
import { buildEmailHtml, DEFAULT_BASE } from '../lib/email'

// Live dual preview: the web page (real components) and the email HTML (iframe).
export default function Preview({ post }) {
  const [tab, setTab] = useState('web')
  const emailHtml = useMemo(
    () => (tab === 'email' ? buildEmailHtml(post, { baseUrl: DEFAULT_BASE }) : ''),
    [tab, post]
  )

  return (
    <div className="preview">
      <div className="preview-tabs">
        <button className={tab === 'web' ? 'on' : ''} onClick={() => setTab('web')}>
          🌐 Website
        </button>
        <button className={tab === 'email' ? 'on' : ''} onClick={() => setTab('email')}>
          ✉️ Email
        </button>
      </div>
      <div className="preview-body">
        {tab === 'web' ? (
          <div className="preview-web">
            <PostView post={post} preview />
          </div>
        ) : (
          <iframe className="preview-email" title="Email preview" srcDoc={emailHtml} />
        )}
      </div>
    </div>
  )
}
