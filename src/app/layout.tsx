import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Providers from "@/providers/Providers";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";

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
        <Providers>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
