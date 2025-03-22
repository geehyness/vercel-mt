import { client } from "@/sanity/client";
// Remove this line: import { sanityFetch } from "@/sanity/live";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { defineQuery, PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const POST_QUERY = defineQuery(`*[
    _type == "post" &&
    yearWeek == $yearWeek
  ][0]{
    _id,
    title,
    yearWeek,
    content,
    mainImage,
    createdAt,
    slug
  }`);

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function PostPage({
  params,
}: {
  params: Promise<{ yearWeek: string }>;
}) {
  const resolvedParams = await params;
  const { yearWeek } = resolvedParams;
  console.log("Params in PostPage:", resolvedParams);

  // Use client.fetch instead of sanityFetch
  const post = await client.fetch(POST_QUERY, { yearWeek });

  if (!post) {
    notFound();
  }

  const {
    title,
    mainImage,
    content,
    createdAt,
  } = post;

  const postImageUrl = mainImage
    ? urlFor(mainImage)?.width(550).height(310).url()
    : null;

  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto grid gap-12 p-12 flex-grow">
        <div className="mb-4">
          <Link href="/">← Back to Meditation Times</Link>
        </div>
        <div className="grid items-top gap-12 sm:grid-cols-2">
          
          <div className="flex flex-col justify-center space-y-4">
            {title && (
              <h1 className="text-4xl font-bold tracking-tighter mb-8">
                {title}
              </h1>
            )}
            {formattedDate && <p className="text-sm text-gray-500">Published on: {formattedDate}</p>}
            {content && content.length > 0 && (
              <div className="prose max-w-none">
                <PortableText value={content} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}