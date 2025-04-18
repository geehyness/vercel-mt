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
      return NextResponse.json(
        { error: validation.error.errors[0].message },
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
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await client.create({
      _type: "user",
      name,
      email,
      password: hashedPassword,
      role: "user",
      emailVerified: false
    })

    // Omit password in response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}