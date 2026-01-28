import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { nftDetailOptions } from '@/lib/query/options/nftOptions';
import { NFTDetail } from '@/components/nft/NFTDetail/NFTDetail';
import { Header } from '@/components/layout/Header/Header';
import { CartDrawer } from '@/components/cart/CartDrawer/CartDrawer';
import { api } from '@/lib/api/client';
import type { NFT, NFTListResponse } from '@/types/nft';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate static paths at build time (SSG)
export async function generateStaticParams() {
  try {
    const response = await api.get<NFTListResponse>('/products', {
      rows: 100,
      sortBy: 'id',
      orderBy: 'ASC',
    });
    return response.products.map((nft) => ({
      id: String(nft.id),
    }));
  } catch {
    // Return empty array if API is down - will use ISR
    return [];
  }
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const nft = await api.get<NFT>(`/products/${id}`);

    return {
      title: nft.name,
      description: nft.description,
      openGraph: {
        title: nft.name,
        description: nft.description,
        images: [{ url: nft.image, alt: nft.name }],
      },
    };
  } catch {
    return {
      title: 'NFT não encontrado',
    };
  }
}

export default async function NFTPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery(nftDetailOptions(numericId));
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Header />
      <main className={styles.main}>
        <Suspense fallback={<NFTDetailSkeleton />}>
          <NFTDetail id={numericId} />
        </Suspense>
      </main>
      <CartDrawer />
    </HydrationBoundary>
  );
}

// Simple skeleton for suspense fallback
function NFTDetailSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonDescription} />
        <div className={styles.skeletonPrice} />
      </div>
    </div>
  );
}

// Enable ISR with revalidation every 60 seconds
export const revalidate = 60;
