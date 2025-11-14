'use client';

import { useSession } from '@/contexts/session-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while loading or redirecting
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
