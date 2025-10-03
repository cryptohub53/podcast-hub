import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

try {
  await connectDB(app, PORT);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Database connection failed", error);
  process.exit(1);
}