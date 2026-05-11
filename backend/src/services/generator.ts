import OpenAI from 'openai';
import { VisionData } from './vision';
import { PricingData } from './pricing';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedListing {
  title: string;
  description: string;
}

export async function generateListingText(visionData: VisionData, pricingData: PricingData): Promise<GeneratedListing> {
  const prompt = `
You are an expert Facebook Marketplace copywriter. Generate a highly-converting, SEO-optimized listing title and description based on the following data:

Item Data:
- Name: ${visionData.item_name}
- Brand: ${visionData.brand || 'Unknown'}
- Condition: ${visionData.condition_assessment}
- Key Features: ${visionData.key_features.join(', ')}

Market Data:
- Suggested Price: $${pricingData.suggestedPrice}
- Market Range: $${pricingData.priceRange.low} - $${pricingData.priceRange.high}

RULES:
1. Title MUST be under 65 characters, keyword-rich, and include brand/condition.
2. Description Structure:
   - Hook: A friendly opening sentence.
   - Details: Bullet points of key features and exact condition.
   - Pricing Context: A brief note justifying the price (e.g., "Priced to sell at $X, currently trending for $Y online").
   - Logistics: End with "Cash or Venmo. Pickup in [City]".
3. Return ONLY a JSON object with "title" and "description" keys. No markdown blocks.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Cost efficient for text synthesis
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Failed to generate listing text");
  }

  try {
    return JSON.parse(content) as GeneratedListing;
  } catch (e) {
    throw new Error("Listing generator returned invalid JSON");
  }
}
