'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './queryClient';

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
