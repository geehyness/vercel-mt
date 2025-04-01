import { readClient } from "@/lib/sanity/client";
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
    updatedAt,
    slug,
    author->{ name },
    categories[]->{ title }
  }`);

const { projectId, dataset } = readClient.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

// Define the Category type
interface Category {
  title: string;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ yearWeek: string }>;
}) {
  const resolvedParams = await params;
  const { yearWeek } = resolvedParams;
  console.log("Params in PostPage:", resolvedParams);

  // Use readClient.fetch instead of sanityFetch
  const post = await readClient.fetch(POST_QUERY, { yearWeek });

  if (!post) {
    notFound();
  }

  const {
    title,
    mainImage,
    content,
    createdAt,
    updatedAt,
    author,
    categories,
  } = post;

  const postImageUrl = mainImage
    ? urlFor(mainImage)?.width(550).height(310).url()
    : null;

  const formattedDate = new Date(createdAt).toLocaleDateString();
  const updatedDate = updatedAt ? new Date(updatedAt).toLocaleDateString() : null;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto grid gap-12 p-12 flex-grow">
        <div className="mb-4">
          <Link href="/">← Back to Meditation Times</Link>
        </div>
        <div className="grid items-top gap-12 sm:grid-cols-2">
          {postImageUrl && (
            <Image
              src={postImageUrl}
              alt={title || "Post"}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              height="310"
              width="550"
            />
          )}
          <div className="flex flex-col justify-center space-y-4">
            {title && (
              <h1 className="text-4xl font-bold tracking-tighter mb-8">
                {title}
              </h1>
            )}
            {/* Published on using createdAt */}
            {formattedDate && (
              <p className="text-sm text-gray-500">
                Published on: {formattedDate}
              </p>
            )}
            {updatedDate && (
              <p className="text-sm text-gray-500">
                Last updated: {updatedDate}
              </p>
            )}
            {author?.name && (
              <p className="text-sm text-gray-500">
                Author: {author.name}
              </p>
            )}
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Categories:</span>
                {categories.map((category: Category) => (
                  <span
                    key={category.title}
                    className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}
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