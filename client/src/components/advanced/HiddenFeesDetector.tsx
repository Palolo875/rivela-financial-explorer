import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  Search, 
  Eye, 
  DollarSign, 
  TrendingUp,
  Filter,
  Download,
  Zap,
  Shield,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format, subDays, subMonths, parseISO } from 'date-fns';
import numeral from 'numeral';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

interface HiddenFeesDetectorProps {
  userId: string;
}

interface HiddenFee {
  id: string;
  amount: number;
  description: string;
  merchantName: string;
  date: string;
  category: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  feeType: 'bank' | 'subscription' | 'service' | 'interest' | 'penalty' | 'foreign_exchange' | 'maintenance' | 'overdraft';
  recurring: boolean;
  estimatedAnnualImpact: number;
}

const feePatterns = [
  {
    type: 'bank',
    keywords: ['frais bancaires', 'commission', 'agios', 'découvert', 'tenue de compte', 'carte bancaire'],
    severity: 'medium' as const,
    description: 'Frais bancaires standards'
  },
  {
    type: 'subscription',
    keywords: ['abonnement', 'subscription', 'monthly', 'annual', 'premium', 'pro'],
    severity: 'high' as const,
    description: 'Abonnements récurrents'
  },
  {
    type: 'service',
    keywords: ['service fee', 'processing fee', 'handling', 'administration', 'gestion'],
    severity: 'medium' as const,
    description: 'Frais de service'
  },
  {
    type: 'foreign_exchange',
    keywords: ['change', 'foreign', 'fx', 'currency', 'devise'],
    severity: 'high' as const,
    description: 'Frais de change'
  },
  {
    type: 'penalty',
    keywords: ['penalty', 'late fee', 'retard', 'pénalité', 'amende'],
    severity: 'critical' as const,
    description: 'Pénalités et retards'
  }
];

const HiddenFeesDetector: React.FC<HiddenFeesDetectorProps> = ({ userId }) => {
  const [analysisPeriod, setAnalysisPeriod] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minAmount, setMinAmount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showOnlyHidden, setShowOnlyHidden] = useState(true);
  const queryClient = useQueryClient();

  // Fetch transactions
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', userId, analysisperiod],
    queryFn: () => fetch(`/api/transactions/${userId}?limit=1000`).then(res => res.json()),
  });

  // AI-powered fee detection algorithm
  const detectHiddenFees = (transactions: any[]): HiddenFee[] => {
    const detectedFees: HiddenFee[] = [];
    
    transactions.forEach((transaction: any) => {
      if (transaction.type !== 'expense') return;
      
      const amount = Math.abs(parseFloat(transaction.amount));
      const description = (transaction.description || '').toLowerCase();
      const merchantName = (transaction.merchantName || '').toLowerCase();
      
      // Pattern matching for different fee types
      feePatterns.forEach(pattern => {
        const hasKeyword = pattern.keywords.some(keyword => 
          description.includes(keyword) || merchantName.includes(keyword)
        );
        
        if (hasKeyword) {
          let confidence = 0.7;
          
          // Increase confidence based on amount patterns
          if (amount < 5) confidence += 0.2; // Small amounts are often fees
          if (amount % 1 === 0) confidence += 0.1; // Round amounts
          if (description.includes('fee') || description.includes('frais')) confidence += 0.2;
          
          // Check for recurring patterns
          const recurring = checkRecurringPattern(transaction, transactions);
          if (recurring) confidence += 0.1;
          
          const estimatedAnnualImpact = recurring ? amount * 12 : amount;
          
          detectedFees.push({
            id: transaction.id,
            amount,
            description: transaction.description || 'Frais détecté',
            merchantName: transaction.merchantName || 'Inconnu',
            date: transaction.date,
            category: pattern.type,
            confidence: Math.min(confidence, 1),
            severity: pattern.severity,
            feeType: pattern.type as any,
            recurring,
            estimatedAnnualImpact
          });
        }
      });
      
      // Advanced pattern detection for unmarked fees
      if (amount < 50 && !transaction.isHiddenFee) {
        const suspiciousPatterns = [
          /\d+\.\d{2}$/, // Precise amounts like 2.95
          /service|admin|process|handle/i,
          /monthly|annual|yearly/i
        ];
        
        const isSuspicious = suspiciousPatterns.some(pattern => 
          pattern.test(description) || pattern.test(merchantName)
        );
        
        if (isSuspicious) {
          detectedFees.push({
            id: transaction.id,
            amount,
            description: transaction.description || 'Frais potentiel détecté',
            merchantName: transaction.merchantName || 'Inconnu',
            date: transaction.date,
            category: 'unknown',
            confidence: 0.5,
            severity: 'low',
            feeType: 'service',
            recurring: false,
            estimatedAnnualImpact: amount
          });
        }
      }
    });
    
    return detectedFees.sort((a, b) => b.confidence - a.confidence);
  };

  const checkRecurringPattern = (transaction: any, allTransactions: any[]): boolean => {
    const amount = parseFloat(transaction.amount);
    const merchantName = transaction.merchantName;
    
    if (!merchantName) return false;
    
    const similarTransactions = allTransactions.filter(t => 
      t.merchantName === merchantName && 
      Math.abs(parseFloat(t.amount) - amount) < 0.01 &&
      t.id !== transaction.id
    );
    
    return similarTransactions.length >= 2;
  };

  const detectedFees = detectHiddenFees(transactions);
  const filteredFees = detectedFees.filter(fee => {
    if (selectedCategory !== 'all' && fee.category !== selectedCategory) return false;
    if (fee.amount < minAmount) return false;
    if (showOnlyHidden && fee.confidence < 0.6) return false;
    return true;
  });

  // Calculate impact metrics
  const totalHiddenFees = filteredFees.reduce((sum, fee) => sum + fee.amount, 0);
  const annualImpact = filteredFees.reduce((sum, fee) => sum + fee.estimatedAnnualImpact, 0);
  const averageFeeAmount = filteredFees.length > 0 ? totalHiddenFees / filteredFees.length : 0;
  const criticalFees = filteredFees.filter(fee => fee.severity === 'critical').length;

  // Chart data for fee categories
  const getCategoryBreakdownData = () => {
    const categoryTotals = filteredFees.reduce((acc: any, fee) => {
      acc[fee.category] = (acc[fee.category] || 0) + fee.amount;
      return acc;
    }, {});

    return {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#EF4444', '#F97316', '#EAB308', '#22D3EE', 
          '#8B5CF6', '#EC4899', '#10B981', '#6B7280'
        ],
        borderWidth: 0,
      }]
    };
  };

  // Timeline chart for fee detection
  const getTimelineData = () => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      const monthFees = filteredFees.filter(fee => {
        const feeDate = parseISO(fee.date);
        return feeDate.getMonth() === date.getMonth() && 
               feeDate.getFullYear() === date.getFullYear();
      });
      
      return {
        month: format(date, 'MMM yyyy'),
        amount: monthFees.reduce((sum, fee) => sum + fee.amount, 0),
        count: monthFees.length
      };
    });

    return {
      labels: last6Months.map(m => m.month),
      datasets: [
        {
          label: 'Montant des frais',
          data: last6Months.map(m => m.amount),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Nombre de frais',
          data: last6Months.map(m => m.count),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: false,
          tension: 0.4,
          yAxisID: 'y1',
        }
      ]
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (confidence >= 0.6) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Détecteur de Frais Cachés
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Identifiez et analysez les frais cachés dans vos transactions
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsAnalyzing(true)} 
              disabled={isAnalyzing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {isAnalyzing ? 'Analyse...' : 'Analyser'}
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Rapport
            </Button>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-rose-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Frais détectés</p>
                  <p className="text-3xl font-bold">
                    {numeral(totalHiddenFees).format('0,0')}€
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 opacity-90" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Impact annuel</p>
                  <p className="text-3xl font-bold">
                    {numeral(annualImpact).format('0,0')}€
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 opacity-90" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Nombre de frais</p>
                  <p className="text-3xl font-bold">{filteredFees.length}</p>
                </div>
                <Eye className="h-8 w-8 opacity-90" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-600 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Frais critiques</p>
                  <p className="text-3xl font-bold">{criticalFees}</p>
                </div>
                <Shield className="h-8 w-8 opacity-90" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filtres:</span>
              </div>
              
              <Select value={analysisperiod} onValueChange={setAnalysisPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 mois</SelectItem>
                  <SelectItem value="3months">3 mois</SelectItem>
                  <SelectItem value="6months">6 mois</SelectItem>
                  <SelectItem value="1year">1 an</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="bank">Frais bancaires</SelectItem>
                  <SelectItem value="subscription">Abonnements</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                  <SelectItem value="penalty">Pénalités</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <span className="text-sm">Montant min:</span>
                <Input
                  type="number"
                  value={minAmount}
                  onChange={(e) => setMinAmount(parseFloat(e.target.value) || 0)}
                  className="w-24"
                  placeholder="0€"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Répartition par catégories</CardTitle>
              <CardDescription>Distribution des frais par type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Pie 
                  data={getCategoryBreakdownData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Évolution temporelle</CardTitle>
              <CardDescription>Tendance des frais sur 6 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line 
                  data={getTimelineData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index' as const, intersect: false },
                    scales: {
                      y: {
                        type: 'linear' as const,
                        display: true,
                        position: 'left' as const,
                        ticks: { callback: (value: any) => numeral(value).format('0,0') + '€' }
                      },
                      y1: {
                        type: 'linear' as const,
                        display: true,
                        position: 'right' as const,
                        grid: { drawOnChartArea: false },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detected Fees List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Frais détectés ({filteredFees.length})
            </CardTitle>
            <CardDescription>
              Liste détaillée des frais cachés identifiés avec niveau de confiance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {filteredFees.map((fee, index) => (
                  <motion.div
                    key={fee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border-l-4 border-red-400"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getConfidenceIcon(fee.confidence)}
                        <h4 className="font-semibold">{fee.description}</h4>
                        <Badge className={getSeverityColor(fee.severity)}>
                          {fee.severity}
                        </Badge>
                        {fee.recurring && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Récurrent
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                        <span>{fee.merchantName}</span>
                        <span>•</span>
                        <span>{format(parseISO(fee.date), 'dd/MM/yyyy')}</span>
                        <span>•</span>
                        <span>Confiance: {(fee.confidence * 100).toFixed(0)}%</span>
                      </div>
                      {fee.recurring && (
                        <div className="mt-2 text-sm text-orange-600">
                          Impact annuel estimé: {numeral(fee.estimatedAnnualImpact).format('0,0')}€
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {numeral(fee.amount).format('0,0.00')}€
                      </div>
                      <Progress 
                        value={fee.confidence * 100} 
                        className="w-20 mt-1" 
                      />
                    </div>
                  </motion.div>
                ))}
                
                {filteredFees.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Aucun frais caché détecté</h3>
                    <p>Vos finances semblent être en ordre pour la période sélectionnée.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {filteredFees.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertTitle>Action immédiate</AlertTitle>
                  <AlertDescription>
                    Contactez votre banque pour les {criticalFees} frais critiques détectés.
                    Économies potentielles: {numeral(annualImpact * 0.3).format('0,0')}€/an
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Prévention</AlertTitle>
                  <AlertDescription>
                    Activez les alertes pour les frais récurrents et négociez 
                    l'exonération des frais de tenue de compte.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HiddenFeesDetector;