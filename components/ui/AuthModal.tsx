'use client';

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/router';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      if (isRegister) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', res.user.uid), {
          email: res.user.email,
          firstName,
          lastName,
          role: 'athlete',
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      onClose();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');
    if (!email) return setError('Enter your email address first');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset link sent!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-lg p-8 w-full max-w-md text-center relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-green-500 text-lg"
        >
          ✕
        </button>
        <div className="text-4xl font-bold mb-2">
          <span className="text-[#00FF00]">ATH</span><span className="text-white">ENA</span>
        </div>
        <p className="text-white text-lg mb-6">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-2 bg-black border border-[#333] text-white rounded"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-2 bg-black border border-[#333] text-white rounded"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 bg-black border border-[#333] text-white rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-2 bg-black border border-[#333] text-white rounded pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-sm text-gray-400 hover:text-white"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {!isRegister && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-green-500 hover:underline"
            >
              Forgot Password?
            </button>
          )}

          <label className="flex items-center text-sm text-white space-x-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="form-checkbox text-green-500"
            />
            <span>Remember Me</span>
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          <button
            type="submit"
            className="w-full bg-[#00FF00] text-black font-semibold py-2 rounded hover:opacity-90"
          >
            {isRegister ? 'Register' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-4">
          {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-[#00FF00] hover:underline"
          >
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
