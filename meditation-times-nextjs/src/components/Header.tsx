"use client";

import Link from "next/link";
import { useState } from "react";
import { UserMenu } from "./UserMenu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 border-b border-orange-200 dark:border-red-900 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-orange-800 dark:text-orange-100 hover:text-orange-600 dark:hover:text-orange-300 transition-colors duration-200"
          >
            Meditation Times
          </Link>

          {/* Hamburger Menu Button (Mobile) */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-orange-800 dark:text-orange-200 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center text-orange-700 dark:text-orange-200">
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

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <Link
              href="/about"
              className="block py-2 text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100 transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100 transition-colors duration-200"
            >
              Contact
            </Link>
            <div className="py-2">
              <UserMenu />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}