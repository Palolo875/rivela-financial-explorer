import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RevelationButton } from "@/components/ui/revelation-button";
import { 
  Search, 
  AlertTriangle, 
  TrendingDown,
  Eye,
  DollarSign,
  Calendar,
  CreditCard,
  Building,
  Smartphone,
  Car,
  Home,
  Coffee,
  Music,
  Gamepad2,
  Utensils
} from "lucide-react";

interface HiddenFeesDetectorProps {
  data: any;
}

export const HiddenFeesDetector = ({ data }: HiddenFeesDetectorProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedFees, setDetectedFees] = useState<any[]>([]);

  // Simulation de détection de frais cachés
  const hiddenFeesDatabase = [
    {
      category: "Bancaire",
      icon: Building,
      items: [
        { name: "Frais de tenue de compte", amount: 3.5, frequency: "monthly", impact: "medium" },
        { name: "Commission découvert", amount: 8, frequency: "occasional", impact: "high" },
        { name: "Frais carte bancaire", amount: 45, frequency: "yearly", impact: "medium" },
        { name: "Virements internationaux", amount: 15, frequency: "occasional", impact: "low" }
      ]
    },
    {
      category: "Abonnements",
      icon: Smartphone,
      items: [
        { name: "Netflix Premium (non utilisé)", amount: 17.99, frequency: "monthly", impact: "medium" },
        { name: "Spotify Family", amount: 15.99, frequency: "monthly", impact: "low" },
        { name: "Abonnement gym (non fréquenté)", amount: 39.90, frequency: "monthly", impact: "high" },
        { name: "Adobe Creative Cloud", amount: 59.99, frequency: "monthly", impact: "medium" }
      ]
    },
    {
      category: "Automobile",
      icon: Car,
      items: [
        { name: "Assurance tous risques surdimensionnée", amount: 95, frequency: "monthly", impact: "high" },
        { name: "Péages autoroutes", amount: 45, frequency: "monthly", impact: "medium" },
        { name: "Stationnement non optimisé", amount: 120, frequency: "monthly", impact: "high" }
      ]
    },
    {
      category: "Logement",
      icon: Home,
      items: [
        { name: "Assurance habitation premium", amount: 25, frequency: "monthly", impact: "medium" },
        { name: "Abonnements énergie multiples", amount: 180, frequency: "monthly", impact: "high" },
        { name: "Internet haut débit non utilisé", amount: 49.99, frequency: "monthly", impact: "medium" }
      ]
    },
    {
      category: "Lifestyle",
      icon: Coffee,
      items: [
        { name: "Cafés quotidiens bureaux", amount: 4.5, frequency: "daily", impact: "high" },
        { name: "Livraisons repas récurrentes", amount: 25, frequency: "weekly", impact: "high" },
        { name: "Achats impulsifs supermarché", amount: 35, frequency: "weekly", impact: "medium" }
      ]
    }
  ];

  const startScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setDetectedFees([]);

    // Simulation du scan progressif
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setScanProgress(i);
      
      if (i === 50) {
        // Première vague de détections
        setDetectedFees(prev => [...prev, ...hiddenFeesDatabase.slice(0, 2)]);
      }
      if (i === 80) {
        // Deuxième vague
        setDetectedFees(prev => [...prev, ...hiddenFeesDatabase.slice(2)]);
      }
    }
    
    setIsScanning(false);
  };

  const calculateMonthlyImpact = (items: any[]) => {
    return items.reduce((total, item) => {
      let monthlyAmount = item.amount;
      switch (item.frequency) {
        case 'daily': monthlyAmount *= 30; break;
        case 'weekly': monthlyAmount *= 4; break;
        case 'yearly': monthlyAmount /= 12; break;
        case 'occasional': monthlyAmount *= 0.5; break;
      }
      return total + monthlyAmount;
    }, 0);
  };

  const totalMonthlyFees = detectedFees.reduce((total, category) => 
    total + calculateMonthlyImpact(category.items), 0
  );

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted bg-muted/10';
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '/jour';
      case 'weekly': return '/semaine';
      case 'monthly': return '/mois';
      case 'yearly': return '/an';
      case 'occasional': return 'ponctuel';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec scan */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-warning/10">
              <Search className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">🕵️ Détective des Frais Cachés</h3>
              <p className="text-muted-foreground">Analyse intelligente de vos dépenses</p>
            </div>
          </div>
          
          <RevelationButton 
            onClick={startScan}
            disabled={isScanning}
            variant={isScanning ? "ghost" : "revelation"}
          >
            {isScanning ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Lancer l'analyse
              </>
            )}
          </RevelationButton>
        </div>

        {isScanning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Analyse des transactions...</span>
              <span>{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="w-full" />
          </div>
        )}

        {!isScanning && detectedFees.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 rounded-lg p-4 border border-destructive/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <span className="font-semibold text-destructive">
                {totalMonthlyFees.toFixed(2)}€/mois de frais détectés
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Soit {(totalMonthlyFees * 12).toFixed(0)}€ par an qui pourraient être économisés
            </p>
          </motion.div>
        )}
      </GlassCard>

      {/* Résultats par catégorie */}
      {detectedFees.map((category, categoryIndex) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: categoryIndex * 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <category.icon className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-semibold">{category.category}</h4>
              <Badge variant="outline">
                {calculateMonthlyImpact(category.items).toFixed(2)}€/mois
              </Badge>
            </div>

            <div className="space-y-3">
              {category.items.map((item: any, itemIndex: number) => (
                <motion.div
                  key={itemIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (categoryIndex * 0.2) + (itemIndex * 0.1) }}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/20 border border-white/10"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium">{item.name}</h5>
                      <Badge className={`text-xs ${getImpactColor(item.impact)}`}>
                        {item.impact === 'high' ? 'Impact fort' : 
                         item.impact === 'medium' ? 'Impact moyen' : 'Impact faible'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.amount}€{getFrequencyText(item.frequency)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-destructive">
                      -{item.amount}€
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.frequency}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recommandations spécifiques */}
            <div className="mt-4 p-4 bg-primary/5 rounded-lg">
              <h5 className="font-medium text-primary mb-2">💡 Recommandations</h5>
              <p className="text-sm text-muted-foreground">
                {category.category === 'Bancaire' && "Négociez avec votre banque ou changez pour une banque en ligne."}
                {category.category === 'Abonnements' && "Auditez vos abonnements mensuellement et utilisez des outils de gestion."}
                {category.category === 'Automobile' && "Comparez les assurances et optimisez vos trajets."}
                {category.category === 'Logement' && "Renégociez vos contrats et optimisez votre consommation."}
                {category.category === 'Lifestyle' && "Préparez vos repas et fixez un budget plaisirs."}
              </p>
            </div>
          </GlassCard>
        </motion.div>
      ))}

      {/* Plan d'Action */}
      {detectedFees.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <GlassCard className="p-6 bg-gradient-to-br from-success/10 to-primary/10">
            <h4 className="text-lg font-semibold mb-4">🎯 Plan d'Action Personnalisé</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-white/10">
                <div className="text-2xl font-bold text-success">
                  {(totalMonthlyFees * 0.7).toFixed(0)}€
                </div>
                <div className="text-sm text-muted-foreground">
                  Économies réalisables facilement
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-white/10">
                <div className="text-2xl font-bold text-primary">
                  {(totalMonthlyFees * 12 * 0.7 / 365).toFixed(2)}€
                </div>
                <div className="text-sm text-muted-foreground">
                  Par jour économisé
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-white/10">
                <div className="text-2xl font-bold text-accent">
                  {Math.ceil(totalMonthlyFees * 12 * 0.7 / 1000)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Milliers d'euros sur 10 ans
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};