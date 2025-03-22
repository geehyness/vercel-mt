"use client";

import Link from "next/link";
import { UserMenu } from "./UserMenu";

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Meditation Times
          </Link>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center text-gray-600 dark:text-gray-400">
            <Link
              href="/about"
              className="hover:text-gray-900 dark:hover:text-gray-100"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="hover:text-gray-900 dark:hover:text-gray-100"
            >
              Contact
            </Link>
            <UserMenu />
          </div>
        </div>
      </nav>
    </header>
  );
}