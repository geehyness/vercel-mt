import { NextResponse } from "next/server";
import { client } from "@/lib/sanity.client";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Check if user exists
    const existingUser = await client.fetch(
      `count(*[_type == "user" && email == $email])`,
      { email }
    );

    if (existingUser > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const user = await client.create({
      _type: "user",
      name,
      email,
      password,
      role: "user",
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}