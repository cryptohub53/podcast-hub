import { type ExpressAuthConfig } from "@auth/express";
import Google from "@auth/express/providers/google";
import validatedEnv from "./envSchema";

const GOOGLE_CLIENT_ID = validatedEnv.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = validatedEnv.GOOGLE_CLIENT_SECRET; 
const AUTH_SECRET = validatedEnv.AUTH_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !AUTH_SECRET) {
  throw new Error("Missing required environment variables for auth setup");
} 

export const authConfig: ExpressAuthConfig = {
  trustHost: true,
  secret: AUTH_SECRET,
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
  },
};


