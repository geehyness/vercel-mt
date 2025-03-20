import { client } from "@/sanity/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PostsList from "@/components/PostsList";

interface Post {
  _id: string;
  title: string;
  yearWeek: string;
  content: any;
  mainImage: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
      url: string;
    };
  };
  createdAt: string;
  slug: {
    current: string;
  };
}

const POSTS_QUERY = `*[
  _type == "post"
  && defined(yearWeek)
  && defined(slug.current)
]{
  _id,
  title,
  yearWeek,
  content,
  mainImage,
  createdAt,
  slug
}|order(yearWeek desc)`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  try {
    console.log('Fetching all posts for year filtering...');
    const allPosts = await client.fetch<Post>(POSTS_QUERY, {}, options);
    console.log('Fetched all posts:', allPosts.length);

    if (!allPosts || allPosts.length === 0) {
      return (
        <div className="flex flex-col min-h-screen">
          
          <main className="container mx-auto max-w-3xl p-8 flex-grow">
            <h3 className="text-4xl font-bold mb-8">Posts</h3>
            <p className="text-gray-600">No posts found.</p>
          </main>
          
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen">
        
        <PostsList allPosts={allPosts} />
        
      </div>
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return (
      <div className="flex flex-col min-h-screen">
        
        <main className="container mx-auto max-w-3xl p-8 flex-grow">
          <h1 className="text-4xl font-bold mb-8">Error</h1>
          <p className="text-red-600">Failed to load posts. Please try again later.</p>
        </main>
        
      </div>
    );
  }
}