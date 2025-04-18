// app/api/contact/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.name || !body.email || !body.message) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Send an email using your email service (e.g., SendGrid, Resend, etc.)
    // 2. Or store the message in your database
    // For now, we'll just log the message
    console.log('New contact form submission:');
    console.log(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}