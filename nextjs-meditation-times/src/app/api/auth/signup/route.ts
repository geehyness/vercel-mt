// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server"
import { client } from "@/lib/sanity/client"
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validation = schema.safeParse(body)

    if (!validation.success) {
      // Return detailed validation errors if possible
      const errors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      )
    }

    const { name, email, password } = validation.data

    // Check for existing user
    const existingUser = await client.fetch(
      `count(*[_type == "user" && email == $email])`,
      { email }
    )

    if (existingUser > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 } // Conflict status code
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user document
    const newUserDoc = {
        _type: "user",
        name,
        email,
        password: hashedPassword,
        role: "user", // Default role
        // emailVerified: false // Example: Set verification status if needed
    };

    const createdUser = await client.create(newUserDoc)

    // Omit password from the data sent back to client and stored in session
    const { ...userWithoutPassword } = createdUser

    // --- Auto-Login: Set session cookie ---
    const response = NextResponse.json(userWithoutPassword, { status: 201 }); // 201 Created status
    response.cookies.set({
      name: 'session',
      value: createdUser._id, // Use the new user's ID
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    // --- End Auto-Login ---

    return response // Return response with user data and cookie

  } catch (error) {
    console.error("Signup error:", error)
    // Provide a generic error message for security
    return NextResponse.json(
      { error: "An error occurred during sign up." },
      { status: 500 }
    )
  }
}