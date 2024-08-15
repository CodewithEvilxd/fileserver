import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'File Share',
    description: 'Temp File Share',
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    return (
        <html lang="en">
            <body className={`dark h-screen ${inter.className || ''}`}>
                <Head>
                    <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />
                    <meta name="File Share" content="File Share" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                    <meta name="apple-mobile-web-app-title" content="yes" />
                    <meta name="description" content="File Share" />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="msapplication-TileColor" content="#2B5797" />
                    <meta name="msapplication-tap-highlight" content="no" />
                    <meta name="theme-color" content="#000000" />

                    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
                    <link rel="manifest" href="manifest.json" />
                    <link rel="shortcut icon" href="/favicon.ico" />
                </Head>
                <Toaster position="bottom-left" />
                {children}
            </body>
        </html>
    );
}
