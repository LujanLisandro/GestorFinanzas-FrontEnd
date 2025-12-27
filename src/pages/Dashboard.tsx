import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import CurrencyBalanceCard from '../components/CurrencyBalanceCard';
import FinancialCharts from '../components/FinancialCharts';
import NavigationMenu from '../components/NavigationMenu';
import AddButtonMenu from '../components/AddButtonMenu';
import DolarConfigModal from '../components/DolarConfigModal';
import Tutorial from '../components/Tutorial';
import TransactionsSection from '../components/sections/TransactionsSection';
import CategoriesSection from '../components/sections/CategoriesSection';
import CalendarSection from '../components/sections/CalendarSection';
import movementService from '../services/movementService';
import dolarService from '../services/dolarService';
import tutorialService from '../services/tutorialService';
import type { Balance, Transaction } from '../types';

const Dashboard = () => {
    const { balance: userBalance, refreshBalance } = useAuth();
    const [balance, setBalance] = useState<Balance>({
        total: 0,
        income: 0,
        expenses: 0,
        transactions: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [exchangeRate, setExchangeRate] = useState<number>(1000);
    const [isDolarConfigOpen, setIsDolarConfigOpen] = useState(false);
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [isFirstTimeTutorial, setIsFirstTimeTutorial] = useState(false);

    // Verificar estado del tutorial al cargar
    useEffect(() => {
        const checkTutorialStatus = async () => {
            console.log('🔍 Verificando estado del tutorial...');
            const response = await tutorialService.getTutorialStatus();
            
            console.log('📊 Respuesta del servicio:', response);
            
            if (response.success && response.data) {
                console.log('✅ Tutorial completado:', response.data.completed);
                
                // Si no está completado, abrir automáticamente
                if (!response.data.completed) {
                    console.log('🎯 Abriendo tutorial por primera vez...');
                    setIsFirstTimeTutorial(true);
                    setIsTutorialOpen(true);
                } else {
                    console.log('✨ Tutorial ya fue completado anteriormente');
                }
            } else {
                console.error('❌ Error al verificar tutorial:', response.error);
            }
        };

        checkTutorialStatus();
    }, []);

    useEffect(() => {
        // Cargar cotización del dólar al iniciar
        dolarService.getExchangeRate()
            .then(rate => {
                setExchangeRate(rate);
            })
            .catch(error => {
                console.error('Error al cargar cotización del dólar:', error);
                // Usar un valor por defecto si falla
                setExchangeRate(1000);
            });
    }, []);

    const handleRefreshBalance = async () => {
        setIsRefreshing(true);
        try {
            await refreshBalance();
            await loadFinancialData(); // Recargar también los movimientos
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleMovementCreated = async () => {
        // Recargar tanto los movimientos como el balance del usuario
        await loadFinancialData();
        await refreshBalance();
        // Incrementar trigger para actualizar TransactionsSection
        setRefreshTrigger(prev => prev + 1);
    };

    const handleDolarConfigChange = async () => {
        // Recargar la cotización del dólar después de cambiar la configuración
        try {
            const rate = await dolarService.getExchangeRate();
            setExchangeRate(rate);
        } catch (error) {
            console.error('Error al actualizar cotización:', error);
        }
    };

    const loadFinancialData = async () => {
        try {
            setError(null);
            
            // Obtener transacciones desde el backend
            const transactions = await movementService.getTransactions();

            const totalIncome = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const totalExpenses = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            setBalance({
                total: totalIncome - totalExpenses,
                income: totalIncome,
                expenses: totalExpenses,
                transactions: transactions
            });
        } catch (err) {
            console.error('Error al cargar los movimientos:', err);
            setError('No se pudieron cargar los movimientos del servidor');
            
            // Cargar datos de ejemplo si falla
            const mockTransactions: Transaction[] = [
                {
                    id: '1',
                    description: 'Salario',
                    amount: 150000,
                    date: '2024-10-01',
                    type: 'income',
                    category: 'Trabajo'
                },
                {
                    id: '2',
                    description: 'Supermercado',
                    amount: 25000,
                    date: '2024-10-02',
                    type: 'expense',
                    category: 'Alimentación'
                },
            ];

            const totalIncome = mockTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const totalExpenses = mockTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            setBalance({
                total: totalIncome - totalExpenses,
                income: totalIncome,
                expenses: totalExpenses,
                transactions: mockTransactions
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFinancialData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header 
                    onMenuToggle={() => setIsNavigationOpen(!isNavigationOpen)}
                    onTutorialOpen={() => setIsTutorialOpen(true)}
                />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    // Función para renderizar contenido según la sección activa
    const renderSectionContent = () => {
        switch (activeSection) {
            case 'transactions':
                return <TransactionsSection key={refreshTrigger} />;
            case 'categories':
                return <CategoriesSection />;
            case 'calendar':
                return <CalendarSection transactions={balance.transactions} />;
            case 'settings':
                return (
                    <div className="space-y-6">
                        <div className="mb-8">
                            <h2 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 bg-clip-text text-transparent mb-3 tracking-tight drop-shadow-sm">
                                Configuración
                            </h2>
                            <p className="text-gray-600 font-medium">Ajusta las preferencias de tu aplicación</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Configuración del Dólar */}
                            <button
                                onClick={() => setIsDolarConfigOpen(true)}
                                className="w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 text-left hover:bg-gray-50 border-2 border-transparent hover:shadow-sm bg-white shadow-lg"
                            >
                                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <line x1="12" x2="12" y1="2" y2="22"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900">Configuración del Dólar</h3>
                                    <p className="text-sm text-gray-500 truncate">Ajusta la cotización del dólar para conversiones</p>
                                </div>
                            </button>

                            {/* Otras configuraciones (placeholder) */}
                            <button
                                className="w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 text-left hover:bg-gray-50 border-2 border-transparent hover:shadow-sm bg-white shadow-lg"
                            >
                                <div className="p-3 rounded-lg bg-gray-100 text-secondary-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900">Configuración</h3>
                                    <p className="text-sm text-gray-500 truncate">Ajustes generales de la aplicación</p>
                                </div>
                            </button>
                        </div>
                    </div>
                );
            default: // dashboard
                return (
                    <div className="space-y-6">
                        {/* Título */}
                        <div className="mb-8">
                            <h2 className="text-5xl font-black bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 bg-clip-text text-transparent mb-3 tracking-tight drop-shadow-sm">
                                FinanPro
                            </h2>
                            <p className="text-gray-600 text-base font-medium flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-pulse"></span>
                                Tu asistente inteligente de finanzas personales
                            </p>
                        </div>

                        {/* Tarjetas de Balance */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                            {/* Mensaje de error si no se pudo cargar el balance */}
                            {(!userBalance || error) && (
                                <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span className="text-sm text-yellow-800">
                                        {error || 'No se pudo cargar el balance del servidor. Mostrando datos simulados.'}
                                    </span>
                                </div>
                            )}
                            
                            <BalanceCard
                                title="Balance Total"
                                amount={(userBalance?.ars || 0) + (userBalance?.dolares || 0)}
                                type="total"
                                showCurrencySwitch={true}
                                arsAmount={userBalance?.ars || 0}
                                usdAmount={userBalance?.dolares || 0}
                                exchangeRate={exchangeRate}
                            />
                            <BalanceCard
                                title="Ingresos"
                                amount={balance.income}
                                type="income"
                            />
                            <BalanceCard
                                title="Gastos"
                                amount={balance.expenses}
                                type="expense"
                            />
                            <CurrencyBalanceCard
                                currency="ARS"
                                amount={userBalance?.ars || 0}
                                onRefresh={handleRefreshBalance}
                                isRefreshing={isRefreshing}
                            />
                            <CurrencyBalanceCard
                                currency="USD"
                                amount={userBalance?.dolares || 0}
                                exchangeRate={exchangeRate}
                                onRefresh={handleRefreshBalance}
                                isRefreshing={isRefreshing}
                            />
                        </div>

                        {/* Transacciones Recientes */}
                        <div className="bg-white rounded-2xl shadow-xl border border-primary-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-primary-50 via-accent-50 to-secondary-50 px-6 py-5 border-b border-primary-200">
                                <h3 className="text-2xl font-black bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full animate-pulse"></span>
                                    Transacciones Recientes
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {balance.transactions
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .slice(0, 5)
                                        .map(transaction => (
                                        <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {transaction.description}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    📅 {new Date(transaction.date).toLocaleDateString('es-AR')} • 🏷️ {transaction.category}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold text-lg ${transaction.type === 'income'
                                                    ? 'text-emerald-600'
                                                    : 'text-rose-600'
                                                    }`}>
                                                    {transaction.type === 'income' ? '+' : '-'}
                                                    {new Intl.NumberFormat('es-AR', {
                                                        style: 'currency',
                                                        currency: 'ARS'
                                                    }).format(transaction.amount)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Gráficos */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <FinancialCharts transactions={balance.transactions} />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50/40 to-secondary-50/40 relative">
            <Header 
                onMenuToggle={() => setIsNavigationOpen(!isNavigationOpen)}
                onTutorialOpen={() => setIsTutorialOpen(true)}
            />
            
            {/* Menú de Navegación (reemplaza al SideMenu original) */}
            <NavigationMenu
                isOpen={isNavigationOpen}
                onClose={() => setIsNavigationOpen(false)}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
            />

            <main className="max-w-[1920px] mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="py-4">
                    {renderSectionContent()}
                </div>
            </main>

            {/* Botón flotante para acciones rápidas */}
            <AddButtonMenu onMovementCreated={handleMovementCreated} />

            {/* Modal de Configuración del Dólar */}
            {isDolarConfigOpen && (
                <DolarConfigModal 
                    isOpen={isDolarConfigOpen}
                    onClose={() => {
                        setIsDolarConfigOpen(false);
                        handleDolarConfigChange();
                    }}
                />
            )}

            {/* Tutorial Interactivo */}
            <Tutorial
                isOpen={isTutorialOpen}
                onClose={() => {
                    setIsTutorialOpen(false);
                    setIsFirstTimeTutorial(false); // Reset después de cerrar
                }}
                onOpenNavMenu={() => setIsNavigationOpen(true)}
                onCloseNavMenu={() => setIsNavigationOpen(false)}
                isFirstTime={isFirstTimeTutorial}
            />
        </div>
    );
};

export default Dashboard;