import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { FinancialHealthIndex } from "./FinancialHealthIndex";
import { TrendAnalysis } from "./TrendAnalysis";
import { HiddenFeesDetector } from "./HiddenFeesDetector";
import { PersonalizedInsights } from "./PersonalizedInsights";
import { GoalsTracker } from "./GoalsTracker";
import { PredictiveAnalytics } from "./PredictiveAnalytics";
import { ExportCenter } from "./ExportCenter";
import { LearningCenter } from "./LearningCenter";
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  BookOpen, 
  Download,
  Sparkles,
  Calendar,
  PieChart,
  Activity
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardProps {
  userFinancialData: any;
  onThemeChange: (theme: string) => void;
}

const DashboardMain = ({ userFinancialData, onThemeChange }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    // Calcul du score de santé financière
    if (userFinancialData) {
      const score = calculateHealthScore(userFinancialData);
      setHealthScore(score);
    }
  }, [userFinancialData]);

  const calculateHealthScore = (data: any) => {
    let score = 50; // Score de base
    
    // Facteurs positifs
    if (data.savings > 0) score += 20;
    if (data.debtToIncomeRatio < 0.3) score += 15;
    if (data.emergencyFund >= 3) score += 15;
    
    // Facteurs négatifs
    if (data.monthlyDeficit > 0) score -= 20;
    if (data.debtToIncomeRatio > 0.5) score -= 15;
    
    return Math.max(0, Math.min(100, score));
  };

  const dashboardSections = [
    {
      id: "overview",
      title: "Vue Synthèse",
      icon: BarChart3,
      component: () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FinancialHealthIndex score={healthScore} data={userFinancialData} />
          <GoalsTracker goals={userFinancialData?.goals || []} />
          <PersonalizedInsights data={userFinancialData} />
        </div>
      )
    },
    {
      id: "trends",
      title: "Tendances",
      icon: TrendingUp,
      component: () => <TrendAnalysis data={userFinancialData} />
    },
    {
      id: "detective",
      title: "Détective Frais",
      icon: AlertCircle,
      component: () => <HiddenFeesDetector data={userFinancialData} />
    },
    {
      id: "predictions",
      title: "Prédictions",
      icon: Activity,
      component: () => <PredictiveAnalytics data={userFinancialData} />
    },
    {
      id: "learning",
      title: "Apprentissage",
      icon: BookOpen,
      component: () => <LearningCenter userProfile={userFinancialData} />
    },
    {
      id: "export",
      title: "Partage & Export",
      icon: Download,
      component: () => <ExportCenter data={userFinancialData} />
    }
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-revelation bg-clip-text text-transparent">
            🧠 Tableau de Bord Financier
          </h1>
          <p className="text-lg text-muted-foreground">
            Votre centre de contrôle personnalisé
          </p>
        </div>
        
        {/* Score de Santé Financière */}
        <GlassCard className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{healthScore}/100</div>
              <div className="text-sm text-muted-foreground">Santé Financière</div>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              healthScore >= 80 ? 'bg-success' : 
              healthScore >= 60 ? 'bg-warning' : 'bg-destructive'
            } animate-pulse`} />
          </div>
        </GlassCard>
      </motion.div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-white/10 backdrop-blur-md">
          {dashboardSections.map((section) => (
            <TabsTrigger 
              key={section.id} 
              value={section.id}
              className="flex items-center gap-2 data-[state=active]:bg-primary/20"
            >
              <section.icon className="w-4 h-4" />
              <span className="hidden md:inline">{section.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {dashboardSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <section.component />
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <GlassCard className="p-4 cursor-pointer hover:shadow-revelation transition-all duration-300">
          <Sparkles className="w-6 h-6 text-primary" />
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default DashboardMain;