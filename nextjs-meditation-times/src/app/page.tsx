'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';

type Post = {
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

export default function PostsPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | 'all'>('all');
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all posts from Sanity
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await client.fetch<Post[]>(`*[
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
        }|order(yearWeek desc)`);

        setAllPosts(data);
        setFilteredPosts(data);

        // Extract unique years
        const uniqueYears = [...new Set(
          data.map(post => post.yearWeek.substring(0, 4))
        )].sort((a, b) => parseInt(b) - parseInt(a));

        setYears(uniqueYears);

        // Check for saved filter in localStorage
        const savedYear = localStorage.getItem('selectedYear');
        if (savedYear) {
          setSelectedYear(savedYear);
          if (savedYear !== 'all') {
            setFilteredPosts(data.filter(post => 
              post.yearWeek.startsWith(savedYear)
            ));
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle year filter changes
  const handleYearChange = (year: string | 'all') => {
    setSelectedYear(year);
    localStorage.setItem('selectedYear', year);

    if (year === 'all') {
      setFilteredPosts(allPosts);
    } else {
      setFilteredPosts(allPosts.filter(post => 
        post.yearWeek.startsWith(year)
      ));
    }
  };

  // Utility functions
  const formatYearWeekDisplay = (yearWeek: string): string => {
    if (!yearWeek || yearWeek.length < 7) return '';
    //const [year, week] = yearWeek.split('/w|-W/');
    //return `Year ${year}, Week ${week}`;
    return yearWeek.replace('w', ' - Week ')
  };

  const truncateText = (text?: string, maxLength: number = 256): string => {
    if (!text) return '';
    return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
  };

  if (loading) return <div className="loading">Loading posts...</div>;

  const latestPost = allPosts[0];
  const currentYear = new Date().getFullYear().toString();

  return (
    <main className="page-container">
      <div className="dashboard-header">
        <div className="year-message-container">
          <h2 className="year-heading">{currentYear}</h2>
          <h2 className="year-theme-heading">Year of Growth</h2>
          <p className="year-theme-text">
            2 Peter 3:18: &quot;But grow in the grace and knowledge of our Lord and Savior Jesus Christ...&quot;
          </p>
          <hr className="section-divider" />

          {latestPost && (
            <div className="latest-meditation-container">
              <h3 className="latest-meditation-title">Latest Meditation Times</h3>
              <Link 
                href={`/post/${latestPost.yearWeek}`} 
                className="latest-meditation-link"
              >
                
                <div className="post-card">
                  <div className="post-week-indicator">
                    {formatYearWeekDisplay(latestPost.yearWeek)}
                  </div>
    <br />
                  <div className="post-content-container">
                    {latestPost.mainImage?.asset?.url && (
                      <div className="post-image-wrapper">
                        <Image
                          src={client.image(latestPost.mainImage).url()}
                          alt={latestPost.mainImage.alt || latestPost.title}
                          width={600}
                          height={400}
                          loading="lazy"
                          className="post-image"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <div className="post-details">
                      <h2 className="post-title"><u>{latestPost.title}</u></h2>

                      <div className="post-meta">
                        <span className="post-author">
                          By {latestPost.author?.name || "Pastor Nathanael"}
                        </span>
                      </div>

                      {(latestPost.description || latestPost.content) && (
                        <p className="post-excerpt">
                          {truncateText(latestPost.description || latestPost.content)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>

<br/>
        <h2 className="year-heading">Filter Messages by Year</h2>

        <div className="year-filter">
          <span className="filter-label">Filter by Year:</span>
          <button
            onClick={() => handleYearChange('all')}
            className={`filter-option ${selectedYear === 'all' ? 'active' : ''}`}
          >
            All Years
          </button>
          {years.map(year => (
            <button
              key={year}
              onClick={() => handleYearChange(year)}
              className={`filter-option ${selectedYear === year ? 'active' : ''}`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="posts-timeline">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
                  <article key={post._id} className="post-card">
                    <Link href={`/post/${post.yearWeek}`} className="post-link">
            
              <div className="post-week-indicator">
                {formatYearWeekDisplay(post.yearWeek)}
              </div>
<br />
              <div className="post-content-container">
                {post.mainImage?.asset?.url && (
                  <div className="post-image-wrapper">
                    <Image
                      src={client.image(post.mainImage).url()}
                      alt={post.mainImage.alt || post.title}
                      width={600}
                      height={400}
                      loading="lazy"
                      className="post-image"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div className="post-details">
                    <h2 className="post-title">{post.title}</h2>
                  
                  <div className="post-meta">
                    <span className="post-author">
                      By {post.author?.name || "Pastor Nathanael"}
                    </span>
                  </div>

                  {(post.description || post.content) && (
                    <p className="post-excerpt">
                      {truncateText(post.description || post.content)}
                    </p>
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
              </Link>
            </article>
            

          ))
        ) : (
          <p className="no-posts-message">No posts found for the selected year.</p>
        )}
      </div>

      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        .dashboard-header {
          margin-bottom: 3rem;
        }
        .year-message-container {
          text-align: center;
          margin-bottom: 2rem;
        }
        .year-heading {
          font-size: 2.5rem;
          color: #2c3e50;
        }
        .section-divider {
          border: 0;
          height: 1px;
          background: #ddd;
          margin: 2rem auto;
          width: 80%;
        }
        .year-theme-heading {
          font-size: 1.8rem;
          color: #3498db;
        }
        .latest-meditation-container {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
        }
        .year-filter {
          margin: 2rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .filter-option {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          background: white;
        }
        .filter-option.active {
          background: #3498db;
          color: white;
          border-color: #3498db;
        }
        .posts-timeline {
          display: grid;
          gap: 2rem;
        }
        .post-card {
          border: 1px solid #eaeaea;
          border-radius: 8px;
          padding: 1.5rem;
          transition: box-shadow 0.3s ease;
        }
        .post-card:hover {
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .post-image-wrapper {
          margin-bottom: 1rem;
        }
        .post-image {
          border-radius: 4px;
        }
        /* Add more styles as needed */
      `}</style>
    </main>
  );
}