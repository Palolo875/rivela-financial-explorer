import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar,
  AlertCircle,
  Target,
  Zap
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TrendAnalysisProps {
  data: any;
}

export const TrendAnalysis = ({ data }: TrendAnalysisProps) => {
  const [timeFrame, setTimeFrame] = useState("6m");
  const [activeChart, setActiveChart] = useState("expenses");

  // Données simulées pour les graphiques
  const generateExpenseTrend = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
    const expenses = [2100, 1950, 2300, 2050, 2200, 1890];
    const income = [3200, 3200, 3350, 3200, 3400, 3200];
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Dépenses',
          data: expenses,
          borderColor: 'hsl(0 85% 62%)',
          backgroundColor: 'hsl(0 85% 62% / 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Revenus',
          data: income,
          borderColor: 'hsl(140 70% 55%)',
          backgroundColor: 'hsl(140 70% 55% / 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const generateCategoryBreakdown = () => {
    return {
      labels: ['Logement', 'Alimentation', 'Transport', 'Loisirs', 'Santé', 'Autres'],
      datasets: [{
        data: [1200, 450, 280, 320, 150, 200],
        backgroundColor: [
          'hsl(225 85% 58%)',
          'hsl(280 75% 65%)',
          'hsl(140 70% 55%)',
          'hsl(38 95% 62%)',
          'hsl(0 85% 62%)',
          'hsl(245 20% 94%)'
        ],
        borderWidth: 0
      }]
    };
  };

  const generateProjection = () => {
    const months = ['Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const projectedExpenses = [1850, 1900, 2000, 1950, 2100, 1800];
    const currentTrend = [1890, 1920, 1950, 1980, 2010, 2040];
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Projection Optimisée',
          data: projectedExpenses,
          borderColor: 'hsl(140 70% 55%)',
          backgroundColor: 'hsl(140 70% 55% / 0.1)',
          borderDash: [5, 5],
          tension: 0.4
        },
        {
          label: 'Tendance Actuelle',
          data: currentTrend,
          borderColor: 'hsl(0 85% 62%)',
          backgroundColor: 'hsl(0 85% 62% / 0.1)',
          borderDash: [10, 5],
          tension: 0.4
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'hsl(225 15% 45%)',
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: 'hsl(225 15% 15%)',
        bodyColor: 'hsl(225 15% 15%)',
        borderColor: 'hsl(225 85% 58%)',
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsl(245 25% 88% / 0.3)'
        },
        ticks: {
          color: 'hsl(225 15% 45%)',
          callback: function(value: any) {
            return value + '€';
          }
        }
      },
      x: {
        grid: {
          color: 'hsl(245 25% 88% / 0.3)'
        },
        ticks: {
          color: 'hsl(225 15% 45%)'
        }
      }
    }
  };

  const insights = [
    {
      icon: TrendingDown,
      title: "Réduction des dépenses",
      value: "-8.5%",
      description: "Vous avez réduit vos dépenses de 180€ ce mois",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: TrendingUp,
      title: "Épargne en hausse",
      value: "+12%",
      description: "Votre taux d'épargne s'améliore",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: AlertCircle,
      title: "Alert budget loisirs",
      value: "105%",
      description: "Dépassement de 16€ ce mois",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      icon: Target,
      title: "Objectif atteint",
      value: "3/5",
      description: "Félicitations pour vos efforts !",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  const patterns = [
    {
      period: "Lundi matin",
      pattern: "Pics de dépenses café (4.50€ en moyenne)",
      trend: "up",
      suggestion: "Préparez votre café à la maison"
    },
    {
      period: "Vendredi soir",
      pattern: "Restaurants et sorties (+40% vs moyenne)",
      trend: "up",
      suggestion: "Fixez un budget weekend"
    },
    {
      period: "Mi-mois",
      pattern: "Baisse des achats alimentaires",
      trend: "down",
      suggestion: "Planifiez mieux vos courses"
    },
    {
      period: "Fin de mois",
      pattern: "Augmentation achats impulsifs",
      trend: "up",
      suggestion: "Utilisez la règle des 24h"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header avec insights rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${insight.bgColor}`}>
                  <insight.icon className={`w-4 h-4 ${insight.color}`} />
                </div>
                <div>
                  <div className={`text-lg font-bold ${insight.color}`}>
                    {insight.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {insight.title}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {insight.description}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Graphiques principaux */}
      <Tabs value={activeChart} onValueChange={setActiveChart}>
        <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md">
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Tendances
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Répartition
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Projections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">📈 Évolution Revenus vs Dépenses</h3>
              <div className="flex gap-2">
                {['3m', '6m', '1a'].map((period) => (
                  <Badge 
                    key={period}
                    variant={timeFrame === period ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setTimeFrame(period)}
                  >
                    {period}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="h-80">
              <Line data={generateExpenseTrend()} options={chartOptions} />
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">🎯 Répartition par Catégories</h3>
              <div className="h-80">
                <Doughnut data={generateCategoryBreakdown()} options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        color: 'hsl(225 15% 45%)',
                        usePointStyle: true,
                        padding: 15
                      }
                    }
                  }
                }} />
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">🔍 Patterns Comportementaux</h3>
              <div className="space-y-4">
                {patterns.map((pattern, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-background/20 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{pattern.period}</span>
                      <Badge className={
                        pattern.trend === 'up' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                      }>
                        {pattern.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {pattern.pattern}
                    </p>
                    <p className="text-xs text-primary bg-primary/10 rounded px-2 py-1">
                      💡 {pattern.suggestion}
                    </p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="projections">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">🔮 Projections Intelligentes</h3>
              <Badge className="bg-accent/20 text-accent">
                <Zap className="w-3 h-3 mr-1" />
                IA Prédictive
              </Badge>
            </div>
            
            <div className="h-80 mb-6">
              <Line data={generateProjection()} options={chartOptions} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-success/10">
                <div className="text-lg font-bold text-success">-240€</div>
                <p className="text-sm text-muted-foreground">
                  Économies potentielles sur 6 mois
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10">
                <div className="text-lg font-bold text-primary">87%</div>
                <p className="text-sm text-muted-foreground">
                  Probabilité d'atteindre votre objectif
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent/10">
                <div className="text-lg font-bold text-accent">3 mois</div>
                <p className="text-sm text-muted-foreground">
                  Avance sur vos objectifs d'épargne
                </p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};