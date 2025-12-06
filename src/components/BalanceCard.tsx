import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface BalanceCardProps {
    title: string;
    amount: number;
    type: 'total' | 'income' | 'expense';
    change?: number;
    showCurrencySwitch?: boolean;
    arsAmount?: number; // Balance en ARS
    usdAmount?: number; // Balance en USD
    exchangeRate?: number; // Cotización del dólar
}

const BalanceCard = ({ title, amount, type, change, showCurrencySwitch = false, arsAmount, usdAmount, exchangeRate = 1000 }: BalanceCardProps) => {
    const [showInUSD, setShowInUSD] = useState(false);

    const formatCurrency = (value: number, inUSD: boolean = false) => {
        if (inUSD) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        }
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(value);
    };

    // Calcular el balance total según la moneda seleccionada
    const getDisplayAmount = () => {
        if (type === 'total' && showCurrencySwitch) {
            if (showInUSD) {
                // Mostrar en USD: USD + (ARS convertido a USD)
                const arsInUsd = (arsAmount || 0) / exchangeRate;
                return (usdAmount || 0) + arsInUsd;
            } else {
                // Mostrar en ARS: ARS + (USD convertido a ARS)
                const usdInArs = (usdAmount || 0) * exchangeRate;
                return (arsAmount || 0) + usdInArs;
            }
        }
        return amount;
    };

    const getIcon = () => {
        switch (type) {
            case 'income':
                return <TrendingUp className="h-6 w-6 text-green-600" />;
            case 'expense':
                return <TrendingDown className="h-6 w-6 text-red-600" />;
            default:
                return <DollarSign className="h-6 w-6 text-indigo-600" />;
        }
    };

    const getColorClasses = () => {
        switch (type) {
            case 'income':
                return 'text-emerald-600 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200';
            case 'expense':
                return 'text-rose-600 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200';
            default:
                return 'text-violet-600 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200';
        }
    };

    const getIconBgClasses = () => {
        switch (type) {
            case 'income':
                return 'bg-emerald-100';
            case 'expense':
                return 'bg-rose-100';
            default:
                return 'bg-violet-100';
        }
    };

    return (
        <div className={`p-6 rounded-2xl shadow-lg border-2 ${getColorClasses()} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</p>
                        {showCurrencySwitch && type === 'total' && (
                            <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm">
                                <button
                                    onClick={() => setShowInUSD(false)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                                        !showInUSD 
                                            ? 'bg-violet-600 text-white shadow-md' 
                                            : 'text-gray-500 hover:text-violet-600 hover:bg-violet-50'
                                    }`}
                                >
                                    ARS
                                </button>
                                <button
                                    onClick={() => setShowInUSD(true)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                                        showInUSD 
                                            ? 'bg-green-600 text-white shadow-md' 
                                            : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                                    }`}
                                >
                                    USD
                                </button>
                            </div>
                        )}
                    </div>
                    <p className={`text-3xl font-bold ${getColorClasses().split(' ')[0]} mb-2`}>
                        {formatCurrency(getDisplayAmount(), showInUSD && type === 'total')}
                    </p>
                    {change && (
                        <div className="flex items-center space-x-1">
                            <span className={`text-sm font-medium ${change > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {change > 0 ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
                            </span>
                            <span className="text-xs text-gray-500">este mes</span>
                        </div>
                    )}
                    {type === 'total' && showCurrencySwitch && (usdAmount || 0) > 0 && (
                        <div className="mt-2 pt-2 border-t border-violet-200">
                            <p className="text-xs text-gray-600 font-medium">
                                {showInUSD ? (
                                    <>💵 USD ${(usdAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ARS ${(arsAmount || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
                                ) : (
                                    <>💵 USD ${(usdAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${exchangeRate.toLocaleString('es-AR')} = ${((usdAmount || 0) * exchangeRate).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
                                )}
                            </p>
                        </div>
                    )}
                </div>
                <div className={`p-4 rounded-2xl ${getIconBgClasses()} ml-4 shadow-sm`}>
                    {getIcon()}
                </div>
            </div>
        </div>
    );
};

export default BalanceCard;