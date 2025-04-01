import { NextResponse } from "next/server";
import { client } from "@/lib/sanity.client";
import bcryptjs from "bcryptjs"; // Use bcryptjs instead of bcrypt
import { z } from "zod";

// Define input validation schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Check if user exists
    const existingUser: number = await client.fetch(
      `count(*[_type == "user" && email == $email])`,
      { email }
    );

    if (existingUser > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const user = await client.create({
      _type: "user",
      name,
      email,
      password: hashedPassword, // Save the hashed password
      role: "user",
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error); // Log the error
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}