import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const options = {
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),
  ],
  secret: String(process.env.NEXTAUTH_SECRET),
  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
} as NextAuthOptions;

export default NextAuth(options);
