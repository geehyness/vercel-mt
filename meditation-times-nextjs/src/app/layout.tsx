import type { Metadata } from "next";
import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";
import { SanityLive } from "@/sanity/live";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { sanityLiveClient } from "@/lib/sanity.client";
import { Loading } from "@/components/Loading"; // Import the Loading component

export const metadata: Metadata = {
  title: "Meditation Times",
  description: "Your daily source for mindfulness and meditation practices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <Providers>
          <Header />
          <main className="flex-grow pt-16 md:pt-20">{children}</main> {/* Add padding-top */}
          <Footer />
          <Loading /> {/* Add the Loading component here */}
        </Providers>
        <SanityLive client={sanityLiveClient} />
      </body>
    </html>
  );
}