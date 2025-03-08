'use client'

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough, AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  RotateCcw,
  RotateCw,
  Save
} from 'lucide-react'

interface ContentEditorProps {
  initialContent?: string
  onSave?: (content: string) => void
  placeholder?: string
  readOnly?: boolean
}

export function ContentEditor({
  initialContent = '',
  onSave,
  placeholder = 'Start writing...',
  readOnly = false,
}: ContentEditorProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    editable: !readOnly,
    onUpdate: () => {
      // Auto-save functionality
      if (onSave) {
        const timeoutId = setTimeout(() => {
          handleSave()
        }, 1000)
        return () => clearTimeout(timeoutId)
      }
    },
  })

  const handleSave = async () => {
    if (!editor || !onSave) return

    setIsSaving(true)
    try {
      await onSave(editor.getHTML())
      setLastSavedAt(new Date())
    } catch (error) {
      console.error('Error saving content:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {!readOnly && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1">
          {/* Text Style Controls */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('bold') ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('italic') ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('underline') ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('strike') ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Alignment Controls */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <AlignRight className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* List Controls */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('bulletList') ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('orderedList') ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Heading Controls */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <Heading2 className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* History Controls */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          {onSave && (
            <>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center gap-x-1"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              {lastSavedAt && (
                <span className="text-xs text-gray-500 dark:text-gray-400 self-center ml-2">
                  Last saved: {lastSavedAt.toLocaleTimeString()}
                </span>
              )}
            </>
          )}
        </div>
      )}

      <EditorContent
        editor={editor}
        className="prose dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none"
      />
    </div>
  )
}