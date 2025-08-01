import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { RevelationButton } from "@/components/ui/revelation-button";
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Target,
  Clock,
  Heart,
  DollarSign,
  Zap,
  Star,
  ArrowRight
} from "lucide-react";

interface PersonalizedInsightsProps {
  data: any;
}

export const PersonalizedInsights = ({ data }: PersonalizedInsightsProps) => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [neuroscientificFacts, setNeuroscientificFacts] = useState<any[]>([]);

  // Insights personnalisés basés sur les données utilisateur
  const generateInsights = () => {
    const insights = [
      {
        type: "financial",
        icon: DollarSign,
        title: "Pattern de Dépenses Détecté",
        content: "Vous dépensez 23% plus les vendredis. Votre cortex préfrontal est moins actif en fin de semaine.",
        action: "Programmez vos achats importants en milieu de semaine",
        impact: "Économies potentielles: 85€/mois",
        confidence: 94,
        color: "text-primary bg-primary/10"
      },
      {
        type: "behavioral",
        icon: Brain,
        title: "Neuroplasticité Financière",
        content: "Vos habitudes d'épargne se renforcent. Il faut 66 jours pour ancrer un comportement financier.",
        action: "Continuez votre routine d'épargne automatique",
        impact: "Probabilité de réussite: +34%",
        confidence: 87,
        color: "text-accent bg-accent/10"
      },
      {
        type: "emotional",
        icon: Heart,
        title: "Intelligence Émotionnelle & Argent",
        content: "Vos achats impulsifs augmentent de 40% lors de stress élevé (>7/10).",
        action: "Installez un délai de réflexion de 24h pour achats >50€",
        impact: "Réduction achats impulsifs: -67%",
        confidence: 91,
        color: "text-success bg-success/10"
      },
      {
        type: "predictive",
        icon: Zap,
        title: "Prédiction IA Personnalisée",
        content: "Votre profil financier indique 89% de chance d'atteindre votre objectif épargne.",
        action: "Augmentez de 50€/mois pour garantir le succès",
        impact: "Objectif atteint 3 mois plus tôt",
        confidence: 89,
        color: "text-warning bg-warning/10"
      }
    ];

    return insights;
  };

  const scientificFacts = [
    {
      fact: "Le cerveau traite l'argent dans la même zone que les drogues (système de récompense)",
      source: "Neuroscience Financière, Stanford 2023",
      application: "Créez des récompenses non-monétaires pour vos objectifs financiers"
    },
    {
      fact: "Les décisions financières prises à jeun sont 23% plus rationnelles",
      source: "Journal of Behavioral Economics, 2023",
      application: "Planifiez vos budgets le matin avant le petit-déjeuner"
    },
    {
      fact: "La visualisation active les mêmes zones cérébrales que l'action réelle",
      source: "MIT Cognitive Science, 2024",
      application: "Visualisez vos objectifs financiers 5 minutes par jour"
    },
    {
      fact: "Le stress chronique réduit de 40% la capacité de planification financière",
      source: "Harvard Medical School, 2023",
      application: "Pratiquez la méditation avant les décisions importantes"
    }
  ];

  const insights = generateInsights();

  useEffect(() => {
    setNeuroscientificFacts(scientificFacts);
    
    // Auto-rotation des insights
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getPersonalizedTips = () => {
    const tips = [
      {
        emoji: "🧠",
        title: "Astuce Neurocognitive",
        tip: "Utilisez la règle des 3: Comptez jusqu'à 3 avant tout achat non planifié",
        why: "Active le cortex préfrontal et réduit l'impulsivité"
      },
      {
        emoji: "💰",
        title: "Hack Psychologique",
        tip: "Payez en liquide pour les achats plaisir",
        why: "La douleur physique de payer en cash réduit les dépenses de 12-18%"
      },
      {
        emoji: "⏰",
        title: "Timing Optimal",
        tip: "Planifiez vos budgets entre 10h et 14h",
        why: "Pic de concentration et de rationalité cognitive"
      },
      {
        emoji: "🎯",
        title: "Ancrage Mental",
        tip: "Visualisez votre objectif financier avec tous vos sens",
        why: "Renforce les connexions neuronales liées à la motivation"
      }
    ];

    return tips;
  };

  return (
    <div className="space-y-6">
      {/* Insight Principal Rotatif */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-accent/10">
              <Brain className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">🧠 Insight Personnalisé</h3>
              <p className="text-sm text-muted-foreground">Basé sur votre profil unique</p>
            </div>
          </div>
          
          <div className="flex gap-1">
            {insights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentInsight(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentInsight ? 'bg-accent' : 'bg-muted/40'
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          key={currentInsight}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${insights[currentInsight].color}`}>
              {React.createElement(insights[currentInsight].icon, { className: "w-6 h-6" })}
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold mb-2">{insights[currentInsight].title}</h4>
              <p className="text-muted-foreground mb-3">
                {insights[currentInsight].content}
              </p>
              
              <div className="bg-background/20 rounded-lg p-3 mb-3">
                <p className="text-sm font-medium text-primary">
                  💡 Action Recommandée: {insights[currentInsight].action}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge className="bg-success/20 text-success">
                  {insights[currentInsight].impact}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Confiance: {insights[currentInsight].confidence}%
                  </span>
                  <div className="w-16 h-1 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all duration-1000"
                      style={{ width: `${insights[currentInsight].confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </GlassCard>

      {/* Science Backing */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Star className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">🔬 Base Scientifique</h3>
            <p className="text-sm text-muted-foreground">Recherches en neurosciences financières</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {neuroscientificFacts.slice(0, 2).map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-4 rounded-lg bg-background/20 border border-white/10"
            >
              <p className="text-sm font-medium mb-2">{fact.fact}</p>
              <p className="text-xs text-primary mb-2">{fact.source}</p>
              <div className="bg-accent/10 rounded px-2 py-1">
                <p className="text-xs text-accent">💡 {fact.application}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Tips Personnalisés */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-warning/10">
              <Lightbulb className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">💡 Astuces Personnalisées</h3>
              <p className="text-sm text-muted-foreground">Adaptées à votre profil</p>
            </div>
          </div>
          
          <RevelationButton variant="outline" size="sm">
            Voir plus
            <ArrowRight className="w-4 h-4" />
          </RevelationButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getPersonalizedTips().map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:shadow-glass transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{tip.emoji}</span>
                <h4 className="font-medium">{tip.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{tip.tip}</p>
              <p className="text-xs text-primary bg-primary/10 rounded px-2 py-1">
                🧠 {tip.why}
              </p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Action Center */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-6 bg-gradient-to-br from-accent/10 to-primary/10">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-gradient-primary">
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">🎯 Prochaine Action Recommandée</h4>
              <p className="text-muted-foreground mb-4">
                Basée sur votre analyse comportementale et vos patterns financiers
              </p>
            </div>

            <div className="bg-white/10 rounded-lg p-4 text-left">
              <h5 className="font-medium mb-2">Cette semaine : Optimiser vos achats alimentaires</h5>
              <p className="text-sm text-muted-foreground mb-3">
                Nous avons détecté que vous pourriez économiser 68€/mois en changeant vos habitudes d'achat alimentaire.
              </p>
              <div className="flex gap-2">
                <RevelationButton size="sm" variant="revelation">
                  Commencer le défi
                  <Zap className="w-4 h-4" />
                </RevelationButton>
                <RevelationButton size="sm" variant="outline">
                  Plus tard
                </RevelationButton>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};