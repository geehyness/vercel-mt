// src/app/layout.tsx
// THIS FILE IS CORRECT - NO CHANGES NEEDED HERE
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Meditation Times',
  description: 'Your weekly devotional to meditate on.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          {/* This main tag is targeted by the CSS fix */}
          <main className="main-content">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}