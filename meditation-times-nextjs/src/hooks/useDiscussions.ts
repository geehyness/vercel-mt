// hooks/useDiscussion.ts
"use client"
import { client } from '@/lib/sanity/client'
import { useEffect, useState } from 'react'

export function useDiscussion(discussionId: string) {
  const [discussion, setDiscussion] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const query = `*[_type == "discussion" && _id == $id][0]{
      ...,
      biblePassage->,
      replies[]{
        ...,
        user->
      }
    }`

    const subscription = client.listen(query, { id: discussionId })
      .subscribe(update => {
        setDiscussion(update.result)
        setLoading(false)
      })

    return () => subscription.unsubscribe()
  }, [discussionId])

  return { discussion, loading }
}