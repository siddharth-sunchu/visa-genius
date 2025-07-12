interface ApiConfig {
  baseURL: string;
  timeout: number;
}

const getApiConfig = (): ApiConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  let baseURL: string;
  
  if (isDevelopment || isLocalhost) {
    baseURL = process.env.REACT_APP_API_URL_LOCAL || 'http://localhost:8080';
  } else {
    baseURL = process.env.REACT_APP_API_URL_DEV || 'https://visa-genius-api.dev';
  }
  
  return {
    baseURL,
    timeout: 30000
  };
};

export const apiConfig = getApiConfig();

export const API_ENDPOINTS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh'
  },
  users: {
    getAll: '/api/users',
    getProfile: '/api/users/profile',
    updateProfile: '/api/users/profile'
  },
  health: {
    check: '/'
  }
};