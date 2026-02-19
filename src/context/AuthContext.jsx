import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'teacher' or 'parent'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeFirestore = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            // Cleanup previous firestore listener if exists
            if (unsubscribeFirestore) {
                unsubscribeFirestore();
                unsubscribeFirestore = null;
            }

            if (currentUser) {
                // Real-time listener for user profile
                const userDocRef = doc(db, 'users', currentUser.uid);

                unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setUserRole(userData.role);
                        setUser({ ...currentUser, ...userData });
                    } else {
                        console.log("No user profile found (yet)");
                        setUser(currentUser);
                        setUserRole(null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setUser(currentUser);
                    setLoading(false);
                });

            } else {
                setUser(null);
                setUserRole(null);
                setLoading(false);
            }
        });

        // Safety timeout in case auth hangs
        const timeoutId = setTimeout(() => {
            setLoading((currentLoading) => {
                if (currentLoading) {
                    console.warn("Auth check timed out, forcing load.");
                    return false;
                }
                return currentLoading;
            });
        }, 5000); // 5 seconds timeout

        return () => {
            clearTimeout(timeoutId);
            unsubscribeAuth();
            if (unsubscribeFirestore) unsubscribeFirestore();
        };
    }, []);

    // Function to create user profile in Firestore after registration
    const createUserProfile = async (uid, email, role, name) => {
        try {
            await setDoc(doc(db, 'users', uid), {
                email,
                role,
                name,
                createdAt: new Date().toISOString()
            });
            setUserRole(role);
        } catch (error) {
            console.error("Error creating user profile:", error);
            throw error;
        }
    };

    const value = {
        user,
        userRole,
        loading,
        createUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="h-screen w-full flex items-center justify-center bg-crema">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sol"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
