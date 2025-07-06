// Application Constants
export const APP_CONFIG = {
  // App Information
  NAME: 'Resume Manager',
  VERSION: '1.0.0',
  DESCRIPTION: 'A full-stack application with Next.js & NestJS',
  
  // Environment
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // URLs
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  
  // Local Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    USER_PROFILE: 'user_profile',
    THEME: 'theme',
    LANGUAGE: 'language',
    RECENT_RESUMES: 'recent_resumes',
  },
  
  // Default Values
  DEFAULTS: {
    THEME: 'light',
    LANGUAGE: 'en',
    ITEMS_PER_PAGE: 10,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  },
  
  // Supported file types
  SUPPORTED_FILE_TYPES: {
    IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    DOCUMENTS: ['pdf', 'doc', 'docx', 'txt'],
    RESUMES: ['pdf', 'doc', 'docx'],
  },
  
  // Routes
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    RESUMES: '/resumes',
    SETTINGS: '/settings',
  },
} as const;

// Export individual parts for convenience
export const { 
  NAME, 
  VERSION, 
  DESCRIPTION, 
  STORAGE_KEYS, 
  DEFAULTS, 
  SUPPORTED_FILE_TYPES, 
  ROUTES 
} = APP_CONFIG; 