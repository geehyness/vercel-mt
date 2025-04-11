'use client';

import { readClient } from "@/lib/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { PortableText } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import Comments from "@/components/Comments";
import { useState, useEffect } from 'react';
import './../../../styles.css';
import { useParams } from 'next/navigation'; // Import useParams

interface Author {
  _id: string;
  name: string;
  email?: string;
}

interface BiblePassage {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  text?: string;
}

interface Reply {
  _id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
}

interface Discussion {
  _id: string;
  title: string;
  content: any; // Changed from string to any for compatibility with PortableText
  biblePassage: BiblePassage;
  author: Author;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
  replies?: Reply[];
}

const DISCUSSION_QUERY = `*[
  _type == "discussion" &&
  _id == $id
][0]{
  _id,
  title,
  content,
  biblePassage{
    book,
    chapter,
    verseStart,
    verseEnd,
    text
  },
  author->{ _id, name, email },
  isFeatured,
  createdAt,
  updatedAt,
  replies[]{
    _id,
    content,
    authorName,
    authorEmail,
    createdAt
  }
}`;

const { projectId, dataset } = readClient.config();
const urlForSanity = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;
console.log("url", urlForSanity)

interface CommentQueryResult {
  _id: string;
  comment: string;
  _createdAt: string;
  user: {
    _id: string;
    name: string;
  };
}

export default function DiscussionPage() { // Removed Props here
  const { id } = useParams();
const postId = id?.toString() || "";

  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readClient.fetch<Discussion>(DISCUSSION_QUERY, { id });
        if (data) {
          setDiscussion(data);
        } else {
          notFound();
        }
      } catch (err: unknown) {
        console.error("Error fetching discussion:", err);
        setError("Failed to load discussion.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p>Loading discussion...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!discussion) {
    return null;
  }

  const {
    title,
    content,
    biblePassage,
    author,
    isFeatured,
    createdAt,
    updatedAt,
    replies
  } = discussion;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const updatedDate = updatedAt ? new Date(updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;

  const passageText = biblePassage.verseEnd
    ? `${biblePassage.book} ${biblePassage.chapter}:${biblePassage.verseStart}-${biblePassage.verseEnd}`
    : `${biblePassage.book} ${biblePassage.chapter}:${biblePassage.verseStart}`;

  const adaptedComments: CommentQueryResult[] = replies ? replies.map(reply => ({
    _id: reply._id,
    comment: reply.content,
    _createdAt: reply.createdAt,
    user: {
      _id: reply.authorEmail || 'anonymous',
      name: reply.authorName || 'Anonymous',
    },
  })) : [];

  return (
    <div className="discussion-page">
      <main className="discussion-container">
        <div className="back-link-container">
          <Link
            href="/community/discussions"
            className="back-link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="back-arrow-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Discussions
          </Link>
        </div>

        <article className="discussion-article">
          <header className="discussion-header">
            {isFeatured && (
              <span className="featured-badge">
                Featured Discussion
              </span>
            )}

            <h1 className="discussion-title">{title}</h1>

            <div className="discussion-meta">
              <div className="meta-item">{author?.name || "Anonymous"}</div>
              <div className="meta-item">{formattedDate}</div>
              {updatedDate && <div className="meta-item">Updated {updatedDate}</div>}
              <div className="meta-item">{passageText}</div>
            </div>
          </header>

          {discussion.biblePassage.text && (
            <section className="bible-passage">
              <h2 className="bible-passage-title">{passageText}</h2>
              <p className="bible-passage-text">{discussion.biblePassage.text}</p>
            </section>
          )}

          <div className="discussion-content">
            <PortableText value={Array.isArray(content) ? content : [{ _type: "block", children: [{ text: content }] }]} />
          </div>
        </article>

        <section className="replies-section">
          <div className="replies-container">
            <Comments postId={postId} initialComments={adaptedComments} />
          </div>
        </section>
      </main>
    </div>
  );
}
