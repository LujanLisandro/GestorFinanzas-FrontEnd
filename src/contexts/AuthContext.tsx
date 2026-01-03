import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, RegisterCredentials, UserBalance } from '../types';
import authService from '../services/authService';
import balanceService from '../services/balanceService';
import httpService, { ApiError } from '../services/httpService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [balance, setBalance] = useState<UserBalance | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Inicia en true para validar sesión
    const [backendUnavailable, setBackendUnavailable] = useState(false);

    // Función helper para detectar si un error indica backend no disponible
    const isBackendUnavailableError = (error: any): boolean => {
        if (error instanceof ApiError) {
            return error.errorType === 'network' || 
                   error.errorType === 'timeout' || 
                   error.errorType === 'server';
        }
        // Errores de fetch nativos
        if (error?.name === 'TypeError' || error?.name === 'AbortError') {
            return true;
        }
        return false;
    };

    const loadBalance = async (): Promise<boolean> => {
        try {
            const response = await balanceService.getMyBalance();
            
            if (response.success && response.data) {
                setBalance(response.data);
                setBackendUnavailable(false);
                return true;
            } else {
                // Si falla la carga del balance, solo mostrar el error sin cerrar sesión
                console.warn('No se pudo cargar el balance:', response.error);
                setBalance(null);
                // Verificar si el error indica backend no disponible
                setBackendUnavailable(false);
                return false;
            }
        } catch (error) {
            console.error('Error loading balance:', error);
            setBalance(null);
            
            // Detectar correctamente si el backend no está disponible
            if (isBackendUnavailableError(error)) {
                setBackendUnavailable(true);
                console.warn('Backend no disponible - activando estado de error');
            } else {
                setBackendUnavailable(false);
            }
            
            return false;
        }
    };

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setBackendUnavailable(false);

        try {
            const response = await authService.login({ username, password });
            
            if (response.success && response.data.status && response.data.jwt) {
                const userData: User = {
                    id: '1', // Valor por defecto ya que no viene en la respuesta
                    username: response.data.username,
                    email: '' // Valor por defecto ya que no viene en la respuesta
                };
                setUser(userData);
                
                // Cargar balance después del login exitoso
                await loadBalance();
                
                setIsLoading(false);
                return true;
            }
            
            setIsLoading(false);
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            
            // Detectar si el backend no está disponible
            if (isBackendUnavailableError(error)) {
                setBackendUnavailable(true);
            }
            
            setIsLoading(false);
            return false;
        }
    };

    const logout = async () => {
        try {
            const result = await authService.logout();
            console.log('Logout result:', result.message);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setBalance(null);
        }
    };

    const refreshBalance = async () => {
        await loadBalance();
    };

    const retryConnection = async () => {
        setIsLoading(true);
        setBackendUnavailable(false);
        
        // Resetear el estado del httpService también
        httpService.resetConnectionState();
        
        const userData = authService.getUserData();
        if (userData && authService.isAuthenticated()) {
            const balanceLoaded = await loadBalance();
            
            if (balanceLoaded) {
                const user: User = {
                    id: userData.id,
                    username: userData.username,
                    email: userData.email || ''
                };
                setUser(user);
                setBackendUnavailable(false);
            } else {
                // Si el balance no se pudo cargar y el backend sigue no disponible,
                // no cerrar la sesión pero mantener el estado de error
                const connectionState = httpService.getConnectionState();
                if (!connectionState.isConnected) {
                    setBackendUnavailable(true);
                } else {
                    // El servidor respondió pero hubo otro tipo de error
                    authService.clearAuth();
                    setUser(null);
                    setBalance(null);
                }
            }
        }
        
        setIsLoading(false);
    };

    const register = async (registerData: RegisterCredentials): Promise<{ success: boolean; message?: string }> => {
        setIsLoading(true);
        
        try {
            const response = await authService.register(registerData);
            setIsLoading(false);
            
            if (response.success) {
                return { success: true, message: 'Usuario registrado exitosamente' };
            } else {
                return { success: false, message: response.error || 'Error al registrar usuario' };
            }
        } catch (error: any) {
            setIsLoading(false);
            return { success: false, message: error.message || 'Error al registrar usuario' };
        }
    };

    // Recuperar usuario del localStorage al cargar y validar con el backend
    useEffect(() => {
        const validateSession = async () => {
            const userData = authService.getUserData();
            const token = authService.getToken();
            
            // Solo validar si hay datos de usuario Y token
            if (userData && token) {
                setIsLoading(true);
                
                // Restaurar usuario aunque falle el balance
                const user: User = {
                    id: userData.id,
                    username: userData.username,
                    email: userData.email || ''
                };
                setUser(user);
                
                // Intentar cargar el balance (sin afectar la sesión si falla)
                await loadBalance();
                
                setIsLoading(false);
            } else {
                // No hay sesión guardada, no hacer nada
                setIsLoading(false);
            }
        };

        validateSession();
    }, []);

    const value: AuthContextType = {
        user,
        balance,
        login,
        logout,
        register,
        refreshBalance,
        isLoading,
        backendUnavailable,
        retryConnection
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};