import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import router from "./routes/index.js";
import { globalErrorHandler } from "./middlewares/errorMiddleware.js";
import { NotFoundError } from "./utils/error.js";
import { ExpressAuth } from "@auth/express";
import { authConfig } from "./controllers/auth.js";
import { authenticatedUser, currentSession } from "./middlewares/auth.middleware.js";
import validatedEnv from "./utils/envSchema.js";

const app: Express = express();

// CORS configuration
const corsOptions = {
  origin: validatedEnv.NODE_ENV === 'production'
    ? validatedEnv.FRONTEND_URL 
    : true, // Allow all origins in development
  credentials: true, // Required for auth cookies
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Middleware
app.set('trust proxy', true); // Required for auth

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Increased limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set session in res.locals
app.use(currentSession)

// Request logging middleware (development only)
if (validatedEnv.NODE_ENV !== 'production') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: validatedEnv.NODE_ENV || 'development',
  });
});

// API routes

// Setup auth routes synchronously
console.log("🔧 Setting up auth routes...");
try {
  app.use("/auth", ExpressAuth(authConfig));
  console.log("✅ Auth routes configured successfully");
} catch (error) {
  console.error("❌ Failed to setup auth routes:", error);
  throw error;
}

app.use('/api/v1', router);

app.get("/auth/session", (req: Request, res: Response) => {
  res.json({session: res.locals.session});
});

app.get("/api/v1/authenticated", authenticatedUser, (req: Request, res: Response) => {
  res.json({message: "Authenticated"});
});

// 404 handler - must be after all routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Global error handler - must be last middleware
app.use(globalErrorHandler);

export default app;
