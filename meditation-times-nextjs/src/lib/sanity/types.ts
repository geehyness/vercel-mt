export interface SanityReply {
    _id: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: string;
  }
  
  export interface SanityDiscussion {
    _id: string;
    title: string;
    content: string;
    biblePassage?: string;
    authorId: string;
    authorName: string;
    authorEmail: string;
    createdAt: string;
    replies?: SanityReply[];
  }