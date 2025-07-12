import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '@/components/layout/Header';
import { AuthProvider } from '@/components/context/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="bg-black text-white min-h-screen w-full">
        <Header />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}

export default MyApp;
