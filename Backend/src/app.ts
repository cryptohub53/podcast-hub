import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import router from "./routes";
import { globalErrorHandler } from "./middlewares/errorMiddleware";
import { NotFoundError } from "./utils/error";


const app: Express = express();

// CORS configuration
// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production' 
//     ? process.env.FRONTEND_URL || "https://podcast-hub-seven.vercel.app"
//     : "*", // Allow all origins in development
//   credentials: true,
//   optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (process.env.NODE_ENV !== 'production') {
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
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/v1', router);

// 404 handler - must be after all routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Global error handler - must be last middleware
app.use(globalErrorHandler);

export default app;
