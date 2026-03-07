import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/contexts/cart-context';
import { CartDrawer } from '@/components/cart/cart-drawer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Surgical & Physiotherapy Equipment Store',
  description: 'Premium medical and physiotherapy equipment for professionals and personal care.',
};

import { Suspense } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <CartProvider>
          <Suspense fallback={<div className="h-16 border-b bg-background/95" />}>
            <Navbar />
          </Suspense>
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-center" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
