import { pgTable, text, serial, integer, boolean, timestamp, uuid, jsonb, decimal, date } from "drizzle-orm/pg-core";
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

// Advanced Financial Data Tables
export const financialProfiles = pgTable("financial_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  monthlyIncome: decimal("monthly_income", { precision: 12, scale: 2 }),
  currency: text("currency").default("EUR"),
  riskTolerance: text("risk_tolerance"), // conservative, moderate, aggressive
  investmentExperience: text("investment_experience"),
  financialGoals: jsonb("financial_goals"), // array of goals with targets
  creditScore: integer("credit_score"),
  emergencyFund: decimal("emergency_fund", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const budgetCategories = pgTable("budget_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // income, fixed_expense, variable_expense, debt, investment
  budgetedAmount: decimal("budgeted_amount", { precision: 12, scale: 2 }),
  actualAmount: decimal("actual_amount", { precision: 12, scale: 2 }),
  color: text("color"),
  icon: text("icon"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  categoryId: uuid("category_id"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  date: date("date").notNull(),
  type: text("type").notNull(), // income, expense, transfer
  tags: text("tags").array(),
  isRecurring: boolean("is_recurring").default(false),
  recurringFrequency: text("recurring_frequency"), // weekly, monthly, yearly
  merchantName: text("merchant_name"),
  isHiddenFee: boolean("is_hidden_fee").default(false),
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // AI confidence score
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const financialInsights = pgTable("financial_insights", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  type: text("type").notNull(), // trend, prediction, recommendation, alert
  title: text("title").notNull(),
  description: text("description"),
  data: jsonb("data"), // detailed insight data
  severity: text("severity"), // low, medium, high, critical
  category: text("category"), // spending, saving, investment, debt
  isRead: boolean("is_read").default(false),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const simulationTemplates = pgTable("simulation_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"), // retirement, house_purchase, debt_payoff, emergency_fund
  parameters: jsonb("parameters"), // template configuration
  isPublic: boolean("is_public").default(true),
  userId: uuid("user_id"), // null for public templates
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSimulations = pgTable("user_simulations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  templateId: uuid("template_id"),
  name: text("name").notNull(),
  parameters: jsonb("parameters").notNull(),
  results: jsonb("results"),
  scenarios: jsonb("scenarios"), // multiple scenario comparisons
  isFavorite: boolean("is_favorite").default(false),
  isShared: boolean("is_shared").default(false),
  shareToken: text("share_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const exportHistory = pgTable("export_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  exportType: text("export_type").notNull(), // pdf, excel, csv, image
  filename: text("filename"),
  dataRange: jsonb("data_range"), // date range, categories, etc.
  fileSize: integer("file_size"),
  downloadCount: integer("download_count").default(0),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schemas for new tables
export const insertFinancialProfileSchema = createInsertSchema(financialProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBudgetCategorySchema = createInsertSchema(budgetCategories).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertFinancialInsightSchema = createInsertSchema(financialInsights).omit({
  id: true,
  createdAt: true,
});

export const insertSimulationTemplateSchema = createInsertSchema(simulationTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertUserSimulationSchema = createInsertSchema(userSimulations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExportHistorySchema = createInsertSchema(exportHistory).omit({
  id: true,
  createdAt: true,
});

// Export new types
export type FinancialProfile = typeof financialProfiles.$inferSelect;
export type InsertFinancialProfile = z.infer<typeof insertFinancialProfileSchema>;

export type BudgetCategory = typeof budgetCategories.$inferSelect;
export type InsertBudgetCategory = z.infer<typeof insertBudgetCategorySchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type FinancialInsight = typeof financialInsights.$inferSelect;
export type InsertFinancialInsight = z.infer<typeof insertFinancialInsightSchema>;

export type SimulationTemplate = typeof simulationTemplates.$inferSelect;
export type InsertSimulationTemplate = z.infer<typeof insertSimulationTemplateSchema>;

export type UserSimulation = typeof userSimulations.$inferSelect;
export type InsertUserSimulation = z.infer<typeof insertUserSimulationSchema>;

export type ExportHistory = typeof exportHistory.$inferSelect;
export type InsertExportHistory = z.infer<typeof insertExportHistorySchema>;
