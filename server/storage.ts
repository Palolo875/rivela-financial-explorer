import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { 
  userProfiles, 
  moodEntries, 
  journalEntries, 
  chatConversations, 
  meditationSessions, 
  simulatorSessions,
  type UserProfile,
  type InsertUserProfile,
  type MoodEntry,
  type InsertMoodEntry,
  type JournalEntry,
  type InsertJournalEntry,
  type ChatConversation,
  type InsertChatConversation,
  type MeditationSession,
  type InsertMeditationSession,
  type SimulatorSession,
  type InsertSimulatorSession
} from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  // User Profile methods
  getUserProfile(id: string): Promise<UserProfile | undefined>;
  getUserProfileByUserId(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(id: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  
  // Mood Entry methods
  getMoodEntries(userId: string, limit?: number): Promise<MoodEntry[]>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  
  // Journal Entry methods
  getJournalEntries(userId: string, limit?: number): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  updateJournalEntry(id: string, entry: Partial<InsertJournalEntry>): Promise<JournalEntry | undefined>;
  
  // Chat Conversation methods
  getChatConversations(userId: string, limit?: number): Promise<ChatConversation[]>;
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  
  // Meditation Session methods
  getMeditationSessions(userId: string, limit?: number): Promise<MeditationSession[]>;
  createMeditationSession(session: InsertMeditationSession): Promise<MeditationSession>;
  
  // Simulator Session methods
  getSimulatorSessions(userId: string, limit?: number): Promise<SimulatorSession[]>;
  createSimulatorSession(session: InsertSimulatorSession): Promise<SimulatorSession>;
}

export class DatabaseStorage implements IStorage {
  // User Profile methods
  async getUserProfile(id: string): Promise<UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.id, id)).limit(1);
    return result[0];
  }

  async getUserProfileByUserId(userId: string): Promise<UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    return result[0];
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const result = await db.insert(userProfiles).values(profile).returning();
    return result[0];
  }

  async updateUserProfile(id: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const result = await db.update(userProfiles).set({ ...profile, updatedAt: new Date() }).where(eq(userProfiles.id, id)).returning();
    return result[0];
  }

  // Mood Entry methods
  async getMoodEntries(userId: string, limit: number = 50): Promise<MoodEntry[]> {
    return await db.select().from(moodEntries).where(eq(moodEntries.userId, userId)).orderBy(moodEntries.createdAt).limit(limit);
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const result = await db.insert(moodEntries).values(entry).returning();
    return result[0];
  }

  // Journal Entry methods
  async getJournalEntries(userId: string, limit: number = 50): Promise<JournalEntry[]> {
    return await db.select().from(journalEntries).where(eq(journalEntries.userId, userId)).orderBy(journalEntries.createdAt).limit(limit);
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const result = await db.insert(journalEntries).values(entry).returning();
    return result[0];
  }

  async updateJournalEntry(id: string, entry: Partial<InsertJournalEntry>): Promise<JournalEntry | undefined> {
    const result = await db.update(journalEntries).set({ ...entry, updatedAt: new Date() }).where(eq(journalEntries.id, id)).returning();
    return result[0];
  }

  // Chat Conversation methods
  async getChatConversations(userId: string, limit: number = 50): Promise<ChatConversation[]> {
    return await db.select().from(chatConversations).where(eq(chatConversations.userId, userId)).orderBy(chatConversations.createdAt).limit(limit);
  }

  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    const result = await db.insert(chatConversations).values(conversation).returning();
    return result[0];
  }

  // Meditation Session methods
  async getMeditationSessions(userId: string, limit: number = 50): Promise<MeditationSession[]> {
    return await db.select().from(meditationSessions).where(eq(meditationSessions.userId, userId)).orderBy(meditationSessions.createdAt).limit(limit);
  }

  async createMeditationSession(session: InsertMeditationSession): Promise<MeditationSession> {
    const result = await db.insert(meditationSessions).values(session).returning();
    return result[0];
  }

  // Simulator Session methods
  async getSimulatorSessions(userId: string, limit: number = 50): Promise<SimulatorSession[]> {
    return await db.select().from(simulatorSessions).where(eq(simulatorSessions.userId, userId)).orderBy(simulatorSessions.createdAt).limit(limit);
  }

  async createSimulatorSession(session: InsertSimulatorSession): Promise<SimulatorSession> {
    const result = await db.insert(simulatorSessions).values(session).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
