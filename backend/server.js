import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import newsRoutes from './routes/news.js';
import cron from 'node-cron';
import { fetchAndProcessNews } from './services/newsFetcher.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/news', newsRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  
  // Fetch immediately on startup
  console.log('Running initial news fetch...');
  fetchAndProcessNews();

  // Schedule news fetching every 10 minutes
  cron.schedule('*/10 * * * *', () => {
    console.log('Running scheduled news fetch...');
    fetchAndProcessNews();
  });
});
