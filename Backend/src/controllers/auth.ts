import { type ExpressAuthConfig } from "@auth/express";
import Google from "@auth/express/providers/google";
import Resend from "@auth/express/providers/resend";
import validatedEnv from "../utils/envSchema.js";
import { User } from "../models/index.js";
import { UserRole } from "../utils/constants.js";
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
      // Add user ID to session for easier access
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Store user ID in token
      if (user) {
        token.id = user.id;
      }

      // For OAuth providers, ensure user exists in database
      if (account && user?.email) {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // Create user if doesn't exist (OAuth sign-up)
          const newUser = await User.create({
            name: user.name || 'Unknown',
            email: user.email,
            provider: account.provider,
            role: UserRole.USER, // Default role
          });
          token.id = newUser._id.toString();
        } else {
          token.id = existingUser._id.toString();
        }
      }

      return token;
    },
    async redirect() {
      return validatedEnv.FRONTEND_URL;
    },
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


