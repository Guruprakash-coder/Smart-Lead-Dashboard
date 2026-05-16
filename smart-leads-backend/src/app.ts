import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';

// Mount Routes

const app: Application = express();

// Global Middlewares
app.use('/api/auth', authRoutes);
app.use(helmet()); // Secures your Express apps by setting various HTTP headers
app.use(cors()); // Enables Cross-Origin Resource Sharing (crucial for your React frontend)
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'Server is running smoothly' });
});

// Global Error Handling Middleware Placeholder (We will expand this later)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default app;