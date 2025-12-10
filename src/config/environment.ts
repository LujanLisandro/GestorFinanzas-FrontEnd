/**
 * Environment Configuration
 * Variables de entorno y configuración general de la aplicación
 */

export const ENV_CONFIG = {
  // Modo de desarrollo
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  
  // URL de la API (usa la variable de entorno según el modo)
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  
  // Configuración del Dólar API
  DOLAR_API_URL: import.meta.env.VITE_DOLAR_API_URL || 'https://dolarapi.com/v1',
  
  // Configuraciones de la aplicación
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Gestor de Finanzas',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Debug mode
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  
  // Configuraciones de localStorage
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    THEME: 'app_theme',
  },
  
  // Configuraciones de timeouts
  TIMEOUTS: {
    REQUEST: 10000, // 10 segundos
    SESSION: (import.meta.env.VITE_SESSION_TIMEOUT || 30) * 60 * 1000, // minutos a milisegundos
  },
} as const;

// Función para obtener la URL completa de la API
export const getApiBaseUrl = (): string => {
  return ENV_CONFIG.API_URL;
};

// Log configuration en development
if (ENV_CONFIG.isDevelopment && ENV_CONFIG.DEBUG_MODE) {
  console.group('🔧 Environment Configuration');
  console.log('Mode:', ENV_CONFIG.mode);
  console.log('API URL:', ENV_CONFIG.API_URL);
  console.log('App Name:', ENV_CONFIG.APP_NAME);
  console.log('Debug Mode:', ENV_CONFIG.DEBUG_MODE);
  console.groupEnd();
}

export default ENV_CONFIG;