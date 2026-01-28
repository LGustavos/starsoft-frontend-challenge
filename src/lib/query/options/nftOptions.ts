import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { NFT, NFTListResponse } from '@/types/nft';

export const nftKeys = {
  all: ['nfts'] as const,
  lists: () => [...nftKeys.all, 'list'] as const,
  list: (filters: { page?: number; rows?: number }) => [...nftKeys.lists(), filters] as const,
  details: () => [...nftKeys.all, 'detail'] as const,
  detail: (id: number) => [...nftKeys.details(), id] as const,
};

export const nftListOptions = (page = 1, rows = 12) =>
  queryOptions({
    queryKey: nftKeys.list({ page, rows }),
    queryFn: () =>
      api.get<NFTListResponse>('/products', { page, rows, sortBy: 'id', orderBy: 'ASC' }),
  });

export const nftInfiniteOptions = (rows = 8) =>
  infiniteQueryOptions({
    queryKey: nftKeys.lists(),
    queryFn: ({ pageParam = 1 }) =>
      api.get<NFTListResponse>('/products', { page: pageParam, rows, sortBy: 'id', orderBy: 'ASC' }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((acc, page) => acc + page.products.length, 0);
      return loadedCount < lastPage.count ? allPages.length + 1 : undefined;
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
      return firstPageParam > 1 ? firstPageParam - 1 : undefined;
    },
  });

export const nftDetailOptions = (id: number) =>
  queryOptions({
    queryKey: nftKeys.detail(id),
    queryFn: () => api.get<NFT>(`/products/${id}`),
    enabled: !!id,
  });
