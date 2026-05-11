import { Router, Request } from 'express';
import { db } from '../db';
import { listings } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const router = Router();

// Save a draft
router.post('/', async (req: Request, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { title, description, suggestedPrice, imageUrl, fbMarketplaceUrl, status } = req.body;

    if (!title || !description || suggestedPrice === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newListing = {
      id: uuidv4(),
      userId,
      title,
      description,
      suggestedPrice,
      imageUrl: imageUrl || '', // Will handle moving temp image to permanent storage if needed
      status: status || 'draft',
      fbMarketplaceUrl
    };

    await db.insert(listings).values(newListing);

    return res.json({ success: true, data: newListing });
  } catch (error: any) {
    console.error('Save Listing Error:', error);
    return res.status(500).json({ error: 'Failed to save listing' });
  }
});

// Get all drafts for user
router.get('/', async (req: Request, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const userListings = await db.select()
      .from(listings)
      .where(eq(listings.userId, userId))
      //.orderBy(desc(listings.id)); // Order by latest (assuming id or add created_at)

    return res.json({ success: true, data: userListings });
  } catch (error: any) {
    console.error('Fetch Listings Error:', error);
    return res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

export default router;
