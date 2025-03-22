"use client";

import Link from "next/link";
import { UserMenu } from "./UserMenu";

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 border-b border-orange-200 dark:border-red-900 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Link
            href="/"
            className="text-2xl font-bold text-orange-800 dark:text-orange-100 hover:text-orange-600 dark:hover:text-orange-300 transition-colors duration-200"
          >
            Meditation Times
          </Link>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center text-orange-700 dark:text-orange-200">
            <Link
              href="/about"
              className="hover:text-orange-900 dark:hover:text-orange-100 transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="hover:text-orange-900 dark:hover:text-orange-100 transition-colors duration-200"
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