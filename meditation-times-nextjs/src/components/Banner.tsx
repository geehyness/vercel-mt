"use client";

import { useState } from "react";
import Image from "next/image";
import PostsList from "./PostsList";

interface ContentBlock {
  _type: string;
  children?: { text: string }[];
}

interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
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

interface YearMessage {
  _id: string;
  year: string;
  message: string;
  description?: string;
  bannerImage?: SanityImage;
}

interface BannerProps {
  yearlyMessages?: YearMessage[];
  allPosts: Post[];
}

export default function Banner({ yearlyMessages = [], allPosts }: BannerProps) {
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Banner Section */}
      <div className="relative flex-1 flex items-center justify-center p-8">
        {currentMessage?.bannerImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={currentMessage.bannerImage.asset.url}
              alt={`${selectedYear} Banner`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          </div>
        )}

        <div className="relative z-10 w-full max-w-4xl bg-white/90 dark:bg-gray-900/90 rounded-md shadow-md p-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {currentMessage?.message || "Meditation Times"}
          </h2>
          {currentMessage?.description && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              {currentMessage.description}
            </p>
          )}

          {/* Year Selector */}
          <div className="mb-8">
            <label htmlFor="year-select" className="mr-2 text-gray-700 dark:text-gray-300">
              Select Year:
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2"
            >
              {allYears.sort((a, b) => b.localeCompare(a)).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Latest Meditation Times Preview */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Meditation Times
            </h3>
            <PostsList filteredPosts={filteredPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}