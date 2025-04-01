import { SanityImageSource } from '@sanity/image-url/lib/types/types'

declare module '@sanity/client' {
  interface SanityClient {
    fetch<T = unknown>(query: string, params?: Record<string, unknown>): Promise<T>
  }
}

export interface Author {
  _id: string
  name: string
  slug: string
  bio?: string
  image?: SanityImageSource
}

export interface Discussion {
  _id: string
  title: string
  content: string
  biblePassage: {
    book: string
    chapter: number
    verseStart: number
    verseEnd?: number
  }
  author: {
    _ref: string
  }
  createdAt: string
}