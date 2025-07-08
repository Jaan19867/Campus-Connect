// API Configuration Constants
export const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3009',
  
  // API Endpoints
  ENDPOINTS: {
    // Student Auth endpoints
    STUDENT_AUTH: {
      LOGIN: '/student/auth/signin',
      SIGNUP: '/student/auth/signup',
      PROFILE: '/student/auth/profile',
    },
    
    // Student Dashboard endpoints
    STUDENT_DASHBOARD: {
      BASE: '/student/dashboard',
      NOTIFICATIONS: '/student/dashboard/notifications',
      EVENTS: '/student/dashboard/events',
    },
    
    // Student Jobs endpoints
    STUDENT_JOBS: {
      BASE: '/student/jobs',
      BY_ID: (id: string) => `/student/jobs/${id}`,
      APPLY: (id: string) => `/student/jobs/${id}/apply`,
    },
    
    // Student Applications endpoints
    STUDENT_APPLICATIONS: {
      BASE: '/student/applications',
      BY_ID: (id: string) => `/student/applications/${id}`,
      STATS: '/student/applications/stats',
    },
    
    // Student Information endpoints
    STUDENT_INFO: {
      PERSONAL: '/student/my-information/personal',
      ACADEMIC: '/student/my-information/academic',
      SKILLS: '/student/my-information/skills',
      SKILL_BY_ID: (id: string) => `/student/my-information/skills/${id}`,
      LANGUAGES: '/student/students/languages',
      LANGUAGE_BY_NAME: (language: string) => `/student/students/languages/${language}`,
      TECHNICAL_SKILLS: '/student/my-information/technical-skills',
      TECHNICAL_SKILL_BY_NAME: (skill: string) => `/student/my-information/technical-skills/${skill}`,
      OTHER_SKILLS: '/student/my-information/other-skills',
      OTHER_SKILL_BY_NAME: (skill: string) => `/student/my-information/other-skills/${skill}`,
      RESPONSIBILITIES: '/student/my-information/responsibilities',
      RESPONSIBILITY_BY_NAME: (responsibility: string) => `/student/my-information/responsibilities/${responsibility}`,
      PROJECT_LINKS: '/student/my-information/project-links',
      PROJECT_LINK_BY_URL: (projectLink: string) => `/student/my-information/project-links/${encodeURIComponent(projectLink)}`,
      CERTIFICATES_LINK: '/student/my-information/certificates-link',
    },
    
    // Student Resumes endpoints
    STUDENT_RESUMES: {
      BASE: '/student/resumes',
      BY_ID: (id: string) => `/student/resumes/${id}`,
      UPLOAD: '/student/resumes/upload',
      DELETE: (id: string) => `/student/resumes/${id}`,
    },
    
    // Health check
    HEALTH: '/',
  },
  
  // Request timeouts (in milliseconds)
  TIMEOUTS: {
    DEFAULT: 10000,
    UPLOAD: 60000,
    DOWNLOAD: 30000,
  },
  
  // HTTP Status Codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
  
  // Application specific constants
  APP_CONSTANTS: {
    MAX_RESUMES: 3,
    SUPPORTED_FILE_TYPES: ['pdf', 'doc', 'docx'],
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  },
} as const;

// Export individual parts for convenience
export const { BASE_URL, ENDPOINTS, TIMEOUTS, STATUS_CODES, APP_CONSTANTS } = API_CONFIG; 