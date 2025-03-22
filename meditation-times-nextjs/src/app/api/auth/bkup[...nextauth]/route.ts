import { authOptions } from "@/lib/auth"; // Import your authOptions
import NextAuth from "next-auth";

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };