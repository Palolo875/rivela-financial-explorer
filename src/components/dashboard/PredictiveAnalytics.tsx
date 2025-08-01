import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line } from 'react-chartjs-2';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Target,
  Calendar,
  Brain,
  Eye,
  Lightbulb,
  Activity
} from "lucide-react";

interface PredictiveAnalyticsProps {
  data: any;
}

export const PredictiveAnalytics = ({ data }: PredictiveAnalyticsProps) => {
  const [selectedScenario, setSelectedScenario] = useState("optimistic");
  const [predictions, setPredictions] = useState<any>({});

  useEffect(() => {
    // Simulation des prédictions IA
    generatePredictions();
  }, [data]);

  const generatePredictions = () => {
    const baseSavings = 400;
    const baseExpenses = 2200;
    const baseIncome = 3200;

    const scenarios = {
      pessimistic: {
        name: "Scénario Prudent",
        savingsGrowth: 0.02,
        expenseGrowth: 0.04,
        incomeGrowth: 0.01,
        color: "text-destructive",
        probability: 20
      },
      realistic: {
        name: "Scénario Réaliste",
        savingsGrowth: 0.05,
        expenseGrowth: 0.03,
        incomeGrowth: 0.03,
        color: "text-warning",
        probability: 60
      },
      optimistic: {
        name: "Scénario Optimiste",
        savingsGrowth: 0.08,
        expenseGrowth: 0.02,
        incomeGrowth: 0.05,
        color: "text-success",
        probability: 20
      }
    };

    const generateProjection = (scenario: any, months: number) => {
      const projection = [];
      let currentSavings = baseSavings;
      let currentExpenses = baseExpenses;
      let currentIncome = baseIncome;

      for (let i = 0; i < months; i++) {
        currentSavings *= (1 + scenario.savingsGrowth / 12);
        currentExpenses *= (1 + scenario.expenseGrowth / 12);
        currentIncome *= (1 + scenario.incomeGrowth / 12);

        projection.push({
          month: i + 1,
          savings: Math.round(currentSavings),
          expenses: Math.round(currentExpenses),
          income: Math.round(currentIncome),
          netWorth: Math.round((currentIncome - currentExpenses) * (i + 1))
        });
      }

      return projection;
    };

    const predictionData = {};
    Object.entries(scenarios).forEach(([key, scenario]) => {
      predictionData[key] = {
        scenario,
        projection: generateProjection(scenario, 24)
      };
    });

    setPredictions(predictionData);
  };

  const getChartData = () => {
    if (!predictions[selectedScenario]) return null;

    const projection = predictions[selectedScenario].projection;
    const labels = projection.map((p: any) => `Mois ${p.month}`);

    return {
      labels,
      datasets: [
        {
          label: 'Patrimoine Net',
          data: projection.map((p: any) => p.netWorth),
          borderColor: 'hsl(225 85% 58%)',
          backgroundColor: 'hsl(225 85% 58% / 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Épargne Mensuelle',
          data: projection.map((p: any) => p.savings),
          borderColor: 'hsl(140 70% 55%)',
          backgroundColor: 'hsl(140 70% 55% / 0.1)',
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
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: 'hsl(225 15% 15%)',
        bodyColor: 'hsl(225 15% 15%)',
        borderColor: 'hsl(225 85% 58%)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'hsl(245 25% 88% / 0.3)' },
        ticks: {
          color: 'hsl(225 15% 45%)',
          callback: function(value: any) {
            return value + '€';
          }
        }
      },
      x: {
        grid: { color: 'hsl(245 25% 88% / 0.3)' },
        ticks: { color: 'hsl(225 15% 45%)' }
      }
    }
  };

  const aiInsights = [
    {
      type: "opportunity",
      icon: TrendingUp,
      title: "Opportunité Détectée",
      content: "Augmentation probable de revenus dans 4-6 mois basée sur votre profil",
      confidence: 78,
      action: "Préparez une négociation salariale",
      impact: "+340€/mois potentiel"
    },
    {
      type: "risk",
      icon: AlertTriangle,
      title: "Risque Identifié",
      content: "Inflation alimentaire pourrait impacter votre budget de 8%",
      confidence: 85,
      action: "Diversifiez vos sources d'approvisionnement",
      impact: "Économies: 45€/mois"
    },
    {
      type: "optimization",
      icon: Lightbulb,
      title: "Optimisation IA",
      content: "Réallocation de budget pour maximiser l'épargne",
      confidence: 92,
      action: "Appliquer la stratégie recommandée",
      impact: "Gain d'efficacité: +22%"
    }
  ];

  const lifePredictions = [
    {
      event: "Achat immobilier",
      probability: 89,
      timeframe: "18-24 mois",
      preparation: "Continuez l'épargne actuelle",
      icon: "🏠"
    },
    {
      event: "Changement de carrière",
      probability: 34,
      timeframe: "12-18 mois",
      preparation: "Constituez 6 mois de réserve",
      icon: "💼"
    },
    {
      event: "Dépense majeure inattendue",
      probability: 67,
      timeframe: "6-12 mois",
      preparation: "Renforcez votre fonds d'urgence",
      icon: "⚡"
    },
    {
      event: "Opportunité d'investissement",
      probability: 45,
      timeframe: "3-9 mois",
      preparation: "Étudiez les options d'investissement",
      icon: "📈"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Prédictif */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-accent/10">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">🔮 Analytics Prédictifs</h3>
              <p className="text-muted-foreground">IA avancée & Machine Learning</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-success">IA Active</span>
          </div>
        </div>

        {/* Prédictions Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm font-medium">Objectif Principal</span>
            </div>
            <div className="text-lg font-bold text-success">87% probable</div>
            <p className="text-xs text-muted-foreground">
              D'atteindre votre objectif épargne dans les temps
            </p>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Optimisation</span>
            </div>
            <div className="text-lg font-bold text-primary">+284€</div>
            <p className="text-xs text-muted-foreground">
              Économies supplémentaires possibles/mois
            </p>
          </div>

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Score IA</span>
            </div>
            <div className="text-lg font-bold text-accent">A+</div>
            <p className="text-xs text-muted-foreground">
              Gestion financière excellente
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Projections Scénarisées */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold">📊 Projections Multi-Scénarios</h4>
          
          <div className="flex gap-2">
            {Object.entries(predictions).map(([key, pred]: [string, any]) => (
              <Badge
                key={key}
                variant={selectedScenario === key ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedScenario(key)}
              >
                {pred.scenario?.name} ({pred.scenario?.probability}%)
              </Badge>
            ))}
          </div>
        </div>

        {getChartData() && (
          <div className="h-80 mb-6">
            <Line data={getChartData()} options={chartOptions} />
          </div>
        )}

        {predictions[selectedScenario] && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-background/20">
              <h5 className="font-medium mb-2">Patrimoine dans 2 ans</h5>
              <div className="text-xl font-bold text-primary">
                {predictions[selectedScenario].projection[23]?.netWorth.toLocaleString()}€
              </div>
            </div>
            <div className="p-4 rounded-lg bg-background/20">
              <h5 className="font-medium mb-2">Épargne mensuelle finale</h5>
              <div className="text-xl font-bold text-success">
                {predictions[selectedScenario].projection[23]?.savings}€
              </div>
            </div>
            <div className="p-4 rounded-lg bg-background/20">
              <h5 className="font-medium mb-2">Confiance prédiction</h5>
              <div className="text-xl font-bold text-accent">
                {predictions[selectedScenario].scenario.probability}%
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Insights IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-warning/10">
              <Eye className="w-6 h-6 text-warning" />
            </div>
            <h4 className="text-lg font-semibold">🤖 Insights IA</h4>
          </div>

          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-4 rounded-lg bg-background/20 border border-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    insight.type === 'opportunity' ? 'bg-success/10' :
                    insight.type === 'risk' ? 'bg-destructive/10' : 'bg-primary/10'
                  }`}>
                    <insight.icon className={`w-4 h-4 ${
                      insight.type === 'opportunity' ? 'text-success' :
                      insight.type === 'risk' ? 'text-destructive' : 'text-primary'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium mb-1">{insight.title}</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      {insight.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge className="bg-accent/20 text-accent text-xs">
                        Confiance: {insight.confidence}%
                      </Badge>
                      <span className="text-xs text-success">
                        {insight.impact}
                      </span>
                    </div>
                    
                    <div className="bg-primary/10 rounded px-2 py-1 mt-2">
                      <p className="text-xs text-primary">
                        💡 {insight.action}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold">🎯 Prédictions de Vie</h4>
          </div>

          <div className="space-y-4">
            {lifePredictions.map((prediction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-background/20 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">{prediction.icon}</span>
                  <div className="flex-1">
                    <h5 className="font-medium">{prediction.event}</h5>
                    <p className="text-xs text-muted-foreground">
                      Dans {prediction.timeframe}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${
                      prediction.probability > 70 ? 'text-success' :
                      prediction.probability > 40 ? 'text-warning' : 'text-destructive'
                    }`}>
                      {prediction.probability}%
                    </div>
                  </div>
                </div>
                
                <div className="bg-accent/10 rounded px-2 py-1">
                  <p className="text-xs text-accent">
                    🎯 {prediction.preparation}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};