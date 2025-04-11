// components/PostsTimeline.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';
import { formatYearWeekDisplay, truncateText } from '@/lib/utils'; // Assuming you'll create this utility file
import type { Post } from '@/lib/sanity/types';

interface PostsTimelineClientProps {
  posts: Post[];
}

function PostsTimelineClient({ posts }: PostsTimelineClientProps) {
  return (
    <div className="posts-timeline">
      {posts.length > 0 ? (
        posts.map((post) => {
          const previewText = truncateText(post.description) || truncateText(post.content);

          return (
            <article key={post._id} className="post-card">
              <div className="post-week-indicator">
                {formatYearWeekDisplay(post.yearWeek)}
              </div>

              <div className="post-content-container">
                {post.mainImage?.asset?.url && (
                  <div className="post-image-wrapper">
                    <Image
                      src={client.image(post.mainImage).url()}
                      alt={post.mainImage.alt || post.title}
                      className="post-image"
                      width={600}
                      height={400}
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div className="post-details">
                  <Link href={`/post/${post.yearWeek}`} className="post-link">
                    <h2 className="post-title">{post.title}</h2>
                  </Link>

                  <div className="post-meta">
                    <span className="post-author">
                      By {post.author?.name || "Pastor Nathanael"}
                    </span>
                  </div>

                  {previewText && (
                    <p className="post-excerpt">{previewText}</p>
                  )}

                  {post.categories?.length > 0 && (
                    <div className="post-categories">
                      {post.categories.map((category) => (
                        <span key={category._id} className="post-category">
                          {category.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })
      ) : (
        <p>No posts found for the selected year.</p>
      )}
    </div>
  );
}

export default PostsTimelineClient;