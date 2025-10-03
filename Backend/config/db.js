import mongoose from "mongoose";

const connectDB = async (app, PORT) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("App connected to database");

    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;