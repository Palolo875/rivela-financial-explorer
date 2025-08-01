import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserProfileSchema,
  insertMoodEntrySchema,
  insertJournalEntrySchema,
  insertChatConversationSchema,
  insertMeditationSessionSchema,
  insertSimulatorSessionSchema,
  insertFinancialProfileSchema,
  insertBudgetCategorySchema,
  insertTransactionSchema,
  insertFinancialInsightSchema,
  insertSimulationTemplateSchema,
  insertUserSimulationSchema,
  insertExportHistorySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User profile routes
  app.get("/api/profiles/:userId", async (req, res) => {
    try {
      const profile = await storage.getUserProfileByUserId(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    try {
      const validatedData = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createUserProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Mood entries routes
  app.get("/api/mood-entries/:userId", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const entries = await storage.getMoodEntries(req.params.userId, limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/mood-entries", async (req, res) => {
    try {
      const validatedData = insertMoodEntrySchema.parse(req.body);
      const entry = await storage.createMoodEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Journal entries routes
  app.get("/api/journal-entries/:userId", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const entries = await storage.getJournalEntries(req.params.userId, limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/journal-entries", async (req, res) => {
    try {
      const validatedData = insertJournalEntrySchema.parse(req.body);
      const entry = await storage.createJournalEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Chat conversations routes
  app.get("/api/chat-conversations/:userId", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const conversations = await storage.getChatConversations(req.params.userId, limit);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/chat-conversations", async (req, res) => {
    try {
      const validatedData = insertChatConversationSchema.parse(req.body);
      const conversation = await storage.createChatConversation(validatedData);
      res.status(201).json(conversation);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Meditation sessions routes
  app.get("/api/meditation-sessions/:userId", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const sessions = await storage.getMeditationSessions(req.params.userId, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/meditation-sessions", async (req, res) => {
    try {
      const validatedData = insertMeditationSessionSchema.parse(req.body);
      const session = await storage.createMeditationSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Simulator sessions routes
  app.get("/api/simulator-sessions/:userId", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const sessions = await storage.getSimulatorSessions(req.params.userId, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/simulator-sessions", async (req, res) => {
    try {
      const validatedData = insertSimulatorSessionSchema.parse(req.body);
      const session = await storage.createSimulatorSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Financial Profile routes
  app.get("/api/financial-profiles/:userId", async (req, res) => {
    try {
      const profile = await storage.getFinancialProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "Financial profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/financial-profiles", async (req, res) => {
    try {
      const validatedData = insertFinancialProfileSchema.parse(req.body);
      const profile = await storage.createFinancialProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put("/api/financial-profiles/:userId", async (req, res) => {
    try {
      const validatedData = insertFinancialProfileSchema.partial().parse(req.body);
      const profile = await storage.updateFinancialProfile(req.params.userId, validatedData);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Budget Categories routes
  app.get("/api/budget-categories/:userId", async (req, res) => {
    try {
      const categories = await storage.getBudgetCategories(req.params.userId);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/budget-categories", async (req, res) => {
    try {
      const validatedData = insertBudgetCategorySchema.parse(req.body);
      const category = await storage.createBudgetCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put("/api/budget-categories/:id", async (req, res) => {
    try {
      const validatedData = insertBudgetCategorySchema.partial().parse(req.body);
      const category = await storage.updateBudgetCategory(req.params.id, validatedData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.delete("/api/budget-categories/:id", async (req, res) => {
    try {
      const success = await storage.deleteBudgetCategory(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Transactions routes
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const categoryId = req.query.categoryId as string;
      const transactions = await storage.getTransactions(req.params.userId, limit, categoryId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.partial().parse(req.body);
      const transaction = await storage.updateTransaction(req.params.id, validatedData);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const success = await storage.deleteTransaction(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Financial Insights routes
  app.get("/api/financial-insights/:userId", async (req, res) => {
    try {
      const type = req.query.type as string;
      const limit = parseInt(req.query.limit as string) || 50;
      const insights = await storage.getFinancialInsights(req.params.userId, type, limit);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/financial-insights", async (req, res) => {
    try {
      const validatedData = insertFinancialInsightSchema.parse(req.body);
      const insight = await storage.createFinancialInsight(validatedData);
      res.status(201).json(insight);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.patch("/api/financial-insights/:id/read", async (req, res) => {
    try {
      const success = await storage.markInsightAsRead(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Insight not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/financial-insights/:userId/unread", async (req, res) => {
    try {
      const insights = await storage.getUnreadInsights(req.params.userId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Simulation Templates routes
  app.get("/api/simulation-templates", async (req, res) => {
    try {
      const category = req.query.category as string;
      const isPublic = req.query.public !== 'false';
      const templates = await storage.getSimulationTemplates(category, isPublic);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/simulation-templates", async (req, res) => {
    try {
      const validatedData = insertSimulationTemplateSchema.parse(req.body);
      const template = await storage.createSimulationTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // User Simulations routes
  app.get("/api/user-simulations/:userId", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const simulations = await storage.getUserSimulations(req.params.userId, limit);
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/user-simulations", async (req, res) => {
    try {
      const validatedData = insertUserSimulationSchema.parse(req.body);
      const simulation = await storage.createUserSimulation(validatedData);
      res.status(201).json(simulation);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put("/api/user-simulations/:id", async (req, res) => {
    try {
      const validatedData = insertUserSimulationSchema.partial().parse(req.body);
      const simulation = await storage.updateUserSimulation(req.params.id, validatedData);
      if (!simulation) {
        return res.status(404).json({ message: "Simulation not found" });
      }
      res.json(simulation);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.delete("/api/user-simulations/:id", async (req, res) => {
    try {
      const success = await storage.deleteUserSimulation(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Simulation not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/shared-simulations/:shareToken", async (req, res) => {
    try {
      const simulation = await storage.getSharedSimulation(req.params.shareToken);
      if (!simulation) {
        return res.status(404).json({ message: "Shared simulation not found" });
      }
      res.json(simulation);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Export History routes
  app.get("/api/export-history/:userId", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const history = await storage.getExportHistory(req.params.userId, limit);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/export-history", async (req, res) => {
    try {
      const validatedData = insertExportHistorySchema.parse(req.body);
      const exportRecord = await storage.createExportHistory(validatedData);
      res.status(201).json(exportRecord);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
