import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  TrendingUp, 
  TrendingDown, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

interface FinancialHealthIndexProps {
  score: number;
  data: any;
}

export const FinancialHealthIndex = ({ score, data }: FinancialHealthIndexProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  const getHealthLevel = (score: number) => {
    if (score >= 80) return { 
      level: "Excellente", 
      color: "text-success", 
      bgColor: "bg-success/10",
      icon: CheckCircle 
    };
    if (score >= 60) return { 
      level: "Bonne", 
      color: "text-warning", 
      bgColor: "bg-warning/10",
      icon: Info 
    };
    if (score >= 40) return { 
      level: "Moyenne", 
      color: "text-accent", 
      bgColor: "bg-accent/10",
      icon: AlertTriangle 
    };
    return { 
      level: "À améliorer", 
      color: "text-destructive", 
      bgColor: "bg-destructive/10",
      icon: TrendingDown 
    };
  };

  const healthLevel = getHealthLevel(score);
  const HealthIcon = healthLevel.icon;

  const healthFactors = [
    {
      name: "Ratio Épargne/Revenus",
      value: data?.savingsRate || 0,
      target: 20,
      unit: "%",
      status: (data?.savingsRate || 0) >= 20 ? "good" : "warning"
    },
    {
      name: "Ratio Dettes/Revenus",
      value: data?.debtToIncomeRatio * 100 || 0,
      target: 30,
      unit: "%",
      status: (data?.debtToIncomeRatio * 100 || 0) <= 30 ? "good" : "bad"
    },
    {
      name: "Fonds d'Urgence",
      value: data?.emergencyFundMonths || 0,
      target: 6,
      unit: " mois",
      status: (data?.emergencyFundMonths || 0) >= 3 ? "good" : "warning"
    },
    {
      name: "Diversification",
      value: data?.diversificationScore || 0,
      target: 80,
      unit: "%",
      status: (data?.diversificationScore || 0) >= 70 ? "good" : "warning"
    }
  ];

  return (
    <GlassCard className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${healthLevel.bgColor}`}>
            <Heart className={`w-6 h-6 ${healthLevel.color}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Indice de Santé Financière</h3>
            <p className="text-sm text-muted-foreground">Évaluation globale</p>
          </div>
        </div>
        <HealthIcon className={`w-5 h-5 ${healthLevel.color}`} />
      </div>

      {/* Score Principal */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative"
        >
          <div className="text-6xl font-bold bg-gradient-revelation bg-clip-text text-transparent">
            {Math.round(animatedScore)}
          </div>
          <div className="text-lg text-muted-foreground">/100</div>
        </motion.div>
        
        <Badge className={`${healthLevel.bgColor} ${healthLevel.color} border-none`}>
          {healthLevel.level}
        </Badge>
        
        <Progress 
          value={animatedScore} 
          className="w-full h-2"
          // TODO: Add custom progress styles based on score
        />
      </div>

      {/* Facteurs de Santé */}
      <div className="space-y-4">
        <h4 className="font-medium text-muted-foreground">Facteurs Clés</h4>
        <div className="grid grid-cols-2 gap-3">
          {healthFactors.map((factor, index) => (
            <motion.div
              key={factor.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg ${
                factor.status === 'good' ? 'bg-success/10' :
                factor.status === 'warning' ? 'bg-warning/10' : 'bg-destructive/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-2 h-2 rounded-full ${
                  factor.status === 'good' ? 'bg-success' :
                  factor.status === 'warning' ? 'bg-warning' : 'bg-destructive'
                }`} />
                <span className="text-xs font-medium">
                  {factor.value}{factor.unit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {factor.name}
              </p>
              <div className="text-xs text-muted-foreground/60">
                Cible: {factor.target}{factor.unit}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommandations Rapides */}
      <div className="bg-primary/5 rounded-lg p-4">
        <h4 className="font-medium text-primary mb-2">💡 Recommandation Priority</h4>
        <p className="text-sm text-muted-foreground">
          {score < 40 && "Concentrez-vous sur la réduction des dettes et l'augmentation de l'épargne d'urgence."}
          {score >= 40 && score < 60 && "Continuez vos efforts et diversifiez vos investissements."}
          {score >= 60 && score < 80 && "Optimisez votre stratégie fiscale et augmentez votre épargne retraite."}
          {score >= 80 && "Excellente santé financière ! Explorez des investissements plus sophistiqués."}
        </p>
      </div>
    </GlassCard>
  );
};