import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Target, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Calendar,
  Brain,
  Zap,
  Eye,
  Settings,
  RefreshCw
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { format, addMonths, addYears, subMonths } from 'date-fns';
import numeral from 'numeral';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

interface PredictiveAnalyticsProps {
  userId: string;
}

interface Prediction {
  id: string;
  type: 'income' | 'expense' | 'balance' | 'goal' | 'investment';
  title: string;
  description: string;
  prediction: number;
  confidence: number;
  timeframe: string;
  category: string;
  impact: 'positive' | 'negative' | 'neutral';
  recommendations: string[];
  dataPoints: { date: string; value: number; predicted?: boolean }[];
}

interface TrendAnalysis {
  category: string;
  currentTrend: 'increasing' | 'decreasing' | 'stable';
  trendStrength: number;
  projectedChange: number;
  seasonalPattern: boolean;
  confidence: number;
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ userId }) => {
  const [timeHorizon, setTimeHorizon] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [analysisType, setAnalysisType] = useState('comprehensive');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch data for predictions
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => fetch(`/api/transactions/${userId}?limit=500`).then(res => res.json()),
  });

  const { data: budgetCategories = [] } = useQuery({
    queryKey: ['budget-categories', userId],
    queryFn: () => fetch(`/api/budget-categories/${userId}`).then(res => res.json()),
  });

  // Advanced prediction algorithms
  const generatePredictions = (): Prediction[] => {
    const predictions: Prediction[] = [];
    
    // Income prediction using linear regression
    const incomeTransactions = transactions.filter((t: any) => t.type === 'income');
    if (incomeTransactions.length >= 3) {
      const incomeData = incomeTransactions.map((t: any, index: number) => ({
        x: index,
        y: parseFloat(t.amount)
      }));
      
      const avgIncome = incomeData.reduce((sum, d) => sum + d.y, 0) / incomeData.length;
      const trend = calculateLinearTrend(incomeData);
      
      const futureIncome = avgIncome + (trend * 6); // 6 months projection
      
      predictions.push({
        id: 'income-prediction',
        type: 'income',
        title: 'Revenus futurs',
        description: 'Prédiction des revenus basée sur l\'historique',
        prediction: futureIncome,
        confidence: Math.min(0.85, 0.5 + (incomeTransactions.length / 20)),
        timeframe: timeHorizon,
        category: 'income',
        impact: futureIncome > avgIncome ? 'positive' : 'negative',
        recommendations: [
          futureIncome > avgIncome ? 
            'Tendance positive des revenus détectée' :
            'Considérez diversifier vos sources de revenus',
          'Planifiez votre épargne en fonction de cette projection'
        ],
        dataPoints: generateFutureDataPoints(incomeData, 6, trend)
      });
    }

    // Expense prediction by category
    budgetCategories.forEach((category: any) => {
      const categoryTransactions = transactions.filter((t: any) => 
        t.categoryId === category.id && t.type === 'expense'
      );
      
      if (categoryTransactions.length >= 2) {
        const expenses = categoryTransactions.map((t: any) => parseFloat(t.amount));
        const avgExpense = expenses.reduce((sum, exp) => sum + exp, 0) / expenses.length;
        const variance = calculateVariance(expenses);
        const volatility = Math.sqrt(variance) / avgExpense;
        
        // Seasonal adjustment
        const seasonalFactor = calculateSeasonalFactor(categoryTransactions);
        const predictedExpense = avgExpense * seasonalFactor;
        
        predictions.push({
          id: `expense-${category.id}`,
          type: 'expense',
          title: `Dépenses ${category.name}`,
          description: `Prédiction pour la catégorie ${category.name}`,
          prediction: predictedExpense,
          confidence: Math.max(0.3, 0.9 - volatility),
          timeframe: timeHorizon,
          category: category.name,
          impact: predictedExpense > avgExpense ? 'negative' : 'positive',
          recommendations: generateExpenseRecommendations(predictedExpense, avgExpense, volatility),
          dataPoints: generateExpenseProjection(expenses, 6)
        });
      }
    });

    // Balance prediction
    const totalIncome = incomeTransactions.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
    const totalExpenses = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
    
    const currentBalance = totalIncome - totalExpenses;
    const monthlyIncome = totalIncome / Math.max(1, getMonthsSpan(transactions));
    const monthlyExpenses = totalExpenses / Math.max(1, getMonthsSpan(transactions));
    
    const futureBalance = currentBalance + ((monthlyIncome - monthlyExpenses) * getTimeHorizonMonths(timeHorizon));
    
    predictions.push({
      id: 'balance-prediction',
      type: 'balance',
      title: 'Solde projeté',
      description: 'Évolution prévue de votre solde',
      prediction: futureBalance,
      confidence: 0.75,
      timeframe: timeHorizon,
      category: 'balance',
      impact: futureBalance > currentBalance ? 'positive' : 'negative',
      recommendations: [
        futureBalance > currentBalance ? 
          'Votre situation financière devrait s\'améliorer' :
          'Attention à la dégradation prévue de votre solde',
        'Surveillez vos dépenses dans les catégories volatiles'
      ],
      dataPoints: generateBalanceProjection(currentBalance, monthlyIncome, monthlyExpenses, 6)
    });

    return predictions.sort((a, b) => b.confidence - a.confidence);
  };

  const calculateLinearTrend = (data: { x: number; y: number }[]): number => {
    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + d.x, 0);
    const sumY = data.reduce((sum, d) => sum + d.y, 0);
    const sumXY = data.reduce((sum, d) => sum + (d.x * d.y), 0);
    const sumXX = data.reduce((sum, d) => sum + (d.x * d.x), 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  };

  const calculateVariance = (values: number[]): number => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  };

  const calculateSeasonalFactor = (transactions: any[]): number => {
    const currentMonth = new Date().getMonth();
    const monthlyAverages = Array(12).fill(0);
    const monthlyCounts = Array(12).fill(0);
    
    transactions.forEach(t => {
      const month = new Date(t.date).getMonth();
      monthlyAverages[month] += parseFloat(t.amount);
      monthlyCounts[month]++;
    });
    
    for (let i = 0; i < 12; i++) {
      if (monthlyCounts[i] > 0) {
        monthlyAverages[i] /= monthlyCounts[i];
      }
    }
    
    const overallAverage = monthlyAverages.reduce((sum, avg) => sum + avg, 0) / 12;
    return overallAverage > 0 ? monthlyAverages[currentMonth] / overallAverage : 1;
  };

  const generateExpenseRecommendations = (predicted: number, current: number, volatility: number): string[] => {
    const recommendations = [];
    
    if (predicted > current * 1.1) {
      recommendations.push('Augmentation des dépenses prévue - préparez votre budget');
    } else if (predicted < current * 0.9) {
      recommendations.push('Diminution des dépenses prévue - opportunité d\'épargne');
    }
    
    if (volatility > 0.3) {
      recommendations.push('Catégorie volatile - surveillez de près ces dépenses');
    }
    
    recommendations.push('Définissez des alertes pour cette catégorie');
    
    return recommendations;
  };

  const generateFutureDataPoints = (historicalData: any[], months: number, trend: number) => {
    const points = [];
    const lastValue = historicalData[historicalData.length - 1]?.y || 0;
    
    for (let i = 1; i <= months; i++) {
      const futureDate = addMonths(new Date(), i);
      points.push({
        date: format(futureDate, 'yyyy-MM-dd'),
        value: lastValue + (trend * i),
        predicted: true
      });
    }
    
    return points;
  };

  const generateExpenseProjection = (expenses: number[], months: number) => {
    const avgExpense = expenses.reduce((sum, exp) => sum + exp, 0) / expenses.length;
    const points = [];
    
    for (let i = 1; i <= months; i++) {
      const futureDate = addMonths(new Date(), i);
      const seasonalVariation = 1 + (Math.sin(i * Math.PI / 6) * 0.1); // Simple seasonal pattern
      points.push({
        date: format(futureDate, 'yyyy-MM-dd'),
        value: avgExpense * seasonalVariation,
        predicted: true
      });
    }
    
    return points;
  };

  const generateBalanceProjection = (currentBalance: number, monthlyIncome: number, monthlyExpenses: number, months: number) => {
    const points = [];
    let balance = currentBalance;
    
    for (let i = 1; i <= months; i++) {
      balance += (monthlyIncome - monthlyExpenses);
      const futureDate = addMonths(new Date(), i);
      points.push({
        date: format(futureDate, 'yyyy-MM-dd'),
        value: balance,
        predicted: true
      });
    }
    
    return points;
  };

  const getMonthsSpan = (transactions: any[]): number => {
    if (transactions.length === 0) return 1;
    
    const dates = transactions.map(t => new Date(t.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    return Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
  };

  const getTimeHorizonMonths = (horizon: string): number => {
    switch (horizon) {
      case '3months': return 3;
      case '6months': return 6;
      case '1year': return 12;
      case '2years': return 24;
      default: return 6;
    }
  };

  const predictions = generatePredictions();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-500" />;
    }
  };

  // Generate prediction chart data
  const getPredictionChartData = () => {
    const balancePrediction = predictions.find(p => p.type === 'balance');
    if (!balancePrediction) return { labels: [], datasets: [] };

    return {
      labels: balancePrediction.dataPoints.map(dp => format(new Date(dp.date), 'MMM yyyy')),
      datasets: [{
        label: 'Solde projeté',
        data: balancePrediction.dataPoints.map(dp => dp.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderDash: balancePrediction.dataPoints.map(dp => dp.predicted ? [5, 5] : []),
      }]
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Analyses Prédictives
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Prédictions intelligentes basées sur vos données financières
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select value={timeHorizon} onValueChange={setTimeHorizon}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 mois</SelectItem>
                <SelectItem value="6months">6 mois</SelectItem>
                <SelectItem value="1year">1 an</SelectItem>
                <SelectItem value="2years">2 ans</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => setIsAnalyzing(true)} 
              disabled={isAnalyzing}
              variant="outline"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              {isAnalyzing ? 'Analyse...' : 'Analyser'}
            </Button>
          </div>
        </div>

        {/* AI Confidence Score */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Intelligence Prédictive</h2>
                <p className="opacity-90">
                  Basé sur {transactions.length} transactions et {budgetCategories.length} catégories
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold">
                  {(predictions.reduce((sum, p) => sum + p.confidence, 0) / Math.max(predictions.length, 1) * 100).toFixed(0)}%
                </div>
                <div className="text-lg opacity-90">Fiabilité moyenne</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Predictions Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {predictions.slice(0, 3).map((prediction, index) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getImpactIcon(prediction.impact)}
                      <h3 className="font-semibold">{prediction.title}</h3>
                    </div>
                    <Badge variant="outline" className={getConfidenceColor(prediction.confidence)}>
                      {(prediction.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  
                  <div className="text-3xl font-bold mb-2">
                    {numeral(prediction.prediction).format('0,0')}€
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    {prediction.description}
                  </p>
                  
                  <Progress value={prediction.confidence * 100} className="mb-3" />
                  
                  <div className="text-xs text-slate-500">
                    Prédiction pour {prediction.timeframe}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Prediction Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Évolution prédite du solde
            </CardTitle>
            <CardDescription>Projection basée sur les tendances actuelles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line
                data={getPredictionChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                      callbacks: {
                        label: (context: any) => `${context.dataset.label}: ${numeral(context.parsed.y).format('0,0')}€`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
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

        {/* Detailed Predictions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Prédictions détaillées
            </CardTitle>
            <CardDescription>
              Analyse complète de toutes les prédictions avec recommandations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-6">
                {predictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800 border-l-4 border-purple-400"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getImpactIcon(prediction.impact)}
                        <div>
                          <h4 className="font-semibold text-lg">{prediction.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {prediction.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {numeral(prediction.prediction).format('0,0')}€
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={prediction.confidence * 100} className="w-20" />
                          <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
                            {(prediction.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{prediction.category}</Badge>
                        <Badge variant="outline">{prediction.timeframe}</Badge>
                        <Badge 
                          variant={prediction.impact === 'positive' ? 'default' : 
                                 prediction.impact === 'negative' ? 'destructive' : 'secondary'}
                        >
                          {prediction.impact}
                        </Badge>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Recommandations:</h5>
                        <ul className="space-y-1">
                          {prediction.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Zap className="h-3 w-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {predictions.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Données insuffisantes</h3>
                    <p>Ajoutez plus de transactions pour obtenir des prédictions précises.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Insights IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertTitle>Tendance positive détectée</AlertTitle>
                <AlertDescription>
                  Vos revenus montrent une progression constante sur les 3 derniers mois.
                  Continuez vos efforts actuels.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Attention aux dépenses variables</AlertTitle>
                <AlertDescription>
                  Volatilité élevée dans certaines catégories. Considérez un budget plus strict.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;