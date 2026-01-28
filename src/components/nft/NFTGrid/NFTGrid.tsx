'use client';

import { AnimatePresence } from 'framer-motion';
import { useNFTs } from '@/hooks/useNFTs';
import { NFTCard } from '@/components/nft/NFTCard/NFTCard';
import { NFTSkeleton } from '@/components/nft/NFTSkeleton/NFTSkeleton';
import { Button } from '@/components/ui/Button/Button';
import styles from './NFTGrid.module.scss';

export function NFTGrid() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error, refetch } =
    useNFTs(8);

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <NFTSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.error} role="alert">
        <h2>Erro ao carregar NFTs</h2>
        <p>{error instanceof Error ? error.message : 'Tente novamente mais tarde.'}</p>
        <Button onClick={() => refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  const allNFTs = data?.pages.flatMap((page) => page.products) ?? [];
  const totalCount = data?.pages[0]?.count ?? 0;
  const loadedCount = allNFTs.length;
  const progress = totalCount > 0 ? (loadedCount / totalCount) * 100 : 0;
  const firstPageCount = data?.pages[0]?.products.length ?? 0;

  if (allNFTs.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Nenhum NFT encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.grid}>
        <AnimatePresence mode="popLayout">
          {allNFTs.map((nft, index) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              index={index}
              isNewlyLoaded={index >= firstPageCount}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination progress and load more button */}
      <div className={styles.loadMore}>
        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            style={{ width: hasNextPage ? `${progress}%` : '100%' }}
          />
        </div>
        <button
          className={styles.loadMoreButton}
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage || !hasNextPage}
        >
          {/* Explicit ternary for conditional rendering (rendering-conditional-render) */}
          {!hasNextPage
            ? 'Você já viu tudo'
            : isFetchingNextPage
              ? 'Carregando...'
              : 'Carregar Mais'}
        </button>
      </div>
    </>
  );
}
