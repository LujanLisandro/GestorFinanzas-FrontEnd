import { DollarSign, RefreshCw, TrendingUp } from 'lucide-react';

interface CurrencyBalanceCardProps {
    currency: 'ARS' | 'USD';
    amount: number;
    exchangeRate?: number; // Opcional, solo para USD
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

const CurrencyBalanceCard = ({ currency, amount, exchangeRate, onRefresh, isRefreshing = false }: CurrencyBalanceCardProps) => {
    const currencySymbol = currency === 'ARS' ? '$' : 'US$';
    const currencyName = currency === 'ARS' ? 'Pesos Argentinos' : 'Dólares';
    const gradientBg = currency === 'ARS' ? 'bg-gradient-to-br from-sky-50 to-blue-100' : 'bg-gradient-to-br from-emerald-50 to-green-100';
    const textColor = currency === 'ARS' ? 'text-sky-700' : 'text-emerald-700';
    const iconBgColor = currency === 'ARS' ? 'bg-sky-200/50' : 'bg-emerald-200/50';
    const borderColor = currency === 'ARS' ? 'border-sky-200' : 'border-emerald-200';

    // Calcular equivalente en ARS si es USD y hay exchangeRate y el monto es mayor a 0
    const equivalentARS = currency === 'USD' && exchangeRate && amount > 0 ? amount * exchangeRate : null;

    return (
        <div className={`${gradientBg} rounded-2xl shadow-lg border-2 ${borderColor} p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`${iconBgColor} backdrop-blur-sm p-3 rounded-xl shadow-sm`}>
                        <DollarSign className={`h-7 w-7 ${textColor}`} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">{currencyName}</p>
                        <p className="text-xs font-semibold text-gray-500">{currency}</p>
                    </div>
                </div>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className={`p-2.5 rounded-xl transition-all duration-200 ${textColor} bg-white/60 hover:bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                        title="Actualizar balance"
                    >
                        <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                )}
            </div>
            
            <div className="mt-3">
                <p className={`text-3xl font-bold ${textColor}`}>
                    {currencySymbol} {amount.toLocaleString(currency === 'ARS' ? 'es-AR' : 'en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </p>
                
                {/* Mostrar equivalente en ARS si es USD */}
                {equivalentARS && (
                    <div className="mt-3 pt-3 border-t border-white/40">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <TrendingUp className="h-3 w-3" />
                            <span className="font-medium">
                                Equivalente: ${equivalentARS.toLocaleString('es-AR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })} ARS
                            </span>
                        </div>
                        {exchangeRate && (
                            <p className="text-xs text-gray-500 mt-1">
                                Cotización: ${exchangeRate.toFixed(2)}
                            </p>
                        )}
                    </div>
                )}
                
                <div className="mt-2 pt-2 border-t border-white/40">
                    <p className="text-xs text-gray-600 font-medium">
                        💰 Balance disponible
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CurrencyBalanceCard;
