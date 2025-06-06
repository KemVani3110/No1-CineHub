// "use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Providers from "@/providers/Providers";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from 'react';
import Loading from '@/components/common/Loading';
import { CompilingProvider } from '@/components/common/CompilingProvider';
import { LoadingProvider } from '@/providers/LoadingProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CineHub - Your Ultimate Movie & TV Show Companion",
  description:
    "Discover, track, and discuss your favorite movies and TV shows with CineHub.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<Loading message="Loading CineHub..." showBackdrop={true} />}>
          <CompilingProvider>
            <Providers>
              <QueryProvider>
                <LoadingProvider>
                  {children}
                  <Toaster />
                </LoadingProvider>
              </QueryProvider>
            </Providers>
          </CompilingProvider>
        </Suspense>
      </body>
    </html>
  );
}
