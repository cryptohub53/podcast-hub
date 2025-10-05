import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import configurePassport from "./auth/passport.js";
import authRoutes from "./routes/auth.js";

const PORT = process.env.PORT || 5000;

// --- Initialize Passport strategies ---
configurePassport();

// --- Mount routes ---
app.use("/auth", authRoutes);

// --- Connect DB and start server ---
connectDB(app, PORT);
