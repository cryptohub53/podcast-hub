import mongoose from "mongoose";
import { Express } from "express";

/**
 * Connect to MongoDB database
 * @param app - Express application instance (optional, for future use)
 * @param port - Port number (optional, for future use)
 */
const connectDB = async (app?: Express, port?: number): Promise<void> => {
  try {
    // Check if MONGODB_URI is provided
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    // Connect to MongoDB
    const connection = await mongoose.connect(mongoUri);
    
    console.log(`✅ Database connected successfully`);
    console.log(`📍 Connected to: ${connection.connection.host}`);
    console.log(`🗄️  Database: ${connection.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (error: Error) => {
      console.error('❌ Database connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  Database disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 Database reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🔒 Database connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during database disconnection:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error("❌ Database connection error:", error);
    
    // Log specific error details
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    process.exit(1);
  }
};

export default connectDB