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
    const iconBgColor = currency === 'ARS' ? 'bg-sky-200/70' : 'bg-emerald-200/70';
    const borderColor = currency === 'ARS' ? 'border-sky-300' : 'border-emerald-300';

    // Calcular equivalente en ARS si es USD y hay exchangeRate y el monto es mayor a 0
    const equivalentARS = currency === 'USD' && exchangeRate && amount > 0 ? amount * exchangeRate : null;

    return (
        <div className={`${gradientBg} rounded-2xl shadow-xl border-2 ${borderColor} p-6 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02]`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`${iconBgColor} backdrop-blur-sm p-3 rounded-xl shadow-lg border-2 border-white/50`}>
                        <DollarSign className={`h-8 w-8 ${textColor} drop-shadow-sm`} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-gray-700 uppercase tracking-wider">{currencyName}</p>
                        <p className="text-xs font-bold text-gray-500">{currency}</p>
                    </div>
                </div>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className={`p-2.5 rounded-xl transition-all duration-200 ${textColor} bg-white/70 hover:bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95`}
                        title="Actualizar balance"
                    >
                        <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''} drop-shadow-sm`} />
                    </button>
                )}
            </div>
            
            <div className="mt-3">
                <p className={`text-3xl font-black ${textColor} drop-shadow-sm`}>
                    {currencySymbol} {amount.toLocaleString(currency === 'ARS' ? 'es-AR' : 'en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </p>
                
                {/* Mostrar equivalente en ARS si es USD */}
                {equivalentARS && (
                    <div className="mt-3 pt-3 border-t-2 border-white/50">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <TrendingUp className="h-4 w-4" />
                            <span className="font-bold">
                                Equivalente: ${equivalentARS.toLocaleString('es-AR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })} ARS
                            </span>
                        </div>
                        {exchangeRate && (
                            <p className="text-xs text-gray-500 mt-1 font-semibold">
                                Cotización: ${exchangeRate.toFixed(2)}
                            </p>
                        )}
                    </div>
                )}
                
                <div className="mt-3 pt-3 border-t-2 border-white/50">
                    <p className="text-xs text-gray-600 font-bold">
                        💰 Balance disponible
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CurrencyBalanceCard;
