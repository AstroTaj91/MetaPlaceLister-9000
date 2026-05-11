import crypto from 'crypto';
import { db } from '../db';
import { userSessions } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const ENCRYPTION_KEY = process.env.SESSION_ENCRYPTION_KEY; // Must be 32 bytes (256 bits)
const ALGORITHM = 'aes-256-gcm';

export async function saveSessionCookies(userId: string, rawCookies: any[]) {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error('Invalid or missing SESSION_ENCRYPTION_KEY. Must be exactly 32 characters.');
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(JSON.stringify(rawCookies), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // We store the authTag appended to the encrypted string, or we can store it separately.
  // Let's store it as: authTag(16 bytes hex) + encrypted
  const finalEncrypted = authTag.toString('hex') + encrypted;

  // Check if session exists
  const existing = await db.select().from(userSessions).where(eq(userSessions.userId, userId));

  if (existing.length > 0) {
    await db.update(userSessions)
      .set({ 
        encryptedCookies: finalEncrypted, 
        iv: iv.toString('hex'), 
        updatedAt: new Date() 
      })
      .where(eq(userSessions.userId, userId));
  } else {
    await db.insert(userSessions).values({
      id: uuidv4(),
      userId,
      encryptedCookies: finalEncrypted,
      iv: iv.toString('hex'),
      updatedAt: new Date()
    });
  }
}

export async function getDecryptedCookies(userId: string): Promise<any[]> {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error('Invalid or missing SESSION_ENCRYPTION_KEY.');
  }

  const sessionRecord = await db.select().from(userSessions).where(eq(userSessions.userId, userId));
  
  if (sessionRecord.length === 0) {
    throw new Error('No Facebook session found. Please connect your account first.');
  }

  const session = sessionRecord[0];
  if (!session) {
    throw new Error('No Facebook session found. Please connect your account first.');
  }

  const { encryptedCookies, iv } = session;
  
  // Extract authTag and the rest
  const authTag = Buffer.from(encryptedCookies.slice(0, 32), 'hex');
  const encryptedText = encryptedCookies.slice(32);

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, 'hex'));
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}
