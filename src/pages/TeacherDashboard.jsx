import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../config/firebase'; // Added auth
import { useNavigate } from 'react-router-dom';
import { MessageCircle, User, FileText } from 'lucide-react';

const TeacherDashboard = () => {
    const [parents, setParents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParents = async () => {
            const q = query(collection(db, "users"), where("role", "==", "parent"));
            const querySnapshot = await getDocs(q);
            const parentsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setParents(parentsData);
        };

        fetchParents();
    }, []);

    const handleChat = (parentId) => {
        navigate(`/chat/${parentId}`);
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Error logging out", error);
        }
    };

    return (
        <div className="min-h-screen bg-crema p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-hand font-bold text-gray-800">Panel del Profesor 🍎</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                >
                    Salir
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parents.map(parent => (
                    <div key={parent.id} className="bg-white p-6 rounded-3xl shadow-soft flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-cielo-light p-3 rounded-full text-cielo-600">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700">{parent.name || "Padre/Madre"}</h3>
                                <p className="text-xs text-gray-400">{parent.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/report/${parent.id}`)}
                                className="bg-cielo hover:bg-cielo-600 text-white p-3 rounded-xl transition-colors"
                                title="Editar Agenda"
                            >
                                <FileText size={20} />
                            </button>
                            <button
                                onClick={() => handleChat(parent.id)}
                                className="bg-sol hover:bg-sol-light text-white p-3 rounded-xl transition-colors"
                                title="Chat"
                            >
                                <MessageCircle size={20} />
                            </button>
                        </div>
                    </div>
                ))}

                {parents.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-10">
                        No hay padres registrados aún.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
