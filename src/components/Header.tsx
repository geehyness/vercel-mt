"use client";

import Link from "next/link";
import { UserMenu } from "./UserMenu";

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Meditation Times
          </Link>
          <div className="flex gap-6 items-center text-gray-600 dark:text-gray-400">
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