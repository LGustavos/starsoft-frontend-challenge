import { memo } from 'react';
import styles from './NFTSkeleton.module.scss';

export const NFTSkeleton = memo(function NFTSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.image} />
      <div className={styles.content}>
        <div className={styles.title} />
        <div className={styles.description} />
        <div className={styles.description} style={{ width: '60%' }} />
        <div className={styles.footer}>
          <div className={styles.price} />
          <div className={styles.button} />
        </div>
      </div>
    </div>
  );
});
