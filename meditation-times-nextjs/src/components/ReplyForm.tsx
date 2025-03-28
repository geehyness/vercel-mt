'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createReply } from '@/lib/sanity/queries'

interface ReplyFormProps {
  discussionId: string
}

export default function ReplyForm({ discussionId }: ReplyFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { appUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!appUser) {
      setError('You must be logged in to reply')
      return
    }

    setIsSubmitting(true)
    try {
      await createReply({
        content,
        discussionId,
        userId: appUser.uid,
        userName: appUser.name,
        userEmail: appUser.email
      })

      router.refresh()
      setContent('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit reply')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          {error}
        </div>
      )}
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows={4}
        placeholder="Write your reply..."
        required
      />
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Post Reply'}
      </button>
    </form>
  )
}