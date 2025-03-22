"use client";

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";

interface ContentBlock {
  _type: string;
  children?: { text: string }[];
}

interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
    url: string;
  };
}

interface Post {
  _id: string;
  title: string;
  yearWeek: string;
  content: ContentBlock[];
  mainImage: SanityImage;
  createdAt: string;
  slug: {
    current: string;
  };
}

interface PostsListProps {
  allPosts: Post[];
}

export default function PostsList({ allPosts }: PostsListProps) {
  // Move useState to the top level
  const availableYears = allPosts
    ? [...new Set(allPosts.map(post => post.yearWeek.slice(0, 4)))].sort((a, b) => b.localeCompare(a))
    : [];

  const initialSelectedYear = availableYears.length > 0 ? availableYears[0] : new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(initialSelectedYear); // ✅ Correct: Hook is always called

  if (!allPosts || allPosts.length === 0) {
    return <div className="text-center text-gray-500">No posts available.</div>;
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  const filteredPosts = allPosts
    .filter(post => post.yearWeek.startsWith(selectedYear))
    .slice(0, 12);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto max-w-3xl p-8 flex-grow">
        <h3 className="text-4xl font-bold mb-4">Meditation Times</h3>
        <div className="mb-8">
          <label htmlFor="yearPicker" className="mr-2 font-semibold">Select Year:</label>
          <select
            id="yearPicker"
            value={selectedYear}
            onChange={handleYearChange}
            className="border rounded px-2 py-1"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <ul className="flex flex-col gap-y-4">
          {filteredPosts.map((post: Post) => (
            <li className="border-b border-gray-200 pb-4" key={post._id}>
              <Link 
                href={`/post/${encodeURIComponent(post.yearWeek)}`} 
                className="block hover:underline"
              >
                <div className="relative">
                <div 
  className="w-full rounded-lg flex items-center justify-center"
  style={{ 
    background: 'linear-gradient(to right, #333, aqua)', // Black to red gradient
    width: '100%', 
    height: '60px', // Reduced height
  }}
>
  <span className="text-gray-500"></span>
</div>
                  <div className="absolute top-2 left-2  bg-opacity-75 rounded-md p-2">
                    <h2 className="text-lg font-bold text-white">
                      {post.title}
                    </h2>
                  </div>
                </div>
                <p className="mt-2 text-gray-700 line-clamp-2">
                  {getContentPreview(post.content)}
                </p>
              </Link>
              <br />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

function getContentPreview(content: ContentBlock[], maxLength: number = 150): string {
  if (!content || !Array.isArray(content)) return '';

  const text = content
    .map(block => {
      if (block._type === 'block' && block.children) {
        return block.children
          .map((child) => child.text)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();

  return text.length > maxLength
    ? text.substring(0, maxLength) + '...'
    : text;
}