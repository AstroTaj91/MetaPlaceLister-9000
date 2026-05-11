import { Router, Request } from 'express';
import { publishToMarketplace } from '../services/playwright';

const router = Router();

router.post('/', async (req: Request, res) => {
  try {
    const { title, price, description, category, imageUrl } = req.body;
    
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    console.log(`Starting publish process for ${title}...`);
    const result = await publishToMarketplace(userId, { title, price, description, category, imageUrl });
    
    return res.json(result);
  } catch (error: any) {
    console.error('Publish Route Error:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during publishing.' });
  }
});

export default router;
