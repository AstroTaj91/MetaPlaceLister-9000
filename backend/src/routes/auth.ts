import { Router } from 'express';
import { saveSessionCookies } from '../services/session';
import { registerUser, authenticateUser } from '../services/auth';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    
    const result = await registerUser(email, password);
    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    
    const result = await authenticateUser(email, password);
    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
});

router.post('/facebook', requireAuth, async (req, res) => {
  try {
    const { cookies } = req.body;
    
    if (!cookies || !Array.isArray(cookies)) {
      return res.status(400).json({ error: 'Invalid cookie array provided.' });
    }

    // Use the authenticated user's ID from the JWT
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    await saveSessionCookies(userId, cookies);
    
    return res.json({ success: true, message: 'Session encrypted and stored successfully.' });
  } catch (error: any) {
    console.error('Facebook Auth Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to securely store cookies.' });
  }
});

export default router;
