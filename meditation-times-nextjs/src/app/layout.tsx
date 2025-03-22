import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import "./globals.css"; // Assuming you have a global styles file
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Meditation Times", // Replace with your actual title
  description: "A website for meditation times and resources.", // Replace with your actual description
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}