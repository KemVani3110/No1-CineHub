import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Loading from '@/components/common/Loading';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If user is already logged in, redirect to appropriate page
  if (session?.user) {
    const role = session.user.role;
    
    // If user is admin/moderator, redirect to admin dashboard
    if (role === 'admin' || role === 'moderator') {
      redirect('/admin/dashboard');
    }
    
    // Otherwise redirect to home
    redirect('/home');
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <Suspense fallback={<Loading message="Loading authentication..." />}>
        {children}
      </Suspense>
    </div>
  );
} 