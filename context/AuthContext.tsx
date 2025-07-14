// /context/AuthContext.tsx
'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

interface ExtendedUser extends FirebaseUser {
  role: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  role: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

          const userData = userDoc.exists() ? userDoc.data() : {};

          const extendedUser: ExtendedUser = {
            ...firebaseUser,
            role: userData.role || 'athlete',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: firebaseUser.email || '',
          };

          setUser(extendedUser);
          setRole(userData.role || 'athlete');
        } catch (err) {
          console.error('Error fetching user doc:', err);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setLoading(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
