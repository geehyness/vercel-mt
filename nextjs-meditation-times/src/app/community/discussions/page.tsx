import { readClient } from '@/lib/sanity/client'
import Link from 'next/link'
import { groq } from 'next-sanity'
import styles from './style.module.css'

interface Discussion {
  _id: string
  title: string
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
        title,
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
      <div className={styles.error}>
        Error loading discussions. Please try again later.
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bible Discussions</h1>
        <Link
          href="/community/discussions/new"
          className={styles.newDiscussionBtn}
          prefetch={false}
        >
          Start New Discussion
        </Link>
      </div>

      {discussions.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>No discussions yet</p>
          <Link
            href="/community/discussions/new"
            className={styles.newDiscussionBtn}
            prefetch={false}
          >
            Create First Discussion
          </Link>
        </div>
      ) : (
        <div className={styles.discussionList}>
          {discussions.map((discussion) => (
            <Link
              key={discussion._id}
              href={`/community/discussions/${discussion._id}`}
              className={styles.discussionCard}
              prefetch={false}
            >
              <h2 className={styles.discussionTitle}>{discussion.title}</h2>
              <p className={styles.discussionMeta}>
                {discussion.biblePassage ? 
                  `${discussion.biblePassage.book} ${discussion.biblePassage.chapter}:${discussion.biblePassage.verseStart}${discussion.biblePassage.verseEnd ? `-${discussion.biblePassage.verseEnd}` : ''}` : 
                  'No passage referenced'} •
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