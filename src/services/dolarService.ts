import { API_ENDPOINTS } from '../config/api';

export interface DolarQuote {
    nombre: string;
    compra: number;
    venta: number;
}

export type DolarType = 'Oficial' | 'Blue' | 'Bolsa' | 'Contado con liquidación' | 'Mayorista' | 'Cripto' | 'Tarjeta';
export type PriceType = 'compra' | 'venta';

class DolarService {
    private readonly STORAGE_KEY = 'dolar_config';
    private readonly DEFAULT_DOLAR_TYPE: DolarType = 'Oficial';
    private readonly DEFAULT_PRICE_TYPE: PriceType = 'compra';

    async getDolarQuotes(): Promise<DolarQuote[]> {
        try {
            // Usar BASE_URL directamente sin API_BASE_URL para evitar duplicación /api/v1/api/dolar
            // Este endpoint NO requiere autenticación (debe ser público en el backend)
            const url = `${API_ENDPOINTS.BASE_URL}/api/dolar`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(10000),
            });

            if (!response.ok) {
                // Silenciar error 403 - el endpoint requiere configuración en el backend
                if (response.status === 403) {
                    console.warn('⚠️ Endpoint /api/dolar requiere autenticación. Usando cotización por defecto.');
                    return [];
                }
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            return data || [];
        } catch (error) {
            // Silenciar errores de red - el endpoint puede no estar disponible
            console.warn('⚠️ No se pudo conectar con el servicio de cotizaciones. Usando valor por defecto.');
            return [];
        }
    }

    getConfig(): { dolarType: DolarType; priceType: PriceType } {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.error('Error al parsear configuración del dólar:', error);
            }
        }
        return {
            dolarType: this.DEFAULT_DOLAR_TYPE,
            priceType: this.DEFAULT_PRICE_TYPE
        };
    }

    saveConfig(dolarType: DolarType, priceType: PriceType): void {
        const config = { dolarType, priceType };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    }

    async getExchangeRate(): Promise<number> {
        try {
            const quotes = await this.getDolarQuotes();
            
            // Si no hay cotizaciones disponibles, retornar valor por defecto
            if (!quotes || quotes.length === 0) {
                return 1000;
            }
            
            const config = this.getConfig();
            
            const selectedQuote = quotes.find(q => q.nombre === config.dolarType);
            if (!selectedQuote) {
                const oficialQuote = quotes.find(q => q.nombre === 'Oficial');
                return oficialQuote ? oficialQuote[config.priceType] : 1000;
            }
            
            return selectedQuote[config.priceType];
        } catch (error) {
            // Error ya manejado en getDolarQuotes
            return 1000;
        }
    }

    convertUSDToARS(usdAmount: number, exchangeRate: number): number {
        return usdAmount * exchangeRate;
    }
}

export default new DolarService();
