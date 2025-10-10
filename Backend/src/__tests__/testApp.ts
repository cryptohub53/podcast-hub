import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import router from "../routes";
import { globalErrorHandler } from "../middlewares/errorMiddleware";
import { NotFoundError } from "../utils/error";

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'test',
  });
});

// API routes
app.use('/api/v1', router);

// 404 handler - simplified for tests
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Global error handler - must be last middleware
app.use(globalErrorHandler);

export default app;
