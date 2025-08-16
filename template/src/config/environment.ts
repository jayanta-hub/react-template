interface EnvironmentConfig {
  NODE_ENV: string;
  VITE_API_BASE_URL: string;
  VITE_APP_NAME: string;
  VITE_APP_VERSION: string;
  VITE_ENABLE_ANALYTICS: boolean;
  VITE_ENABLE_DEBUG: boolean;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  return {
    NODE_ENV: import.meta.env.NODE_ENV || 'development',
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'React Template',
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    VITE_ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  };
};

export const env = getEnvironmentConfig();

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
