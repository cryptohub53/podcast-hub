import express from "express";
import cors from "cors";
import authRoutes from "./api/routes/auth.route.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'PodcastHub API is running',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

export default app;
