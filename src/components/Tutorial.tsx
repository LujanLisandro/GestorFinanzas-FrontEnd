import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import tutorialService from '../services/tutorialService';

interface TutorialProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenNavMenu?: () => void;
    onCloseNavMenu?: () => void;
    isFirstTime?: boolean; // Indica si es la primera vez que se muestra
}

interface TutorialStep {
    id: number;
    title: string;
    description: string;
    targetSelector?: string;
    highlightColor: string;
    action?: () => void;
}

const Tutorial = ({ isOpen, onClose, onOpenNavMenu, onCloseNavMenu, isFirstTime = false }: TutorialProps) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps: TutorialStep[] = [
        {
            id: 0,
            title: '¡Bienvenido a FinanPro! 🎉',
            description: 'Te guiaremos paso a paso para que comiences a gestionar tus finanzas personales de manera fácil y efectiva.',
            highlightColor: 'from-primary-500 to-accent-500'
        },
        {
            id: 1,
            title: '📊 Balance Total',
            description: 'Aquí puedes ver tu balance total. Cambia entre ARS y USD usando los botones superiores.',
            targetSelector: '.balance-card-total',
            highlightColor: 'from-violet-500 to-purple-500',
            action: onCloseNavMenu
        },
        {
            id: 2,
            title: '🗂️ Menú de Navegación',
            description: 'Este botón abre el menú lateral. Desde aquí accedes a: Transacciones, Categorías, Calendario y Configuración.',
            targetSelector: 'button[title="Abrir navegación lateral"]',
            highlightColor: 'from-primary-500 to-accent-500'
        },
        {
            id: 3,
            title: '🗂️ Categorías - ¡Importante!',
            description: 'PRIMERO debes crear categorías (ej: Alimentación, Transporte). Esta es la opción "Categorías" en el menú lateral.',
            targetSelector: 'button[data-section="categories"]',
            highlightColor: 'from-amber-500 to-orange-500',
            action: onOpenNavMenu
        },
        {
            id: 4,
            title: '➕ Agregar Movimientos',
            description: 'Una vez que tengas categorías, usa este botón para registrar ingresos o gastos.',
            targetSelector: '.add-button-menu > button',
            highlightColor: 'from-green-500 to-emerald-500',
            action: onCloseNavMenu
        },
        {
            id: 5,
            title: '📋 Transacciones',
            description: 'Aquí verás el historial completo de todos tus movimientos. Puedes filtrar, buscar y ver detalles de cada transacción.',
            targetSelector: 'button[data-section="transactions"]',
            highlightColor: 'from-cyan-500 to-blue-500',
            action: onOpenNavMenu
        },
        {
            id: 6,
            title: '📅 Calendario Financiero',
            description: 'Visualiza tus ingresos y gastos organizados por fecha. Perfecto para planificar y revisar tu mes financiero.',
            targetSelector: 'button[data-section="calendar"]',
            highlightColor: 'from-purple-500 to-pink-500',
            action: onOpenNavMenu
        },
        {
            id: 7,
            title: '⚙️ Configuración',
            description: 'Ajusta la cotización del dólar y otras configuraciones de la aplicación desde esta sección.',
            targetSelector: 'button[data-section="settings"]',
            highlightColor: 'from-gray-500 to-slate-600',
            action: onOpenNavMenu
        },
        {
            id: 8,
            title: '🎯 ¡Listo para comenzar!',
            description: 'Recuerda: primero crea categorías, luego agrega transacciones. ¡Toma el control de tus finanzas!',
            highlightColor: 'from-primary-500 to-secondary-500',
            action: onCloseNavMenu
        }
    ];

    const currentStepData = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    // Agregar clase al body cuando el tutorial está activo
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('tutorial-active');
        } else {
            document.body.classList.remove('tutorial-active');
        }
        
        return () => {
            document.body.classList.remove('tutorial-active');
        };
    }, [isOpen]);

    // Destacar elemento y hacer scroll
    useEffect(() => {
        if (!isOpen) return;

        const step = steps[currentStep];
        
        // Ejecutar acción del paso (ej: abrir menú)
        if (step.action) {
            step.action();
        }
        
        // Delay para permitir que se renderice el elemento
        const timer = setTimeout(() => {
            if (step.targetSelector) {
                const element = document.querySelector(step.targetSelector) as HTMLElement;
                if (element) {
                    element.classList.add('tutorial-spotlight');
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }, step.action ? 300 : 0);
        
        return () => {
            clearTimeout(timer);
            if (step.targetSelector) {
                const element = document.querySelector(step.targetSelector) as HTMLElement;
                if (element) {
                    element.classList.remove('tutorial-spotlight');
                }
            }
        };
    }, [currentStep, isOpen]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleClose = async () => {
        // Solo marcar como completado si es la primera vez Y llegó al final
        if (isFirstTime && currentStep === steps.length - 1) {
            await tutorialService.completeTutorial();
        }
        
        setCurrentStep(0);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Card del tutorial - centrado en pantalla */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[90%] max-w-lg">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200">
                    {/* Header con gradiente */}
                    <div className={`bg-gradient-to-r ${currentStepData.highlightColor} p-6 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-6 w-6 text-white animate-pulse" />
                                    <span className="text-white font-bold text-sm">
                                        Paso {currentStep + 1} de {steps.length}
                                    </span>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-white" />
                                </button>
                            </div>
                            <h2 className="text-2xl font-black text-white drop-shadow-lg">
                                {currentStepData.title}
                            </h2>
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="h-2 bg-gray-200 relative overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${currentStepData.highlightColor} transition-all duration-500 ease-out`}
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                        <p className="text-gray-700 leading-relaxed text-base mb-6">
                            {currentStepData.description}
                        </p>

                        {/* Indicadores de pasos */}
                        <div className="flex justify-center gap-2 mb-6">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        index === currentStep
                                            ? 'w-8 bg-gradient-to-r ' + currentStepData.highlightColor
                                            : index < currentStep
                                            ? 'w-2 bg-gray-400'
                                            : 'w-2 bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Botones de navegación */}
                        <div className="flex items-center justify-between gap-3">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
                            >
                                Saltar tutorial
                            </button>

                            <div className="flex gap-2">
                                {currentStep > 0 && (
                                    <button
                                        onClick={handlePrevious}
                                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        Anterior
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    {currentStep === steps.length - 1 ? '¡Comenzar!' : 'Siguiente'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Tutorial;
