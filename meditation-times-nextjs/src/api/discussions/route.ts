// app/api/discussions/route.ts
import { NextResponse } from 'next/server'
import { createDiscussion } from '@/lib/sanity/discussion'

export async function POST(request: Request) {
  try {
    const { 
      question, 
      details, 
      biblePassage,
      userId
    } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const newDiscussion = await createDiscussion({
      title: question,
      content: details,
      biblePassage,
      author: {
        _type: 'reference',
        _ref: userId
      }
    })

    return NextResponse.json({
      discussionId: newDiscussion._id
    })

  } catch (error) {
    console.error('Error creating discussion:', error)
    return NextResponse.json(
      { error: 'Failed to create discussion' },
      { status: 500 }
    )
  }
}