/**
 * Environment Configuration
 * Variables de entorno y configuración general de la aplicación
 */

export const ENV_CONFIG = {
  // Modo de desarrollo
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  
  // URLs del API Spring Boot (puedes sobrescribir desde variables de entorno si es necesario)
  API_HOST: import.meta.env.VITE_API_HOST || '192.168.0.214',
  API_PORT: import.meta.env.VITE_API_PORT || '8080', // Spring Boot default es 8080
  API_PROTOCOL: import.meta.env.VITE_API_PROTOCOL || 'http',
  
  // Configuraciones de la aplicación
  APP_NAME: 'FinanPro',
  APP_VERSION: '1.0.0',
  
  // Configuraciones de localStorage
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    THEME: 'app_theme',
  },
  
  // Configuraciones de timeouts
  TIMEOUTS: {
    REQUEST: 10000, // 10 segundos
    SESSION: 3600000, // 1 hora
  },
} as const;

// Función para obtener la URL completa de la API
export const getApiBaseUrl = (): string => {
  return `${ENV_CONFIG.API_PROTOCOL}://${ENV_CONFIG.API_HOST}:${ENV_CONFIG.API_PORT}`;
};

export default ENV_CONFIG;