'use client';

import { useQuery } from '@tanstack/react-query';
import { nftDetailOptions } from '@/lib/query/options/nftOptions';

export function useNFT(id: number) {
  return useQuery(nftDetailOptions(id));
}
