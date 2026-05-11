import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.SESSION_ENCRYPTION_KEY || 'default-secret';

export async function registerUser(email: string, passwordHashRaw: string) {
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    throw new Error('User already exists with this email.');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(passwordHashRaw, salt);

  const newUser = {
    id: uuidv4(),
    email,
    passwordHash,
  };

  await db.insert(users).values(newUser);

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
  return { token, userId: newUser.id, email: newUser.email };
}

export async function authenticateUser(email: string, passwordHashRaw: string) {
  const userRecords = await db.select().from(users).where(eq(users.email, email));
  if (userRecords.length === 0) {
    throw new Error('Invalid email or password.');
  }

  const user = userRecords[0];
  const isMatch = await bcrypt.compare(passwordHashRaw, user.passwordHash);

  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  return { token, userId: user.id, email: user.email };
}
