import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { LogIn, User, Lock } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user, login, isLoading } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Por favor, completa todos los campos');
            return;
        }

        try {
            const success = await login(username, password);
            if (!success) {
                setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
            }
        } catch (error: any) {
            setError(error.message || 'Error de conexión. Verifica que el servidor esté disponible.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-accent-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/50 transform hover:scale-110 transition-transform duration-300">
                        <LogIn className="h-10 w-10 text-white drop-shadow-lg" />
                    </div>
                    <h2 className="mt-8 text-5xl font-black bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                        FinanPro
                    </h2>
                    <p className="mt-3 text-base text-gray-600 font-medium">
                        Inicia sesión en tu cuenta
                    </p>
                </div>

                <form className="mt-10 space-y-6 bg-white p-10 rounded-2xl shadow-2xl border-2 border-gray-100" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">
                                Usuario
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-12 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium hover:border-gray-300"
                                    placeholder="Ingresa tu usuario"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium hover:border-gray-300"
                                    placeholder="Ingresa tu contraseña"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 text-red-600 px-5 py-4 rounded-xl text-sm font-semibold shadow-md">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-4 px-4 border-2 border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-accent-700 hover:from-primary-700 hover:via-primary-800 hover:to-accent-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl"
                    >
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 font-medium">
                            ¿No tienes una cuenta?{' '}
                            <Link
                                to="/register"
                                className="font-bold text-primary-600 hover:text-accent-600 transition-colors duration-200"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;