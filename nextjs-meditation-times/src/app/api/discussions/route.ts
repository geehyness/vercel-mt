// src/app/api/discussions/route.ts
import { NextResponse } from 'next/server';
import { createDiscussion } from '@/lib/sanity/queries';

export async function POST(request: Request) {
  try {
    // Destructure all required fields from the incoming JSON.
    const { question, details, biblePassage, userId, authorName, authorEmail } = await request.json();

    // Ensure a user ID is present.
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Build the payload with all required fields.
    const newDiscussionPayload = {
      title: question,
      content: details,
      biblePassage,       // Should be an object with properties like book, chapter, verseStart, verseEnd, text, etc.
      authorRef: userId,  // A simple reference to the user ID.
      authorName,         // The author's display name.
      authorEmail,        // The author's email.
      isFeatured: false,
    };

    // Call your helper to create the discussion.
    const createdDiscussion = await createDiscussion(newDiscussionPayload);

    // Return the created discussion's ID.
    return NextResponse.json({ discussionId: createdDiscussion._id });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json(
      { error: 'Failed to create discussion' },
      { status: 500 }
    );
  }
}
