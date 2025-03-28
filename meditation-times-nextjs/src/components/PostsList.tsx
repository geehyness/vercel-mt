"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react"; // Import loading spinner

// Interface definitions
interface ContentBlock {
  _type: string;
  children?: { text: string }[];
}

interface Author {
  _id: string;
  name: string;
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
  author?: {
    _ref: string;
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
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const [authorError, setAuthorError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Fetch all authors from the database
  useEffect(() => {
    async function fetchAuthors() {
      try {
        setLoadingAuthors(true);
        setAuthorError(null);
        
        const response = await fetch("/api/authors");
        if (!response.ok) {
          throw new Error(`Failed to load authors (${response.status})`);
        }
        const data = await response.json();
        setAuthors(data);
      } catch (error) {
        console.error("Failed to fetch authors:", error);
        setAuthorError("Error loading author information");
        setAuthors([{ _id: "default", name: "Pastor Nathanael Munashe-Takudzwa" }]);
      } finally {
        setLoadingAuthors(false);
      }
    }

    fetchAuthors();
  }, []);

  // Calculate years and highest year
  const allYears = [
    ...new Set([
      ...(yearlyMessages?.map((msg) => msg.year) || []),
      ...(allPosts?.map((post) => post.yearWeek.slice(0, 4)) || []),
    ]),
  ];

  const highestYear = allYears.length > 0
    ? allYears.reduce((a, b) => (a > b ? a : b))
    : new Date().getFullYear().toString();

  // Initialize selectedYear after authors load
  useEffect(() => {
    setSelectedYear(highestYear);
  }, [highestYear]);

  // Function to get author name by ID
  const getAuthorName = (authorRef: string) => {
    if (loadingAuthors) return <Loader2 className="h-4 w-4 animate-spin inline" />;
    if (authorError) return "Pastor Nathanael Munashe-Takudzwa";
    
    const author = authors.find((a) => a._id === authorRef);
    return author ? author.name : "Pastor Nathanael Munashe-Takudzwa";
  };

  // Function to get Sunday date from yearWeek
  const getSundayDate = (yearWeek: string): string => {
    const [year, week] = yearWeek.split("w").map(Number);
    const firstDayOfYear = new Date(year, 0, 1);
    const firstDayOfWeek = firstDayOfYear.getDay();
    const firstSunday = new Date(firstDayOfYear);
    firstSunday.setDate(firstDayOfYear.getDate() + (7 - firstDayOfWeek) % 7);
    const sundayDate = new Date(firstSunday);
    sundayDate.setDate(firstSunday.getDate() + (week - 1) * 7);

    return sundayDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter posts for selected year
  const filteredPosts = allPosts
    .filter((post) => post.yearWeek.startsWith(selectedYear))
    .slice(0, 12);

  const currentMessage = yearlyMessages.find((msg) => msg.year === selectedYear);
  const latestPost = filteredPosts[0] || null;

  if (!allPosts || allPosts.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        No posts available.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Section */}
      <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-orange-400 to-red-500">
        <div className="container mx-auto max-w-3xl p-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedYear}
            </h2>

            <hr className="my-4" />

            {currentMessage && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Year of {currentMessage.message}
                </h2>
                {currentMessage.description && (
                  <p className="text-gray-700 mb-4">
                    {currentMessage.description}
                  </p>
                )}
                <hr className="my-4" />
              </>
            )}

            {latestPost && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Latest Meditation Times
                </h4>
                <Link
                  href={`/post/${encodeURIComponent(latestPost.yearWeek)}`}
                  className="block hover:underline"
                >
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-lg">
                    <h5 className="text-lg font-bold text-white">
                      {latestPost.title} | Week {latestPost.yearWeek.slice(5)}
                    </h5>
                    <p className="mt-2 text-white line-clamp-2">
                      {getContentPreview(latestPost.content)}
                    </p>
                  </div>
                </Link>
                <p className="text-sm text-gray-500 mt-2">
                  {getSundayDate(latestPost.yearWeek)} |{" "}
                  {latestPost.author?._ref 
                    ? getAuthorName(latestPost.author._ref)
                    : "Pastor Nathanael Munashe-Takudzwa"}
                </p>
              </div>
            )}

            <div className="mt-4">
              <label htmlFor="year-select" className="mr-2 text-gray-700">
                Select Year:
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2"
                disabled={!selectedYear}
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
        <h3 className="text-xl font-semibold mb-4">
          Year of {currentMessage?.message || "Unknown"}
        </h3>

        <ul className="space-y-6">
          {filteredPosts.map((post) => (
            <li key={post._id} className="border-b border-gray-200 pb-6">
              <Link
                href={`/post/${encodeURIComponent(post.yearWeek)}`}
                className="block hover:underline"
              >
                <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-lg">
                  <h2 className="text-lg font-bold text-white">
                    {post.title} | Week {post.yearWeek.slice(5)}
                  </h2>
                </div>
                <p className="mt-2 text-gray-700 line-clamp-2">
                  {getContentPreview(post.content)}
                </p>
              </Link>
              <p className="text-sm text-gray-500 mt-2">
                {getSundayDate(post.yearWeek)} |{" "}
                {post.author?._ref
                  ? getAuthorName(post.author._ref)
                  : "Pastor Nathanael Munashe-Takudzwa"}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

// Content preview helper function
function getContentPreview(content: ContentBlock[], maxLength: number = 150): string {
  if (!content) return "";
  
  return content
    .filter(block => block._type === "block" && block.children)
    .flatMap(block => block.children!.map(child => child.text))
    .join(" ")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
    .trimEnd() + (content.length > maxLength ? "..." : "");
}