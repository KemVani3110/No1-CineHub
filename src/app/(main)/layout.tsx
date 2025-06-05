import { Suspense } from 'react';
import Loading from '@/components/common/Loading';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <Header />
      <Suspense fallback={<Loading message="Loading content..." />}>
        {children}
      </Suspense>
      <Footer />
    </div>
  );
} 