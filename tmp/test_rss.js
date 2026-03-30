import Parser from 'rss-parser';
const parser = new Parser();

const testFeeds = [
  'http://feeds.bbci.co.uk/news/world/rss.xml',
  'https://www.goodnewsnetwork.org/category/news/feed/',
  'https://feeds.npr.org/1007/rss.xml'
];

async function test() {
  for (const url of testFeeds) {
    console.log(`\n--- Testing ${url} ---`);
    const feed = await parser.parseURL(url);
    feed.items.slice(0, 3).forEach(item => {
      console.log(`Title: ${item.title}`);
      console.log(`Enclosure: ${JSON.stringify(item.enclosure)}`);
      console.log(`Content: ${item.content?.slice(0, 50)}...`);
      // Check for media:content
      const mediaContent = item['media:content'];
      if (mediaContent) console.log(`Media Content Found`);
    });
  }
}

test();
