import { useState, useMemo, useEffect } from 'react';
import { PieChart as PieChartIcon, Calendar } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { Transaction } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface FinancialChartsProps {
    transactions: Transaction[];
}

const FinancialCharts = ({ transactions }: FinancialChartsProps) => {
    // Obtener rango de fechas por defecto (fecha mínima de transacciones hasta hoy)
    const today = new Date();
    
    // Encontrar la fecha más antigua de las transacciones
    const oldestDate = useMemo(() => {
        if (transactions.length === 0) {
            const defaultDate = new Date();
            defaultDate.setMonth(today.getMonth() - 12); // Un año atrás por defecto
            return defaultDate;
        }
        const dates = transactions.map(t => new Date(t.date));
        return new Date(Math.min(...dates.map(d => d.getTime())));
    }, [transactions]);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Inicializar fechas después del primer render
    useEffect(() => {
        if (!startDate) {
            setStartDate(oldestDate.toISOString().split('T')[0]);
        }
        if (!endDate) {
            setEndDate(today.toISOString().split('T')[0]);
        }
    }, [oldestDate]);

    // Filtrar transacciones por rango de fechas
    const filteredTransactions = useMemo(() => {
        if (!startDate || !endDate) return transactions;
        
        return transactions.filter(t => {
            // Comparación simple de strings en formato YYYY-MM-DD
            const transactionDateStr = t.date.split('T')[0]; // Por si viene con hora
            return transactionDateStr >= startDate && transactionDateStr <= endDate;
        });
    }, [transactions, startDate, endDate]);

    // Calcular gastos por categoría
    const getCategoriesData = useMemo(() => {
        const expensesByCategory: { [key: string]: number } = {};

        filteredTransactions.filter(t => t.type === 'expense').forEach(transaction => {
            expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
        });

        return Object.entries(expensesByCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => ({ category, amount }));
    }, [filteredTransactions]);

    // Calcular total de gastos para porcentajes
    const totalExpenses = useMemo(() => {
        return filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [filteredTransactions]);

    // Debug: Verificar datos
    useEffect(() => {
        console.log('📊 Datos del gráfico:', {
            transaccionesTotales: transactions.length,
            transaccionesFiltradas: filteredTransactions.length,
            categorias: getCategoriesData.length,
            totalGastos: totalExpenses,
            rangoFechas: { inicio: startDate, fin: endDate }
        });
    }, [filteredTransactions, startDate, endDate]);

    // Colores para el gráfico de torta
    const chartColors = [
        'rgba(99, 102, 241, 0.8)',   // Indigo
        'rgba(59, 130, 246, 0.8)',   // Blue
        'rgba(16, 185, 129, 0.8)',   // Green
        'rgba(245, 158, 11, 0.8)',   // Amber
        'rgba(239, 68, 68, 0.8)',    // Red
        'rgba(168, 85, 247, 0.8)',   // Purple
        'rgba(236, 72, 153, 0.8)',   // Pink
        'rgba(14, 165, 233, 0.8)',   // Sky
        'rgba(251, 146, 60, 0.8)',   // Orange
        'rgba(132, 204, 22, 0.8)',   // Lime
    ];

    // Datos para el gráfico de torta
    const pieChartData = {
        labels: getCategoriesData.map(item => item.category),
        datasets: [
            {
                label: 'Gastos por Categoría',
                data: getCategoriesData.map(item => item.amount),
                backgroundColor: chartColors.slice(0, getCategoriesData.length),
                borderColor: chartColors.slice(0, getCategoriesData.length).map(color => color.replace('0.8', '1')),
                borderWidth: 2,
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                    },
                    generateLabels: (chart: any) => {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label: string, i: number) => {
                                const value = data.datasets[0].data[i];
                                const percentage = ((value / totalExpenses) * 100).toFixed(1);
                                return {
                                    text: `${label} (${percentage}%)`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    hidden: false,
                                    index: i,
                                };
                            });
                        }
                        return [];
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const percentage = ((value / totalExpenses) * 100).toFixed(1);
                        const formatted = new Intl.NumberFormat('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                            minimumFractionDigits: 0
                        }).format(value);
                        return `${label}: ${formatted} (${percentage}%)`;
                    },
                },
            },
        },
    };

    // Función para establecer rangos rápidos
    const setQuickRange = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    };

    // Función para formatear fechas en formato dd-mm-yyyy
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="space-y-6">
            {/* Título y Filtros de Fecha */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <PieChartIcon className="h-6 w-6 text-indigo-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                        Gastos por Categoría
                    </h3>
                </div>

                {/* Filtros de Fecha */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-semibold text-gray-700">Filtrar por Período</span>
                        </div>
                        {startDate && endDate && (
                            <div className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-300">
                                {formatDate(startDate)} al {formatDate(endDate)}
                            </div>
                        )}
                    </div>
                    
                    {/* Botones de rango rápido */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button
                            onClick={() => setQuickRange(7)}
                            className="px-3 py-1.5 text-sm rounded-lg bg-white border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                        >
                            Últimos 7 días
                        </button>
                        <button
                            onClick={() => setQuickRange(30)}
                            className="px-3 py-1.5 text-sm rounded-lg bg-white border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                        >
                            Últimos 30 días
                        </button>
                        <button
                            onClick={() => setQuickRange(90)}
                            className="px-3 py-1.5 text-sm rounded-lg bg-white border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                        >
                            Últimos 3 meses
                        </button>
                        <button
                            onClick={() => setQuickRange(365)}
                            className="px-3 py-1.5 text-sm rounded-lg bg-white border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                        >
                            Último año
                        </button>
                    </div>

                    {/* Selectores de fecha personalizados */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha Desde
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha Hasta
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Resumen del período */}
                <div className="bg-indigo-50 rounded-lg p-4 mb-6 border border-indigo-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-indigo-700 font-medium">Total de Gastos en el Período</p>
                            <p className="text-2xl font-bold text-indigo-900 mt-1">
                                {new Intl.NumberFormat('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                    minimumFractionDigits: 0
                                }).format(totalExpenses)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-indigo-700">Categorías</p>
                            <p className="text-2xl font-bold text-indigo-900">{getCategoriesData.length}</p>
                        </div>
                    </div>
                </div>

                {/* Gráfico de Torta */}
                {getCategoriesData.length > 0 ? (
                    <div className="relative" style={{ height: '400px' }}>
                        <Pie data={pieChartData} options={pieChartOptions} />
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <PieChartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No hay gastos registrados en este período</p>
                        <p className="text-gray-400 text-sm mt-2">Intenta seleccionar un rango de fechas diferente</p>
                    </div>
                )}
            </div>

            {/* Lista de Categorías con Detalles */}
            {getCategoriesData.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <h4 className="text-lg font-bold mb-4 text-gray-900">
                        📊 Detalle por Categoría
                    </h4>
                    <div className="space-y-3">
                        {getCategoriesData.map((item, index) => {
                            const percentage = (item.amount / totalExpenses) * 100;
                            return (
                                <div key={index} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className="w-4 h-4 rounded-full" 
                                                style={{ backgroundColor: chartColors[index % chartColors.length] }}
                                            />
                                            <span className="font-semibold text-gray-900">
                                                {item.category}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-indigo-600">
                                                {new Intl.NumberFormat('es-AR', {
                                                    style: 'currency',
                                                    currency: 'ARS',
                                                    minimumFractionDigits: 0
                                                }).format(item.amount)}
                                            </span>
                                            <span className="text-sm text-gray-600 ml-2">
                                                ({percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full rounded-full h-2 bg-gray-200">
                                        <div
                                            className="h-2 rounded-full transition-all"
                                            style={{ 
                                                width: `${percentage}%`,
                                                backgroundColor: chartColors[index % chartColors.length]
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialCharts;