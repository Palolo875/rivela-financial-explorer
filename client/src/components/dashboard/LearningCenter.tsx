import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RevelationButton } from "@/components/ui/revelation-button";
import { 
  BookOpen, 
  Brain,
  Target,
  Clock,
  CheckCircle,
  Play,
  Bookmark,
  Star,
  Users,
  TrendingUp,
  Lightbulb,
  Award,
  ArrowRight
} from "lucide-react";

interface LearningCenterProps {
  userProfile: any;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  personalizedFor?: string;
  completion: number;
  tags: string[];
}

interface LessonsData {
  [key: string]: Lesson[];
}

interface CategoryInfo {
  name: string;
  icon: any;
  description: string;
}

interface CategoriesData {
  [key: string]: CategoryInfo;
}

export const LearningCenter = ({ userProfile }: LearningCenterProps) => {
  const [selectedCategory, setSelectedCategory] = useState("recommended");
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const learningCategories: CategoriesData = {
    recommended: {
      name: "Recommandé pour vous",
      icon: Target,
      description: "Leçons adaptées à votre profil et situation"
    },
    fundamentals: {
      name: "Fondamentaux",
      icon: BookOpen,
      description: "Bases essentielles de la finance personnelle"
    },
    advanced: {
      name: "Avancé",
      icon: Brain,
      description: "Stratégies sophistiquées et investissements"
    },
    psychology: {
      name: "Psychologie",
      icon: Lightbulb,
      description: "Comportements et biais financiers"
    }
  };

  const lessons: LessonsData = {
    recommended: [
      {
        id: "rec1",
        title: "Optimiser vos dépenses récurrentes",
        description: "Basé sur votre profil : économisez 180€/mois en moyenne",
        duration: "12 min",
        difficulty: "Facile",
        personalizedFor: "Votre pattern de dépenses détecté",
        completion: 0,
        tags: ["Personnalisé", "Économies", "Pratique"]
      },
      {
        id: "rec2", 
        title: "Négocier votre prochaine augmentation",
        description: "Votre profil indique un potentiel de +340€/mois",
        duration: "18 min",
        difficulty: "Moyen",
        personalizedFor: "Votre secteur et expérience",
        completion: 0,
        tags: ["Revenus", "Carrière", "Négociation"]
      },
      {
        id: "rec3",
        title: "Réduire l'impulsivité d'achat",
        description: "Techniques neuroscientifiques pour vos patterns identifiés",
        duration: "15 min", 
        difficulty: "Facile",
        personalizedFor: "Vos moments de vulnérabilité",
        completion: 25,
        tags: ["Psychologie", "Contrôle", "Habitudes"]
      }
    ],
    fundamentals: [
      {
        id: "fund1",
        title: "Budget 50/30/20 : La méthode éprouvée",
        description: "Répartition optimale pour tous les profils",
        duration: "10 min",
        difficulty: "Facile",
        completion: 100,
        tags: ["Budget", "Base", "Méthode"]
      },
      {
        id: "fund2",
        title: "Fonds d'urgence : Combien et comment ?",
        description: "Calculez votre coussin de sécurité idéal",
        duration: "14 min",
        difficulty: "Facile", 
        completion: 75,
        tags: ["Épargne", "Sécurité", "Planification"]
      },
      {
        id: "fund3",
        title: "Comprendre les intérêts composés",
        description: "Le secret de l'enrichissement à long terme",
        duration: "16 min",
        difficulty: "Moyen",
        completion: 0,
        tags: ["Investissement", "Mathématiques", "Long terme"]
      }
    ],
    advanced: [
      {
        id: "adv1",
        title: "Allocation d'actifs selon votre âge",
        description: "Stratégies de diversification optimales",
        duration: "25 min",
        difficulty: "Difficile",
        completion: 0,
        tags: ["Investissement", "Diversification", "Stratégie"]
      },
      {
        id: "adv2",
        title: "Optimisation fiscale légale",
        description: "Réduisez vos impôts en toute légalité",
        duration: "30 min",
        difficulty: "Difficile",
        completion: 0,
        tags: ["Fiscalité", "Optimisation", "Légal"]
      }
    ],
    psychology: [
      {
        id: "psy1",
        title: "Les 12 biais cognitifs qui ruinent votre budget",
        description: "Identifiez et contrez vos patterns inconscients",
        duration: "20 min",
        difficulty: "Moyen",
        completion: 50,
        tags: ["Biais", "Psychologie", "Conscience"]
      },
      {
        id: "psy2",
        title: "Motivation long terme : Ancrer ses objectifs",
        description: "Techniques de neurosciences pour persévérer",
        duration: "17 min",
        difficulty: "Moyen",
        completion: 0,
        tags: ["Motivation", "Objectifs", "Neurosciences"]
      }
    ]
  };

  const achievements = [
    {
      id: "learner",
      title: "Apprenant Assidu",
      description: "5 leçons complétées",
      progress: 60,
      icon: BookOpen,
      unlocked: true
    },
    {
      id: "specialist",
      title: "Spécialiste Budget",
      description: "Maîtrise de la catégorie Fondamentaux",
      progress: 75,
      icon: Target,
      unlocked: true
    },
    {
      id: "psychologist",
      title: "Psychologue Financier",
      description: "Expert en comportements financiers",
      progress: 30,
      icon: Brain,
      unlocked: false
    },
    {
      id: "master",
      title: "Maître Financier",
      description: "Toutes les catégories maîtrisées",
      progress: 45,
      icon: Award,
      unlocked: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'text-success bg-success/10';
      case 'Moyen': return 'text-warning bg-warning/10';
      case 'Difficile': return 'text-destructive bg-destructive/10';
      default: return 'text-muted bg-muted/10';
    }
  };

  const startLesson = (lessonId: string) => {
    // Simulation de démarrage de leçon - would redirect to lesson or open modal
    // Implementation needed
  };

  const toggleBookmark = (lessonId: string) => {
    // Logique de bookmark - would update user preferences
    // Implementation needed
  };

  const calculateCategoryProgress = (category: string) => {
    const categoryLessons = lessons[category] || [];
    const totalLessons = categoryLessons.length;
    const completedCount = categoryLessons.filter(lesson => lesson.completion === 100).length;
    return totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header Learning */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-accent/10">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">📚 Centre d'Apprentissage</h3>
              <p className="text-muted-foreground">Formation financière personnalisée</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                {Array.from(completedLessons).length}
              </div>
              <p className="text-xs text-muted-foreground">Leçons complétées</p>
            </div>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          </div>
        </div>

        {/* Progress Général */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progression Globale</span>
            <span className="text-sm text-muted-foreground">
              {Math.round((Array.from(completedLessons).length / 15) * 100)}%
            </span>
          </div>
          
          <Progress value={(Array.from(completedLessons).length / 15) * 100} className="h-2" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(learningCategories).map(([key, category]) => {
              const progress = calculateCategoryProgress(key);
              const CategoryIcon = category.icon;
              
              return (
                <div
                  key={key}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedCategory === key ? 
                    'bg-primary/10 border-primary/30' : 
                    'bg-background/20 border-white/10 hover:bg-background/30'
                  }`}
                  onClick={() => setSelectedCategory(key)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CategoryIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {Math.round(progress)}% complété
                  </div>
                  <Progress value={progress} className="h-1" />
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* Leçons de la catégorie sélectionnée */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg font-semibold">
              {learningCategories[selectedCategory]?.name}
            </h4>
            <p className="text-muted-foreground text-sm">
              {learningCategories[selectedCategory]?.description}
            </p>
          </div>
          
          {selectedCategory === 'recommended' && (
            <Badge className="bg-accent/20 text-accent">
              <Lightbulb className="w-3 h-3 mr-1" />
              IA Personnalisé
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {(lessons[selectedCategory] || []).map((lesson: Lesson, index: number) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-background/20 border border-white/10 hover:bg-background/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-semibold">{lesson.title}</h5>
                    {lesson.completion > 0 && lesson.completion < 100 && (
                      <Badge className="bg-warning/20 text-warning text-xs">
                        En cours
                      </Badge>
                    )}
                    {lesson.completion === 100 && (
                      <Badge className="bg-success/20 text-success text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complété
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {lesson.description}
                  </p>
                  
                  {lesson.personalizedFor && (
                    <div className="bg-accent/10 rounded px-2 py-1 mb-3">
                      <p className="text-xs text-accent">
                        🎯 Personnalisé: {lesson.personalizedFor}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                    </div>
                    
                    <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {lesson.tags.map((tag: string, tagIndex: number) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {lesson.completion > 0 && lesson.completion < 100 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progression</span>
                        <span>{lesson.completion}%</span>
                      </div>
                      <Progress value={lesson.completion} className="h-1" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <RevelationButton
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(lesson.id)}
                  >
                    <Bookmark className="w-4 h-4" />
                  </RevelationButton>
                  
                  <RevelationButton
                    variant={lesson.completion === 100 ? "outline" : "revelation"}
                    size="sm"
                    onClick={() => startLesson(lesson.id)}
                  >
                    {lesson.completion === 100 ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Revoir
                      </>
                    ) : lesson.completion > 0 ? (
                      <>
                        <Play className="w-4 h-4" />
                        Continuer
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Commencer
                      </>
                    )}
                  </RevelationButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Achievements & Community */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-warning/10">
              <Award className="w-6 h-6 text-warning" />
            </div>
            <h4 className="text-lg font-semibold">🏆 Accomplissements</h4>
          </div>

          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked ? 
                  'bg-success/10 border-success/20' : 
                  'bg-background/20 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    achievement.unlocked ? 'bg-success/20' : 'bg-muted/20'
                  }`}>
                    <achievement.icon className={`w-5 h-5 ${
                      achievement.unlocked ? 'text-success' : 'text-muted'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium">{achievement.title}</h5>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progression</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold">👥 Communauté</h4>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="font-medium">Étude de Groupe</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Rejoignez un groupe d'étude sur l'investissement débutant
              </p>
              <RevelationButton size="sm" variant="outline">
                Rejoindre
                <ArrowRight className="w-4 h-4" />
              </RevelationButton>
            </div>

            <div className="p-4 rounded-lg bg-background/20">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-warning" />
                <span className="font-medium">Mentor du Mois</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Échangez avec un expert en finance personnelle
              </p>
              <RevelationButton size="sm" variant="outline">
                Programmer
                <ArrowRight className="w-4 h-4" />
              </RevelationButton>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10">
              <div className="text-center">
                <h5 className="font-medium mb-2">🎓 Certification Rivela</h5>
                <p className="text-sm text-muted-foreground mb-3">
                  Obtenez votre certificat de Financial Literacy
                </p>
                <RevelationButton size="sm" variant="revelation">
                  En savoir plus
                </RevelationButton>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};