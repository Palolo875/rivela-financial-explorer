import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Calculator, 
  AlertTriangle, 
  Download, 
  Brain, 
  TrendingUp,
  DollarSign,
  Eye,
  Target,
  Zap,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    title: "Tableau de Bord Avancé",
    description: "Analyse complète de votre situation financière avec score de santé",
    icon: BarChart3,
    href: "/dashboard",
    color: "from-blue-500 to-cyan-500",
    badge: "Analytics"
  },
  {
    title: "Simulateur Financier",
    description: "Planifiez vos objectifs avec des simulations personnalisées",
    icon: Calculator,
    href: "/simulator",
    color: "from-green-500 to-emerald-500",
    badge: "Planning"
  },
  {
    title: "Détecteur de Frais Cachés",
    description: "Identifiez les frais cachés avec intelligence artificielle",
    icon: AlertTriangle,
    href: "/fees-detector",
    color: "from-red-500 to-pink-500",
    badge: "AI Detection"
  },
  {
    title: "Centre d'Export",
    description: "Exportez et partagez vos rapports financiers",
    icon: Download,
    href: "/export",
    color: "from-purple-500 to-indigo-500",
    badge: "Sharing"
  },
  {
    title: "Analyses Prédictives",
    description: "Prédictions intelligentes basées sur vos données",
    icon: Brain,
    href: "/predictions",
    color: "from-orange-500 to-amber-500",
    badge: "AI Predictions"
  }
];

const stats = [
  { icon: DollarSign, value: "€2.3M+", label: "Épargnes Planifiées" },
  { icon: Eye, value: "15,000+", label: "Frais Détectés" },
  { icon: Target, value: "95%", label: "Objectifs Atteints" },
  { icon: TrendingUp, value: "23%", label: "Croissance Moyenne" }
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-6xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 px-6 py-2 text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <Zap className="w-4 h-4 mr-2" />
              Application de Wellness Financier Avancée
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Maîtrisez Vos Finances
              <br />
              Avec Intelligence
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Tableau de bord intelligent, simulations avancées, détection IA des frais cachés, 
              analyses prédictives et bien plus pour optimiser votre santé financière.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Commencer l'Analyse
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/simulator">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2">
                  Essayer le Simulateur
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-4">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={feature.href}>
                  <Card className="h-full cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} text-white shadow-lg`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          {feature.badge}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        {feature.title}
                      </CardTitle>
                      
                      <CardDescription className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <Button className="w-full group">
                        Explorer
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
        >
          <h2 className="text-4xl font-bold mb-6">
            Prêt à transformer votre vie financière ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà optimisé leurs finances 
            grâce à nos outils d'intelligence artificielle avancés.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
                <BarChart3 className="mr-2 h-5 w-5" />
                Voir le Dashboard
              </Button>
            </Link>
            
            <Link href="/simulator">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-purple-600">
                <Calculator className="mr-2 h-5 w-5" />
                Simuler mes Objectifs
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-pink-400/20 to-cyan-600/20 blur-3xl"></div>
      </div>
    </div>
  );
}