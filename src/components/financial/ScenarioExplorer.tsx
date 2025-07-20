import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { RevelationButton } from "@/components/ui/revelation-button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock,
  Sparkles,
  ArrowLeft,
  BarChart3,
  PieChart,
  Calendar
} from "lucide-react";

interface ScenarioExplorerProps {
  scenarioId: string;
  onBack: () => void;
}

const ScenarioExplorer = ({ scenarioId, onBack }: ScenarioExplorerProps) => {
  const [sliderValue, setSliderValue] = useState([50]);
  const [timeHorizon, setTimeHorizon] = useState([12]);
  const [visualMode, setVisualMode] = useState<'impact' | 'timeline' | 'comparison'>('impact');

  // Données de scénario basées sur l'ID
  const scenarioData = {
    coffee: {
      title: "Réduire les cafés quotidiens",
      currentAmount: 150,
      maxReduction: 130,
      description: "Impact de la réduction de vos achats de café",
      unit: "€/mois",
      comparisonItems: [
        { name: "1 week-end à la mer", value: 150 },
        { name: "Abonnement gym", value: 45 },
        { name: "2 repas restaurant", value: 60 }
      ]
    },
    salary: {
      title: "Augmentation de salaire",
      currentAmount: 3200,
      maxReduction: 640,
      description: "Impact d'une augmentation sur votre budget",
      unit: "€/mois",
      comparisonItems: [
        { name: "Loyer plus grand appart", value: 300 },
        { name: "Voiture électrique", value: 400 },
        { name: "Épargne retraite", value: 200 }
      ]
    },
    transport: {
      title: "Optimiser les transports",
      currentAmount: 280,
      maxReduction: 200,
      description: "Économies avec transports alternatifs",
      unit: "€/mois",
      comparisonItems: [
        { name: "1 voyage par trimestre", value: 250 },
        { name: "Équipement sportif", value: 100 },
        { name: "Cours en ligne", value: 50 }
      ]
    }
  };

  const currentScenario = scenarioData[scenarioId as keyof typeof scenarioData];
  const currentImpact = Math.round((sliderValue[0] / 100) * currentScenario.maxReduction);
  const projectedSavings = currentImpact * timeHorizon[0];

  const impactLevels = [
    { min: 0, max: 25, label: "Changement doux", color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { min: 26, max: 50, label: "Effort modéré", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
    { min: 51, max: 75, label: "Engagement sérieux", color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { min: 76, max: 100, label: "Transformation totale", color: "text-red-500", bgColor: "bg-red-500/10" }
  ];

  const getCurrentLevel = () => {
    return impactLevels.find(level => 
      sliderValue[0] >= level.min && sliderValue[0] <= level.max
    ) || impactLevels[0];
  };

  const getTimelineData = () => {
    const months = timeHorizon[0];
    return Array.from({ length: Math.min(months, 24) }, (_, i) => ({
      month: i + 1,
      cumulative: currentImpact * (i + 1),
      monthly: currentImpact
    }));
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold bg-gradient-revelation bg-clip-text text-transparent">
            🎯 Explorateur de Scénario
          </h1>
          <p className="text-lg text-muted-foreground">
            {currentScenario.title}
          </p>
        </div>
        
        <div className="flex gap-2">
          {[
            { id: 'impact', icon: BarChart3, label: 'Impact' },
            { id: 'timeline', icon: Calendar, label: 'Timeline' },
            { id: 'comparison', icon: PieChart, label: 'Comparaison' }
          ].map((mode) => (
            <RevelationButton
              key={mode.id}
              variant={visualMode === mode.id ? "revelation" : "glass"}
              size="sm"
              onClick={() => setVisualMode(mode.id as any)}
            >
              <mode.icon className="w-4 h-4" />
              {mode.label}
            </RevelationButton>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panneau de Contrôle */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <GlassCard>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Niveau d'Impact</h3>
                <div className={`text-3xl font-bold ${getCurrentLevel().color}`}>
                  {sliderValue[0]}%
                </div>
                <Badge className={`mt-2 ${getCurrentLevel().bgColor}`}>
                  {getCurrentLevel().label}
                </Badge>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">
                  Intensité du changement
                </label>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Minimal</span>
                  <span>Maximal</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <label className="text-sm font-medium">
                  Horizon temporel (mois)
                </label>
                <Slider
                  value={timeHorizon}
                  onValueChange={setTimeHorizon}
                  min={1}
                  max={36}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 mois</span>
                  <span>3 ans</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Résumé Impact */}
          <GlassCard className="bg-gradient-to-br from-success/10 to-accent/10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-success" />
                <h4 className="font-semibold">Impact Calculé</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Par mois:</span>
                  <span className="font-bold text-success">+{currentImpact}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sur {timeHorizon[0]} mois:</span>
                  <span className="font-bold text-success">+{projectedSavings}€</span>
                </div>
              </div>

              <div className="bg-success/10 rounded-lg p-3">
                <p className="text-sm font-medium text-success">
                  🎯 Probabilité de réussite: {100 - sliderValue[0]/2}%
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Zone de Visualisation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          {visualMode === 'impact' && (
            <GlassCard className="h-96">
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-6">
                  <motion.div
                    key={currentImpact}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-8xl font-bold bg-gradient-revelation bg-clip-text text-transparent"
                  >
                    +{currentImpact}€
                  </motion.div>
                  <p className="text-lg text-muted-foreground">
                    Économie mensuelle potentielle
                  </p>
                  
                  <div className="flex items-center justify-center gap-4">
                    {currentImpact > 100 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 text-success"
                      >
                        <TrendingUp className="w-6 h-6" />
                        <span className="font-semibold">Excellent potentiel!</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {visualMode === 'timeline' && (
            <GlassCard>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Projection sur {timeHorizon[0]} mois</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[3, 6, 12, 24].filter(m => m <= timeHorizon[0]).map((months) => (
                    <div key={months} className="bg-gradient-subtle rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {currentImpact * months}€
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {months} mois
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-accent/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="font-medium">Étapes recommandées</span>
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Mois 1-2: Adaptation et mise en place</li>
                    <li>• Mois 3-6: Consolidation des habitudes</li>
                    <li>• Mois 6+: Optimisation et ajustements</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          )}

          {visualMode === 'comparison' && (
            <GlassCard>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Avec +{currentImpact}€/mois, vous pouvez:</h3>
                
                <div className="grid gap-4">
                  {currentScenario.comparisonItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        currentImpact >= item.value 
                          ? 'bg-success/10 border border-success/20' 
                          : 'bg-muted/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          currentImpact >= item.value ? 'bg-success' : 'bg-muted'
                        }`} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.value}€</span>
                        {currentImpact >= item.value && (
                          <Badge variant="secondary" className="bg-success/20 text-success">
                            Possible
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between pt-6"
      >
        <RevelationButton variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Retour aux révélations
        </RevelationButton>
        
        <div className="flex gap-3">
          <RevelationButton variant="outline">
            Sauvegarder ce scénario
          </RevelationButton>
          <RevelationButton variant="revelation" particles>
            Planifier ce changement
            <Sparkles className="w-4 h-4" />
          </RevelationButton>
        </div>
      </motion.div>
    </div>
  );
};

export default ScenarioExplorer;