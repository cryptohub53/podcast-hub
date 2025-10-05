import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

/**
 * Initialize Passport strategies
 */
export default function configurePassport() {

  // --- Google OAuth Strategy ---
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase();
      if (!email) return done(new Error("Google account has no email"));

      let user = await User.findOne({ email });

      const providerObj = {
        name: "google",
        id: profile.id,
        profileUrl: profile.profileUrl || "",
      };

      if (user) {
        // Link Google if not already linked
        const alreadyLinked = user.providers.some(p => p.name === "google" && p.id === profile.id);
        if (!alreadyLinked) {
          user.providers.push(providerObj);
          await user.save();
        }
      } else {
        // Create new user
        user = new User({
          email,
          username: profile.displayName || email.split("@")[0],
          providers: [providerObj],
        });
        await user.save();
      }

      done(null, user);

    } catch (err) {
      done(err);
    }
  }));


  // --- GitHub OAuth Strategy ---
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ["user:email"]
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // GitHub may return multiple emails
      const emailObj = (profile.emails || []).find(e => e.primary) || profile.emails?.[0];
      const email = emailObj?.value?.toLowerCase();
      if (!email) return done(new Error("GitHub account has no email"));

      let user = await User.findOne({ email });

      const providerObj = {
        name: "github",
        id: profile.id,
        profileUrl: profile.profileUrl || "",
      };

      if (user) {
        const alreadyLinked = user.providers.some(p => p.name === "github" && p.id === profile.id);
        if (!alreadyLinked) {
          user.providers.push(providerObj);
          await user.save();
        }
      } else {
        user = new User({
          email,
          username: profile.username || email.split("@")[0],
          providers: [providerObj],
        });
        await user.save();
      }

      done(null, user);

    } catch (err) {
      done(err);
    }
  }));

  // --- Passport serialize/deserialize (not used for JWT but required) ---
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
