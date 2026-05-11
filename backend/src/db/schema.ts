import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
});

export const userSessions = sqliteTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  encryptedCookies: text('encrypted_cookies').notNull(),
  iv: text('iv').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const listings = sqliteTable('listings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  imageUrl: text('image_url').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  suggestedPrice: integer('suggested_price').notNull(),
  status: text('status', { enum: ['draft', 'pending_review', 'approved_for_publishing', 'published', 'failed'] }).notNull().default('draft'),
  fbMarketplaceUrl: text('fb_marketplace_url'),
});
