"use client";

import { useState } from "react";
import Link from "next/link";

interface ContentBlock {
  _type: string;
  children?: { text: string }[];
}

interface Post {
  _id: string;
  title: string;
  yearWeek: string;
  content: ContentBlock[];
  createdAt: string;
  slug: {
    current: string;
  };
}

interface YearMessage {
  _id: string;
  year: string;
  message: string;
  description?: string;
}

interface PostsListProps {
  allPosts: Post[];
  yearlyMessages?: YearMessage[];
}

export default function PostsList({ allPosts, yearlyMessages = [] }: PostsListProps) {
  // Extract all years from posts and messages
  const allYears = [
    ...new Set([
      ...(yearlyMessages?.map((msg) => msg.year) || []),
      ...(allPosts?.map((post) => post.yearWeek.slice(0, 4)) || []),
    ]),
  ];

  // Find the highest year in the database
  const highestYear = allYears.length > 0
    ? allYears.reduce((a, b) => (a > b ? a : b))
    : new Date().getFullYear().toString();

  // Initialize selectedYear to the highest year
  const [selectedYear, setSelectedYear] = useState<string>(highestYear);

  // Find the message for the selected year
  const currentMessage = yearlyMessages.find((msg) => msg.year === selectedYear);

  // Filter posts for the selected year
  const filteredPosts = allPosts
    .filter((post) => post.yearWeek.startsWith(selectedYear))
    .slice(0, 12);

  // Get the latest post for the selected year
  const latestPost = filteredPosts.length > 0 ? filteredPosts[0] : null;

  if (!allPosts || allPosts.length === 0) {
    return <div className="text-center text-gray-500">No posts available.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Section */}
      <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-orange-400 to-red-500">
        <div className="container mx-auto max-w-3xl p-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Year */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedYear}
            </h2>

            <hr />
            <br />

            {/* Year Message Title */}
            {currentMessage?.message && (
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Year of {currentMessage.message}
              </h2>
            )}

            {/* Year Message Description */}
            {currentMessage?.description && (
              <p className="text-gray-700 mb-4">
                {currentMessage.description}
              </p>
            )}

            <hr />
            <br />

            {/* Latest Post for Selected Year */}
            {latestPost && (
              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Latest Meditation Time
                </h4>
                <Link
                  href={`/post/${encodeURIComponent(latestPost.yearWeek)}`}
                  className="block hover:underline"
                >
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-lg">
                    <h5 className="text-lg font-bold text-white">
                      {latestPost.title} | Week {latestPost.yearWeek.slice(5, 8)}
                    </h5>
                    <p className="mt-2 text-white line-clamp-2">
                      {getContentPreview(latestPost.content)}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {/* Year Picker */}
            <div className="mt-4">
              <label htmlFor="year-select" className="mr-2 text-gray-700">
                Select Year:
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2"
              >
                {allYears.sort((a, b) => b.localeCompare(a)).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List Section */}
      <main className="container mx-auto max-w-3xl p-8">
        <br />

          <h4>Year of {currentMessage.message}</h4>

        <hr />
        <br />

        <ul className="flex flex-col gap-y-4">
          {filteredPosts.map((post: Post) => (
            <li className="border-b border-gray-200 pb-4" key={post._id}>
              <Link
                href={`/post/${encodeURIComponent(post.yearWeek)}`}
                className="block hover:underline"
              >
                <div className="relative">
                  <div className="w-full rounded-lg flex items-center justify-center bg-gradient-to-r from-orange-400 to-red-500 p-4">
                    <h2 className="text-lg font-bold text-white">
                      {post.title} | Week {post.yearWeek.slice(5, 8)}
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
  if (!content || !Array.isArray(content)) return "";

  const text = content
    .map((block) => {
      if (block._type === "block" && block.children) {
        return block.children.map((child) => child.text).join(" ");
      }
      return "";
    })
    .join(" ")
    .trim();

  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}