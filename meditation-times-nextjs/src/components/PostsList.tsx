"use client";

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";

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
  content: any;
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
  if (!allPosts || allPosts.length === 0) {
    return <div className="text-center text-gray-500">No posts available.</div>;
  }

  const availableYears = [...new Set(allPosts.map(post => post.yearWeek.slice(0, 4)))]
    .sort((a, b) => b.localeCompare(a));

  const initialSelectedYear = availableYears.length > 0 ? availableYears[0] : new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(initialSelectedYear);

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
                  {post.mainImage?.asset?.url ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={post.mainImage.asset.url}
                        alt={post.title}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-white bg-opacity-75 rounded-md p-2">
                    <h2 className="text-lg font-semibold">
                      {post.title}
                    </h2>
                  </div>
                </div>
                <p className="mt-2 text-gray-700 line-clamp-2">
                  {getContentPreview(post.content)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

function getContentPreview(content: any, maxLength: number = 150): string {
  if (!content || !Array.isArray(content)) return '';

  const text = content
    .map(block => {
      if (block._type === 'block' && block.children) {
        return block.children
          .map((child: any) => child.text)
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