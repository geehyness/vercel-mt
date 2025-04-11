// Example update in src/lib/sanity/types.ts

export interface Discussion {
  _id: string;
  _type: 'discussion';
  title: string;
  content: string;
  biblePassage: {
    book: string;
    chapter: number;
    verseStart: number;
    verseEnd?: number;
  };
  author: {  // change here: use a nested author object
    _type: 'reference';
    _ref: string;
  };
  isFeatured: boolean;
  createdAt: string;
  replies?: SanityReply[];
}

// Then for creation, you can define:
export type NewDiscussion = Omit<Discussion, '_id' | '_type' | 'createdAt'>;

export type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  yearWeek: string;
  mainImage?: { asset: { url: string }; alt?: string };
  description?: string;
  content?: string;
  categories?: { _id: string; title: string }[];
  author?: { name: string };
};
