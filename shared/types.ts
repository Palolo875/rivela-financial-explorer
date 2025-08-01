// Shared types for the application

export interface Transaction {
  id: string;
  userId: string;
  amount: string;
  description: string;
  categoryId: string;
  type: 'income' | 'expense';
  date: string;
  isHiddenFee?: boolean;
  createdAt: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'investment';
  color: string;
  budget: number;
  spent: number;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  userType?: string;
  preferences?: any;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialInsight {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  impact: string;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  data?: any;
  createdAt: string;
}

export interface SimulationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isPublic: boolean;
  parameters: any;
  usageCount: number;
  averageRating: number;
  createdAt: string;
}

// Chart and visualization types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
  tension?: number;
}

export interface PredictionData {
  month: number;
  netWorth: number;
  savings: number;
  expenses: number;
  income: number;
}