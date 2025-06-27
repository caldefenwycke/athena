// context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

interface ExtendedUser extends FirebaseUser {
  role: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();

            const extendedUser: ExtendedUser = {
              ...firebaseUser,
              role: userData.role || 'athlete', // default fallback
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: firebaseUser.email || '',
            };

            setUser(extendedUser);
          } else {
            console.warn('No Firestore user doc found for:', firebaseUser.uid);
            setUser({
              ...firebaseUser,
              role: 'athlete',
              email: firebaseUser.email || '',
            } as ExtendedUser);
          }
        } catch (error) {
          console.error('Error fetching Firestore user:', error);
          setUser({
            ...firebaseUser,
            role: 'athlete',
            email: firebaseUser.email || '',
          } as ExtendedUser);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setLoading(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

