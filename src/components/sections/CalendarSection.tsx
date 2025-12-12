import { useState } from 'react';
import { ChevronLeft, ChevronRight, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
}

interface CalendarSectionProps {
    transactions?: Transaction[];
}

const CalendarSection = ({ transactions = [] }: CalendarSectionProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Obtener el primer y último día del mes actual
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Obtener el día de la semana del primer día (0 = Domingo, 1 = Lunes, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    // Días del mes
    const daysInMonth = lastDayOfMonth.getDate();

    // Navegar entre meses
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };

    // Formatear fecha como YYYY-MM-DD para comparación
    const formatDateKey = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    // Agrupar transacciones por fecha
    const transactionsByDate = transactions.reduce((acc, transaction) => {
        const dateKey = transaction.date.split('T')[0];
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(transaction);
        return acc;
    }, {} as Record<string, Transaction[]>);

    // Calcular totales por día
    const getDayTotals = (date: Date) => {
        const dateKey = formatDateKey(date);
        const dayTransactions = transactionsByDate[dateKey] || [];
        
        const income = dayTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expense = dayTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        return { income, expense, total: income - expense, count: dayTransactions.length };
    };

    // Verificar si es el día actual
    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    // Verificar si es el día seleccionado
    const isSelectedDay = (date: Date): boolean => {
        if (!selectedDate) return false;
        return date.getDate() === selectedDate.getDate() &&
               date.getMonth() === selectedDate.getMonth() &&
               date.getFullYear() === selectedDate.getFullYear();
    };

    // Renderizar días del calendario
    const renderCalendarDays = () => {
        const days = [];
        
        // Días vacíos del mes anterior
        for (let i = 0; i < firstDayWeekday; i++) {
            days.push(
                <div key={`empty-${i}`} className="p-2 min-h-[100px] bg-gray-50 rounded-lg"></div>
            );
        }
        
        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const { income, expense, total, count } = getDayTotals(date);
            const hasTransactions = count > 0;
            const today = isToday(date);
            const selected = isSelectedDay(date);
            
            days.push(
                <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 min-h-[100px] rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md hover:scale-[1.02] ${
                        selected
                            ? 'border-primary-500 bg-primary-50 shadow-lg scale-[1.02]'
                            : today
                            ? 'border-accent-400 bg-accent-50/50'
                            : hasTransactions
                            ? 'border-gray-200 bg-white hover:border-primary-300'
                            : 'border-gray-100 bg-gray-50/50 hover:bg-white'
                    }`}
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-bold ${
                            today ? 'text-accent-700' : selected ? 'text-primary-700' : 'text-gray-700'
                        }`}>
                            {day}
                        </span>
                        {today && (
                            <span className="text-xs bg-accent-500 text-white px-2 py-0.5 rounded-full font-bold">
                                Hoy
                            </span>
                        )}
                    </div>
                    
                    {hasTransactions && (
                        <div className="space-y-1 text-xs">
                            {income > 0 && (
                                <div className="flex items-center gap-1 text-emerald-600">
                                    <TrendingUp className="h-3 w-3" />
                                    <span className="font-semibold">
                                        ${income.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}
                            {expense > 0 && (
                                <div className="flex items-center gap-1 text-rose-600">
                                    <TrendingDown className="h-3 w-3" />
                                    <span className="font-semibold">
                                        ${expense.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}
                            <div className={`text-xs font-bold pt-1 border-t ${
                                total > 0 ? 'text-emerald-700 border-emerald-200' : 
                                total < 0 ? 'text-rose-700 border-rose-200' : 
                                'text-gray-600 border-gray-200'
                            }`}>
                                Balance: ${Math.abs(total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    )}
                </button>
            );
        }
        
        return days;
    };

    // Obtener transacciones del día seleccionado
    const getSelectedDayTransactions = (): Transaction[] => {
        if (!selectedDate) return [];
        const dateKey = formatDateKey(selectedDate);
        return transactionsByDate[dateKey] || [];
    };

    const selectedDayTransactions = getSelectedDayTransactions();
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return (
        <div className="space-y-6">
            {/* Header del Calendario */}
            <div className="bg-gradient-to-r from-primary-50 via-accent-50 to-secondary-50 rounded-2xl p-6 border-2 border-primary-200 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToToday}
                            className="px-4 py-2 bg-white hover:bg-primary-50 text-primary-700 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg border-2 border-primary-200"
                        >
                            Hoy
                        </button>
                        <button
                            onClick={goToPreviousMonth}
                            className="p-2 bg-white hover:bg-primary-50 text-primary-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-primary-200"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={goToNextMonth}
                            className="p-2 bg-white hover:bg-primary-50 text-primary-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-primary-200"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                        <div
                            key={day}
                            className="text-center text-sm font-bold text-gray-600 py-2"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendario */}
                <div className="grid grid-cols-7 gap-2">
                    {renderCalendarDays()}
                </div>
            </div>

            {/* Detalles del día seleccionado */}
            {selectedDate && (
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-primary-600" />
                        Transacciones del {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
                    </h3>

                    {selectedDayTransactions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-lg">No hay transacciones en este día</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {selectedDayTransactions.map(transaction => (
                                <div
                                    key={transaction.id}
                                    className={`p-4 rounded-xl border-2 ${
                                        transaction.type === 'income'
                                            ? 'bg-emerald-50 border-emerald-200'
                                            : 'bg-rose-50 border-rose-200'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${
                                                transaction.type === 'income'
                                                    ? 'bg-emerald-200'
                                                    : 'bg-rose-200'
                                            }`}>
                                                {transaction.type === 'income' ? (
                                                    <TrendingUp className="h-5 w-5 text-emerald-700" />
                                                ) : (
                                                    <TrendingDown className="h-5 w-5 text-rose-700" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {transaction.description}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {transaction.category}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`text-right ${
                                            transaction.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                                        }`}>
                                            <p className="text-xl font-black">
                                                {transaction.type === 'income' ? '+' : '-'}$
                                                {transaction.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Resumen del día */}
                            <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border-2 border-primary-200">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">Ingresos</p>
                                        <p className="text-lg font-black text-emerald-700">
                                            ${getDayTotals(selectedDate).income.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">Gastos</p>
                                        <p className="text-lg font-black text-rose-700">
                                            ${getDayTotals(selectedDate).expense.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">Balance</p>
                                        <p className={`text-lg font-black ${
                                            getDayTotals(selectedDate).total > 0 ? 'text-emerald-700' :
                                            getDayTotals(selectedDate).total < 0 ? 'text-rose-700' :
                                            'text-gray-700'
                                        }`}>
                                            ${Math.abs(getDayTotals(selectedDate).total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CalendarSection;
