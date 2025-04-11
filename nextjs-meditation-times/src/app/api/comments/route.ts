// app/api/comments/route.ts
import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity.client';

export async function POST(request: Request) {
  try {
    const { postId, comment, userId } = await request.json();

    // Validate required fields
    if (!postId || !comment || !userId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user exists
    const userExists = await writeClient.fetch(
      `defined(*[_type == "user" && _id == $userId][0])`,
      { userId }
    );

    if (!userExists) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Create comment
    const result = await writeClient.create({
      _type: 'comment',
      post: { _type: 'reference', _ref: postId },
      comment,
      user: { _type: 'reference', _ref: userId },
    });

    return NextResponse.json({
      message: 'Comment submitted for approval!',
      comment: result
    });

  } catch (error: unknown) {
    console.error('Comment creation error:', error);
    return NextResponse.json(
      { message: error || 'Internal server error' },
      { status: 500 }
    );
  }
}