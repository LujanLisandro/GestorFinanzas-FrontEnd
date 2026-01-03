import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, Clock, ServerOff } from 'lucide-react';
import httpService from '../services/httpService';
import type { ConnectionState, ConnectionErrorType } from '../services/httpService';

interface ConnectionStatusProps {
    className?: string;
}

const ConnectionStatus = ({ className = '' }: ConnectionStatusProps) => {
    const [connectionState, setConnectionState] = useState<ConnectionState>(
        httpService.getConnectionState()
    );
    const [isVisible, setIsVisible] = useState(false);
    const [hideTimeout, setHideTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Suscribirse a cambios de estado de conexión
        const unsubscribe = httpService.onConnectionStateChange((state) => {
            setConnectionState(state);
            
            // Mostrar el banner cuando hay problemas
            if (!state.isConnected || state.isRetrying) {
                setIsVisible(true);
                // Limpiar timeout previo si existe
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    setHideTimeout(null);
                }
            } else if (state.isConnected && !state.isRetrying) {
                // Ocultar después de 3 segundos cuando se recupera la conexión
                const timeout = setTimeout(() => {
                    setIsVisible(false);
                }, 3000);
                setHideTimeout(timeout);
            }
        });

        return () => {
            unsubscribe();
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
        };
    }, [hideTimeout]);

    // Obtener icono según el tipo de error
    const getIcon = (errorType: ConnectionErrorType | null, isRetrying: boolean) => {
        if (isRetrying) {
            return <RefreshCw className="h-5 w-5 animate-spin" />;
        }

        switch (errorType) {
            case 'timeout':
                return <Clock className="h-5 w-5" />;
            case 'network':
                return <WifiOff className="h-5 w-5" />;
            case 'server':
                return <ServerOff className="h-5 w-5" />;
            default:
                return <AlertTriangle className="h-5 w-5" />;
        }
    };

    // Obtener colores según el estado
    const getColors = (isConnected: boolean, isRetrying: boolean) => {
        if (isConnected && !isRetrying) {
            return 'bg-green-500 text-white';
        }
        if (isRetrying) {
            return 'bg-amber-500 text-white';
        }
        return 'bg-rose-500 text-white';
    };

    // Obtener mensaje según el estado
    const getMessage = (state: ConnectionState): string => {
        if (state.isConnected && !state.isRetrying) {
            return '¡Conexión restaurada!';
        }
        
        if (state.isRetrying) {
            return `Reconectando... (intento ${state.retryCount}/3)`;
        }
        
        return state.lastErrorMessage || 'Sin conexión con el servidor';
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            } ${className}`}
        >
            <div className={`${getColors(connectionState.isConnected, connectionState.isRetrying)} 
                px-4 py-3 shadow-lg`}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {getIcon(connectionState.lastError, connectionState.isRetrying)}
                        <span className="font-medium text-sm">
                            {getMessage(connectionState)}
                        </span>
                    </div>
                    
                    {connectionState.isConnected && !connectionState.isRetrying && (
                        <Wifi className="h-5 w-5" />
                    )}
                    
                    {!connectionState.isConnected && !connectionState.isRetrying && (
                        <button
                            onClick={() => {
                                httpService.resetConnectionState();
                                setIsVisible(false);
                            }}
                            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                        >
                            Cerrar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConnectionStatus;
