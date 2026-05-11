import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export interface PricingData {
  suggestedPrice: number;
  priceRange: {
    low: number;
    high: number;
  };
  dataPoints: number;
}

export async function getMarketPricing(itemName: string): Promise<PricingData> {
  const query = encodeURIComponent(itemName);
  // Target eBay sold listings
  const targetUrl = `https://www.ebay.com/sch/i.html?_nkw=${query}&LH_Sold=1&LH_Complete=1`;

  const extractResponse = await firecrawl.extract([targetUrl], {
    prompt: "Extract the sold items from this eBay search results page.",
    schema: {
      type: "object",
      properties: {
        listings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              price_usd: { type: "number" },
              date_sold: { type: "string" }
            },
            required: ["title", "price_usd"]
          }
        }
      },
      required: ["listings"]
    }
  });

  if (!extractResponse.success || !extractResponse.data || !extractResponse.data.listings) {
    throw new Error("Failed to extract pricing data from Firecrawl");
  }

  const listings = extractResponse.data.listings;
  
  if (listings.length === 0) {
    // Fallback if no data is found
    return {
      suggestedPrice: 0,
      priceRange: { low: 0, high: 0 },
      dataPoints: 0
    };
  }

  // Calculate pricing metrics
  let prices = listings.map((l: any) => l.price_usd).filter((p: number) => !isNaN(p) && p > 0);
  
  if (prices.length === 0) {
     return {
      suggestedPrice: 0,
      priceRange: { low: 0, high: 0 },
      dataPoints: 0
    };
  }

  // Sort prices
  prices.sort((a: number, b: number) => a - b);

  // Simple outlier removal (remove top and bottom 10% if enough data)
  if (prices.length > 5) {
    const trimCount = Math.floor(prices.length * 0.1);
    prices = prices.slice(trimCount, prices.length - trimCount);
  }

  const sum = prices.reduce((a: number, b: number) => a + b, 0);
  const avg = sum / prices.length;
  // Suggested price is slightly below average for a "quick sell" on FB Marketplace
  const suggestedPrice = Math.round(avg * 0.9);

  return {
    suggestedPrice,
    priceRange: {
      low: prices[0],
      high: prices[prices.length - 1],
    },
    dataPoints: prices.length
  };
}
