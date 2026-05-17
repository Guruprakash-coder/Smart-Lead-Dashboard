import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import userRoutes from './routes/user.routes';
const app = express();

// 1. Configure CORS to accept requests from both Localhost AND Vercel
const allowedOrigins = [
  'http://localhost:5173', 
  process.env.FRONTEND_URL // Render will read your Vercel URL from the dashboard
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
app.use('/api/users', userRoutes);

export default app;