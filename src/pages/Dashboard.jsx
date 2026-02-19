import { useState, useEffect } from 'react';
import { Utensils, Moon, Droplets, AlertTriangle, MessageCircle, LogOut, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [dailyReport, setDailyReport] = useState(null);
    const [loadingReport, setLoadingReport] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Mock Data for static fields
    const childData = {
        name: user?.name || "Leo",
        group: "MiraSur",
        allergies: ["Huevo", "Frutos Secos"],
    };

    useEffect(() => {
        const fetchReport = async () => {
            if (!user) return;
            setLoadingReport(true);
            try {
                const reportDoc = await getDoc(doc(db, "users", user.uid, "dailyReports", selectedDate));
                if (reportDoc.exists()) {
                    setDailyReport(reportDoc.data());
                } else {
                    setDailyReport(null);
                }
            } catch (error) {
                console.error("Error fetching report:", error);
            } finally {
                setLoadingReport(false);
            }
        };
        fetchReport();
    }, [user, selectedDate]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Error logging out", error);
        }
    };

    return (
        <div className="min-h-screen bg-crema pb-20">
            {/* Header / Child Profile */}
            <div className="bg-white rounded-b-5xl shadow-soft p-6 pb-8 mb-6 relative">
                <button
                    onClick={handleLogout}
                    className="absolute top-4 right-4 bg-red-100 text-red-500 p-2 rounded-full hover:bg-red-200 transition-colors"
                    title="Cerrar Sesión"
                >
                    <LogOut size={20} />
                </button>

                <div className="flex items-center justify-between mb-4 mt-6">
                    <div>
                        <h1 className="text-3xl font-hand font-bold text-gray-800">Hola, {childData.name} 👋</h1>
                        <p className="text-cielo font-bold mb-2">{childData.group}</p>

                        {/* Date Picker */}
                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2 w-fit">
                            <Calendar size={18} className="text-gray-400" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent border-none text-gray-600 font-bold text-sm outline-none"
                            />
                        </div>
                    </div>
                    <div className="w-16 h-16 bg-sol rounded-full border-4 border-white shadow-md overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${childData.name}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Allergy Alert */}
                {childData.allergies.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-xl flex items-start gap-3">
                        <AlertTriangle className="text-red-400 shrink-0" />
                        <div>
                            <p className="text-red-800 font-bold text-sm uppercase tracking-wide">Alergias</p>
                            <p className="text-red-700 text-sm">{childData.allergies.join(", ")}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-4 space-y-6 max-w-3xl mx-auto">

                {!dailyReport ? (
                    <div className="text-center py-10">
                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                            <Moon className="text-gray-400" size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-600">Sin agenda para este día</h2>
                        <p className="text-gray-400 text-sm">Selecciona otra fecha o espera a que el profesor actualice.</p>
                    </div>
                ) : (
                    <>
                        {/* Daily Summary Cards */}
                        <section>
                            <h2 className="text-xl font-hand font-bold text-gray-700 mb-3 ml-2">Resumen de Hoy</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Food Card */}
                                <div className="bg-white p-5 rounded-4xl shadow-soft border-l-8 border-sol">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-2 bg-sol-light rounded-full text-sol-600">
                                            <Utensils size={20} className="text-orange-500" />
                                        </div>
                                        <h3 className="font-bold text-gray-700">Alimentación</h3>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between border-b border-gray-100 pb-1">
                                            <span className="text-gray-500">1º {dailyReport.food.first.dish || 'Plato'}</span>
                                            <span className="font-medium text-sol-600">{dailyReport.food.first.amount}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-1">
                                            <span className="text-gray-500">2º {dailyReport.food.second.dish || 'Plato'}</span>
                                            <span className="font-medium text-sol-600">{dailyReport.food.second.amount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Postre {dailyReport.food.dessert.dish || ''}</span>
                                            <span className="font-medium text-sol-600">{dailyReport.food.dessert.amount}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sleep Card */}
                                <div className="bg-white p-5 rounded-4xl shadow-soft border-l-8 border-cielo">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-2 bg-cielo-light rounded-full">
                                            <Moon size={20} className="text-cielo-500" fill="currentColor" />
                                        </div>
                                        <h3 className="font-bold text-gray-700">Sueño</h3>
                                    </div>
                                    <div className="flex items-center justify-between text-ce">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400">Inicio</p>
                                            <p className="font-bold text-xl text-gray-700">{dailyReport.sleep.start || '--:--'}</p>
                                        </div>
                                        <div className="h-0.5 bg-gray-200 w-8"></div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400">Fin</p>
                                            <p className="font-bold text-xl text-gray-700">{dailyReport.sleep.end || '--:--'}</p>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2 text-sm text-gray-500 bg-gray-50 py-1 rounded-lg">
                                        Calidad: <span className="font-bold text-cielo">{dailyReport.sleep.quality}</span>
                                    </p>
                                </div>

                                {/* Hygiene Card */}
                                <div className="bg-white p-5 rounded-4xl shadow-soft border-l-8 border-menta md:col-span-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-2 bg-menta-light rounded-full">
                                            <Droplets size={20} className="text-green-600" />
                                        </div>
                                        <h3 className="font-bold text-gray-700">Higiene</h3>
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {dailyReport.hygiene.diapers && dailyReport.hygiene.diapers.length > 0 ? dailyReport.hygiene.diapers.map((h, i) => (
                                            <div key={i} className="flex-shrink-0 bg-menta-light/30 p-3 rounded-2xl min-w-[80px] text-center border border-menta-light">
                                                <p className="font-bold text-gray-700">{h.time}</p>
                                                <p className="text-xs text-green-700 font-bold mt-1">{h.type}</p>
                                            </div>
                                        )) : <p className="text-gray-400 text-sm">Sin cambios registrados hoy.</p>}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Teacher Notes */}
                        {dailyReport.notes && (
                            <section>
                                <div className="bg-white p-6 rounded-4xl shadow-soft relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <MessageCircle size={100} />
                                    </div>
                                    <h3 className="font-hand font-bold text-lg text-suave mb-2">📝 Observaciones</h3>
                                    <p className="text-gray-600 italic leading-relaxed">"{dailyReport.notes}"</p>
                                </div>
                            </section>
                        )}
                    </>
                )}

                {/* Actions Grid */}
                <section className="grid grid-cols-1 gap-3">
                    <button
                        onClick={() => navigate('/chat')}
                        className="bg-white p-4 rounded-3xl shadow-soft flex flex-row items-center justify-center gap-4 active:scale-95 transition-transform"
                    >
                        <div className="bg-blue-100 p-3 rounded-full text-blue-500">
                            <MessageCircle size={24} />
                        </div>
                        <span className="text-lg font-bold text-gray-600">Chat con el Profe</span>
                    </button>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
