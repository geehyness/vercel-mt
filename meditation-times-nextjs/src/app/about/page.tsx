import { defineQuery, PortableText, PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { client } from "@/lib/sanity.client"; // Import the Sanity client

// Define the TypeScript interface for the About Page data
interface AboutPageData {
  title?: string;
  missionTitle?: string;
  missionContent?: PortableTextBlock[];
  whoWeAreTitle?: string;
  whoWeAreContent?: PortableTextBlock[];
  whatYoullFindTitle?: string;
  whatYoullFindContent?: PortableTextBlock[];
}

const ABOUT_PAGE_QUERY = defineQuery(`*[ // Remove the generic type here
  _type == "aboutPage"
][0]{
  title,
  missionTitle,
  missionContent,
  whoWeAreTitle,
  whoWeAreContent,
  whatYoullFindTitle,
  whatYoullFindContent
}`);

export default async function AboutPage() {
  // Fetch data directly using the Sanity client
  const aboutData = await client.fetch(ABOUT_PAGE_QUERY) as AboutPageData; // Explicit type assertion here

  if (!aboutData) {
    return (
      <main className="container mx-auto max-w-3xl p-8">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p>The content for this page is not yet available in the backend.</p>
        <p className="mt-8">
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to Meditation Times
          </Link>
        </p>
      </main>
    );
  }

  const {
    title,
    missionTitle,
    missionContent,
    whoWeAreTitle,
    whoWeAreContent,
    whatYoullFindTitle,
    whatYoullFindContent,
  } = aboutData;

  return (
    <main className="container mx-auto max-w-3xl p-8">
      {title && <h1 className="text-4xl font-bold mb-6">{title}</h1>}

      {missionTitle && <h2 className="text-2xl font-bold mb-4">{missionTitle}</h2>}
      {missionContent && (
        <div className="mb-4 prose max-w-none">
          <PortableText value={missionContent} />
        </div>
      )}

      {whoWeAreTitle && <h2 className="text-2xl font-bold mb-4">{whoWeAreTitle}</h2>}
      {whoWeAreContent && (
        <div className="mb-4 prose max-w-none">
          <PortableText value={whoWeAreContent} />
        </div>
      )}

      {whatYoullFindTitle && <h2 className="text-2xl font-bold mb-4">{whatYoullFindTitle}</h2>}
      {whatYoullFindContent && (
        <div className="mb-4 prose max-w-none">
          <PortableText value={whatYoullFindContent} />
        </div>
      )}

      <p className="mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Meditation Times
        </Link>
      </p>
    </main>
  );
}