import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { title, content, biblePassage } = await request.json();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if (!sessionId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (
      !title ||
      !content ||
      !biblePassage?.book ||
      !biblePassage?.chapter ||
      !biblePassage?.verseStart
    ) {
      return new NextResponse('Please provide all required discussion details', { status: 400 });
    }

    // Use sessionId as the user ID.
    const userId = sessionId;

    const mutations = [
      {
        create: {
          _type: 'discussion',
          title,
          content,
          biblePassage,
          author: { _type: 'reference', _ref: userId },
          isFeatured: false, // Default value
        },
      },
    ];

    const result = await client.mutate(mutations);
    return NextResponse.json({ message: 'Discussion created', result });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
