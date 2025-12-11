/**
 * Auth Service
 * Servicio específico para manejo de autenticación
 */

import httpService from './httpService';
import type { ApiResponse } from './httpService';
import { ENV_CONFIG } from '../config/environment';
import { API_ENDPOINTS } from '../config/api';

// Importar tipos del archivo types central
import type { LoginCredentials, LoginResponse, LogoutResponse, RegisterCredentials, User } from '../types';

class AuthService {
  // Método para login
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    try {
      // Hacer petición directa al endpoint de login (sin usar httpService para evitar problemas con headers)
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data: LoginResponse = await response.json();
      
      // Verificar que el login fue exitoso y guardar JWT
      if (data.status && data.jwt) {
        localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN, data.jwt);
        
        // Crear objeto user basado en la respuesta
        const userData: User = {
          id: '1', // Como no viene ID en la respuesta, usar un valor por defecto
          username: data.username,
          email: '', // No viene en la respuesta
        };
        localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        
        return {
          success: true,
          data: data,
          message: data.message
        };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Método para registro
  async register(credentials: RegisterCredentials): Promise<ApiResponse<User>> {
    try {
      // Construir el objeto con los valores por defecto
      const registerData = {
        username: credentials.username,
        password: credentials.password,
        enabled: credentials.enabled ?? true,
        accountNotExpired: credentials.accountNotExpired ?? true,
        accountNotLocked: credentials.accountNotLocked ?? true,
        credentialNotExpired: credentials.credentialNotExpired ?? true,
        rolesList: credentials.rolesList
      };

      // Usar la URL completa del endpoint de registro
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Usuario registrado exitosamente'
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Método para logout
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const token = this.getToken();
      
      if (!token) {
        // No hay token, solo limpiar localStorage
        this.clearLocalStorage();
        return { success: true, message: 'Sesión cerrada exitosamente' };
      }

      // Enviar token al backend para invalidarlo
      const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: LogoutResponse = await response.json();
        this.clearLocalStorage();
        return { success: true, message: data.message };
      } else {
        // Incluso si falla el logout en el backend, limpiar localStorage local
        console.warn('Logout failed on backend, but clearing local session');
        this.clearLocalStorage();
        return { success: true, message: 'Sesión cerrada localmente' };
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      // Incluso si hay error, limpiar localStorage local
      this.clearLocalStorage();
      return { success: true, message: 'Sesión cerrada localmente' };
    }
  }

  // Método para obtener perfil del usuario
  async getProfile(): Promise<ApiResponse<User>> {
    return await httpService.get<User>('/auth/profile');
  }

  // Método para refrescar token
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await httpService.post<{ token: string }>('/auth/refresh');
    
    if (response.success && response.data.token) {
      localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    }
    
    return response;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  }

  // Obtener token actual
  getToken(): string | null {
    return localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  }

  // Obtener datos del usuario
  getUserData(): User | null {
    const userData = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  // Limpiar localStorage
  private clearLocalStorage(): void {
    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.USER_DATA);
  }

  // Limpiar autenticación (método público)
  clearAuth(): void {
    this.clearLocalStorage();
  }
}

// Instancia singleton del servicio de autenticación
const authService = new AuthService();

export default authService;