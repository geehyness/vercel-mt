import Link from 'next/link';
import { client } from '@/sanity/client';
import type { Post as SanityPost } from '@/lib/sanity/types';

import PostsTimelineClient from '@/components/PostsTimeline';
import YearFilter from '@/components/YearFilter';
import { extractYearFromYearWeek, formatYearWeekDisplay, truncateText } from '@/lib/utils';

const POSTS_QUERY = `*[
  _type == "post" && defined(slug.current) && defined(yearWeek)
]{
  _id,
  title,
  slug,
  publishedAt,
  yearWeek,
  mainImage,
  description,
  "content": coalesce(content[0].children[0].text, null),
  categories[]->{_id, title},
  author->{name}
}|order(yearWeek desc)`;

interface Post {
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
}

export default async function IndexPage() {
  const posts = await client.fetch<SanityPost[]>(POSTS_QUERY);

  const years = Array.from(new Set(posts.map(p => extractYearFromYearWeek(p.yearWeek))))
    .sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

  const currentYear = new Date().getFullYear().toString();
  const latestPost = posts[0];
  const themeDisplayYear = currentYear;

  return (
    <main className="page-container">
      <div className="dashboard-header">
        <div className="year-message-container">
          <h2 className="year-heading">{themeDisplayYear}</h2>
          <hr className="section-divider" />
          <h2 className="year-theme-heading">Year of Growth</h2>
          <p className="year-theme-text">2 Peter 3:18: &quot;But grow in the grace and knowledge of our Lord and Savior Jesus Christ. To him be glory both now and forevermore. Amen.&quot;</p>
          <hr className="section-divider" />

          <div className="latest-meditation-container">
            <h4 className="latest-meditation-title">Latest Meditation Times</h4>
            {latestPost ? (
              <Link href={`/post/${latestPost.yearWeek}`} className="latest-meditation-link">
                <div className="latest-meditation-card">
                  <h5 className="latest-meditation-card-title">
                    {latestPost.title} ({formatYearWeekDisplay(latestPost.yearWeek)})
                  </h5>
                  <p className="latest-meditation-card-excerpt">
                    {truncateText(latestPost.description) || truncateText(latestPost.content)}
                  </p>
                </div>
              </Link>
            ) : (
              <p>No latest meditation found.</p>
            )}
            {latestPost?.publishedAt && (
              <p className="latest-meditation-meta">
                {new Date(latestPost.publishedAt).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                })} | {latestPost?.author?.name ?? "Pastor Nathanael"}
              </p>
            )}
          </div>
        </div>

        <YearFilter years={years} />
      </div>

      <PostsTimelineClient posts={posts} />
    </main>
  );
}