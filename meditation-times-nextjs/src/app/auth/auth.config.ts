import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [
    // Add your authentication providers here (e.g., GitHub, Google, etc.)
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub; // Add user ID to the session
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
};