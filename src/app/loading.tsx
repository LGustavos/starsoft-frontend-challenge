import { NFTSkeleton } from '@/components/nft/NFTSkeleton/NFTSkeleton';
import styles from './page.module.scss';

export default function Loading() {
  return (
    <main className={styles.main}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <NFTSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
