import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { FinancialInput } from "@/components/ui/financial-input";
import { RevelationButton } from "@/components/ui/revelation-button";
import { cn } from "@/lib/utils";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  placeholder?: string;
  examples?: string[];
}

const QuestionInput = ({ 
  onSubmit, 
  placeholder = "Ex: Pourquoi j'ai toujours -200€ en fin de mois ?",
  examples = [
    "Pourquoi j'ai toujours -200€ en fin de mois ?",
    "Puis-je vraiment m'acheter une voiture électrique ?",
    "Quel est l'impact de mes cafés quotidiens sur mon budget ?",
    "Comment optimiser mes dépenses pour épargner 500€/mois ?"
  ]
}: QuestionInputProps) => {
  const [question, setQuestion] = useState("");
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() || selectedExample) {
      onSubmit(selectedExample || question.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setSelectedExample(example);
    setQuestion(example);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium shadow-soft">
          <Sparkles className="w-4 h-4" />
          Explorateur Financier Rivela
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-revelation bg-clip-text text-transparent">
          Révélez l'invisible de vos finances
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Posez votre question financière personnelle et découvrez les insights neuroscientifiques cachés dans vos données
        </p>
      </motion.div>

      {/* Question Input */}
      <GlassCard className="p-8 space-y-6">
        <div className="flex items-center gap-3 text-lg font-semibold text-foreground">
          <MessageCircle className="w-6 h-6 text-primary" />
          Quelle est votre question financière ?
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FinancialInput
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              setSelectedExample(null);
            }}
            placeholder={placeholder}
            className="text-lg h-14"
            icon={<MessageCircle className="w-5 h-5" />}
          />
          
          <RevelationButton 
            type="submit"
            variant="revelation"
            size="xl"
            className="w-full"
            particles
            disabled={!question.trim() && !selectedExample}
          >
            Révéler les insights
            <ArrowRight className="w-5 h-5" />
          </RevelationButton>
        </form>
      </GlassCard>

      {/* Example Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-center text-muted-foreground">
          Ou choisissez une question d'exemple
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {examples.map((example, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              onClick={() => handleExampleClick(example)}
              className={cn(
                "glass-card p-4 text-left rounded-lg transition-all duration-300",
                "hover:shadow-revelation hover:scale-105 hover:bg-gradient-primary/10",
                selectedExample === example && "ring-2 ring-primary bg-gradient-primary/20"
              )}
            >
              <p className="text-sm text-foreground/80 font-medium">{example}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="flex justify-center items-center gap-8 text-sm text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          100% Confidentiel
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          Science Vérifiée
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full"></div>
          Insights Personnalisés
        </div>
      </motion.div>
    </div>
  );
};

export { QuestionInput };