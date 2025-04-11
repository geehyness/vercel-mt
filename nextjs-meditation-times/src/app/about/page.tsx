import { defineQuery, PortableText, PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { client } from "@/lib/sanity.client";

interface AboutPageData {
  title?: string;
  missionTitle?: string;
  missionContent?: PortableTextBlock[];
  whoWeAreTitle?: string;
  whoWeAreContent?: PortableTextBlock[];
  whatYoullFindTitle?: string;
  whatYoullFindContent?: PortableTextBlock[];
}

const ABOUT_PAGE_QUERY = defineQuery(`*[
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
  const aboutData = await client.fetch(ABOUT_PAGE_QUERY) as AboutPageData;

  if (!aboutData) {
    return (
      <main className="container"> {/* Use your .container class */}
        <h1 className="page-title">About Us</h1> {/* Use your .page-title style */}
        <p>The content for this page is not yet available in the backend.</p>
        <p className="mt-8">
          <Link href="/" className=""> {/* Remove inline Tailwind, will inherit global a style */}
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
    <main className="container"> {/* Use your .container class */}
      {title && <h1 className="page-title">{title}</h1>} {/* Use your .page-title style */}

      {missionTitle && <h2 className="">{missionTitle}</h2>} {/* Will inherit h2 style */}
      {missionContent && (
        <div className="mb-4 prose max-w-none">
          <PortableText value={missionContent} />
        </div>
      )}

      {whoWeAreTitle && <h2 className="">{whoWeAreTitle}</h2>} {/* Will inherit h2 style */}
      {whoWeAreContent && (
        <div className="mb-4 prose max-w-none">
          <PortableText value={whoWeAreContent} />
        </div>
      )}

      {whatYoullFindTitle && <h2 className="">{whatYoullFindTitle}</h2>} {/* Will inherit h2 style */}
      {whatYoullFindContent && (
        <div className="mb-4 prose max-w-none">
          <PortableText value={whatYoullFindContent} />
        </div>
      )}

      <p className="mt-8">
        <Link href="/" className=""> {/* Remove inline Tailwind, will inherit global a style */}
          ← Back to Meditation Times
        </Link>
      </p>
    </main>
  );
}