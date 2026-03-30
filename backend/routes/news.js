import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const dataPath = path.join(__dirname, '../data.json');
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        const newsData = JSON.parse(fileContent);
        res.json(newsData);
    } catch (error) {
        console.error("Failed to read news data", error);
        res.status(500).json({ error: "Failed to load news" });
    }
});

export default router;
