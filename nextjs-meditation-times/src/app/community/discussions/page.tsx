import { readClient } from '@/lib/sanity/client'
import Link from 'next/link'
import { groq } from 'next-sanity'
import './style.css'

interface Discussion {
  _id: string
  title: string // Changed from question to title
  biblePassage?: {
    book: string;
    chapter: number;
    verseStart: number;
    verseEnd?: number;
  }
  replyCount?: number
  author?: {
    name: string;
  }
}

export default async function DiscussionsPage() {
  let discussions: Discussion[] = []

  try {
    discussions = await readClient.fetch<Discussion[]>(groq`
      *[_type == "discussion"] | order(_createdAt desc) {
        _id,
        title, // Changed from question to title
        biblePassage{
          book,
          chapter,
          verseStart,
          verseEnd
        },
        "replyCount": count(replies[]),
        "author": author->{name}
      }
    `)
  } catch (error) {
    console.error('Error fetching discussions:', error)
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-red-500">
        Error loading discussions. Please try again later.
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-500">Bible Discussions</h1>
        <Link
          href="/community/discussions/new"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          prefetch={false}
        >
          Start New Discussion
        </Link>
      </div>

      {discussions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No discussions yet</p>
          <Link
            href="/community/discussions/new"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            prefetch={false}
          >
            Create First Discussion
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <Link
              key={discussion._id}
              href={`/community/discussions/${discussion._id}`}
              className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              prefetch={false}
            >
              <h2 className="text-xl font-semibold">{discussion.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {discussion.biblePassage ? `${discussion.biblePassage.book} ${discussion.biblePassage.chapter}:${discussion.biblePassage.verseStart}${discussion.biblePassage.verseEnd ? `-${discussion.biblePassage.verseEnd}` : ''}` : 'No passage referenced'} •
                {(discussion.replyCount || 0)} replies •
                Started by {discussion.author?.name || 'Anonymous'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}