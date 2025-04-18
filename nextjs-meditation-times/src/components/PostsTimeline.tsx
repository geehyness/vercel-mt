'use client';

import { useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';
import { formatYearWeekDisplay, truncateText, extractYearFromYearWeek } from '@/lib/utils';

export default function PostsTimelineClient({ allPosts, initialYear }: PostsTimelineClientProps) {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedYear = localStorage.getItem('selectedYear');
    if (storedYear) setSelectedYear(storedYear);
  }, []);

  const filteredPosts = useMemo(() => {
    return selectedYear === 'all'
      ? allPosts
      : allPosts.filter(post => 
          extractYearFromYearWeek(post.yearWeek) === selectedYear
        );
  }, [allPosts, selectedYear]);

  if (!isClient) {
    const initialPosts = initialYear === 'all'
      ? allPosts
      : allPosts.filter(post => 
          extractYearFromYearWeek(post.yearWeek) === initialYear
        );
    return <PostsList posts={initialPosts} />;
  }

  return <PostsList posts={filteredPosts} />;
}

function PostsList({ posts }: { posts: Post[] }) {
  return (
    <div className="posts-timeline">
      {posts.length > 0 ? (
        posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))
      ) : (
        <p className="no-posts-message">No posts found for the selected year.</p>
      )}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const previewText = truncateText(post.description || post.content);
  const imageUrl = post.mainImage?.asset 
    ? client.image(post.mainImage).width(600).height(400).url() 
    : null;

  return (
    <article className="post-card">
      <div className="post-week-indicator">
        {formatYearWeekDisplay(post.yearWeek)}
      </div>

      <div className="post-content-container">
        {imageUrl && (
          <div className="post-image-wrapper">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              width={600}
              height={400}
              loading="lazy"
              className="post-image"
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
              {post.categories.map(category => (
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
}