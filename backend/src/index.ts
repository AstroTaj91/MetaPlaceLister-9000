import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import analyzeRouter from './routes/analyze';
import authRouter from './routes/auth';
import publishRouter from './routes/publish';
import listingsRouter from './routes/listings';
import { requireAuth } from './middleware/auth';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/analyze', requireAuth, analyzeRouter);
app.use('/api/auth', authRouter);
app.use('/api/publish', requireAuth, publishRouter);
app.use('/api/listings', requireAuth, listingsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
