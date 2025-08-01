import { useMemo } from 'react';
import type { Transaction, BudgetCategory } from '@shared/types';

export interface FinancialMetrics {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  hiddenFees: number;
  budgetAdherence: number;
  spendingByCategory: { [key: string]: number };
  monthlyTrend: { month: string; amount: number }[];
}

/**
 * Hook pour calculer et mémoriser les métriques financières
 * Optimise les performances en évitant les recalculs inutiles
 */
export function useFinancialCalculations(
  transactions: Transaction[],
  budgetCategories: BudgetCategory[]
): FinancialMetrics {
  return useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const hiddenFees = transactions
      .filter(t => t.isHiddenFee)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const spendingByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.categoryId] = (acc[t.categoryId] || 0) + parseFloat(t.amount);
        return acc;
      }, {} as { [key: string]: number });

    // Calcul de l'adhérence au budget
    const budgetAdherence = budgetCategories.reduce((total, category) => {
      const spent = spendingByCategory[category.id] || 0;
      const adherence = category.budget > 0 ? (spent / category.budget) * 100 : 0;
      return total + Math.min(adherence, 100);
    }, 0) / budgetCategories.length;

    // Tendance mensuelle (simplifiée pour cet exemple)
    const monthlyTrend = Array.from({ length: 6 }, (_, i) => ({
      month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleString('fr-FR', { month: 'short' }),
      amount: totalExpenses / 6 + (Math.random() - 0.5) * (totalExpenses * 0.2)
    }));

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      hiddenFees,
      budgetAdherence,
      spendingByCategory,
      monthlyTrend
    };
  }, [transactions, budgetCategories]);
}