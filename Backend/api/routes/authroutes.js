import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Helper: create JWT token
const createJwt = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/* -------------------- LOCAL AUTH -------------------- */

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = new User({
      email: email.toLowerCase(),
      username,
      passwordHash,
      providers: [{ name: "local" }]
    });

    await user.save();

    const token = createJwt(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    res.json({ ok: true, user: { id: user._id, email: user.email, username: user.username } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.passwordHash) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = createJwt(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.json({ ok: true, user: { id: user._id, email: user.email, username: user.username } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

// Guest login
router.post("/guest", async (req, res) => {
  try {
    // Option 1: Create a new temporary guest user each time
    const guestUser = new User({
      email: `guest_${Date.now()}@example.com`,
      username: `Guest${Math.floor(Math.random() * 1000)}`,
      providers: [{ name: "guest" }],
    });

    await guestUser.save();

    const token = createJwt(guestUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.json({
      ok: true,
      user: { id: guestUser._id, email: guestUser.email, username: guestUser.username },
      guest: true,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to login as guest" });
  }
});



/* -------------------- OAUTH -------------------- */

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));
router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/auth/failed` }),
  (req, res) => {
    const token = createJwt(req.user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
    res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
  });

// GitHub OAuth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/auth/failed` }),
  (req, res) => {
    const token = createJwt(req.user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
    res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
  });

export default router;
