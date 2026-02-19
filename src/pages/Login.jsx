import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Cloud } from 'lucide-react';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Attempting login with:", email);
        setError('');

        try {
            console.log("Calling signInWithEmailAndPassword...");
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Login successful, navigating to home...");
            navigate('/');
        } catch (err) {
            console.error("Login error:", err);
            if (err.code === 'auth/wrong-password') {
                setError('Contraseña incorrecta.');
            } else if (err.code === 'auth/user-not-found') {
                setError('Usuario no encontrado.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Correo electrónico inválido.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Demasiados intentos fallidos. Intenta más tarde.');
            } else {
                setError('Error al iniciar sesión: ' + err.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-cielo-light/30 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-10 left-10 text-sol animate-bounce duration-[3000ms]">
                <Star size={48} fill="currentColor" />
            </div>
            <div className="absolute bottom-10 right-10 text-menta animate-bounce duration-[4000ms]">
                <Heart size={48} fill="currentColor" />
            </div>
            <div className="absolute top-20 right-20 text-cielo animate-pulse">
                <Cloud size={64} fill="currentColor" />
            </div>

            <div className="bg-white rounded-5xl shadow-card w-full max-w-md p-8 relative z-10 border-4 border-crema">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-hand text-suave font-bold mb-2">¡Hola Familia!</h1>
                    <p className="text-gray-500 font-sans">
                        Bienvenido a Mi Pequeña Agenda
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-center font-bold text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-600 font-bold mb-2 ml-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-crema border-2 border-transparent focus:border-cielo rounded-3xl py-3 px-4 outline-none transition-all font-sans"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 font-bold mb-2 ml-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-crema border-2 border-transparent focus:border-menta rounded-3xl py-3 px-4 outline-none transition-all font-sans"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-sol hover:bg-sol-light text-white font-hand font-bold text-xl py-3 rounded-full shadow-soft transform transition hover:-translate-y-1 active:translate-y-0"
                    >
                        Entrar
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        ¿Olvidaste tu contraseña? <span className="text-cielo font-bold cursor-pointer hover:underline">Recuperar</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
