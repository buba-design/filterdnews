import { GoogleGenAI } from '@google/genai';

const PROMPT = `You are a real-time news curator for an application called "FilterdNews" which presents two completely distinct emotional environments: "Rushed" and "Relaxed".
The user provides a JSON array of raw news headlines fetched from major RSS feeds today.
You must categorize EVERY headline into either the "rushed" bucket or the "relaxed" bucket.

"Rushed" news should:
- Include major political shakeups, conflicts, urgent breaking news, intense sports, or high-stakes developments.
- Provide a summary rewritten in short, urgent, ALL-CAPS TICKER style (e.g., "BREAKING: SITUATION INTENSIFIES IN REGION...").
- Evaluate the *primary subject's country* of the news headline. Provide a lowercase 2-letter ISO country code (e.g., "us", "de", "gb", "fr", "ru", "ir").
- Note: Do NOT use flags starting with the letter 'c' like "cn", "ca", or "cu" as the assets do not exist. If a news item is about China or Canada, use "un" or "eu" instead, or fall back to "us" if closely related. If it's global, European, or unclear, use "un" or "eu" respectively.

"Relaxed" news should:
- Include calm, positive, fascinating tech, heartwarming, or low-stakes lifestyle news. If news is inherently stressful, you must NOT put it in Relaxed. Just pick the best fits from the list. If you need to fill space, find a silver lining.
- Provide a summary rewritten in a calming, accessible, low-stress tone focusing on the silver lining.

Output EXACTLY AND ONLY valid JSON referencing this schema. Ensure URLs and sources from the input are carried over accurately:
{
  "rushed": [
    { "title": "ORIGINAL_HEADLINE_IN_ALL_CAPS", "summary": "REWRITTEN URGENT TICKER SUMMARY.", "source": "Source", "url": "URL", "image": "URL_OR_NULL", "countryCode": "us" }
  ],
  "relaxed": [
    { "title": "ORIGINAL_HEADLINE", "summary": "Rewritten peaceful summary focusing on positive aspects.", "source": "Source", "url": "URL", "image": "URL_OR_NULL" }
  ]
}`;

export const classifyNews = async (headlines) => {
  console.log(`Processing ${headlines.length} news items through Gemini AI Classifier...`);

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
    console.warn("WARNING: No GEMINI_API_KEY found! Returning empty data.");
    return { rushed: [], relaxed: [] };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
         PROMPT,
         `RAW HEADLINES:\n${JSON.stringify(headlines, null, 2)}`
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const outputText = response.text;
    console.log("Raw AI Response Length:", outputText?.length);
    console.log("Raw AI Response:", outputText);

    const jsonResult = JSON.parse(outputText);
    return jsonResult;
  } catch (error) {
    console.error("AI Classification Error:", error);
    return { rushed: [], relaxed: [] };
  }
};
