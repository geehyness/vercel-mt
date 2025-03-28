import { readClient, writeClient } from './client';

interface BiblePassage {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  text?: string;
}

interface DiscussionInput {
  title: string;
  content: string;
  biblePassage: BiblePassage;
  authorRef: string;
  authorName: string;
  authorEmail: string;
}

interface ReplyInput {
  content: string;
  discussionId: string;
  authorRef: string;
  authorName: string;
  authorEmail: string;
}

// WRITE OPERATIONS
export async function createDiscussion({
  title,
  content,
  biblePassage,
  authorRef,
  authorName,
  authorEmail
}: DiscussionInput) {
  return writeClient.create({
    _type: 'discussion',
    title,
    content,
    biblePassage,
    author: {
      _type: 'reference',
      _ref: authorRef
    },
    authorName,
    authorEmail,
    isFeatured: false,
    createdAt: new Date().toISOString()
  });
}

export async function createReply({
  content,
  discussionId,
  authorRef,
  authorName,
  authorEmail
}: ReplyInput) {
  return writeClient.create({
    _type: 'reply',
    content,
    discussion: {
      _type: 'reference',
      _ref: discussionId
    },
    author: {
      _type: 'reference',
      _ref: authorRef
    },
    authorName,
    authorEmail,
    createdAt: new Date().toISOString()
  });
}

// READ OPERATIONS
export async function getDiscussionWithReplies(id: string) {
  return readClient.fetch(`
    *[_type == "discussion" && _id == $id][0] {
      _id,
      title,
      content,
      biblePassage,
      author->{
        _id,
        name,
        email,
        "avatar": image.asset->url
      },
      authorName,
      authorEmail,
      isFeatured,
      createdAt,
      "replies": *[_type == "reply" && discussion._ref == $id] | order(createdAt asc) {
        _id,
        content,
        author->{
          _id,
          name,
          "avatar": image.asset->url
        },
        authorName,
        createdAt
      }
    }
  `, { id });
}

// Additional read operations
export async function getFeaturedDiscussions() {
  return readClient.fetch(`
    *[_type == "discussion" && isFeatured == true] | order(createdAt desc) {
      _id,
      title,
      biblePassage,
      author->{
        name,
        "avatar": image.asset->url
      },
      createdAt
    }
  `);
}