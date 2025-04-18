'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  if (['/auth/signin', '/auth/signup'].includes(pathname)) return null;

  return (
    <footer className="website-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Logo and description */}
          <div className="space-y-4">
            <Link
              href="/"
              className="footer-logo"
            >
              <span className="footer-logo-link">Meditation Times</span>
            </Link>

            <h3>
            Joshua 1:8 New King James Version (NKJV)
            </h3>
            <p className="footer-description">
            This Book of the Law shall not depart from your mouth, but you shall meditate in it day and night, that you may observe to do according to all that is written in it. For then you will make your way prosperous, and then you will have good success.
            </p>
            <div className="footer-social-icons">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="footer-social-icon">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links
          <div>
            <h3 className="footer-heading">
              Quick Links
            </h3>
            <ul className="footer-links-list">
              {['About', 'Blog', 'Guides', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase()}`}
                    className="footer-link"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Resources
          <div>
            <h3 className="footer-heading">
              Resources
            </h3>
            <ul className="footer-links-list">
              {['Meditation Techniques', 'Sleep Stories', 'Mindfulness Exercises', 'FAQ'].map((resource) => (
                <li key={resource}>
                  <Link
                    href={`/resources/${resource.toLowerCase().replace(/\s+/g, '-')}`}
                    className="footer-link"
                  >
                    {resource}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Newsletter 
          <div>
            <h3 className="newsletter-heading">
              Newsletter
            </h3>
            <p className="newsletter-description">
              Join our community for weekly mindfulness tips.
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Your email"
                className="newsletter-input"
              />
              <button
                type="submit"
                className="newsletter-button"
              >
                Subscribe
              </button>
            </form>
          </div> */}
        </div>

        {/* Copyright */}
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Meditation Times. All rights reserved.</p>
          <div className="copyright-links">
            <Link href="/privacy" className="copyright-link">
              Privacy Policy
            </Link>
            <Link href="/terms" className="copyright-link">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}