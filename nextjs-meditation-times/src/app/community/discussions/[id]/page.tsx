'use client';

import { readClient } from "@/lib/sanity/client";
import { PortableText } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Replies from "@/components/Replies";
import './../../../styles.css';

interface Author {
  _id: string;
  name: string;
}

interface BiblePassage {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  text?: string;
}

interface Discussion {
  _id: string;
  title: string;
  content: any;
  biblePassage: BiblePassage;
  author: Author;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
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
  author->{ _id, name },
  isFeatured,
  createdAt,
  updatedAt
}`;

export default function DiscussionPage() {
  const { id } = useParams();
  const discussionId = id?.toString() || "";
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const data = await readClient.fetch<Discussion>(DISCUSSION_QUERY, { id: discussionId });
        if (data) {
          setDiscussion(data);
        } else {
          notFound();
        }
      } catch (err) {
        console.error("Error fetching discussion:", err);
        setError("Failed to load discussion.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussion();
  }, [discussionId]);

  if (loading) return <div className="loading">Loading discussion...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!discussion) return null;

  const {
    title,
    content,
    biblePassage,
    author,
    isFeatured,
    createdAt,
    updatedAt
  } = discussion;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const passageText = biblePassage.verseEnd
    ? `${biblePassage.book} ${biblePassage.chapter}:${biblePassage.verseStart}-${biblePassage.verseEnd}`
    : `${biblePassage.book} ${biblePassage.chapter}:${biblePassage.verseStart}`;

  return (
    <div className="discussion-page">
      <main className="discussion-container">
        <div className="back-link-container">
          <Link href="/community/discussions" className="back-link">
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
              <div className="meta-item author">{author?.name || "Anonymous"}</div>
              <div className="meta-item date">{formattedDate}</div>
              {updatedAt && (
                <div className="meta-item updated">
                  Updated {new Date(updatedAt).toLocaleDateString()}
                </div>
              )}
              <div className="meta-item passage">{passageText}</div>
            </div>
          </header>

          {biblePassage.text && (
            <section className="bible-passage">
              <h2 className="passage-reference">{passageText}</h2>
              <p className="passage-text">{biblePassage.text}</p>
            </section>
          )}

          
{/* Display Discussion Content (assuming it's a string) */}
      {/* Add a check to ensure content exists and is a string */}
      {content && typeof content === 'string' && (
        <section className="discussion-content"> {/* Use a class for styling the content section */}
          <p className="discussion-paragraph">{content}</p> {/* Use a class for styling paragraphs */}
        </section>
      )}
        </article>

        <Replies 
          discussionId={discussionId} 
          discussionAuthorId={author._id} 
        />
      </main>

      <style jsx>{`
        .discussion-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        .back-link-container {
          margin-bottom: 2rem;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }
        .back-arrow-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.5rem;
        }
        .discussion-article {
          margin-bottom: 3rem;
        }
        .discussion-header {
          margin-bottom: 2rem;
        }
        .featured-badge {
          display: inline-block;
          background: #f59e0b;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        .discussion-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          color: #1f2937;
        }
        .discussion-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
        }
        .meta-item {
          display: flex;
          align-items: center;
        }
        .meta-item.author {
          font-weight: 500;
          color: #1f2937;
        }
        .bible-passage {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin: 2rem 0;
        }
        .passage-reference {
          font-size: 1.25rem;
          margin: 0 0 1rem 0;
          color: #1e40af;
        }
        .passage-text {
          margin: 0;
          line-height: 1.6;
          color: #374151;
        }
        .discussion-content {
          line-height: 1.8;
          color: #374151;
        }
        .discussion-content :global(p) {
          margin: 1.5rem 0;
        }
        .loading {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }
        .error {
          text-align: center;
          padding: 2rem;
          color: #dc2626;
        }
      `}</style>
    </div>
  );
}