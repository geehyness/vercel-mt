import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

// Local font configuration with absolute paths
const inter = localFont({
  src: [
    {
      path: "/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "/fonts/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "/fonts/Inter-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Meditation Times",
  description: "Daily spiritual guidance through meditation and prayer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <AuthProvider>
          <Header />
          <main className="flex-grow pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}