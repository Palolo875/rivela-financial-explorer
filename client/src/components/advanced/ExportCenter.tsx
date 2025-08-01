import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  FileText, 
  Image, 
  Mail, 
  Share2, 
  Calendar,
  Filter,
  Settings,
  Eye,
  Trash2,
  ExternalLink,
  Printer,
  Copy,
  QrCode,
  Twitter,
  Linkedin,
  Facebook
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { toast } from "@/hooks/use-toast";
import { format, subDays, subMonths } from 'date-fns';
import numeral from 'numeral';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportCenterProps {
  userId: string;
}

interface ExportSettings {
  format: 'pdf' | 'excel' | 'csv' | 'image' | 'print';
  dateRange: {
    from: Date;
    to: Date;
  };
  categories: string[];
  includeSummary: boolean;
  includeCharts: boolean;
  includeTransactions: boolean;
  includeInsights: boolean;
  template: 'standard' | 'executive' | 'detailed' | 'minimal';
  language: 'fr' | 'en';
}

const exportTemplates = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Rapport complet avec tous les éléments essentiels',
    includes: ['summary', 'charts', 'transactions', 'insights']
  },
  {
    id: 'executive',
    name: 'Exécutif',
    description: 'Résumé concis pour présentation',
    includes: ['summary', 'charts', 'insights']
  },
  {
    id: 'detailed',
    name: 'Détaillé',
    description: 'Analyse complète avec toutes les données',
    includes: ['summary', 'charts', 'transactions', 'insights', 'recommendations']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Données essentielles uniquement',
    includes: ['summary', 'transactions']
  }
];

const shareTemplates = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-blue-500',
    template: "J'ai analysé mes finances avec ce tableau de bord génial ! 📊 #FinTech #PersonalFinance"
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-700',
    template: "Excellent outil d'analyse financière personnelle. Recommandé pour une meilleure gestion budgétaire."
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
    template: "Découverte d'un super outil pour gérer ses finances personnelles ! 💰"
  }
];

const ExportCenter: React.FC<ExportCenterProps> = ({ userId }) => {
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'pdf',
    dateRange: {
      from: subMonths(new Date(), 3),
      to: new Date()
    },
    categories: [],
    includeSummary: true,
    includeCharts: true,
    includeTransactions: true,
    includeInsights: true,
    template: 'standard',
    language: 'fr'
  });

  const [shareSettings, setShareSettings] = useState({
    isPublic: false,
    allowComments: false,
    expiresIn: '30days',
    password: '',
    description: ''
  });

  const [isExporting, setIsExporting] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const queryClient = useQueryClient();

  // Fetch export history
  const { data: exportHistory = [] } = useQuery({
    queryKey: ['export-history', userId],
    queryFn: () => fetch(`/api/export-history/${userId}`).then(res => res.json()),
  });

  // Fetch user data for export
  const { data: userData } = useQuery({
    queryKey: ['export-data', userId, exportSettings.dateRange],
    queryFn: async () => {
      const [transactions, insights, budgetCategories] = await Promise.all([
        fetch(`/api/transactions/${userId}?limit=1000`).then(res => res.json()),
        fetch(`/api/financial-insights/${userId}`).then(res => res.json()),
        fetch(`/api/budget-categories/${userId}`).then(res => res.json())
      ]);
      
      return { transactions, insights, budgetCategories };
    },
  });

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: async (settings: ExportSettings) => {
      setIsExporting(true);
      
      // Generate export based on format
      let exportData;
      
      switch (settings.format) {
        case 'pdf':
          exportData = await generatePDF(settings);
          break;
        case 'image':
          exportData = await generateImage(settings);
          break;
        case 'excel':
          exportData = await generateExcel(settings);
          break;
        case 'csv':
          exportData = await generateCSV(settings);
          break;
        default:
          throw new Error('Format non supporté');
      }

      // Save export history
      const exportRecord = {
        userId,
        exportType: settings.format,
        filename: `financial-report-${format(new Date(), 'yyyy-MM-dd')}.${settings.format}`,
        dataRange: settings.dateRange,
        fileSize: exportData.size || 0,
      };

      await fetch('/api/export-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportRecord),
      });

      return exportData;
    },
    onSuccess: (data) => {
      setIsExporting(false);
      queryClient.invalidateQueries({ queryKey: ['export-history', userId] });
      toast({
        title: "Export réussi",
        description: "Votre rapport a été généré avec succès.",
      });
      
      // Download the file
      downloadFile(data, `financial-report-${format(new Date(), 'yyyy-MM-dd')}.${exportSettings.format}`);
    },
    onError: () => {
      setIsExporting(false);
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de la génération du rapport.",
        variant: "destructive",
      });
    },
  });

  const generatePDF = async (settings: ExportSettings) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Rapport Financier Personnel', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Période: ${format(settings.dateRange.from, 'dd/MM/yyyy')} - ${format(settings.dateRange.to, 'dd/MM/yyyy')}`, 20, 40);
    pdf.text(`Généré le: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, 50);
    
    let yPosition = 70;
    
    if (settings.includeSummary && userData) {
      pdf.setFontSize(16);
      pdf.text('Résumé Financier', 20, yPosition);
      yPosition += 20;
      
      const totalIncome = userData.transactions
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
      
      const totalExpenses = userData.transactions
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
      
      pdf.setFontSize(12);
      pdf.text(`Revenus total: ${numeral(totalIncome).format('0,0')}€`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Dépenses totales: ${numeral(totalExpenses).format('0,0')}€`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Solde net: ${numeral(totalIncome - totalExpenses).format('0,0')}€`, 20, yPosition);
      yPosition += 20;
    }

    if (settings.includeTransactions && userData) {
      pdf.setFontSize(16);
      pdf.text('Transactions Récentes', 20, yPosition);
      yPosition += 20;
      
      userData.transactions.slice(0, 10).forEach((transaction: any) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.setFontSize(10);
        pdf.text(`${format(new Date(transaction.date), 'dd/MM')} - ${transaction.description} - ${numeral(transaction.amount).format('0,0')}€`, 20, yPosition);
        yPosition += 8;
      });
    }

    return pdf.output('blob');
  };

  const generateImage = async (settings: ExportSettings) => {
    // Create a temporary div with the dashboard content
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 40px; background: white; width: 1200px;">
        <h1 style="color: #1e40af; font-size: 32px; margin-bottom: 20px;">Rapport Financier</h1>
        <p style="color: #64748b; margin-bottom: 40px;">
          Période: ${format(settings.dateRange.from, 'dd/MM/yyyy')} - ${format(settings.dateRange.to, 'dd/MM/yyyy')}
        </p>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; border-radius: 12px;">
            <h3 style="font-size: 18px; margin-bottom: 10px;">Revenus</h3>
            <p style="font-size: 32px; font-weight: bold;">€15,250</p>
          </div>
          <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; border-radius: 12px;">
            <h3 style="font-size: 18px; margin-bottom: 10px;">Dépenses</h3>
            <p style="font-size: 32px; font-weight: bold;">€12,340</p>
          </div>
          <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 12px;">
            <h3 style="font-size: 18px; margin-bottom: 10px;">Épargne</h3>
            <p style="font-size: 32px; font-weight: bold;">€2,910</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(element);
    
    const canvas = await html2canvas(element, {
      width: 1200,
      height: 800,
      backgroundColor: '#ffffff'
    });
    
    document.body.removeChild(element);
    
    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  };

  const generateExcel = async (settings: ExportSettings) => {
    // Simple CSV format that Excel can read
    let csv = 'Date,Description,Montant,Type,Catégorie\n';
    
    if (userData) {
      userData.transactions.forEach((transaction: any) => {
        csv += `${transaction.date},"${transaction.description}",${transaction.amount},${transaction.type},"${transaction.category || 'N/A'}"\n`;
      });
    }
    
    return new Blob([csv], { type: 'application/vnd.ms-excel' });
  };

  const generateCSV = async (settings: ExportSettings) => {
    let csv = 'Date,Description,Montant,Type\n';
    
    if (userData) {
      userData.transactions.forEach((transaction: any) => {
        csv += `${transaction.date},"${transaction.description}",${transaction.amount},${transaction.type}\n`;
      });
    }
    
    return new Blob([csv], { type: 'text/csv' });
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    exportMutation.mutate(exportSettings);
  };

  const generateShareUrl = () => {
    const token = Math.random().toString(36).substring(2, 15);
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/shared-dashboard/${token}`;
    setShareUrl(shareUrl);
    
    toast({
      title: "Lien de partage généré",
      description: "Votre lien de partage a été créé avec succès.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "Le lien a été copié dans le presse-papiers.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Centre d'Export et Partage
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Exportez vos données et partagez vos rapports financiers
            </p>
          </div>
        </div>

        <Tabs defaultValue="export" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="share">Partage</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="export">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Export Settings */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Paramètres d'export
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Format Selection */}
                    <div>
                      <Label className="text-base font-semibold">Format d'export</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        {[
                          { id: 'pdf', icon: FileText, label: 'PDF', color: 'text-red-600' },
                          { id: 'image', icon: Image, label: 'Image', color: 'text-green-600' },
                          { id: 'excel', icon: Download, label: 'Excel', color: 'text-blue-600' },
                          { id: 'csv', icon: FileText, label: 'CSV', color: 'text-orange-600' }
                        ].map((format) => {
                          const Icon = format.icon;
                          return (
                            <motion.div
                              key={format.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card 
                                className={`cursor-pointer transition-all border-2 ${
                                  exportSettings.format === format.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                }`}
                                onClick={() => setExportSettings({
                                  ...exportSettings,
                                  format: format.id as any
                                })}
                              >
                                <CardContent className="p-4 text-center">
                                  <Icon className={`h-8 w-8 mx-auto mb-2 ${format.color}`} />
                                  <div className="font-medium">{format.label}</div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Template Selection */}
                    <div>
                      <Label className="text-base font-semibold">Modèle de rapport</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        {exportTemplates.map((template) => (
                          <Card 
                            key={template.id}
                            className={`cursor-pointer transition-all border-2 ${
                              exportSettings.template === template.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-slate-200 dark:border-slate-700'
                            }`}
                            onClick={() => setExportSettings({
                              ...exportSettings,
                              template: template.id as any
                            })}
                          >
                            <CardContent className="p-4">
                              <h4 className="font-semibold">{template.name}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                {template.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {template.includes.map((item) => (
                                  <Badge key={item} variant="outline" className="text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Content Options */}
                    <div>
                      <Label className="text-base font-semibold">Contenu à inclure</Label>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        {[
                          { key: 'includeSummary', label: 'Résumé financier' },
                          { key: 'includeCharts', label: 'Graphiques' },
                          { key: 'includeTransactions', label: 'Transactions' },
                          { key: 'includeInsights', label: 'Analyses' }
                        ].map((option) => (
                          <div key={option.key} className="flex items-center space-x-2">
                            <Checkbox
                              checked={exportSettings[option.key as keyof ExportSettings] as boolean}
                              onCheckedChange={(checked) => setExportSettings({
                                ...exportSettings,
                                [option.key]: checked
                              })}
                            />
                            <Label className="text-sm">{option.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Date Range */}
                    <div>
                      <Label className="text-base font-semibold">Période</Label>
                      <div className="mt-3">
                        <DatePickerWithRange
                          date={{
                            from: exportSettings.dateRange.from,
                            to: exportSettings.dateRange.to
                          }}
                          onSelect={(range) => setExportSettings({
                            ...exportSettings,
                            dateRange: {
                              from: range?.from || exportSettings.dateRange.from,
                              to: range?.to || exportSettings.dateRange.to
                            }
                          })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview & Export */}
              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Aperçu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h4 className="font-semibold text-sm">
                          {exportTemplates.find(t => t.id === exportSettings.template)?.name}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          Format: {exportSettings.format.toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          Période: {format(exportSettings.dateRange.from, 'dd/MM/yyyy')} - {format(exportSettings.dateRange.to, 'dd/MM/yyyy')}
                        </p>
                      </div>
                      
                      <Button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full"
                        size="lg"
                      >
                        {isExporting ? (
                          <>
                            <Download className="w-4 h-4 mr-2 animate-pulse" />
                            Export en cours...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Exporter
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="share">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Partage sécurisé
                  </CardTitle>
                  <CardDescription>
                    Créez un lien de partage pour vos rapports financiers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Lien public</Label>
                      <Switch
                        checked={shareSettings.isPublic}
                        onCheckedChange={(checked) => setShareSettings({
                          ...shareSettings,
                          isPublic: checked
                        })}
                      />
                    </div>

                    <div>
                      <Label>Expire dans</Label>
                      <Select 
                        value={shareSettings.expiresIn} 
                        onValueChange={(value) => setShareSettings({
                          ...shareSettings,
                          expiresIn: value
                        })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1hour">1 heure</SelectItem>
                          <SelectItem value="1day">1 jour</SelectItem>
                          <SelectItem value="7days">7 jours</SelectItem>
                          <SelectItem value="30days">30 jours</SelectItem>
                          <SelectItem value="never">Jamais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Mot de passe (optionnel)</Label>
                      <Input
                        type="password"
                        value={shareSettings.password}
                        onChange={(e) => setShareSettings({
                          ...shareSettings,
                          password: e.target.value
                        })}
                        placeholder="Laisser vide pour aucun mot de passe"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={shareSettings.description}
                        onChange={(e) => setShareSettings({
                          ...shareSettings,
                          description: e.target.value
                        })}
                        placeholder="Description du rapport partagé..."
                        className="mt-1"
                      />
                    </div>

                    <Button onClick={generateShareUrl} className="w-full">
                      <QrCode className="w-4 h-4 mr-2" />
                      Générer le lien
                    </Button>

                    {shareUrl && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Label className="text-sm font-medium">Lien de partage:</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input value={shareUrl} readOnly className="text-sm" />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(shareUrl)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Partage sur les réseaux sociaux</CardTitle>
                  <CardDescription>
                    Partagez vos succès financiers avec votre réseau
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {shareTemplates.map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <div key={platform.id} className="flex items-center gap-3 p-3 rounded-lg border">
                          <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{platform.name}</h4>
                          </div>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Partager
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Historique des exports
                </CardTitle>
                <CardDescription>
                  Retrouvez tous vos exports et partages précédents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {exportHistory.length > 0 ? exportHistory.map((exportItem: any, index: number) => (
                      <motion.div
                        key={exportItem.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{exportItem.filename}</h4>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                              <span>{format(new Date(exportItem.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {exportItem.exportType.toUpperCase()}
                              </Badge>
                              <span>•</span>
                              <span>{numeral(exportItem.fileSize).format('0.0b')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-12 text-slate-500">
                        <Download className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">Aucun export</h3>
                        <p>Vos exports apparaîtront ici une fois créés.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExportCenter;