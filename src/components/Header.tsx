import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, DollarSign, PanelLeft, HelpCircle } from 'lucide-react';

interface HeaderProps {
    onMenuToggle: () => void;
    onTutorialOpen?: () => void;
}

const Header = ({ onMenuToggle, onTutorialOpen }: HeaderProps) => {
    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <header className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-700 shadow-xl sticky top-0 z-50">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-19 py-2">
                    <div className="flex items-center">
                        <button
                            onClick={onMenuToggle}
                            className="inline-flex items-center px-3 py-2.5 border border-transparent text-sm leading-4 font-medium rounded-xl text-white/90 hover:text-white hover:bg-white/20 focus:outline-none transition-all duration-200 mr-3 hover:scale-105 active:scale-95"
                            title="Abrir navegación lateral"
                        >
                            <PanelLeft className="h-5 w-5 drop-shadow-lg" />
                        </button>
                        
                        <div className="flex-shrink-0 flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-white/20 to-white/10 p-2 rounded-xl backdrop-blur-md shadow-lg border border-white/20">
                                <DollarSign className="h-7 w-7 text-white drop-shadow-lg" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-white drop-shadow-md tracking-tight">
                                    FinanPro
                                </h1>
                                <p className="text-xs text-white/90 hidden sm:block font-medium tracking-wide">Tu asistente financiero</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="hidden md:flex items-center space-x-2 bg-gradient-to-br from-white/20 to-white/10 rounded-xl px-3 py-2 backdrop-blur-md border border-white/20 shadow-lg">
                            <div className="bg-white/20 p-1 rounded-lg">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-white drop-shadow-sm">
                                {user?.username}
                            </span>
                        </div>

                        {/* Botón de Tutorial/Ayuda */}
                        <button
                            onClick={onTutorialOpen}
                            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-br from-accent-500 to-cyan-600 hover:from-accent-600 hover:to-cyan-700 text-white rounded-xl transition-all duration-200 shadow-lg border border-accent-400/30 hover:scale-105 active:scale-95 hover:shadow-xl"
                            title="Ver tutorial"
                        >
                            <HelpCircle className="h-4 w-4 drop-shadow-sm" />
                            <span className="hidden sm:inline text-sm font-bold drop-shadow-sm">
                                Tutorial
                            </span>
                        </button>

                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-lg border border-red-400/30 hover:scale-105 active:scale-95 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            title={isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                        >
                            <LogOut className="h-4 w-4 drop-shadow-sm" />
                            <span className="hidden sm:inline text-sm font-bold drop-shadow-sm">
                                {isLoggingOut ? 'Saliendo...' : 'Salir'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;