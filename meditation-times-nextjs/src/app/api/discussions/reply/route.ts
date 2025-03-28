// ./src/app/api/discussions/route.ts
import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity/client';

export async function POST(request: Request) {
  try {
    const { question, details, biblePassage, book, chapter, verseStart, verseEnd, userId } = await request.json();

    if (!question || !details || !userId || !book || !chapter || !verseStart) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const discussionResult = await writeClient.create({
      _type: 'discussion',
      question,
      details,
      biblePassage: biblePassage || null, // Store the reference string
      book,
      chapter: parseInt(chapter),
      verseStart: parseInt(verseStart),
      verseEnd: verseEnd ? parseInt(verseEnd) : parseInt(verseStart),
      author: {
        _type: 'reference',
        _ref: userId,
      },
    });

    return NextResponse.json({ discussionId: discussionResult._id });
  } catch (error) {
    console.error('Error creating discussion in API route:', error);
    return NextResponse.json({ error: 'Failed to create discussion.' }, { status: 500 });
  }
}