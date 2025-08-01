import { pgTable, text, serial, integer, boolean, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profiles table
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  userType: text("user_type"),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Mood entries table
export const moodEntries = pgTable("mood_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  moodScore: integer("mood_score").notNull(),
  emotionEmoji: text("emotion_emoji"),
  energyLevel: integer("energy_level"),
  note: text("note"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Journal entries table
export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  entryType: text("entry_type"),
  isPrivate: boolean("is_private").default(true),
  moodBefore: integer("mood_before"),
  moodAfter: integer("mood_after"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Chat conversations table
export const chatConversations = pgTable("chat_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  emotionEmoji: text("emotion_emoji"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Meditation sessions table
export const meditationSessions = pgTable("meditation_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  sessionType: text("session_type").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  completed: boolean("completed").default(false),
  moodBefore: integer("mood_before"),
  moodAfter: integer("mood_after"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Simulator sessions table
export const simulatorSessions = pgTable("simulator_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  sessionType: text("session_type").notNull(),
  scenarioData: jsonb("scenario_data").notNull(),
  durationMinutes: integer("duration_minutes"),
  moodBefore: integer("mood_before"),
  moodAfter: integer("mood_after"),
  insights: text("insights"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).omit({
  id: true,
  createdAt: true,
});

export const insertMeditationSessionSchema = createInsertSchema(meditationSessions).omit({
  id: true,
  createdAt: true,
});

export const insertSimulatorSessionSchema = createInsertSchema(simulatorSessions).omit({
  id: true,
  createdAt: true,
});

// Export types
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;

export type MeditationSession = typeof meditationSessions.$inferSelect;
export type InsertMeditationSession = z.infer<typeof insertMeditationSessionSchema>;

export type SimulatorSession = typeof simulatorSessions.$inferSelect;
export type InsertSimulatorSession = z.infer<typeof insertSimulatorSessionSchema>;
