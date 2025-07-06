// API Configuration Constants
export const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006',
  
  // API Endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile',
    },
    
    // User endpoints
    USERS: {
      BASE: '/users',
      BY_ID: (id: string) => `/users/${id}`,
      PROFILE: '/users/profile',
      UPDATE: '/users/update',
    },
    
    // Resume endpoints
    RESUMES: {
      BASE: '/resumes',
      BY_ID: (id: string) => `/resumes/${id}`,
      BY_USER: (userId: string) => `/resumes/user/${userId}`,
      CREATE: '/resumes',
      UPDATE: (id: string) => `/resumes/${id}`,
      DELETE: (id: string) => `/resumes/${id}`,
    },
    
    // Health check
    HEALTH: '/',
  },
  
  // Request timeouts (in milliseconds)
  TIMEOUTS: {
    DEFAULT: 10000,
    UPLOAD: 30000,
    DOWNLOAD: 15000,
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
} as const;

// Export individual parts for convenience
export const { BASE_URL, ENDPOINTS, TIMEOUTS, STATUS_CODES } = API_CONFIG; 