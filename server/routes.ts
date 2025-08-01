import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserProfileSchema,
  insertMoodEntrySchema,
  insertJournalEntrySchema,
  insertChatConversationSchema,
  insertMeditationSessionSchema,
  insertSimulatorSessionSchema
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

  const httpServer = createServer(app);
  return httpServer;
}
