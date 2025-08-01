// Configuration de l'application
export const APP_CONFIG = {
  // Pagination
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 1000,
  
  // Débounce delays
  SEARCH_DEBOUNCE_MS: 300,
  AUTO_SAVE_DEBOUNCE_MS: 1000,
  
  // Animation durées
  ANIMATION_DURATION_SHORT: 200,
  ANIMATION_DURATION_MEDIUM: 400,
  ANIMATION_DURATION_LONG: 800,
  
  // Couleurs par défaut
  CHART_COLORS: {
    PRIMARY: '#3B82F6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    DANGER: '#EF4444',
    INFO: '#6366F1',
  },
  
  // Formats de date
  DATE_FORMATS: {
    SHORT: 'dd/MM/yyyy',
    LONG: 'dd MMMM yyyy',
    WITH_TIME: 'dd/MM/yyyy HH:mm',
  },
  
  // Limites financières
  FINANCE: {
    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 999999.99,
    DEFAULT_CURRENCY: 'EUR',
    BUDGET_WARNING_THRESHOLD: 0.8, // 80%
    BUDGET_DANGER_THRESHOLD: 0.95, // 95%
  },
  
  // Stockage local
  STORAGE_KEYS: {
    USER_PREFERENCES: 'user_preferences',
    THEME: 'theme',
    LANGUAGE: 'language',
    DASHBOARD_LAYOUT: 'dashboard_layout',
  },
  
  // Messages d'erreur
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Erreur de connexion. Veuillez réessayer.',
    VALIDATION_ERROR: 'Données invalides. Veuillez vérifier vos saisies.',
    UNAUTHORIZED: 'Vous n\'êtes pas autorisé à effectuer cette action.',
    NOT_FOUND: 'Ressource non trouvée.',
    SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  },
  
  // Catégories de budget par défaut
  DEFAULT_BUDGET_CATEGORIES: [
    { name: 'Alimentation', color: '#10B981', type: 'expense' },
    { name: 'Transport', color: '#3B82F6', type: 'expense' },
    { name: 'Logement', color: '#F59E0B', type: 'expense' },
    { name: 'Loisirs', color: '#EF4444', type: 'expense' },
    { name: 'Santé', color: '#6366F1', type: 'expense' },
    { name: 'Salaire', color: '#10B981', type: 'income' },
    { name: 'Investissements', color: '#8B5CF6', type: 'investment' },
  ],
  
  // Configuration des charts
  CHART_CONFIG: {
    RESPONSIVE: true,
    MAINTAIN_ASPECT_RATIO: false,
    ANIMATION_DURATION: 750,
    HOVER_ANIMATION_DURATION: 400,
  },
} as const;

// Types d'export supportés
export const EXPORT_FORMATS = [
  { id: 'pdf', name: 'PDF', extension: '.pdf', mimeType: 'application/pdf' },
  { id: 'excel', name: 'Excel', extension: '.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { id: 'csv', name: 'CSV', extension: '.csv', mimeType: 'text/csv' },
  { id: 'json', name: 'JSON', extension: '.json', mimeType: 'application/json' },
] as const;

// États de l'application
export const APP_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  IDLE: 'idle',
} as const;

// Priorités des insights
export const INSIGHT_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Niveaux de difficulté des leçons
export const LESSON_DIFFICULTY = {
  EASY: 'Facile',
  MEDIUM: 'Moyen',
  HARD: 'Difficile',
  EXPERT: 'Expert',
} as const;