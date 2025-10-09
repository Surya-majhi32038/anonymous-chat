import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'True Feedback',
    description: 'Real feedback from real people.',
};

interface RootLayoutProps {
    children: React.ReactNode;
}
// last 8:2:00 
export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" >
            <AuthProvider>
                <body className={inter.className}>
                    {children}
                    <Toaster
                        theme='light'
                        position="top-center"
                        richColors
                    />
                </body>
            </AuthProvider>
        </html>
    );
}
