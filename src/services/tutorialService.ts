import API_CONFIG from '../config/api';
import { ENV_CONFIG } from '../config/environment';

interface TutorialStatus {
    completed: boolean;
}

const tutorialService = {
    /**
     * Obtiene el estado del tutorial del usuario
     */
    getTutorialStatus: async (): Promise<{ success: boolean; data?: TutorialStatus; error?: string }> => {
        try {
            const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
            
            console.log('🔑 Token encontrado:', token ? `${token.substring(0, 20)}...` : 'NO HAY TOKEN');
            console.log('🔑 Storage key usado:', ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
            
            if (!token) {
                console.error('❌ No hay token de autenticación');
                return {
                    success: false,
                    error: 'No hay token de autenticación'
                };
            }

            console.log('📡 Llamando a:', `${API_CONFIG.BASE_URL}/api/users/tutorial`);
            
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/users/tutorial`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('📥 Respuesta HTTP:', response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('📋 Estado del tutorial recibido:', data);
            
            // Si la respuesta es un booleano directamente
            if (typeof data === 'boolean') {
                return { success: true, data: { completed: data } };
            }
            
            // Si la respuesta es un objeto con la propiedad completed
            if (typeof data === 'object' && 'completed' in data) {
                return { success: true, data };
            }
            
            // Formato inesperado, asumir no completado para mostrar tutorial
            console.warn('⚠️ Formato de respuesta inesperado, asumiendo tutorial no completado');
            return { success: true, data: { completed: false } };
        } catch (error) {
            console.error('❌ Error al obtener estado del tutorial:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            };
        }
    },

    /**
     * Marca el tutorial como completado
     */
    completeTutorial: async (): Promise<{ success: boolean; error?: string }> => {
        try {
            const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
            
            if (!token) {
                console.error('❌ No hay token de autenticación');
                return {
                    success: false,
                    error: 'No hay token de autenticación'
                };
            }

            console.log('✅ Marcando tutorial como completado...');
            
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/users/tutorial/complete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            console.log('🎉 Tutorial marcado como completado');
            return { success: true };
        } catch (error) {
            console.error('❌ Error al completar tutorial:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            };
        }
    }
};

export default tutorialService;
