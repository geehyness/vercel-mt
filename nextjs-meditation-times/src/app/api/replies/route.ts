import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity.client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const discussionId = searchParams.get('discussionId');

  if (!discussionId) {
    return NextResponse.json(
      { success: false, message: 'Missing discussionId parameter' },
      { status: 400 }
    );
  }

  try {
    const replies = await client.fetch(
      `*[_type == "reply" && discussion._ref == $discussionId && approved == true] | order(_createdAt desc) {
        _id,
        content,
        _createdAt,
        "author": author->{ _id, name }
      }`,
      { discussionId }
    );

    return NextResponse.json({ success: true, replies });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { discussionId, content, authorId } = await request.json();

    if (!discussionId || !content || !authorId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = getClient();
    const reply = await client.create({
      _type: 'reply',
      content,
      discussion: {
        _type: 'reference',
        _ref: discussionId
      },
      author: {
        _type: 'reference',
        _ref: authorId
      },
      approved: false,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Reply submitted for moderation',
      reply
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}