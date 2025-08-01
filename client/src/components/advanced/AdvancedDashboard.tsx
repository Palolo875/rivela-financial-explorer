import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  PieChart,
  BarChart3,
  Calendar,
  Download,
  Share2,
  Lightbulb,
  Eye,
  EyeOff,
  Filter,
  Search,
  RefreshCw
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { format, subDays, subMonths } from 'date-fns';
import numeral from 'numeral';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

interface AdvancedDashboardProps {
  userId: string;
}

interface DashboardData {
  financialProfile: any;
  budgetCategories: any[];
  transactions: any[];
  insights: any[];
  simulations: any[];
}

const AdvancedDashboard: React.FC<AdvancedDashboardProps> = ({ userId }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showHiddenFees, setShowHiddenFees] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch all dashboard data
  const { data: financialProfile } = useQuery({
    queryKey: ['financial-profile', userId],
    queryFn: () => fetch(`/api/financial-profiles/${userId}`).then(res => res.json()),
  });

  const { data: budgetCategories = [] } = useQuery({
    queryKey: ['budget-categories', userId],
    queryFn: () => fetch(`/api/budget-categories/${userId}`).then(res => res.json()),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', userId, timeRange],
    queryFn: () => fetch(`/api/transactions/${userId}?limit=500`).then(res => res.json()),
  });

  const { data: insights = [] } = useQuery({
    queryKey: ['financial-insights', userId],
    queryFn: () => fetch(`/api/financial-insights/${userId}`).then(res => res.json()),
  });

  // Calculate financial metrics
  const calculateMetrics = () => {
    const now = new Date();
    const startDate = timeRange === 'week' ? subDays(now, 7) : 
                     timeRange === 'month' ? subMonths(now, 1) :
                     subMonths(now, 12);

    const filteredTransactions = transactions.filter((t: any) => 
      new Date(t.date) >= startDate && 
      (selectedCategory === 'all' || t.categoryId === selectedCategory) &&
      (showHiddenFees || !t.isHiddenFee)
    );

    const income = filteredTransactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

    const expenses = filteredTransactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

    const hiddenFees = transactions
      .filter((t: any) => t.isHiddenFee && new Date(t.date) >= startDate)
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

    const balance = income - expenses;
    const savingsRate = income > 0 ? ((balance / income) * 100) : 0;

    return { income, expenses, balance, savingsRate, hiddenFees };
  };

  const metrics = calculateMetrics();

  // Generate spending trends chart data
  const getSpendingTrendsData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      const dayTransactions = transactions.filter((t: any) => 
        format(new Date(t.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
        t.type === 'expense'
      );
      const amount = dayTransactions.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
      return { date: format(date, 'MMM dd'), amount };
    });

    return {
      labels: last30Days.map(d => d.date),
      datasets: [{
        label: 'Dépenses quotidiennes',
        data: last30Days.map(d => d.amount),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }]
    };
  };

  // Generate category breakdown chart data
  const getCategoryBreakdownData = () => {
    const categoryTotals = budgetCategories.map((category: any) => {
      const categoryTransactions = transactions.filter((t: any) => 
        t.categoryId === category.id && t.type === 'expense'
      );
      const total = categoryTransactions.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
      return { name: category.name, amount: total, color: category.color || '#3B82F6' };
    });

    return {
      labels: categoryTotals.map((c: any) => c.name),
      datasets: [{
        data: categoryTotals.map((c: any) => c.amount),
        backgroundColor: categoryTotals.map((c: any) => c.color),
        borderWidth: 0,
      }]
    };
  };

  // Financial Health Score calculation
  const calculateHealthScore = () => {
    let score = 0;
    
    // Savings rate (40% of score)
    if (metrics.savingsRate >= 20) score += 40;
    else if (metrics.savingsRate >= 10) score += 20;
    else if (metrics.savingsRate >= 0) score += 10;

    // Emergency fund (20% of score)
    const emergencyFund = financialProfile?.emergencyFund || 0;
    const monthlyExpenses = metrics.expenses;
    const emergencyMonths = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;
    
    if (emergencyMonths >= 6) score += 20;
    else if (emergencyMonths >= 3) score += 15;
    else if (emergencyMonths >= 1) score += 10;

    // Budget adherence (20% of score)
    const budgetAdherence = budgetCategories.filter((cat: any) => {
      const actual = parseFloat(cat.actualAmount || '0');
      const budgeted = parseFloat(cat.budgetedAmount || '0');
      return budgeted > 0 && actual <= budgeted * 1.1; // 10% tolerance
    }).length / Math.max(budgetCategories.length, 1);
    
    score += budgetAdherence * 20;

    // Hidden fees impact (20% of score)
    const hiddenFeesImpact = metrics.income > 0 ? (metrics.hiddenFees / metrics.income) * 100 : 0;
    if (hiddenFeesImpact < 1) score += 20;
    else if (hiddenFeesImpact < 3) score += 15;
    else if (hiddenFeesImpact < 5) score += 10;

    return Math.min(Math.round(score), 100);
  };

  const healthScore = calculateHealthScore();

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreText = (score: number) => {
    if (score >= 80) return 'Excellente';
    if (score >= 60) return 'Bonne';
    if (score >= 40) return 'Moyenne';
    return 'À améliorer';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tableau de bord avancé
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Analyse complète de votre situation financière
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>

        {/* Financial Health Score */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold mb-2">Score de Santé Financière</h2>
                <div className="flex items-center gap-4">
                  <div className="text-6xl font-bold">{healthScore}</div>
                  <div>
                    <div className="text-xl">{getHealthScoreText(healthScore)}</div>
                    <Progress value={healthScore} className="w-32 mt-2" />
                  </div>
                </div>
              </div>
              <div className="mt-6 lg:mt-0">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{numeral(metrics.balance).format('0,0')}€</div>
                    <div className="text-sm opacity-90">Solde net</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{metrics.savingsRate.toFixed(1)}%</div>
                    <div className="text-sm opacity-90">Taux d'épargne</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Revenus</p>
                  <p className="text-3xl font-bold text-green-600">
                    {numeral(metrics.income).format('0,0')}€
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Dépenses</p>
                  <p className="text-3xl font-bold text-red-600">
                    {numeral(metrics.expenses).format('0,0')}€
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Frais cachés</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {numeral(metrics.hiddenFees).format('0,0')}€
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Objectifs</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {budgetCategories.filter(c => c.type === 'investment').length}
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spending Trends Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Tendances des dépenses
              </CardTitle>
              <CardDescription>Évolution de vos dépenses sur 30 jours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line 
                  data={getSpendingTrendsData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value: any) => numeral(value).format('0,0') + '€'
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Répartition par catégories
              </CardTitle>
              <CardDescription>Distribution de vos dépenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Pie 
                  data={getCategoryBreakdownData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' },
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.label}: ${numeral(context.parsed).format('0,0')}€`
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights and Recommendations */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Insights et recommandations
            </CardTitle>
            <CardDescription>Analyses personnalisées basées sur vos données</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-4">
                {insights.length > 0 ? insights.map((insight: any, index: number) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <div className={`p-2 rounded-full ${
                      insight.severity === 'high' ? 'bg-red-100 text-red-600' :
                      insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <Lightbulb className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {insight.description}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {insight.category}
                      </Badge>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-8 text-slate-500">
                    <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun insight disponible pour le moment</p>
                    <p className="text-sm">Ajoutez plus de données pour obtenir des analyses personnalisées</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedDashboard;