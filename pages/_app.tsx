// /pages/_app.tsx
import '@/styles/globals.css';
import '@/styles/toastify.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/AuthContext'; // ✅ Add this

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider> {/* ✅ Wrap the app in AuthProvider */}
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </AuthProvider>
  );
}


