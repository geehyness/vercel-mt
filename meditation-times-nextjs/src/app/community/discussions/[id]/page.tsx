import { readClient, writeClient } from "@/lib/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { PortableText } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReplyForm from "@/components/ReplyForm";

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
  content: any;
  biblePassage: BiblePassage;
  author: Author;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
  replies: Reply[];
}

const DISCUSSION_QUERY = `*[
  _type == "discussion" &&
  _id == $id
][0]{
  _id,
  title,
  content,
  biblePassage,
  author->{ _id, name, email },
  isFeatured,
  createdAt,
  updatedAt,
  replies[]->{
    _id,
    content,
    authorName,
    authorEmail,
    createdAt
  }
}`;

const { projectId, dataset } = readClient.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function DiscussionPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const discussion = await readClient.fetch<Discussion>(DISCUSSION_QUERY, { id });

  if (!discussion) {
    notFound();
  }

  const {
    title,
    content,
    biblePassage,
    author,
    isFeatured,
    createdAt,
    updatedAt,
    replies = []
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

  // Format Bible passage
  const passageText = biblePassage.verseEnd 
    ? `${biblePassage.book} ${biblePassage.chapter}:${biblePassage.verseStart}-${biblePassage.verseEnd}`
    : `${biblePassage.book} ${biblePassage.chapter}:${biblePassage.verseStart}`;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link 
            href="/community/discussions" 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1" 
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
        
        <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <header className="mb-6">
              {isFeatured && (
                <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-yellow-800 uppercase bg-yellow-200 rounded-full">
                  Featured Discussion
                </span>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  {author?.name || "Anonymous"}
                </div>
                
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {formattedDate}
                </div>
                
                {updatedDate && (
                  <div className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-1" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Updated {updatedDate}
                  </div>
                )}
                
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  {passageText}
                </div>
              </div>
            </header>
            
            <div className="prose max-w-none mb-8">
              <PortableText value={content} />
            </div>
          </div>
        </article>

        <section className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              Replies ({replies.length})
            </h2>
          </div>
          
          {replies.length > 0 ? (
            <div className="divide-y">
              {replies.map((reply) => (
                <div key={reply._id} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {reply.authorName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(reply.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {reply.authorEmail && (
                      <span className="text-sm text-gray-500">
                        {reply.authorEmail}
                      </span>
                    )}
                  </div>
                  <p className="whitespace-pre-line text-gray-700">
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No replies yet. Be the first to contribute!
            </div>
          )}
          
          <div className="p-6 border-t">
            <ReplyForm discussionId={id} />
          </div>
        </section>
      </main>
    </div>
  );
}