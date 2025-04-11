import { createClient } from '@sanity/client'
import type { SanityClient } from '@sanity/client'

// Configuration
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN
}

// Clients
const readClient: SanityClient = createClient({
  ...config,
  useCdn: true
})

const writeClient: SanityClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN
})

// Type definitions
interface Discussion {
  _id: string
  _type: 'discussion'
  title: string
  content: string
  biblePassage: {
    book: string
    chapter: number
    verseStart: number
    verseEnd?: number
  }
  authorRef: string
  authorName: string
  authorEmail: string
  createdAt: string
  updatedAt?: string
  isFeatured?: boolean
}

interface ReplyInput {
  content: string
  discussionId: string
  authorRef: string
  authorName: string
  authorEmail: string
}

// Discussion Operations
export async function createDiscussion(doc: Omit<Discussion, '_id' | '_type' | 'createdAt'>): Promise<Discussion> {
  return await writeClient.create({
    _type: 'discussion',
    createdAt: new Date().toISOString(),
    ...doc
  })
}

export async function getDiscussionById(id: string): Promise<Discussion | null> {
  return await readClient.fetch(`
    *[_type == "discussion" && _id == $id][0] {
      ...,
      "replies": *[_type == "reply" && discussion._ref == ^._id] | order(createdAt asc) {
        _id,
        content,
        authorName,
        createdAt
      }
    }
  `, { id })
}
export async function getDiscussionsByAuthor(authorId: string): Promise<Discussion[]> {
  return await readClient.fetch(`
    *[_type == "discussion" && authorRef == $authorId] | order(createdAt desc) {
      ...,
      "replies": count(*[_type == "reply" && discussion._ref == ^._id])
    }
  `, { authorId })
}

export async function updateDiscussion(id: string, doc: Partial<Discussion>): Promise<Discussion> {
  return await writeClient.patch(id)
    .set({ ...doc, updatedAt: new Date().toISOString() })
    .commit()
}

export async function deleteDiscussion(id: string): Promise<void> {
  await writeClient.delete(id)
}

export async function discussionExists(id: string): Promise<boolean> {
  const count: number = await readClient.fetch(
    `count(*[_type == "discussion" && _id == $id])`,
    { id }
  )
  return count > 0
}

// Reply Operations
export async function createReply({
  content,
  discussionId,
  authorRef,
  authorName,
  authorEmail
}: ReplyInput) {
  return await writeClient.create({
    _type: 'reply',
    content,
    discussion: {
      _type: 'reference',
      _ref: discussionId
    },
    authorRef,
    authorName,
    authorEmail,
    createdAt: new Date().toISOString()
  })
}

export async function getRepliesForDiscussion(discussionId: string) {
  return await readClient.fetch(`
    *[_type == "reply" && discussion._ref == $discussionId] | order(createdAt asc) {
      _id,
      content,
      authorName,
      authorEmail,
      createdAt
    }
  `, { discussionId })
}


const sanityClients = {
  read: readClient,
  write: writeClient
};

export default sanityClients;