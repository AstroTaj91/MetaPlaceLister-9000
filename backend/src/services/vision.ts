import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface VisionData {
  item_name: string;
  brand: string | null;
  model: string | null;
  category: string;
  condition_assessment: string;
  key_features: string[];
}

export async function identifyItemFromImage(base64Image: string, mimeType: string): Promise<VisionData> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert appraiser and item identifier. Analyze the provided image and return a JSON object with the following keys: `item_name` (short, descriptive), `brand` (if visible/known, else null), `model` (if visible/known, else null), `category` (best fit for Facebook Marketplace), `condition_assessment` (New, Like New, Good, Fair, Poor based on visual wear), and `key_features` (array of strings). Do not return markdown formatting, only raw JSON."
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please analyze this item."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Failed to get response from Vision API");
  }

  try {
    return JSON.parse(content) as VisionData;
  } catch (error) {
    throw new Error("Vision API returned invalid JSON");
  }
}
