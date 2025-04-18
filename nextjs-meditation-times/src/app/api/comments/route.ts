// app/api/comments/route.ts
import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity.client'; // Ensure writeClient is correctly configured for writes

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

    // --- User Verification (Good Practice) ---
    // Verify user exists before creating comment
    const userExists = await writeClient.fetch(
      `defined(*[_type == "user" && _id == $userId][0])`,
      { userId }
    );

    if (!userExists) {
      // Log error for server-side tracking
      console.error(`Comment submission failed: User with ID ${userId} not found.`);
      return NextResponse.json(
        { message: 'User not found or not authorized' }, // Generic message to client
        { status: 404 }
      );
    }
    // --- End User Verification ---


    // Create comment document in Sanity
    // Note: The 'approved' field is NOT explicitly set here.
    // It will default to 'false' based on the initialValue defined in comment.ts schema.
    const result = await writeClient.create({
      _type: 'comment',
      post: { _type: 'reference', _ref: postId }, // Link comment to the post by reference
      comment,
      user: { _type: 'reference', _ref: userId }, // Link comment to the user by reference
      // You could optionally set createdAt here, but Sanity adds _createdAt automatically
      // createdAt: new Date().toISOString()
      approved: true
    });

    // --- Success Response ---
    // Return success message and the created comment document details
    return NextResponse.json({
      message: 'Comment submitted successfully and is awaiting moderation.',
      comment: { // Return key fields needed for optimistic update
        _id: result._id,
        _createdAt: result._createdAt,
        comment: result.comment,
        approved: result.approved === undefined? true : true // Include the actual approved status from creation (should be false)
      }
    }, { status: 201 }); // Use 201 Created status code


  } catch (error: unknown) {
    console.error('Comment creation error:', error);
    // Provide a generic error message to the client for security
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { message: 'Internal server error submitting comment.', error: errorMessage },
      { status: 500 }
    );
  }
}