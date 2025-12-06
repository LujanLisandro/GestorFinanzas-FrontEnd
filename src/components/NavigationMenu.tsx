import { 
  X, 
  Home, 
  PieChart, 
  CreditCard, 
  Settings, 
  Calendar
} from 'lucide-react';

interface NavigationMenuProps {
    isOpen: boolean;
    onClose: () => void;
    activeSection: string;
    onSectionChange: (section: string) => void;
}

interface Section {
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
    color: string;
}

const NavigationMenu = ({ isOpen, onClose, activeSection, onSectionChange }: NavigationMenuProps) => {
    const sections: Section[] = [
        {
            id: 'dashboard',
            title: 'Dashboard Principal',
            icon: <Home className="h-5 w-5" />,
            description: 'Vista general de tus finanzas',
            color: 'text-primary-600'
        },
        {
            id: 'transactions',
            title: 'Transacciones',
            icon: <CreditCard className="h-5 w-5" />,
            description: 'Historial completo de movimientos',
            color: 'text-accent-600'
        },
        {
            id: 'categories',
            title: 'Categorías',
            icon: <PieChart className="h-5 w-5" />,
            description: 'Gestión de categorías de gastos',
            color: 'text-primary-700'
        },
        {
            id: 'calendar',
            title: 'Calendario Financiero',
            icon: <Calendar className="h-5 w-5" />,
            description: 'Vista mensual de ingresos y gastos',
            color: 'text-primary-500'
        },
        {
            id: 'settings',
            title: 'Configuración',
            icon: <Settings className="h-5 w-5" />,
            description: 'Ajustes generales de la aplicación',
            color: 'text-secondary-500'
        }
    ];

    const handleSectionClick = (sectionId: string) => {
        if (sectionId === 'settings') {
            // Para configuración, cambiar la sección para mostrar las opciones
            onSectionChange(sectionId);
            onClose();
        } else {
            onSectionChange(sectionId);
            onClose();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Navigation Menu */}
            <div
                className={`fixed left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Navegación</h2>
                        <p className="text-blue-100 text-sm">Explora las secciones</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-white" />
                    </button>
                </div>

                {/* Sections List */}
                <div className="p-4 space-y-2 overflow-y-auto h-full pb-20">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => handleSectionClick(section.id)}
                            className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 text-left ${
                                activeSection === section.id
                                    ? 'bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200 shadow-md'
                                    : 'hover:bg-gray-50 border-2 border-transparent hover:shadow-sm'
                            }`}
                        >
                            <div
                                className={`p-3 rounded-lg ${
                                    activeSection === section.id
                                        ? 'bg-gradient-to-br from-primary-100 to-accent-100'
                                        : 'bg-gray-100'
                                } ${section.color}`}
                            >
                                {section.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold ${
                                    activeSection === section.id ? 'text-primary-900' : 'text-gray-900'
                                }`}>
                                    {section.title}
                                </h3>
                                <p className={`text-sm ${
                                    activeSection === section.id ? 'text-primary-600' : 'text-gray-500'
                                } truncate`}>
                                    {section.description}
                                </p>
                            </div>
                            {activeSection === section.id && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default NavigationMenu;