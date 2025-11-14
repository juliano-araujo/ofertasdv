'use client';

import { SessionProvider } from '@/contexts/session-context';
import { makeQueryClient } from '@/queries';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  const [queryClient] = React.useState(() => makeQueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </>
      </QueryClientProvider>
    </SessionProvider>
  );
}
