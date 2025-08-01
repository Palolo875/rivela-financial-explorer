# Financial Wellness & Mood Tracking Application

## Project Overview
A comprehensive wellness application that combines financial planning with mood tracking and personal development features. The app provides users with financial mapping, scenario exploration, mood tracking, journaling, meditation sessions, and AI-powered conversations.

## Architecture

### Frontend (Client)
- **Framework**: React with TypeScript
- **Routing**: Wouter (migrated from React Router)
- **State Management**: React Query/TanStack Query
- **UI Components**: Shadcn/UI with Tailwind CSS
- **Animations**: Framer Motion

### Backend (Server) 
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (migrated from Supabase)
- **API**: RESTful endpoints with Zod validation

### Development Environment
- **Runtime**: Node.js 20
- **Build Tool**: Vite
- **Development Server**: Express + Vite middleware
- **Port**: 5000 (serves both API and client)

## Database Schema

### Core Tables
- **user_profiles**: User profile information and preferences
- **mood_entries**: Daily mood tracking with emotion emojis and energy levels
- **journal_entries**: Personal journal entries with mood correlation
- **chat_conversations**: AI conversation history
- **meditation_sessions**: Meditation tracking with before/after mood scores
- **simulator_sessions**: Financial scenario simulation data

## API Endpoints

All API endpoints are prefixed with `/api`:

### User Profiles
- `GET /api/profiles/:userId` - Get user profile
- `POST /api/profiles` - Create user profile

### Mood Tracking
- `GET /api/mood-entries/:userId` - Get mood entries
- `POST /api/mood-entries` - Create mood entry

### Journaling
- `GET /api/journal-entries/:userId` - Get journal entries  
- `POST /api/journal-entries` - Create journal entry

### Chat & AI
- `GET /api/chat-conversations/:userId` - Get chat history
- `POST /api/chat-conversations` - Create chat entry

### Wellness Features
- `GET /api/meditation-sessions/:userId` - Get meditation sessions
- `POST /api/meditation-sessions` - Create meditation session
- `GET /api/simulator-sessions/:userId` - Get simulator sessions
- `POST /api/simulator-sessions` - Create simulator session

## Migration Status (Lovable → Replit)

### Completed ✓
- [x] Installed required packages (react-router-dom, sonner)
- [x] Migrated routing from React Router to Wouter
- [x] Created PostgreSQL database with Neon
- [x] Migrated database schema from Supabase to Drizzle
- [x] Replaced Supabase client with server-side PostgreSQL queries
- [x] Created comprehensive API routes with validation
- [x] Removed all Supabase dependencies and code
- [x] Updated query client configuration

### Architecture Changes
- **Database**: Supabase → PostgreSQL with Drizzle ORM
- **Routing**: React Router → Wouter
- **API**: Supabase Edge Functions → Express.js routes
- **Authentication**: Client-side Supabase auth → Server-side (to be implemented if needed)

## Component Structure

### Financial Components
- `QuestionInput` - Initial financial question entry
- `FinancialMapping` - Financial data mapping and analysis
- `RevelationScreen` - Financial insights and revelations
- `ScenarioExplorer` - Interactive financial scenario simulation

### Dashboard Components
- `DashboardMain` - Main dashboard interface
- `FinancialHealthIndex` - Financial health metrics
- `GoalsTracker` - Goal tracking and progress
- `HiddenFeesDetector` - Fee analysis tools
- `PredictiveAnalytics` - Future financial predictions
- `TrendAnalysis` - Historical trend analysis
- `PersonalizedInsights` - AI-powered insights
- `LearningCenter` - Educational content
- `ExportCenter` - Data export functionality

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Database connection details

## Development Workflow
1. Start development server: `npm run dev`
2. Push database schema changes: `npm run db:push`
3. Application runs on port 5000 with hot reload

## User Preferences
- Language: English
- Communication: Simple, non-technical language preferred
- Progress tracking: Use checklist format in progress tracker

## Recent Changes
- **2025-01-XX**: Successfully migrated from Lovable to Replit
- **2025-01-XX**: Replaced Supabase with PostgreSQL + Drizzle
- **2025-01-XX**: Implemented comprehensive API layer with validation
- **2025-01-XX**: Updated frontend routing to use Wouter