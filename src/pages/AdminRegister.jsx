import { useState } from 'react';
import { User, GraduationCap } from 'lucide-react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const AdminRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('parent'); // 'parent' or 'teacher'
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { createUserProfile } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await createUserProfile(userCredential.user.uid, email, role, name);
            setMessage(`Usuario cread: ${email} (${role})`);
            setEmail('');
            setPassword('');
            setName('');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('El correo ya está registrado.');
            } else {
                setError('Error al crear usuario: ' + err.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-crema flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-soft w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin: Crear Cuentas</h1>

                {message && <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-center">{message}</div>}
                {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-600 font-bold mb-2 ml-2">Nombre Completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-cielo rounded-2xl py-2 px-4 outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="flex gap-4 mb-4">
                        <button
                            type="button"
                            onClick={() => setRole('parent')}
                            className={`flex-1 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'parent' ? 'border-menta bg-menta-light text-menta-700' : 'border-gray-100 text-gray-400'}`}
                        >
                            <User size={24} />
                            <span className="font-bold text-sm">Padre</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('teacher')}
                            className={`flex-1 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'teacher' ? 'border-sol bg-sol-light text-sol-600' : 'border-gray-100 text-gray-400'}`}
                        >
                            <GraduationCap size={24} />
                            <span className="font-bold text-sm">Profe</span>
                        </button>
                    </div>

                    <div>
                        <label className="block text-gray-600 font-bold mb-2 ml-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-cielo rounded-2xl py-2 px-4 outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 font-bold mb-2 ml-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-menta rounded-2xl py-2 px-4 outline-none transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-800 hover:bg-black text-white font-bold py-3 rounded-2xl shadow-lg transition-transform active:scale-95"
                    >
                        Crear Usuario
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminRegister;
