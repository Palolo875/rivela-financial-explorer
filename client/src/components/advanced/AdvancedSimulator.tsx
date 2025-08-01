import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, 
  Sliders, 
  TrendingUp, 
  Target, 
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  Save,
  Share2,
  Copy,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Home,
  Car,
  GraduationCap,
  Heart,
  Plane,
  Building
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { format, addYears, addMonths } from 'date-fns';
import numeral from 'numeral';
import { v4 as uuidv4 } from 'uuid';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

interface AdvancedSimulatorProps {
  userId: string;
}

interface SimulationParameters {
  goalType: string;
  targetAmount: number;
  timeHorizon: number;
  initialAmount: number;
  monthlyContribution: number;
  expectedReturn: number;
  riskTolerance: string;
  inflationRate: number;
  additionalParameters: Record<string, any>;
}

interface ScenarioResult {
  scenario: string;
  finalAmount: number;
  totalContributions: number;
  totalGains: number;
  monthlyPayment?: number;
  feasibility: 'excellent' | 'good' | 'challenging' | 'unrealistic';
}

const simulationTemplates = [
  {
    id: 'retirement',
    name: 'Planification retraite',
    icon: Target,
    description: 'Calculez combien épargner pour votre retraite',
    category: 'long-term',
    defaultParams: {
      targetAmount: 500000,
      timeHorizon: 30,
      expectedReturn: 7,
      inflationRate: 2.5,
    }
  },
  {
    id: 'house_purchase',
    name: 'Achat immobilier',
    icon: Home,
    description: 'Planifiez l\'achat de votre future maison',
    category: 'medium-term',
    defaultParams: {
      targetAmount: 300000,
      timeHorizon: 10,
      expectedReturn: 4,
      inflationRate: 2,
    }
  },
  {
    id: 'education_fund',
    name: 'Fonds éducation',
    icon: GraduationCap,
    description: 'Épargnez pour les études de vos enfants',
    category: 'medium-term',
    defaultParams: {
      targetAmount: 50000,
      timeHorizon: 18,
      expectedReturn: 5,
      inflationRate: 2.5,
    }
  },
  {
    id: 'emergency_fund',
    name: 'Fonds d\'urgence',
    icon: Heart,
    description: 'Constituez votre réserve de sécurité',
    category: 'short-term',
    defaultParams: {
      targetAmount: 20000,
      timeHorizon: 2,
      expectedReturn: 2.5,
      inflationRate: 2,
    }
  },
  {
    id: 'car_purchase',
    name: 'Achat véhicule',
    icon: Car,
    description: 'Financez votre prochain véhicule',
    category: 'short-term',
    defaultParams: {
      targetAmount: 25000,
      timeHorizon: 3,
      expectedReturn: 3,
      inflationRate: 2,
    }
  },
  {
    id: 'travel_fund',
    name: 'Voyage de rêve',
    icon: Plane,
    description: 'Planifiez votre voyage idéal',
    category: 'short-term',
    defaultParams: {
      targetAmount: 10000,
      timeHorizon: 2,
      expectedReturn: 3,
      inflationRate: 2,
    }
  }
];

const AdvancedSimulator: React.FC<AdvancedSimulatorProps> = ({ userId }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(simulationTemplates[0]);
  const [parameters, setParameters] = useState<SimulationParameters>({
    goalType: 'retirement',
    targetAmount: 500000,
    timeHorizon: 30,
    initialAmount: 5000,
    monthlyContribution: 500,
    expectedReturn: 7,
    riskTolerance: 'moderate',
    inflationRate: 2.5,
    additionalParameters: {}
  });
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [compareScenarios, setCompareScenarios] = useState(false);
  const [savedSimulations, setSavedSimulations] = useState<any[]>([]);
  const queryClient = useQueryClient();

  // Fetch user simulations
  const { data: userSimulations = [] } = useQuery({
    queryKey: ['user-simulations', userId],
    queryFn: () => fetch(`/api/user-simulations/${userId}`).then(res => res.json()),
  });

  // Save simulation mutation
  const saveSimulationMutation = useMutation({
    mutationFn: async (simulationData: any) => {
      const response = await fetch('/api/user-simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simulationData),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-simulations', userId] });
    },
  });

  // Compound interest calculation
  const calculateCompoundInterest = (params: SimulationParameters) => {
    const { initialAmount, monthlyContribution, expectedReturn, timeHorizon, inflationRate } = params;
    const monthlyRate = expectedReturn / 100 / 12;
    const months = timeHorizon * 12;
    
    let amount = initialAmount;
    const progression = [];
    
    for (let month = 0; month <= months; month++) {
      if (month > 0) {
        amount = amount * (1 + monthlyRate) + monthlyContribution;
      }
      
      if (month % 12 === 0) {
        const year = month / 12;
        const realValue = amount / Math.pow(1 + inflationRate / 100, year);
        progression.push({
          year,
          nominalValue: amount,
          realValue,
          contributions: initialAmount + (monthlyContribution * month),
          gains: amount - (initialAmount + monthlyContribution * month)
        });
      }
    }
    
    return progression;
  };

  // Generate multiple scenarios
  const generateScenarios = (baseParams: SimulationParameters): ScenarioResult[] => {
    const scenarios = [
      { name: 'Optimiste', returnModifier: 1.2, contributionModifier: 1.1 },
      { name: 'Réaliste', returnModifier: 1, contributionModifier: 1 },
      { name: 'Conservateur', returnModifier: 0.8, contributionModifier: 0.9 },
      { name: 'Pessimiste', returnModifier: 0.6, contributionModifier: 0.8 }
    ];

    return scenarios.map(scenario => {
      const modifiedParams = {
        ...baseParams,
        expectedReturn: baseParams.expectedReturn * scenario.returnModifier,
        monthlyContribution: baseParams.monthlyContribution * scenario.contributionModifier
      };
      
      const progression = calculateCompoundInterest(modifiedParams);
      const finalResult = progression[progression.length - 1];
      
      const feasibilityScore = (finalResult.nominalValue / baseParams.targetAmount) * 100;
      let feasibility: ScenarioResult['feasibility'] = 'unrealistic';
      
      if (feasibilityScore >= 100) feasibility = 'excellent';
      else if (feasibilityScore >= 80) feasibility = 'good';
      else if (feasibilityScore >= 60) feasibility = 'challenging';
      
      return {
        scenario: scenario.name,
        finalAmount: finalResult.nominalValue,
        totalContributions: finalResult.contributions,
        totalGains: finalResult.gains,
        feasibility
      };
    });
  };

  const progression = calculateCompoundInterest(parameters);
  const scenarios = generateScenarios(parameters);
  const finalResult = progression[progression.length - 1];

  // Chart data for progression
  const getProgressionChartData = () => ({
    labels: progression.map(p => `Année ${p.year}`),
    datasets: [
      {
        label: 'Valeur totale',
        data: progression.map(p => p.nominalValue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Contributions',
        data: progression.map(p => p.contributions),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Gains',
        data: progression.map(p => p.gains),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  });

  // Scenario comparison chart
  const getScenarioChartData = () => ({
    labels: scenarios.map(s => s.scenario),
    datasets: [{
      label: 'Montant final',
      data: scenarios.map(s => s.finalAmount),
      backgroundColor: scenarios.map(s => 
        s.feasibility === 'excellent' ? 'rgba(16, 185, 129, 0.8)' :
        s.feasibility === 'good' ? 'rgba(59, 130, 246, 0.8)' :
        s.feasibility === 'challenging' ? 'rgba(245, 158, 11, 0.8)' :
        'rgba(239, 68, 68, 0.8)'
      ),
      borderColor: scenarios.map(s => 
        s.feasibility === 'excellent' ? 'rgb(16, 185, 129)' :
        s.feasibility === 'good' ? 'rgb(59, 130, 246)' :
        s.feasibility === 'challenging' ? 'rgb(245, 158, 11)' :
        'rgb(239, 68, 68)'
      ),
      borderWidth: 2,
    }]
  });

  const handleTemplateChange = (template: typeof simulationTemplates[0]) => {
    setSelectedTemplate(template);
    setParameters({
      ...parameters,
      goalType: template.id,
      ...template.defaultParams
    });
  };

  const handleSaveSimulation = () => {
    const simulationData = {
      userId,
      name: `${selectedTemplate.name} - ${format(new Date(), 'dd/MM/yyyy')}`,
      templateId: selectedTemplate.id,
      parameters,
      results: {
        finalAmount: finalResult.nominalValue,
        totalContributions: finalResult.contributions,
        totalGains: finalResult.gains,
        scenarios
      },
      scenarios: scenarios,
    };

    saveSimulationMutation.mutate(simulationData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Simulateur Financier Avancé
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Planifiez et optimisez vos objectifs financiers
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleSaveSimulation} disabled={saveSimulationMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>

        {/* Template Selection */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Choisir un objectif
            </CardTitle>
            <CardDescription>Sélectionnez le type de simulation qui correspond à votre projet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulationTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                        selectedTemplate.id === template.id 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                      onClick={() => handleTemplateChange(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedTemplate.id === template.id 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                              {template.description}
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Parameters Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="h-5 w-5" />
                  Paramètres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Objectif financier</Label>
                  <Input
                    type="number"
                    value={parameters.targetAmount}
                    onChange={(e) => setParameters({
                      ...parameters,
                      targetAmount: parseFloat(e.target.value) || 0
                    })}
                    className="mt-1"
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    {numeral(parameters.targetAmount).format('0,0')}€
                  </p>
                </div>

                <div>
                  <Label>Horizon de temps (années)</Label>
                  <Slider
                    value={[parameters.timeHorizon]}
                    onValueChange={([value]) => setParameters({
                      ...parameters,
                      timeHorizon: value
                    })}
                    min={1}
                    max={50}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-sm text-slate-500 mt-1">{parameters.timeHorizon} années</p>
                </div>

                <div>
                  <Label>Montant initial</Label>
                  <Input
                    type="number"
                    value={parameters.initialAmount}
                    onChange={(e) => setParameters({
                      ...parameters,
                      initialAmount: parseFloat(e.target.value) || 0
                    })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Contribution mensuelle</Label>
                  <Input
                    type="number"
                    value={parameters.monthlyContribution}
                    onChange={(e) => setParameters({
                      ...parameters,
                      monthlyContribution: parseFloat(e.target.value) || 0
                    })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Rendement annuel attendu (%)</Label>
                  <Slider
                    value={[parameters.expectedReturn]}
                    onValueChange={([value]) => setParameters({
                      ...parameters,
                      expectedReturn: value
                    })}
                    min={0}
                    max={15}
                    step={0.1}
                    className="mt-2"
                  />
                  <p className="text-sm text-slate-500 mt-1">{parameters.expectedReturn}%</p>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Paramètres avancés</Label>
                  <Switch
                    checked={showAdvanced}
                    onCheckedChange={setShowAdvanced}
                  />
                </div>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <Label>Taux d'inflation (%)</Label>
                        <Slider
                          value={[parameters.inflationRate]}
                          onValueChange={([value]) => setParameters({
                            ...parameters,
                            inflationRate: value
                          })}
                          min={0}
                          max={10}
                          step={0.1}
                          className="mt-2"
                        />
                        <p className="text-sm text-slate-500 mt-1">{parameters.inflationRate}%</p>
                      </div>

                      <div>
                        <Label>Tolérance au risque</Label>
                        <Select
                          value={parameters.riskTolerance}
                          onValueChange={(value) => setParameters({
                            ...parameters,
                            riskTolerance: value
                          })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conservative">Conservateur</SelectItem>
                            <SelectItem value="moderate">Modéré</SelectItem>
                            <SelectItem value="aggressive">Agressif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardContent className="p-6">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {numeral(finalResult?.nominalValue || 0).format('0,0')}€
                    </div>
                    <div className="text-sm opacity-90">Montant final</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                <CardContent className="p-6">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {numeral(finalResult?.gains || 0).format('0,0')}€
                    </div>
                    <div className="text-sm opacity-90">Gains totaux</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Target className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {((finalResult?.nominalValue || 0) / parameters.targetAmount * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm opacity-90">Objectif atteint</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="progression" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="progression">Évolution</TabsTrigger>
                <TabsTrigger value="scenarios">Scénarios</TabsTrigger>
              </TabsList>

              <TabsContent value="progression">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Évolution de votre épargne
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Line
                        data={getProgressionChartData()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'top' },
                            tooltip: {
                              callbacks: {
                                label: (context) => `${context.dataset.label}: ${numeral(context.parsed.y).format('0,0')}€`
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: (value) => numeral(value).format('0,0') + '€'
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scenarios">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Comparaison de scénarios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 mb-6">
                      <Bar
                        data={getScenarioChartData()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              callbacks: {
                                label: (context) => `${numeral(context.parsed.y).format('0,0')}€`
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: (value) => numeral(value).format('0,0') + '€'
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {scenarios.map((scenario, index) => (
                        <div key={index} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{scenario.scenario}</h4>
                            <Badge variant={
                              scenario.feasibility === 'excellent' ? 'default' :
                              scenario.feasibility === 'good' ? 'secondary' :
                              scenario.feasibility === 'challenging' ? 'outline' :
                              'destructive'
                            }>
                              {scenario.feasibility}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Montant final:</span>
                              <span className="font-semibold">{numeral(scenario.finalAmount).format('0,0')}€</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Contributions:</span>
                              <span>{numeral(scenario.totalContributions).format('0,0')}€</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Gains:</span>
                              <span className="text-green-600">{numeral(scenario.totalGains).format('0,0')}€</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSimulator;