import { fetchAndProcessNews } from './services/newsFetcher.js';
import dotenv from 'dotenv';
dotenv.config();

console.log("Starting manual news update...");
fetchAndProcessNews().then(() => {
  console.log("Manual news update complete.");
  process.exit(0);
}).catch(err => {
  console.error("Manual update failed:", err);
  process.exit(1);
});
