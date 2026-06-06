import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useCallback } from 'react'

// Constrained WYSIWYG (bold / italic / link / lists). Emits HTML via onChange.
// Remount (via a React key) to load a different field's content.
export default function RichText({ value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, codeBlock: false, blockquote: false, horizontalRule: false }),
      Link.configure({ openOnClick: false, autolink: false, HTMLAttributes: { rel: null, target: null } }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  const setLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href || ''
    const url = window.prompt('Link URL (use #anchor to link within the page)', prev)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null
  const btn = (active, on, label) => (
    <button
      type="button"
      className={`rt-btn${active ? ' on' : ''}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
    >
      {label}
    </button>
  )

  return (
    <div className="rt-editor">
      <div className="rt-toolbar">
        {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <b>B</b>)}
        {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <i>i</i>)}
        {btn(editor.isActive('link'), setLink, '🔗')}
        {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), '• List')}
        {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), '1. List')}
      </div>
      <EditorContent className="rt-content" editor={editor} placeholder={placeholder} />
    </div>
  )
}
