import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, 
  Home, 
  Coffee, 
  CreditCard, 
  Target, 
  Heart,
  Plus,
  Trash2,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { FinancialInput } from "@/components/ui/financial-input";
import { RevelationButton } from "@/components/ui/revelation-button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface FinancialData {
  revenus: Array<{ nom: string; montant: number }>;
  depensesFixes: Array<{ nom: string; montant: number }>;
  depensesVariables: Array<{ nom: string; montant: number }>;
  dettes: Array<{ nom: string; montant: number; taux?: number }>;
  objectifs: Array<{ nom: string; montant: number; echeance: string }>;
  contexteEmotionnel: {
    humeur: number;
    tags: string[];
  };
}

interface FinancialMappingProps {
  question: string;
  onSubmit: (data: FinancialData) => void;
  onBack: () => void;
}

const emotionalTags = [
  "Stress au travail", "Événement familial", "Pression sociale", 
  "Motivation élevée", "Fatigue", "Optimisme", "Anxiété", "Confiance"
];

const FinancialMapping = ({ question, onSubmit, onBack }: FinancialMappingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FinancialData>({
    revenus: [{ nom: "", montant: 0 }],
    depensesFixes: [{ nom: "", montant: 0 }],
    depensesVariables: [{ nom: "", montant: 0 }],
    dettes: [],
    objectifs: [],
    contexteEmotionnel: {
      humeur: 5,
      tags: []
    }
  });

  const steps = [
    { title: "Revenus", icon: DollarSign, key: "revenus" as keyof FinancialData },
    { title: "Dépenses Fixes", icon: Home, key: "depensesFixes" as keyof FinancialData },
    { title: "Dépenses Variables", icon: Coffee, key: "depensesVariables" as keyof FinancialData },
    { title: "Dettes", icon: CreditCard, key: "dettes" as keyof FinancialData },
    { title: "Objectifs", icon: Target, key: "objectifs" as keyof FinancialData },
    { title: "Contexte Émotionnel", icon: Heart, key: "contexteEmotionnel" as keyof FinancialData }
  ];

  const addItem = (category: keyof FinancialData) => {
    if (category === "contexteEmotionnel") return;
    
    setData(prev => ({
      ...prev,
      [category]: [
        ...(prev[category] as any[]),
        category === "objectifs" 
          ? { nom: "", montant: 0, echeance: "" }
          : category === "dettes"
          ? { nom: "", montant: 0, taux: 0 }
          : { nom: "", montant: 0 }
      ]
    }));
  };

  const removeItem = (category: keyof FinancialData, index: number) => {
    if (category === "contexteEmotionnel") return;
    
    setData(prev => ({
      ...prev,
      [category]: (prev[category] as any[]).filter((_, i) => i !== index)
    }));
  };

  const updateItem = (category: keyof FinancialData, index: number, field: string, value: any) => {
    if (category === "contexteEmotionnel") return;
    
    setData(prev => ({
      ...prev,
      [category]: (prev[category] as any[]).map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const toggleEmotionalTag = (tag: string) => {
    setData(prev => ({
      ...prev,
      contexteEmotionnel: {
        ...prev.contexteEmotionnel,
        tags: prev.contexteEmotionnel.tags.includes(tag)
          ? prev.contexteEmotionnel.tags.filter(t => t !== tag)
          : [...prev.contexteEmotionnel.tags, tag]
      }
    }));
  };

  const renderStep = () => {
    const step = steps[currentStep];
    
    if (step.key === "contexteEmotionnel") {
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-lg font-semibold text-foreground">
              Comment vous sentez-vous actuellement ? (1-10)
            </label>
            <div className="space-y-2">
              <Slider
                value={[data.contexteEmotionnel.humeur]}
                onValueChange={(value) => setData(prev => ({
                  ...prev,
                  contexteEmotionnel: { ...prev.contexteEmotionnel, humeur: value[0] }
                }))}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">
                  {data.contexteEmotionnel.humeur}/10
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-lg font-semibold text-foreground">
              Contexte émotionnel actuel
            </label>
            <div className="flex flex-wrap gap-3">
              {emotionalTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={data.contexteEmotionnel.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleEmotionalTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const items = data[step.key] as any[];

    return (
      <div className="space-y-6">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-4 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-foreground">
                  {step.title} #{index + 1}
                </h4>
                {items.length > 1 && (
                  <RevelationButton
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(step.key, index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </RevelationButton>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FinancialInput
                  label="Nom"
                  value={item.nom}
                  onChange={(e) => updateItem(step.key, index, "nom", e.target.value)}
                  placeholder={`Ex: ${step.title === "Revenus" ? "Salaire" : step.title === "Dépenses Fixes" ? "Loyer" : step.title === "Dépenses Variables" ? "Courses" : step.title === "Dettes" ? "Crédit auto" : "Épargne"}`}
                  animate={false}
                />
                <FinancialInput
                  label="Montant"
                  type="number"
                  value={item.montant || ""}
                  onChange={(e) => updateItem(step.key, index, "montant", parseFloat(e.target.value) || 0)}
                  suffix="€"
                  animate={false}
                />
              </div>

              {step.key === "dettes" && (
                <FinancialInput
                  label="Taux d'intérêt (optionnel)"
                  type="number"
                  value={item.taux || ""}
                  onChange={(e) => updateItem(step.key, index, "taux", parseFloat(e.target.value) || 0)}
                  suffix="%"
                  animate={false}
                />
              )}

              {step.key === "objectifs" && (
                <FinancialInput
                  label="Échéance"
                  type="date"
                  value={item.echeance || ""}
                  onChange={(e) => updateItem(step.key, index, "echeance", e.target.value)}
                  animate={false}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <RevelationButton
          variant="glass"
          onClick={() => addItem(step.key)}
          className="w-full"
        >
          <Plus className="w-4 h-4" />
          Ajouter {step.title.toLowerCase()}
        </RevelationButton>
      </div>
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Question Context */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 text-primary">
          <TrendingUp className="w-6 h-6" />
          <span className="font-semibold">Votre question :</span>
        </div>
        <p className="mt-2 text-lg text-foreground/80 italic">"{question}"</p>
      </GlassCard>

      {/* Progress */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Étape {currentStep + 1} sur {steps.length}</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% complété</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-gradient-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-center">
        <div className="flex gap-4 p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  index === currentStep
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : index < currentStep
                    ? "bg-success/20 text-success hover:bg-success/30"
                    : "bg-white/20 text-muted-foreground hover:bg-white/30"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Current Step */}
      <GlassCard className="p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-xl font-bold text-foreground">
            {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-primary" })}
            {steps[currentStep].title}
          </div>
          
          {renderStep()}
        </div>
      </GlassCard>

      {/* Navigation */}
      <div className="flex justify-between">
        <RevelationButton variant="glass" onClick={handleBack}>
          Retour
        </RevelationButton>
        <RevelationButton 
          variant={currentStep === steps.length - 1 ? "revelation" : "default"}
          onClick={handleNext}
          particles={currentStep === steps.length - 1}
        >
          {currentStep === steps.length - 1 ? "Révéler les insights" : "Suivant"}
          <ArrowRight className="w-4 h-4" />
        </RevelationButton>
      </div>
    </div>
  );
};

export { FinancialMapping };
export type { FinancialData };