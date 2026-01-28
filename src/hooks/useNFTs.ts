'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { nftInfiniteOptions } from '@/lib/query/options/nftOptions';

export function useNFTs(limit = 8) {
  return useInfiniteQuery(nftInfiniteOptions(limit));
}
