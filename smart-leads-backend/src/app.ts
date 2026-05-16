import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';

const app = express();

// 1. Configure CORS with absolute preflight and origin options for your Vite frontend
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Parse incoming JSON payloads
app.use(express.json());

// 3. Basic Health Check Route (Great for testing if backend is alive)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is healthy and running smoothly!' });
});

// 4. Mount Application API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

export default app;