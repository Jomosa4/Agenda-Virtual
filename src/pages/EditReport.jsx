import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Save, Utensils, Moon, Droplets, MessageCircle } from 'lucide-react';

const EditReport = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [studentName, setStudentName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        food: {
            first: { dish: '', amount: 'Todo' },
            second: { dish: '', amount: 'Todo' },
            dessert: { dish: '', amount: 'Todo' }
        },
        sleep: {
            start: '',
            end: '',
            quality: 'Tranquilo'
        },
        hygiene: {
            diapers: [] // Array of { time: string, type: string }
        },
        notes: ''
    });

    // Helper for hygiene input
    const [newDiaperTime, setNewDiaperTime] = useState('');
    const [newDiaperType, setNewDiaperType] = useState('Pis');

    // Date State
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchData = async () => {
            if (!studentId) return;

            try {
                // Get Student Name
                const studentDoc = await getDoc(doc(db, "users", studentId));
                if (studentDoc.exists()) {
                    setStudentName(studentDoc.data().name);
                }

                // Get Report for selected date
                const reportDoc = await getDoc(doc(db, "users", studentId, "dailyReports", selectedDate));
                if (reportDoc.exists()) {
                    setFormData(reportDoc.data());
                } else {
                    // Reset form if no data exists for this day
                    setFormData({
                        food: {
                            first: { dish: '', amount: 'Todo' },
                            second: { dish: '', amount: 'Todo' },
                            dessert: { dish: '', amount: 'Todo' }
                        },
                        sleep: {
                            start: '',
                            end: '',
                            quality: 'Tranquilo'
                        },
                        hygiene: {
                            diapers: []
                        },
                        notes: ''
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [studentId, selectedDate]);

    const handleFoodChange = (course, field, value) => {
        setFormData(prev => ({
            ...prev,
            food: {
                ...prev.food,
                [course]: {
                    ...prev.food[course],
                    [field]: value
                }
            }
        }));
    };

    const handleSleepChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            sleep: {
                ...prev.sleep,
                [field]: value
            }
        }));
    };

    const addDiaper = () => {
        if (!newDiaperTime) return;
        setFormData(prev => ({
            ...prev,
            hygiene: {
                ...prev.hygiene,
                diapers: [...prev.hygiene.diapers, { time: newDiaperTime, type: newDiaperType }]
            }
        }));
        setNewDiaperTime('');
    };

    const removeDiaper = (index) => {
        setFormData(prev => ({
            ...prev,
            hygiene: {
                ...prev.hygiene,
                diapers: prev.hygiene.diapers.filter((_, i) => i !== index)
            }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await setDoc(doc(db, "users", studentId, "dailyReports", selectedDate), {
                ...formData,
                updatedAt: serverTimestamp()
            });
            setMessage('Agenda guardada correctamente ✨');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Error saving report:", error);
            setMessage('Error al guardar ❌');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-crema p-6 pb-24">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-hand font-bold text-gray-800">
                        Agenda de {studentName}
                    </h1>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent border-none text-gray-500 font-bold text-sm outline-none mt-1"
                    />
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl mb-6 text-center font-bold ${message.includes('Error') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <div className="space-y-6 max-w-3xl mx-auto">
                {/* Food Section */}
                <div className="bg-white p-6 rounded-3xl shadow-soft border-l-8 border-sol">
                    <div className="flex items-center gap-2 mb-4">
                        <Utensils className="text-sol-600" />
                        <h2 className="font-bold text-gray-700">Alimentación</h2>
                    </div>
                    <div className="space-y-4">
                        {['first', 'second', 'dessert'].map((course) => (
                            <div key={course} className="grid grid-cols-3 gap-2 items-center">
                                <label className="text-sm font-bold text-gray-500 capitalize">
                                    {course === 'first' ? '1º Plato' : course === 'second' ? '2º Plato' : 'Postre'}
                                </label>
                                <input
                                    type="text"
                                    placeholder="Plato..."
                                    value={formData.food[course].dish}
                                    onChange={(e) => handleFoodChange(course, 'dish', e.target.value)}
                                    className="col-span-2 p-2 bg-gray-50 rounded-xl border border-gray-100 text-sm"
                                />
                                <div className="col-start-2 col-span-2 flex gap-2">
                                    {['Nada', 'Poco', 'Mitad', 'Casi Todo', 'Todo'].map(amt => (
                                        <button
                                            key={amt}
                                            onClick={() => handleFoodChange(course, 'amount', amt)}
                                            className={`flex-1 py-1 px-2 rounded-lg text-xs transition-colors ${formData.food[course].amount === amt ? 'bg-sol text-white font-bold' : 'bg-gray-100 text-gray-400'}`}
                                        >
                                            {amt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sleep Section */}
                <div className="bg-white p-6 rounded-3xl shadow-soft border-l-8 border-cielo">
                    <div className="flex items-center gap-2 mb-4">
                        <Moon className="text-cielo-600" />
                        <h2 className="font-bold text-gray-700">Sueño</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Inicio</label>
                            <input
                                type="time"
                                value={formData.sleep.start}
                                onChange={(e) => handleSleepChange('start', e.target.value)}
                                className="w-full p-2 bg-gray-50 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Fin</label>
                            <input
                                type="time"
                                value={formData.sleep.end}
                                onChange={(e) => handleSleepChange('end', e.target.value)}
                                className="w-full p-2 bg-gray-50 rounded-xl"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-xs text-gray-400 mb-2">Calidad</label>
                        <div className="flex gap-2">
                            {['Intranquilo', 'Normal', 'Tranquilo'].map(q => (
                                <button
                                    key={q}
                                    onClick={() => handleSleepChange('quality', q)}
                                    className={`flex-1 py-2 rounded-xl text-sm transition-colors ${formData.sleep.quality === q ? 'bg-cielo text-white font-bold' : 'bg-gray-100 text-gray-400'}`}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Hygiene Section */}
                <div className="bg-white p-6 rounded-3xl shadow-soft border-l-8 border-menta">
                    <div className="flex items-center gap-2 mb-4">
                        <Droplets className="text-menta-700" />
                        <h2 className="font-bold text-gray-700">Higiene (Cambios)</h2>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {formData.hygiene.diapers.map((diaper, index) => (
                            <div key={index} className="bg-menta-light/30 p-2 rounded-xl flex items-center gap-2 border border-menta-light">
                                <div>
                                    <span className="font-bold text-gray-700 block text-sm">{diaper.time}</span>
                                    <span className="text-xs text-green-700">{diaper.type}</span>
                                </div>
                                <button onClick={() => removeDiaper(index)} className="text-red-400 hover:text-red-600">×</button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 items-end border-t pt-4 border-gray-100">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Hora</label>
                            <input
                                type="time"
                                value={newDiaperTime}
                                onChange={(e) => setNewDiaperTime(e.target.value)}
                                className="p-2 bg-gray-50 rounded-xl w-24"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-400 mb-1">Tipo</label>
                            <select
                                value={newDiaperType}
                                onChange={(e) => setNewDiaperType(e.target.value)}
                                className="w-full p-2 bg-gray-50 rounded-xl"
                            >
                                <option>Pis</option>
                                <option>Caca</option>
                                <option>Pis/Caca</option>
                                <option>Seco</option>
                            </select>
                        </div>
                        <button
                            onClick={addDiaper}
                            className="bg-menta text-white p-2 rounded-xl h-10 w-10 flex items-center justify-center font-bold text-xl hover:bg-menta-600"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Observations */}
                <div className="bg-white p-6 rounded-3xl shadow-soft">
                    <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="text-suave" />
                        <h2 className="font-bold text-gray-700">Observaciones</h2>
                    </div>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Escribe aquí notas para los padres..."
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 h-32 focus:ring-2 focus:ring-suave outline-none"
                    />
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-gray-800 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                >
                    <Save size={20} />
                    {loading ? 'Guardando...' : 'Guardar Agenda'}
                </button>
            </div>
        </div>
    );
};

export default EditReport;
