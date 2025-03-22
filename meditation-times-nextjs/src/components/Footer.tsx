"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 border-t border-orange-200 dark:border-red-900 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-orange-800 dark:text-orange-200">
              &copy; {new Date().getFullYear()} Meditation Times
            </p>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100 transition-colors duration-200"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}