import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { RevelationButton } from "@/components/ui/revelation-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  TrendingUp, 
  Calculator, 
  Lightbulb, 
  Target,
  Sparkles,
  ArrowRight,
  Coffee,
  Car,
  Home
} from "lucide-react";

interface RevelationData {
  question: string;
  financialData: any;
  emotionalContext: any;
}

interface RevelationScreenProps {
  data: RevelationData;
  onBack: () => void;
  onExploreScenario: (scenario: string) => void;
}

const RevelationScreen = ({ data, onBack, onExploreScenario }: RevelationScreenProps) => {
  const [currentView, setCurrentView] = useState<'equation' | 'scenarios' | 'science'>('equation');
  const [revealedInsights, setRevealedInsights] = useState<string[]>([]);

  // Calculs financiers simulés
  const financialEquation = {
    income: 3200,
    fixedExpenses: 1850,
    variableExpenses: 950,
    remaining: 400,
    savingsRate: 12.5,
    riskLevel: "Modéré"
  };

  const scenarios = [
    {
      id: 'coffee',
      title: "Vos 5 cafés/jour",
      icon: Coffee,
      comparison: "= 1 week-end à la mer/mois",
      impact: "+180€/mois d'épargne",
      probability: "87% de réussite",
      gradient: "from-amber-400/20 to-orange-500/20"
    },
    {
      id: 'salary',
      title: "Augmentation 10%",
      icon: TrendingUp,
      comparison: "= Nouvel appartement possible",
      impact: "+320€/mois disponibles",
      probability: "Objectif 18 mois",
      gradient: "from-emerald-400/20 to-green-500/20"
    },
    {
      id: 'transport',
      title: "Transport alternatif",
      icon: Car,
      comparison: "= 2 voyages/an économisés",
      impact: "+250€/mois libérés",
      probability: "Faisable en 3 mois",
      gradient: "from-blue-400/20 to-indigo-500/20"
    }
  ];

  const scientificPrinciples = [
    {
      title: "Biais de Disponibilité",
      description: "Votre cerveau surestime les dépenses récentes de 340%",
      study: "Kahneman & Tversky, 2023",
      relevance: "Explique vos -200€ en fin de mois"
    },
    {
      title: "Dopamine & Récompense",
      description: "Chaque achat < 20€ active le circuit de récompense",
      study: "MIT Neural Economics Lab",
      relevance: "Vos microtransactions = 23% du budget"
    }
  ];

  const revealInsight = (insight: string) => {
    if (!revealedInsights.includes(insight)) {
      setRevealedInsights([...revealedInsights, insight]);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header avec Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold bg-gradient-revelation bg-clip-text text-transparent">
            🔮 Votre Révélation Financière
          </h1>
          <p className="text-muted-foreground">
            "{data.question}"
          </p>
        </div>
        
        <div className="flex gap-2">
          {['equation', 'scenarios', 'science'].map((view) => (
            <RevelationButton
              key={view}
              variant={currentView === view ? "revelation" : "glass"}
              size="sm"
              onClick={() => setCurrentView(view as any)}
              animate={true}
            >
              {view === 'equation' && <Calculator className="w-4 h-4" />}
              {view === 'scenarios' && <Target className="w-4 h-4" />}
              {view === 'science' && <Brain className="w-4 h-4" />}
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </RevelationButton>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Vue Équation */}
        {currentView === 'equation' && (
          <motion.div
            key="equation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Équation Principale */}
            <GlassCard className="col-span-full" glow animate>
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                  <h2 className="text-3xl font-bold">Votre Équation Personnelle</h2>
                  <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                </div>

                <div className="bg-gradient-subtle rounded-lg p-8 space-y-4">
                  <div className="text-6xl font-bold text-primary">
                    {financialEquation.income}€
                  </div>
                  <div className="text-lg text-muted-foreground">revenus mensuels</div>
                  
                  <div className="flex items-center justify-center gap-4 text-2xl">
                    <span className="text-destructive">- {financialEquation.fixedExpenses}€</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-warning">- {financialEquation.variableExpenses}€</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-success font-bold">{financialEquation.remaining}€</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-destructive">Charges fixes</div>
                    <div className="text-warning">Dépenses variables</div>
                    <div className="text-success">Reste disponible</div>
                  </div>
                </div>

                <Badge variant="secondary" className="px-4 py-2">
                  Taux d'épargne: {financialEquation.savingsRate}% - {financialEquation.riskLevel}
                </Badge>
              </div>
            </GlassCard>

            {/* Insights Révélés */}
            <GlassCard hover onClick={() => revealInsight('spending-pattern')}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-semibold">Pattern de Dépenses</h3>
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: revealedInsights.includes('spending-pattern') ? 1 : 0.5 }}
                  className="space-y-2"
                >
                  <p className="text-muted-foreground">
                    Vos dépenses suivent un cycle de 7 jours avec des pics le weekend
                  </p>
                  <div className="bg-accent/10 rounded-lg p-3">
                    <p className="text-sm font-medium">
                      💡 68% de vos achats impulsifs ont lieu après 19h
                    </p>
                  </div>
                </motion.div>
              </div>
            </GlassCard>

            <GlassCard hover onClick={() => revealInsight('emotional-trigger')}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Déclencheur Émotionnel</h3>
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: revealedInsights.includes('emotional-trigger') ? 1 : 0.5 }}
                  className="space-y-2"
                >
                  <p className="text-muted-foreground">
                    Corrélation: Stress ↗ = Dépenses ↗ (+23%)
                  </p>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-sm font-medium">
                      🧠 Votre humeur influence 34% de vos décisions financières
                    </p>
                  </div>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Vue Scénarios */}
        {currentView === 'scenarios' && (
          <motion.div
            key="scenarios"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <GlassCard>
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Mode "Et si ?" - Explorez vos possibles</h2>
                <p className="text-muted-foreground">
                  Découvrez l'impact de petits changements sur votre situation
                </p>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scenarios.map((scenario) => (
                <motion.div
                  key={scenario.id}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <GlassCard 
                    className={`h-full bg-gradient-to-br ${scenario.gradient} border-white/30`}
                    hover
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <scenario.icon className="w-8 h-8 text-primary" />
                        <Badge variant="outline" className="text-xs">
                          {scenario.probability}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{scenario.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {scenario.comparison}
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div className="text-2xl font-bold text-success">
                          {scenario.impact}
                        </div>
                        
                        <RevelationButton
                          variant="revelation"
                          size="sm"
                          className="w-full"
                          onClick={() => onExploreScenario(scenario.id)}
                          particles
                        >
                          Explorer ce scénario
                          <ArrowRight className="w-4 h-4" />
                        </RevelationButton>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Vue Science */}
        {currentView === 'science' && (
          <motion.div
            key="science"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <GlassCard glow>
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Brain className="w-8 h-8 text-accent" />
                  <h2 className="text-2xl font-bold">Neuroscience derrière vos Finances</h2>
                </div>
                <p className="text-muted-foreground">
                  Comprendre les mécanismes cérébraux qui influencent vos décisions
                </p>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {scientificPrinciples.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <GlassCard className="h-full" hover>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">Science vérifiée</Badge>
                        <Badge variant="outline">{principle.study}</Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold text-primary">
                        {principle.title}
                      </h3>
                      
                      <p className="text-muted-foreground">
                        {principle.description}
                      </p>
                      
                      <div className="bg-accent/10 rounded-lg p-4">
                        <p className="text-sm font-medium text-accent">
                          💡 Application: {principle.relevance}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between pt-6"
      >
        <RevelationButton variant="ghost" onClick={onBack}>
          Retour à l'exploration
        </RevelationButton>
        
        <div className="flex gap-3">
          <RevelationButton variant="outline">
            Exporter le rapport
          </RevelationButton>
          <RevelationButton variant="revelation" particles>
            Nouvelle exploration
            <Sparkles className="w-4 h-4" />
          </RevelationButton>
        </div>
      </motion.div>
    </div>
  );
};

export default RevelationScreen;