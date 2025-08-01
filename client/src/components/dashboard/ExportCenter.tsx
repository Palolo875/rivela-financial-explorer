import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { RevelationButton } from "@/components/ui/revelation-button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Share2, 
  FileText,
  Image,
  Mail,
  MessageCircle,
  Printer,
  Link,
  QrCode,
  Sparkles,
  Trophy,
  Heart,
  Target
} from "lucide-react";

interface ExportCenterProps {
  data: any;
}

export const ExportCenter = ({ data }: ExportCenterProps) => {
  const [exportType, setExportType] = useState("report");
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = {
    report: {
      title: "Rapport Complet",
      description: "Analyse détaillée avec insights et recommandations",
      formats: [
        { name: "PDF Premium", icon: FileText, size: "2.3 MB", description: "Rapport professionnel avec graphiques" },
        { name: "PDF Simple", icon: FileText, size: "890 KB", description: "Version allégée pour impression" },
        { name: "Excel Dashboard", icon: FileText, size: "1.1 MB", description: "Données interactives et calculs" }
      ]
    },
    visuals: {
      title: "Visuels & Infographies",
      description: "Graphiques et visualisations pour réseaux sociaux",
      formats: [
        { name: "Infographie Instagram", icon: Image, size: "450 KB", description: "Carré 1080x1080px optimisé" },
        { name: "Story LinkedIn", icon: Image, size: "320 KB", description: "Format vertical professionnel" },
        { name: "Graphiques HD", icon: Image, size: "1.2 MB", description: "PNG haute résolution" }
      ]
    },
    achievements: {
      title: "Accomplissements",
      description: "Badges et certificats de progression",
      formats: [
        { name: "Certificat PDF", icon: Trophy, size: "560 KB", description: "Réussites financières certifiées" },
        { name: "Badge Numérique", icon: Trophy, size: "78 KB", description: "À ajouter sur LinkedIn/CV" },
        { name: "Résumé de Progrès", icon: Target, size: "234 KB", description: "Timeline de vos succès" }
      ]
    }
  };

  const shareOptions = [
    {
      platform: "Email",
      icon: Mail,
      color: "text-primary bg-primary/10",
      description: "Envoyer à votre conseiller ou famille"
    },
    {
      platform: "WhatsApp",
      icon: MessageCircle,
      color: "text-success bg-success/10",
      description: "Partager vos objectifs atteints"
    },
    {
      platform: "LinkedIn",
      icon: Share2,
      color: "text-accent bg-accent/10",
      description: "Montrer votre discipline financière"
    },
    {
      platform: "Lien Privé",
      icon: Link,
      color: "text-warning bg-warning/10",
      description: "Accès sécurisé temporaire"
    }
  ];

  const handleExport = async (format: any) => {
    setIsExporting(true);
    
    // Simulation d'export
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Ici on implémenterait la vraie logique d'export
    if (format.name.includes("PDF")) {
      // Logique jsPDF - implementation here
    } else if (format.name.includes("Excel")) {
      // Logique Excel export - implementation here
    } else if (format.name.includes("Infographie")) {
      // Logique html2canvas - implementation here
    }
    
    setIsExporting(false);
  };

  const generateInsightSummary = () => {
    return {
      healthScore: 87,
      monthlyProgress: "+12%",
      topInsight: "Réduction dépenses café: -65€/mois",
      nextGoal: "Fonds urgence dans 4 mois",
      achievements: ["Épargneur Régulier", "Détecteur de Patterns", "Optimisateur Budget"]
    };
  };

  const summary = generateInsightSummary();

  return (
    <div className="space-y-6">
      {/* Header Export */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">📤 Centre d'Export & Partage</h3>
              <p className="text-muted-foreground">Partagez vos succès et analyses</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-success">Données à jour</span>
          </div>
        </div>

        {/* Résumé Rapide */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-success/10">
            <div className="text-lg font-bold text-success">{summary.healthScore}/100</div>
            <p className="text-xs text-muted-foreground">Santé Financière</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-primary/10">
            <div className="text-lg font-bold text-primary">{summary.monthlyProgress}</div>
            <p className="text-xs text-muted-foreground">Progrès ce mois</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-accent/10">
            <div className="text-lg font-bold text-accent">{summary.achievements.length}</div>
            <p className="text-xs text-muted-foreground">Badges Obtenus</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-warning/10">
            <div className="text-lg font-bold text-warning">4 mois</div>
            <p className="text-xs text-muted-foreground">Prochain objectif</p>
          </div>
        </div>
      </GlassCard>

      {/* Options d'Export */}
      <Tabs value={exportType} onValueChange={setExportType}>
        <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md">
          <TabsTrigger value="report" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Rapports
          </TabsTrigger>
          <TabsTrigger value="visuals" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Visuels
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Accomplissements
          </TabsTrigger>
        </TabsList>

        {Object.entries(exportFormats).map(([key, category]) => (
          <TabsContent key={key} value={key}>
            <GlassCard className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">{category.title}</h4>
                <p className="text-muted-foreground">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {category.formats.map((format, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-background/20 border border-white/10 hover:bg-background/30 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <format.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h5 className="font-medium">{format.name}</h5>
                        <p className="text-xs text-muted-foreground">{format.size}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {format.description}
                    </p>
                    
                    <RevelationButton
                      onClick={() => handleExport(format)}
                      disabled={isExporting}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {isExporting ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                          Export...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Télécharger
                        </>
                      )}
                    </RevelationButton>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>
        ))}
      </Tabs>

      {/* Options de Partage */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-accent/10">
            <Share2 className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h4 className="text-lg font-semibold">🌟 Partage Social</h4>
            <p className="text-muted-foreground">Inspirez votre entourage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shareOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-background/20 border border-white/10 hover:bg-background/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${option.color} group-hover:scale-110 transition-transform`}>
                  <option.icon className="w-5 h-5" />
                </div>
                <h5 className="font-medium">{option.platform}</h5>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Message Personnalisé & QR Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h4 className="text-lg font-semibold mb-4">✨ Message Personnalisé</h4>
          
          <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-accent" />
              <span className="font-medium">Votre Citation Motivante</span>
            </div>
            <p className="text-sm italic">
              "J'ai économisé 520€ ce mois en détectant mes patterns de dépenses. 
              La discipline financière, c'est la liberté de choisir son avenir !"
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-background/20">
              <h5 className="font-medium text-sm">🎯 Mon défi actuel</h5>
              <p className="text-xs text-muted-foreground">{summary.nextGoal}</p>
            </div>
            
            <div className="p-3 rounded-lg bg-background/20">
              <h5 className="font-medium text-sm">💡 Ma meilleure discovery</h5>
              <p className="text-xs text-muted-foreground">{summary.topInsight}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h4 className="text-lg font-semibold mb-4">📱 Partage Rapide</h4>
          
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-white rounded-lg flex items-center justify-center">
              <QrCode className="w-16 h-16 text-primary" />
            </div>
            
            <div>
              <p className="text-sm font-medium">QR Code de Partage</p>
              <p className="text-xs text-muted-foreground">
                Scannez pour voir mon profil financier public
              </p>
            </div>
            
            <div className="bg-background/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground break-all">
                https://rivela.app/profile/shared/abc123...
              </p>
            </div>
            
            <RevelationButton variant="outline" size="sm">
              <Link className="w-4 h-4" />
              Copier le lien
            </RevelationButton>
          </div>
        </GlassCard>
      </div>

      {/* Badges & Accomplissements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-6 bg-gradient-to-br from-success/10 to-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-warning/10">
              <Trophy className="w-6 h-6 text-warning" />
            </div>
            <h4 className="text-lg font-semibold">🏆 Vos Accomplissements</h4>
          </div>

          <div className="flex flex-wrap gap-3">
            {summary.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <Badge className="bg-gradient-primary text-white px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {achievement}
                </Badge>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <RevelationButton variant="revelation" particles>
              <Trophy className="w-4 h-4" />
              Partager mes succès
            </RevelationButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};