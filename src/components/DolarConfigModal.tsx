import { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, X } from 'lucide-react';
import dolarService, { type DolarQuote, type DolarType, type PriceType } from '../services/dolarService';

interface DolarConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DolarConfigModal = ({ isOpen, onClose }: DolarConfigModalProps) => {
    const [quotes, setQuotes] = useState<DolarQuote[]>([]);
    const [selectedDolarType, setSelectedDolarType] = useState<DolarType>('Oficial');
    const [selectedPriceType, setSelectedPriceType] = useState<PriceType>('compra');
    const [isLoading, setIsLoading] = useState(false);
    const [currentRate, setCurrentRate] = useState<number | null>(null);

    useEffect(() => {
        const config = dolarService.getConfig();
        setSelectedDolarType(config.dolarType);
        setSelectedPriceType(config.priceType);
    }, []);

    useEffect(() => {
        if (isOpen) {
            loadQuotes();
        }
    }, [isOpen]);

    const loadQuotes = async () => {
        setIsLoading(true);
        try {
            const data = await dolarService.getDolarQuotes();
            setQuotes(data);
            
            // Calcular la cotización actual seleccionada
            const config = dolarService.getConfig();
            const selectedQuote = data.find(q => q.nombre === config.dolarType);
            if (selectedQuote) {
                setCurrentRate(selectedQuote[config.priceType]);
            }
        } catch (error) {
            console.error('Error al cargar cotizaciones:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        dolarService.saveConfig(selectedDolarType, selectedPriceType);
        
        // Actualizar la cotización actual
        const selectedQuote = quotes.find(q => q.nombre === selectedDolarType);
        if (selectedQuote) {
            setCurrentRate(selectedQuote[selectedPriceType]);
        }
        
        // Cerrar el modal
        onClose();
    };

    return (
        <>
            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="h-6 w-6 text-white" />
                                    <h2 className="text-xl font-bold text-white">
                                        Configuración de Cotización del Dólar
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Información actual */}
                            {currentRate && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Cotización actual:</strong> ${currentRate.toFixed(2)} ARS por USD
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        {selectedDolarType} - {selectedPriceType === 'compra' ? 'Compra' : 'Venta'}
                                    </p>
                                </div>
                            )}

                            {/* Selector de tipo de dólar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Dólar
                                </label>
                                <select
                                    value={selectedDolarType}
                                    onChange={(e) => setSelectedDolarType(e.target.value as DolarType)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Oficial">Oficial</option>
                                    <option value="Blue">Blue</option>
                                    <option value="Bolsa">Bolsa</option>
                                    <option value="Contado con liquidación">Contado con liquidación</option>
                                    <option value="Mayorista">Mayorista</option>
                                    <option value="Cripto">Cripto</option>
                                    <option value="Tarjeta">Tarjeta</option>
                                </select>
                            </div>

                            {/* Selector de precio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setSelectedPriceType('compra')}
                                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                                            selectedPriceType === 'compra'
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                                        }`}
                                    >
                                        Compra
                                    </button>
                                    <button
                                        onClick={() => setSelectedPriceType('venta')}
                                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                                            selectedPriceType === 'venta'
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                                        }`}
                                    >
                                        Venta
                                    </button>
                                </div>
                            </div>

                            {/* Tabla de cotizaciones */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-gray-700">
                                        Cotizaciones Actuales
                                    </h3>
                                    <button
                                        onClick={loadQuotes}
                                        disabled={isLoading}
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                        Actualizar
                                    </button>
                                </div>

                                {isLoading ? (
                                    <div className="text-center py-8 text-gray-500">
                                        Cargando cotizaciones...
                                    </div>
                                ) : (
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Tipo
                                                    </th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                        Compra
                                                    </th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                        Venta
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {quotes.map((quote) => (
                                                    <tr
                                                        key={quote.nombre}
                                                        className={`hover:bg-gray-50 ${
                                                            quote.nombre === selectedDolarType
                                                                ? 'bg-blue-50'
                                                                : ''
                                                        }`}
                                                    >
                                                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                                            {quote.nombre}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                                                            ${quote.compra.toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">
                                                            ${quote.venta.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Información adicional */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Nota:</strong> Esta configuración se utiliza para convertir los montos en USD a ARS en todo el sistema. Los cambios se aplicarán después de guardar.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Guardar Configuración
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DolarConfigModal;
