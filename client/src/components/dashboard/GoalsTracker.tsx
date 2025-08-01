import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RevelationButton } from "@/components/ui/revelation-button";
import { 
  Target, 
  Plus, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Home,
  Car,
  Plane,
  GraduationCap,
  Heart,
  Sparkles
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  icon: any;
  priority: 'high' | 'medium' | 'low';
  status: 'on_track' | 'behind' | 'ahead' | 'completed';
}

interface GoalsTrackerProps {
  goals: Goal[];
}

export const GoalsTracker = ({ goals: initialGoals }: GoalsTrackerProps) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);

  useEffect(() => {
    // Objectifs par défaut si aucun n'est fourni
    const defaultGoals: Goal[] = [
      {
        id: '1',
        title: 'Apport pour appartement',
        description: 'Premier achat immobilier',
        targetAmount: 50000,
        currentAmount: 28500,
        deadline: '2025-06-01',
        category: 'Immobilier',
        icon: Home,
        priority: 'high',
        status: 'on_track'
      },
      {
        id: '2',
        title: 'Fonds d\'urgence',
        description: '6 mois de charges',
        targetAmount: 12000,
        currentAmount: 8400,
        deadline: '2024-12-31',
        category: 'Sécurité',
        icon: Heart,
        priority: 'high',
        status: 'ahead'
      },
      {
        id: '3',
        title: 'Voyage au Japon',
        description: 'Vacances de rêve',
        targetAmount: 4500,
        currentAmount: 1200,
        deadline: '2025-03-15',
        category: 'Loisirs',
        icon: Plane,
        priority: 'medium',
        status: 'behind'
      },
      {
        id: '4',
        title: 'Formation développement',
        description: 'Bootcamp développeur',
        targetAmount: 8000,
        currentAmount: 5600,
        deadline: '2024-09-01',
        category: 'Éducation',
        icon: GraduationCap,
        priority: 'medium',
        status: 'on_track'
      }
    ];

    setGoals(initialGoals.length > 0 ? initialGoals : defaultGoals);
  }, [initialGoals]);

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTimeToGoal = (deadline: string, currentAmount: number, targetAmount: number, monthlyContribution: number = 300) => {
    const remaining = targetAmount - currentAmount;
    const monthsNeeded = Math.ceil(remaining / monthlyContribution);
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const monthsUntilDeadline = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    return {
      monthsNeeded,
      monthsUntilDeadline,
      isOnTrack: monthsNeeded <= monthsUntilDeadline
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { color: 'text-success', bg: 'bg-success/10', icon: CheckCircle };
      case 'ahead': return { color: 'text-primary', bg: 'bg-primary/10', icon: TrendingUp };
      case 'on_track': return { color: 'text-warning', bg: 'bg-warning/10', icon: Target };
      case 'behind': return { color: 'text-destructive', bg: 'bg-destructive/10', icon: AlertCircle };
      default: return { color: 'text-muted', bg: 'bg-muted/10', icon: Target };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-destructive';
      case 'medium': return 'border-l-4 border-warning';
      case 'low': return 'border-l-4 border-success';
      default: return '';
    }
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">🎯 Suivi des Objectifs</h3>
              <p className="text-sm text-muted-foreground">{goals.length} objectifs actifs</p>
            </div>
          </div>
          
          <RevelationButton 
            onClick={() => setShowAddGoal(true)}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            Nouvel objectif
          </RevelationButton>
        </div>

        {/* Progression globale */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progression Globale</span>
            <span className="text-sm text-muted-foreground">
              {totalSaved.toLocaleString()}€ / {totalTarget.toLocaleString()}€
            </span>
          </div>
          
          <Progress value={overallProgress} className="h-3" />
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 rounded-lg bg-success/10">
              <div className="text-lg font-bold text-success">
                {goals.filter(g => g.status === 'completed' || g.status === 'ahead').length}
              </div>
              <p className="text-xs text-muted-foreground">En avance/Atteints</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-warning/10">
              <div className="text-lg font-bold text-warning">
                {goals.filter(g => g.status === 'on_track').length}
              </div>
              <p className="text-xs text-muted-foreground">Sur la bonne voie</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-destructive/10">
              <div className="text-lg font-bold text-destructive">
                {goals.filter(g => g.status === 'behind').length}
              </div>
              <p className="text-xs text-muted-foreground">En retard</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Liste des objectifs */}
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const statusInfo = getStatusColor(goal.status);
          const StatusIcon = statusInfo.icon;
          const timeInfo = getTimeToGoal(goal.deadline, goal.currentAmount, goal.targetAmount);
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className={`p-6 ${getPriorityColor(goal.priority)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${statusInfo.bg}`}>
                      <goal.icon className={`w-6 h-6 ${statusInfo.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{goal.title}</h4>
                        <Badge className={`${statusInfo.bg} ${statusInfo.color} text-xs`}>
                          {goal.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {goal.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(goal.deadline).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {timeInfo.isOnTrack ? 
                              `${timeInfo.monthsNeeded} mois requis` : 
                              `${timeInfo.monthsNeeded - timeInfo.monthsUntilDeadline} mois de retard`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                    <span className={`text-sm font-medium ${statusInfo.color}`}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {goal.currentAmount.toLocaleString()}€
                    </span>
                    <span className="text-muted-foreground">
                      {goal.targetAmount.toLocaleString()}€
                    </span>
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Reste: {(goal.targetAmount - goal.currentAmount).toLocaleString()}€
                    </span>
                    
                    {progress < 100 && (
                      <div className="text-xs text-primary bg-primary/10 rounded px-2 py-1">
                        💡 +{Math.ceil((goal.targetAmount - goal.currentAmount) / timeInfo.monthsUntilDeadline)}€/mois
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="flex gap-2 mt-4">
                  <RevelationButton size="sm" variant="outline" className="flex-1">
                    Ajuster
                  </RevelationButton>
                  <RevelationButton size="sm" variant="ghost" className="flex-1">
                    Modifier
                  </RevelationButton>
                  {progress >= 100 && (
                    <RevelationButton size="sm" variant="revelation" className="flex-1">
                      <Sparkles className="w-4 h-4" />
                      Célébrer !
                    </RevelationButton>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Recommandations d'optimisation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-6 bg-gradient-to-br from-accent/10 to-primary/10">
          <h4 className="font-semibold mb-4">🚀 Optimisations Suggérées</h4>
          
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-white/10">
              <p className="text-sm font-medium">Priorisez votre fonds d'urgence</p>
              <p className="text-xs text-muted-foreground">
                Atteignez d'abord 6 mois de charges avant les autres objectifs
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-white/10">
              <p className="text-sm font-medium">Automatisez vos virements</p>
              <p className="text-xs text-muted-foreground">
                +23% de réussite avec l'épargne automatique
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-white/10">
              <p className="text-sm font-medium">Révisez vos échéances</p>
              <p className="text-xs text-muted-foreground">
                3 objectifs ont des délais trop serrés
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};