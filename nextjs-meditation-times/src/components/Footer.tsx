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
        <div className="footer-content">
          <div className="footer-main">
            <Link href="/" className="footer-logo">
              <span className="logo-link">Meditation Times</span>
            </Link>
            
            <div className="footer-verse">
              <h3 className="verse-heading">Joshua 1:8 (NKJV)</h3>
              <p className="verse-text">
                This Book of the Law shall not depart from your mouth, but you shall meditate 
                in it day and night, that you may observe to do according to all that is written 
                in it. For then you will make your way prosperous, and then you will have good success.
              </p>
            </div>

            <div className="footer-social">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="social-link">
                  <Icon className="social-icon" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} Meditation Times. All rights reserved.</p>
            <div className="legal-links">
              <Link href="/privacy" className="legal-link">Privacy Policy</Link>
              <span className="divider">|</span>
              <Link href="/terms" className="legal-link">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}