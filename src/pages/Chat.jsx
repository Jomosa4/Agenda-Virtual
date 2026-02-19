import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Send, ArrowLeft } from 'lucide-react';

const Chat = () => {
    const { user, userRole } = useAuth();
    const { parentId } = useParams(); // Used if teacher is viewing
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const dummyRef = useRef();
    const navigate = useNavigate();

    // Determine the Chat ID
    // If I am a parent, the chat ID is my own UID.
    // If I am a teacher, the chat ID is the parentId passed in params.
    const chatId = userRole === 'parent' ? user.uid : parentId;

    useEffect(() => {
        if (!chatId) return;

        const messagesRef = collection(db, "messages");
        const q = query(
            messagesRef,
            where("chatId", "==", chatId),
            orderBy("createdAt")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let msgs = [];
            snapshot.forEach((doc) => {
                msgs.push({ ...doc.data(), id: doc.id });
            });
            setMessages(msgs);
            // Scroll to bottom
            setTimeout(() => {
                dummyRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });

        return () => unsubscribe();
    }, [chatId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === '') return;

        try {
            await addDoc(collection(db, "messages"), {
                text: newMessage,
                createdAt: serverTimestamp(),
                senderId: user.uid,
                senderName: user.name || "Usuario",
                chatId: chatId,
                role: userRole
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-crema">
            {/* Header */}
            <div className="bg-white p-4 shadow-soft flex items-center gap-4 z-10 sticky top-0">
                <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="font-hand font-bold text-xl text-gray-800">
                        {userRole === 'teacher' ? 'Chat con Familia' : 'Chat con el Profe'}
                    </h1>
                    {userRole === 'teacher' && <p className="text-xs text-gray-400">ID: {chatId}</p>}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === user.uid;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl ${isMe
                                ? 'bg-sol text-white rounded-br-none'
                                : 'bg-white text-gray-700 shadow-sm rounded-bl-none'
                                }`}>
                                <p className="font-sans">{msg.text}</p>
                                <p className={`text-[10px] mt-1 ${isMe ? 'text-orange-100' : 'text-gray-400'}`}>
                                    {msg.senderName}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={dummyRef}></div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white shadow-soft-up">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        className="flex-1 bg-gray-100 border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-sol outline-none font-sans"
                        placeholder="Escribe un mensaje..."
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                    />
                    <button type="submit" className="bg-sol hover:bg-sol-light text-white p-3 rounded-full transition-transform active:scale-95 shadow-md">
                        <Send size={24} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
