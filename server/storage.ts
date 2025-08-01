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
  financialProfiles,
  budgetCategories,
  transactions,
  financialInsights,
  simulationTemplates,
  userSimulations,
  exportHistory,
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
  type InsertSimulatorSession,
  type FinancialProfile,
  type InsertFinancialProfile,
  type BudgetCategory,
  type InsertBudgetCategory,
  type Transaction,
  type InsertTransaction,
  type FinancialInsight,
  type InsertFinancialInsight,
  type SimulationTemplate,
  type InsertSimulationTemplate,
  type UserSimulation,
  type InsertUserSimulation,
  type ExportHistory,
  type InsertExportHistory
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

  // Advanced Financial Profile methods
  getFinancialProfile(userId: string): Promise<FinancialProfile | undefined>;
  createFinancialProfile(profile: InsertFinancialProfile): Promise<FinancialProfile>;
  updateFinancialProfile(userId: string, profile: Partial<InsertFinancialProfile>): Promise<FinancialProfile | undefined>;

  // Budget Category methods
  getBudgetCategories(userId: string): Promise<BudgetCategory[]>;
  createBudgetCategory(category: InsertBudgetCategory): Promise<BudgetCategory>;
  updateBudgetCategory(id: string, category: Partial<InsertBudgetCategory>): Promise<BudgetCategory | undefined>;
  deleteBudgetCategory(id: string): Promise<boolean>;

  // Transaction methods
  getTransactions(userId: string, limit?: number, categoryId?: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<boolean>;
  getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]>;

  // Financial Insights methods
  getFinancialInsights(userId: string, type?: string, limit?: number): Promise<FinancialInsight[]>;
  createFinancialInsight(insight: InsertFinancialInsight): Promise<FinancialInsight>;
  markInsightAsRead(id: string): Promise<boolean>;
  getUnreadInsights(userId: string): Promise<FinancialInsight[]>;

  // Simulation Template methods
  getSimulationTemplates(category?: string, isPublic?: boolean): Promise<SimulationTemplate[]>;
  createSimulationTemplate(template: InsertSimulationTemplate): Promise<SimulationTemplate>;
  updateSimulationTemplate(id: string, template: Partial<InsertSimulationTemplate>): Promise<SimulationTemplate | undefined>;

  // User Simulation methods
  getUserSimulations(userId: string, limit?: number): Promise<UserSimulation[]>;
  createUserSimulation(simulation: InsertUserSimulation): Promise<UserSimulation>;
  updateUserSimulation(id: string, simulation: Partial<InsertUserSimulation>): Promise<UserSimulation | undefined>;
  deleteUserSimulation(id: string): Promise<boolean>;
  getSharedSimulation(shareToken: string): Promise<UserSimulation | undefined>;

  // Export History methods
  getExportHistory(userId: string, limit?: number): Promise<ExportHistory[]>;
  createExportHistory(exportData: InsertExportHistory): Promise<ExportHistory>;
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

  // Advanced Financial Profile methods
  async getFinancialProfile(userId: string): Promise<FinancialProfile | undefined> {
    const [profile] = await db.select().from(financialProfiles).where(eq(financialProfiles.userId, userId));
    return profile || undefined;
  }

  async createFinancialProfile(profile: InsertFinancialProfile): Promise<FinancialProfile> {
    const result = await db.insert(financialProfiles).values(profile).returning();
    return result[0];
  }

  async updateFinancialProfile(userId: string, profile: Partial<InsertFinancialProfile>): Promise<FinancialProfile | undefined> {
    const result = await db.update(financialProfiles).set({ ...profile, updatedAt: new Date() }).where(eq(financialProfiles.userId, userId)).returning();
    return result[0] || undefined;
  }

  // Budget Category methods
  async getBudgetCategories(userId: string): Promise<BudgetCategory[]> {
    return await db.select().from(budgetCategories).where(eq(budgetCategories.userId, userId)).orderBy(budgetCategories.createdAt);
  }

  async createBudgetCategory(category: InsertBudgetCategory): Promise<BudgetCategory> {
    const result = await db.insert(budgetCategories).values(category).returning();
    return result[0];
  }

  async updateBudgetCategory(id: string, category: Partial<InsertBudgetCategory>): Promise<BudgetCategory | undefined> {
    const result = await db.update(budgetCategories).set(category).where(eq(budgetCategories.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteBudgetCategory(id: string): Promise<boolean> {
    const result = await db.delete(budgetCategories).where(eq(budgetCategories.id, id));
    return result.rowCount! > 0;
  }

  // Transaction methods
  async getTransactions(userId: string, limit: number = 100, categoryId?: string): Promise<Transaction[]> {
    let query = db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(transactions.date).limit(limit);
    if (categoryId) {
      query = query.where(eq(transactions.categoryId, categoryId));
    }
    return await query;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  async updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const result = await db.update(transactions).set(transaction).where(eq(transactions.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const result = await db.delete(transactions).where(eq(transactions.id, id));
    return result.rowCount! > 0;
  }

  async getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(transactions.date);
  }

  // Financial Insights methods
  async getFinancialInsights(userId: string, type?: string, limit: number = 50): Promise<FinancialInsight[]> {
    let query = db.select().from(financialInsights).where(eq(financialInsights.userId, userId)).orderBy(financialInsights.createdAt).limit(limit);
    if (type) {
      query = query.where(eq(financialInsights.type, type));
    }
    return await query;
  }

  async createFinancialInsight(insight: InsertFinancialInsight): Promise<FinancialInsight> {
    const result = await db.insert(financialInsights).values(insight).returning();
    return result[0];
  }

  async markInsightAsRead(id: string): Promise<boolean> {
    const result = await db.update(financialInsights).set({ isRead: true }).where(eq(financialInsights.id, id));
    return result.rowCount! > 0;
  }

  async getUnreadInsights(userId: string): Promise<FinancialInsight[]> {
    return await db.select().from(financialInsights).where(eq(financialInsights.userId, userId)).orderBy(financialInsights.createdAt);
  }

  // Simulation Template methods
  async getSimulationTemplates(category?: string, isPublic: boolean = true): Promise<SimulationTemplate[]> {
    let query = db.select().from(simulationTemplates).where(eq(simulationTemplates.isPublic, isPublic)).orderBy(simulationTemplates.usageCount);
    if (category) {
      query = query.where(eq(simulationTemplates.category, category));
    }
    return await query;
  }

  async createSimulationTemplate(template: InsertSimulationTemplate): Promise<SimulationTemplate> {
    const result = await db.insert(simulationTemplates).values(template).returning();
    return result[0];
  }

  async updateSimulationTemplate(id: string, template: Partial<InsertSimulationTemplate>): Promise<SimulationTemplate | undefined> {
    const result = await db.update(simulationTemplates).set(template).where(eq(simulationTemplates.id, id)).returning();
    return result[0] || undefined;
  }

  // User Simulation methods
  async getUserSimulations(userId: string, limit: number = 50): Promise<UserSimulation[]> {
    return await db.select().from(userSimulations).where(eq(userSimulations.userId, userId)).orderBy(userSimulations.updatedAt).limit(limit);
  }

  async createUserSimulation(simulation: InsertUserSimulation): Promise<UserSimulation> {
    const result = await db.insert(userSimulations).values(simulation).returning();
    return result[0];
  }

  async updateUserSimulation(id: string, simulation: Partial<InsertUserSimulation>): Promise<UserSimulation | undefined> {
    const result = await db.update(userSimulations).set({ ...simulation, updatedAt: new Date() }).where(eq(userSimulations.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteUserSimulation(id: string): Promise<boolean> {
    const result = await db.delete(userSimulations).where(eq(userSimulations.id, id));
    return result.rowCount! > 0;
  }

  async getSharedSimulation(shareToken: string): Promise<UserSimulation | undefined> {
    const [simulation] = await db.select().from(userSimulations).where(eq(userSimulations.shareToken, shareToken));
    return simulation || undefined;
  }

  // Export History methods
  async getExportHistory(userId: string, limit: number = 50): Promise<ExportHistory[]> {
    return await db.select().from(exportHistory).where(eq(exportHistory.userId, userId)).orderBy(exportHistory.createdAt).limit(limit);
  }

  async createExportHistory(exportData: InsertExportHistory): Promise<ExportHistory> {
    const result = await db.insert(exportHistory).values(exportData).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
