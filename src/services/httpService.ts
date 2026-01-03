/**
 * HTTP Service
 * Servicio base para realizar peticiones HTTP a la API
 * Con sistema de reintentos automáticos y detección de errores mejorada
 */

import { API_ENDPOINTS, DEFAULT_CONFIG } from '../config/api';
import { ENV_CONFIG } from '../config/environment';

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Tipos de errores de conexión
export type ConnectionErrorType = 'timeout' | 'network' | 'server' | 'unknown';

// Interfaz para el estado de conexión
export interface ConnectionState {
  isConnected: boolean;
  isRetrying: boolean;
  retryCount: number;
  lastError: ConnectionErrorType | null;
  lastErrorMessage: string | null;
}

// Callbacks para notificar cambios de estado de conexión
type ConnectionStateCallback = (state: ConnectionState) => void;

// Configuración de reintentos
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 segundo
  maxDelay: 8000,  // 8 segundos máximo
  retryableStatuses: [408, 429, 500, 502, 503, 504], // Códigos HTTP que permiten reintento
};

// Configuración de errores
export class ApiError extends Error {
  public status?: number;
  public response?: any;
  public errorType: ConnectionErrorType;

  constructor(
    message: string,
    status?: number,
    response?: any,
    errorType: ConnectionErrorType = 'unknown'
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
    this.errorType = errorType;
  }
}

// Función para detectar el tipo de error
const detectErrorType = (error: any, status?: number): ConnectionErrorType => {
  // Error de timeout
  if (error.name === 'TimeoutError' || error.name === 'AbortError') {
    return 'timeout';
  }
  
  // Error de red (sin conexión, DNS, etc.)
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'network';
  }
  
  // Error del servidor (5xx)
  if (status && status >= 500 && status < 600) {
    return 'server';
  }
  
  return 'unknown';
};

// Función para calcular delay con backoff exponencial
const calculateBackoffDelay = (retryCount: number): number => {
  const delay = RETRY_CONFIG.baseDelay * Math.pow(2, retryCount);
  return Math.min(delay, RETRY_CONFIG.maxDelay);
};

// Función helper para esperar
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Clase principal del servicio HTTP
class HttpService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private connectionState: ConnectionState;
  private stateCallbacks: Set<ConnectionStateCallback>;

  constructor() {
    this.baseURL = API_ENDPOINTS.API_BASE_URL;
    this.defaultHeaders = {
      ...DEFAULT_CONFIG.headers,
    };
    this.connectionState = {
      isConnected: true,
      isRetrying: false,
      retryCount: 0,
      lastError: null,
      lastErrorMessage: null,
    };
    this.stateCallbacks = new Set();
  }

  // Suscribirse a cambios de estado de conexión
  onConnectionStateChange(callback: ConnectionStateCallback): () => void {
    this.stateCallbacks.add(callback);
    // Retornar función para desuscribirse
    return () => this.stateCallbacks.delete(callback);
  }

  // Notificar cambios de estado
  private notifyStateChange(): void {
    this.stateCallbacks.forEach(callback => callback({ ...this.connectionState }));
  }

  // Actualizar estado de conexión
  private updateConnectionState(updates: Partial<ConnectionState>): void {
    this.connectionState = { ...this.connectionState, ...updates };
    this.notifyStateChange();
  }

  // Obtener estado actual de conexión
  getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  // Método privado para obtener headers con token
  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    const headers = { ...this.defaultHeaders };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Método privado para manejar respuestas
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Si es error 401 o 403, el token es inválido - limpiar y redirigir al login
      if (response.status === 401 || response.status === 403) {
        console.warn('Token inválido o expirado. Redirigiendo al login...');
        localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.USER_DATA);
        window.location.href = '/login';
      }

      const errorType = detectErrorType(null, response.status);
      throw new ApiError(
        data.message || data.error || `HTTP Error: ${response.status}`,
        response.status,
        data,
        errorType
      );
    }

    // Conexión exitosa - resetear estado
    this.updateConnectionState({
      isConnected: true,
      isRetrying: false,
      retryCount: 0,
      lastError: null,
      lastErrorMessage: null,
    });

    return data;
  }

  // Método privado para determinar si un error es retriable
  private isRetryableError(error: any, status?: number): boolean {
    const errorType = detectErrorType(error, status);
    
    // Reintentar en timeout, errores de red o errores de servidor específicos
    if (errorType === 'timeout' || errorType === 'network') {
      return true;
    }
    
    if (status && RETRY_CONFIG.retryableStatuses.includes(status)) {
      return true;
    }
    
    return false;
  }

  // Método genérico con reintentos
  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    retryCount: number = 0
  ): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(DEFAULT_CONFIG.timeout),
      });

      // Si el servidor responde con error retriable, intentar de nuevo
      if (!response.ok && this.isRetryableError(null, response.status) && retryCount < RETRY_CONFIG.maxRetries) {
        const delay = calculateBackoffDelay(retryCount);
        console.warn(`Servidor respondió ${response.status}. Reintentando en ${delay}ms... (${retryCount + 1}/${RETRY_CONFIG.maxRetries})`);
        
        this.updateConnectionState({
          isRetrying: true,
          retryCount: retryCount + 1,
          lastError: detectErrorType(null, response.status),
          lastErrorMessage: `Error ${response.status} - Reintentando...`,
        });

        await sleep(delay);
        return this.fetchWithRetry<T>(url, options, retryCount + 1);
      }

      return response;
    } catch (error: any) {
      const errorType = detectErrorType(error);
      
      // Si es un error retriable y no hemos agotado los reintentos
      if (this.isRetryableError(error) && retryCount < RETRY_CONFIG.maxRetries) {
        const delay = calculateBackoffDelay(retryCount);
        console.warn(`Error de conexión (${errorType}). Reintentando en ${delay}ms... (${retryCount + 1}/${RETRY_CONFIG.maxRetries})`);
        
        this.updateConnectionState({
          isConnected: false,
          isRetrying: true,
          retryCount: retryCount + 1,
          lastError: errorType,
          lastErrorMessage: this.getErrorMessage(errorType),
        });

        await sleep(delay);
        return this.fetchWithRetry<T>(url, options, retryCount + 1);
      }

      // Agotamos los reintentos o error no retriable
      this.updateConnectionState({
        isConnected: false,
        isRetrying: false,
        retryCount: retryCount,
        lastError: errorType,
        lastErrorMessage: this.getErrorMessage(errorType),
      });

      throw new ApiError(
        this.getErrorMessage(errorType),
        undefined,
        undefined,
        errorType
      );
    }
  }

  // Obtener mensaje de error legible
  private getErrorMessage(errorType: ConnectionErrorType): string {
    switch (errorType) {
      case 'timeout':
        return 'El servidor tardó demasiado en responder. Por favor, intenta de nuevo.';
      case 'network':
        return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      case 'server':
        return 'El servidor está experimentando problemas. Por favor, intenta más tarde.';
      default:
        return 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
    }
  }

  // Método GET con reintentos
  async get<T>(endpoint: string, useFullUrl: boolean = false): Promise<ApiResponse<T>> {
    const url = useFullUrl ? endpoint : `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithRetry<T>(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return await this.handleResponse<T>(response);
  }

  // Método POST con reintentos
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.fetchWithRetry<T>(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return await this.handleResponse<T>(response);
  }

  // Método PUT con reintentos
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.fetchWithRetry<T>(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return await this.handleResponse<T>(response);
  }

  // Método DELETE con reintentos
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.fetchWithRetry<T>(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return await this.handleResponse<T>(response);
  }

  // Método para verificar conexión con el servidor (sin reintentos)
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });
      
      const isConnected = response.ok;
      this.updateConnectionState({
        isConnected,
        lastError: isConnected ? null : 'server',
      });
      
      return isConnected;
    } catch (error: any) {
      const errorType = detectErrorType(error);
      this.updateConnectionState({
        isConnected: false,
        lastError: errorType,
        lastErrorMessage: this.getErrorMessage(errorType),
      });
      return false;
    }
  }

  // Resetear estado de conexión manualmente
  resetConnectionState(): void {
    this.updateConnectionState({
      isConnected: true,
      isRetrying: false,
      retryCount: 0,
      lastError: null,
      lastErrorMessage: null,
    });
  }
}

// Instancia singleton del servicio
const httpService = new HttpService();

export default httpService;