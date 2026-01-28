import { Suspense } from 'react';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { NFTGrid } from '@/components/nft/NFTGrid/NFTGrid';
import { NFTSkeleton } from '@/components/nft/NFTSkeleton/NFTSkeleton';
import { CartDrawer } from '@/components/cart/CartDrawer/CartDrawer';
import styles from './page.module.scss';

function NFTGridSkeleton() {
  return (
    <div className={styles.skeletonGrid}>
      {Array.from({ length: 8 }).map((_, i) => (
        <NFTSkeleton key={i} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Suspense fallback={<NFTGridSkeleton />}>
          <NFTGrid />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
