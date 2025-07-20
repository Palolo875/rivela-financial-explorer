import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionInput } from "@/components/financial/QuestionInput";
import { FinancialMapping, FinancialData } from "@/components/financial/FinancialMapping";
import RevelationScreen from "@/components/financial/RevelationScreen";
import ScenarioExplorer from "@/components/financial/ScenarioExplorer";

type AppStep = "question" | "mapping" | "revelation" | "scenario";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>("question");
  const [userQuestion, setUserQuestion] = useState("");
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const handleQuestionSubmit = (question: string) => {
    setUserQuestion(question);
    setCurrentStep("mapping");
  };

  const handleMappingSubmit = (data: FinancialData) => {
    setFinancialData(data);
    setCurrentStep("revelation");
  };

  const handleBackToQuestion = () => {
    setCurrentStep("question");
    setUserQuestion("");
  };

  const handleBackToMapping = () => {
    setCurrentStep("mapping");
    setFinancialData(null);
  };

  const handleScenarioExploration = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setCurrentStep("scenario");
  };

  const handleBackToRevelation = () => {
    setSelectedScenario(null);
    setCurrentStep("revelation");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-success/20 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {currentStep === "question" && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <QuestionInput onSubmit={handleQuestionSubmit} />
            </motion.div>
          )}

          {currentStep === "mapping" && (
            <motion.div
              key="mapping"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
            >
              <FinancialMapping
                question={userQuestion}
                onSubmit={handleMappingSubmit}
                onBack={handleBackToQuestion}
              />
            </motion.div>
          )}

          {currentStep === "revelation" && financialData && (
            <motion.div
              key="revelation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8 }}
            >
              <RevelationScreen
                data={{
                  question: userQuestion,
                  financialData,
                  emotionalContext: {}
                }}
                onBack={handleBackToMapping}
                onExploreScenario={handleScenarioExploration}
              />
            </motion.div>
          )}

          {currentStep === "scenario" && selectedScenario && (
            <motion.div
              key="scenario"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
            >
              <ScenarioExplorer
                scenarioId={selectedScenario}
                onBack={handleBackToRevelation}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>100% Confidentiel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Science Vérifiée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span>Insights Personnalisés</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
