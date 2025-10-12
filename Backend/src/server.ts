import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

// Load environment variables
dotenv.config();


const PORT: number = parseInt(process.env.PORT || "5000", 10);
const NODE_ENV: string = process.env.NODE_ENV || "development";

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to database first
    await connectDB();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`📅 Started at: ${new Date().toISOString()}`);
      
      if (NODE_ENV === 'development') {
        console.log(`🔗 Local URL: http://localhost:${PORT}`);
        console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    console.error("💥 Failed to start server:", error);
    
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    process.exit(1);
  }
};

// Start the server
startServer();