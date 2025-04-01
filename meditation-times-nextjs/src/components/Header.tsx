'use client';

import Link from 'next/link';
import { useState } from 'react';
import { UserMenu } from './UserMenu';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 border-b border-orange-200 dark:border-red-900 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-orange-800 dark:text-orange-100 hover:text-orange-600 dark:hover:text-orange-300 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Meditation Times
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/about"
              className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100 transition-colors duration-200"
            >
              About
            </Link>
            {/* Mobile menu button 
            <Link
              href="/community/discussions"
              className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100 transition-colors duration-200"
            >
              Community
            </Link>
            <Link
              href="/kids"
              className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100 transition-colors duration-200"
            >
              Kids
            </Link>*/}
            <Link
              href="/contact"
              className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100 transition-colors duration-200"
            >
              Contact
            </Link>
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-orange-800 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-2">
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-orange-800 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>{/*
            <Link
              href="/community/discussions"
              className="block px-3 py-2 rounded-md text-base font-medium text-orange-800 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </Link>
            <Link
              href="/kids"
              className="block px-3 py-2 rounded-md text-base font-medium text-orange-800 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Kids
            </Link>*/}
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-orange-800 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="px-3 py-2">
              <UserMenu />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}