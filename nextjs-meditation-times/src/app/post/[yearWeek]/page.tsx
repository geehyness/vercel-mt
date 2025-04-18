// app/post/[yearWeek]/page.tsx
import { PortableText } from '@portabletext/react';
import type { SanityDocument } from '@sanity/client';
import { notFound } from 'next/navigation';
import { client, urlFor } from '@/lib/sanity.client';
import Image from 'next/image';
import Link from 'next/link';
import Comments from '@/components/Comments';
import AudioPlayButton from '@/components/AudioPlayButton';


import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { PortableTextBlock } from '@portabletext/types';

export interface CommentQueryResult {
  _id: string;
  comment: string;
  _createdAt: string;
  user: {
    _id: string;
    name: string;
  };
}

interface PostDocument extends SanityDocument {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  yearWeek: string;
  mainImage?: SanityImageSource;
  aiAudioAnalysis?: {
    asset?: {
      _ref: string;
      url: string;
    };
  };
  content: PortableTextBlock[];
  categories?: Array<{ _id: string; title: string }>;
  author?: { name: string };
  comments: CommentQueryResult[];
}

export async function generateStaticParams() {
  const query = `*[_type == "post"]{ "yearWeek": yearWeek }`;
  const rawPosts = await client.fetch(query);
  const paths =
    rawPosts
      ?.map((post: any) => {
        const yearWeekValue = post?.yearWeek;
        if (typeof yearWeekValue === 'string' && yearWeekValue) {
          return { yearWeek: yearWeekValue };
        }
        return null;
      })
      .filter(Boolean) || [];
  return paths;
}

export default async function PostPage({ params, searchParams }: any) {
  const resolvedParams =
    typeof params?.then === "function" ? await params : params;
  const { yearWeek } = resolvedParams;

  const post = await client.fetch<PostDocument>(
    `*[_type == "post" && yearWeek == $yearWeek][0]{
      _id,
      title,
      slug,
      publishedAt,
      yearWeek,
      mainImage { asset->{ url } },
      aiAudioAnalysis { asset->{ url } },
      content,
      categories[]->{_id, title},
      author->{name},
      "comments": *[_type == "comment" && post._ref == ^._id && approved == true]{
        _id,
        comment,
        _createdAt,
        user->{_id, name}
      } | order(_createdAt asc)
    }`,
    { yearWeek }
  );

  if (!post) {
    console.warn(`Post not found for yearWeek: ${yearWeek}`);
    notFound();
  }

  const audioUrl = post.aiAudioAnalysis?.asset?.url || null;
  const imageUrl = post.mainImage?.asset?.url || null;

  return (
    <main className="page-container">
      <div className="post-container">
        <Link href="/" className="filter-option back-link">
          ← Back to all posts
        </Link>

        <article className="post-card full-post">
          {imageUrl && (
            <div className="post-image-wrapper">
              <Image
                src={imageUrl}
                alt={post.title}
                width={800}
                height={450}
                className="post-image"
                priority
              />
            </div>
          )}

          <div className="post-details">
            <header className="post-header">
              <h1 className="post-title">{post.title}</h1>
              <div className="post-meta">
                <span className="post-author">
                  By {post.author?.name || "Pastor Nathanael"}
                </span>
                {post.publishedAt && (
                  <time dateTime={post.publishedAt} className="post-date">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
                {post.yearWeek && (
                  <span> (Year Week: {post.yearWeek})</span>
                )}
              </div>
            </header>

            <div className="post-content">
              <PortableText
                value={post.content}
                components={{
                  types: {
                    image: ({ value }) => (
                       value?.asset ? (
                         <Image
                           src={urlFor(value).url()}
                           alt={value.alt || "Post content image"}
                           width={800}
                           height={600}
                           className="post-content-image"
                         />
                       ) : null
                    ),
                  },
                }}
              />
            </div>

            {Array.isArray(post.categories) && post.categories.length > 0 && (
              <div className="post-categories">
                <strong>Categories:</strong>
                {post.categories.map((category, index) => (
                  <span key={category._id} className="post-category">
                    {category.title}
                    {Array.isArray(post.categories) && index < post.categories.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        {audioUrl && (
                <AudioPlayButton
                    src={audioUrl}
                    title={post.title}
                    artist={post.author?.name || 'AI Analysis'}
                    artworkUrl={imageUrl || undefined}
                    yearWeek={post.yearWeek}
                />
            )}

        <Comments postId={post._id} initialComments={post.comments || []} />

      </div>
    </main>
  );
}