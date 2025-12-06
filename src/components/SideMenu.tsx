import { useState } from 'react';
import { X, Plus, TrendingUp, TrendingDown, Settings, Download, Filter, DollarSign } from 'lucide-react';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenDolarConfig?: () => void;
}

const SideMenu = ({ isOpen, onClose, onOpenDolarConfig }: SideMenuProps) => {
    const [activeSection, setActiveSection] = useState<string>('');

    const menuOptions = [
        {
            id: 'add-transaction',
            title: 'Agregar Transacción',
            icon: <Plus className="h-5 w-5" />,
            description: 'Registra un nuevo ingreso o gasto'
        },
        {
            id: 'add-income',
            title: 'Agregar Ingreso',
            icon: <TrendingUp className="h-5 w-5" />,
            description: 'Registra un nuevo ingreso'
        },
        {
            id: 'add-expense',
            title: 'Agregar Gasto',
            icon: <TrendingDown className="h-5 w-5" />,
            description: 'Registra un nuevo gasto'
        },
        {
            id: 'dolar-config',
            title: 'Configuración del Dólar',
            icon: <DollarSign className="h-5 w-5" />,
            description: 'Ajusta la cotización del dólar'
        },
        {
            id: 'filters',
            title: 'Filtros',
            icon: <Filter className="h-5 w-5" />,
            description: 'Filtra transacciones por fecha o categoría'
        },
        {
            id: 'export',
            title: 'Exportar Datos',
            icon: <Download className="h-5 w-5" />,
            description: 'Descarga tu información financiera'
        },
        {
            id: 'settings',
            title: 'Configuración',
            icon: <Settings className="h-5 w-5" />,
            description: 'Ajustes generales de la aplicación'
        }
    ];

    const handleOptionClick = (optionId: string) => {
        if (optionId === 'dolar-config' && onOpenDolarConfig) {
            onOpenDolarConfig();
            onClose();
        } else {
            setActiveSection(activeSection === optionId ? '' : optionId);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Side Menu */}
            <div
                className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Opciones</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Menu Content */}
                <div className="p-6 space-y-2 overflow-y-auto h-full pb-20">
                    {menuOptions.map((option) => (
                        <div key={option.id}>
                            <button
                                onClick={() => handleOptionClick(option.id)}
                                className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${activeSection === option.id
                                        ? 'bg-indigo-50 border-2 border-indigo-200'
                                        : 'hover:bg-gray-50 border-2 border-transparent'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${activeSection === option.id
                                        ? 'bg-indigo-100 text-indigo-600'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {option.icon}
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-medium text-gray-900">{option.title}</h3>
                                    <p className="text-sm text-gray-500">{option.description}</p>
                                </div>
                            </button>

                            {/* Expanded Content */}
                            {activeSection === option.id && (
                                <div className="mt-3 ml-4 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-200">
                                    {renderOptionContent(option.id)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

const renderOptionContent = (optionId: string) => {
    switch (optionId) {
        case 'add-transaction':
        case 'add-income':
        case 'add-expense':
            return (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Ej: Compra de supermercado"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monto
                        </label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="0.00"
                        />
                    </div>

                    {optionId === 'add-transaction' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option value="income">Ingreso</option>
                                <option value="expense">Gasto</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="">Seleccionar categoría</option>
                            <option value="alimentacion">Alimentación</option>
                            <option value="transporte">Transporte</option>
                            <option value="servicios">Servicios</option>
                            <option value="entretenimiento">Entretenimiento</option>
                            <option value="trabajo">Trabajo</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha
                        </label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            defaultValue={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                        Agregar {optionId === 'add-income' ? 'Ingreso' : optionId === 'add-expense' ? 'Gasto' : 'Transacción'}
                    </button>
                </div>
            );

        case 'filters':
            return (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha desde
                        </label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha hasta
                        </label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="">Todas las categorías</option>
                            <option value="alimentacion">Alimentación</option>
                            <option value="transporte">Transporte</option>
                            <option value="servicios">Servicios</option>
                            <option value="entretenimiento">Entretenimiento</option>
                            <option value="trabajo">Trabajo</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="">Todos</option>
                            <option value="income">Solo ingresos</option>
                            <option value="expense">Solo gastos</option>
                        </select>
                    </div>

                    <div className="flex space-x-2">
                        <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                            Aplicar Filtros
                        </button>
                        <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                            Limpiar
                        </button>
                    </div>
                </div>
            );

        case 'export':
            return (
                <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-3">
                        Exporta tus datos financieros en diferentes formatos
                    </p>

                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Exportar como Excel</span>
                    </button>

                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Exportar como PDF</span>
                    </button>

                    <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Exportar como CSV</span>
                    </button>
                </div>
            );

        case 'settings':
            return (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Notificaciones</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Modo oscuro</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Moneda
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="ARS">Peso Argentino (ARS)</option>
                            <option value="USD">Dólar Estadounidense (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                        </select>
                    </div>

                    <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                        Guardar Configuración
                    </button>
                </div>
            );

        default:
            return (
                <div className="text-sm text-gray-500">
                    Funcionalidad próximamente disponible
                </div>
            );
    }
};

export default SideMenu;