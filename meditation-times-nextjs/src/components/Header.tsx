'use client';

import Link from 'next/link';
import { useState } from 'react';
import { UserMenu } from './UserMenu';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`website-header ${false ? 'dark' : ''}`}>
      <nav className="header-nav">
        <div className="nav-container">
          {/* Logo */}
          <Link
            href="/"
            className="logo"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="logo-link">Meditation Times</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            <Link
              href="/about"
              className="nav-link"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="nav-link"
            >
              Contact
            </Link>
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <button
            className="mobile-menu-button md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Link
              href="/about"
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="mobile-user-menu-container">
              <UserMenu />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}