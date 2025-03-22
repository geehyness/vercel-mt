import CredentialsProvider from "@auth/core/providers/credentials";
import { client } from "@/lib/sanity.client"; // Your Sanity client
import bcryptjs from "bcryptjs"; // For password hashing and comparison

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Fetch the user from Sanity
        const user = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: credentials.email }
        );

        // If no user is found or the password is incorrect, return null
        if (!user || !(await bcryptjs.compare(credentials.password, user.password))) {
          return null;
        }

        // Return the user object if authentication is successful
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Required for encryption
  session: {
    strategy: "jwt", // Use JSON Web Tokens for session management
  },
  callbacks: {
    async session({ session, token }) {
      // Add user ID and role to the session object
      session.user.id = token.sub;
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      // Add user role to the JWT token
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
};