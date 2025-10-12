import { type ExpressAuthConfig } from "@auth/express";
import Google from "@auth/express/providers/google";
import Resend from "@auth/express/providers/resend";
import validatedEnv from "../utils/envSchema.js";
import { User } from "../models/index.js";
import { sendVerificationRequest } from "../utils/email.auth.js";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../utils/db.client.js";

const GOOGLE_CLIENT_ID = validatedEnv.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = validatedEnv.GOOGLE_CLIENT_SECRET; 
const AUTH_SECRET = validatedEnv.AUTH_SECRET;
const AUTH_RESEND_KEY = validatedEnv.AUTH_RESEND_KEY;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !AUTH_SECRET || !AUTH_RESEND_KEY) {
  throw new Error("Missing required environment variables for auth setup");
} 

export const authConfig: ExpressAuthConfig = {
  trustHost: true,
  adapter: MongoDBAdapter(clientPromise),
  secret: AUTH_SECRET,
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      from: "podcast-hub@resend.dev",
      apiKey: AUTH_RESEND_KEY,
      sendVerificationRequest,
    })
  ],
  session: {
    strategy: "jwt", 
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async signIn({ user, account }){
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create({
          name: user.name || user.email?.split('@')[0] || 'User', // Fallback name for email users
          email: user.email,
          avatarUrl: user.image || null, // Email users won't have image
          provider: account?.provider || "unknown",
          favorites: [],
          recentlyPlayed: [],
        });
      }
      return true;
    }
  },
  events: {
    async signIn(message) {
      console.log("Sign in event:", message);
    },
    async signOut(message) {
      console.log("Sign out event:", message);
    },
  },
};


