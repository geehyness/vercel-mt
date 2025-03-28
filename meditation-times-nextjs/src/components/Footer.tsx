'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Skip rendering on auth pages
  if (['/auth/signin', '/auth/signup'].includes(pathname)) return null;

  return (
    <footer className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 border-t border-orange-200 dark:border-red-900 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold text-orange-800 dark:text-orange-100"
            >
              Meditation Times
            </Link>
            <p className="text-orange-700 dark:text-orange-200">
              Helping you find peace and mindfulness in your daily life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-100 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/community/discussions"
                  className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/kids"
                  className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100"
                >
                  Kids Corner
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-100 mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100"
                >
                  Meditation Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-100 mb-4">
              Newsletter
            </h3>
            <p className="text-orange-700 dark:text-orange-200 mb-4">
              Subscribe to get meditation tips and updates.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-md border border-orange-300 dark:border-orange-700 bg-white dark:bg-orange-800 text-orange-900 dark:text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-orange-200 dark:border-orange-800 mt-8 pt-8 text-center text-orange-700 dark:text-orange-300">
          <p>&copy; {new Date().getFullYear()} Meditation Times. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}