import Parser from 'rss-parser';
import { classifyNews } from './aiClassifier.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parser = new Parser({
  timeout: 10000,
});

const RSS_FEEDS = [
  // Hard News for Rushed Mode
  { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC World' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', source: 'New York Times' },
  
  // Positive, Science, Environment, Animals, and Lifestyle for Relaxed Mode
  { url: 'https://www.goodnewsnetwork.org/category/news/feed/', source: 'Good News Network' },
  { url: 'https://feeds.npr.org/1007/rss.xml', source: 'NPR Science & Environment' },
  { url: 'https://feeds.npr.org/1008/rss.xml', source: 'NPR Arts & Life' }
];

export const fetchAndProcessNews = async () => {
  try {
    console.log("Fetching live RSS feeds...");
    let allHeadlines = [];
    const ANIMAL_KEYWORDS = [
      'animal',
      'animals',
      'wildlife',
      'dog',
      'dogs',
      'cat',
      'cats',
      'monkey',
      'elephant',
      'bear',
      'lion',
      'tiger',
      'bird',
      'fish',
      'zoo',
      'pet',
      'rescue',
      'puppy',
      'kitten'
    ];
    const animalRegex = new RegExp(`\\b(${ANIMAL_KEYWORDS.join('|')})\\b`, 'i');

    for (const feed of RSS_FEEDS) {
      try {
        const feedData = await parser.parseURL(feed.url);
        // Grab top 5 from each source to interleave variety
        const topItems = feedData.items.slice(0, 5).map(item => {
          // Robust image extraction
          let imageUrl = null;
          
          if (item.enclosure && item.enclosure.url) {
            imageUrl = item.enclosure.url;
          } else if (item['media:content'] && item['media:content'].$) {
            imageUrl = item['media:content'].$.url;
          } else if (item['media:thumbnail'] && item['media:thumbnail'].$) {
            imageUrl = item['media:thumbnail'].$.url;
          } else {
            // Scrub content for <img> tag as fallback
            const imgMatch = (item.content || item.contentSnippet || "").match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) imageUrl = imgMatch[1];
          }

          return {
            title: item.title,
            url: item.link || '#',
            summary: item.contentSnippet || item.content || "No summary provided.",
            source: feed.source,
            image: imageUrl // New field
          };
        });
        
        allHeadlines.push(...topItems);
      } catch (err) {
        console.error(`Error fetching feed ${feed.source}:`, err.message);
      }
    }

    if (allHeadlines.length === 0) {
      console.log("No news fetched. Retrying later.");
      return;
    }

    // Extract likely animal-related headlines for the dedicated Animals mode
    const animalsCandidates = allHeadlines.filter((item) => {
      const haystack = `${item.title || ''} ${item.summary || ''}`;
      return animalRegex.test(haystack);
    });
    const animals = animalsCandidates.length > 0 ? animalsCandidates.slice(0, 15) : [];

    // Shuffle array slightly or just take top 25 to avoid overwhelming the LLM
    const top25 = allHeadlines.slice(0, 25);
    console.log(`Successfully fetched ${allHeadlines.length} items. Sending top ${top25.length} to AI Classifier...`);

    // Process with AI classifier
    const processedData = await classifyNews(top25);

    // Save back to data.json
    const dataPath = path.join(__dirname, '../data.json');
    fs.writeFileSync(
      dataPath,
      JSON.stringify(
        {
          rushed: processedData?.rushed || [],
          relaxed: processedData?.relaxed || [],
          animals,
        },
        null,
        2
      ),
      'utf8'
    );

    console.log("data.json successfully updated with live fetched & classified news.");
  } catch (error) {
    console.error("Critical error in fetchAndProcessNews:", error);
  }
};
