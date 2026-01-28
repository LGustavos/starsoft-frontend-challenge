'use client';

import { memo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import styles from './Header.module.scss';

export const Header = memo(function Header() {
  const { count, toggle } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCount = mounted ? count : 0;
  const displayCountText = displayCount > 99 ? '99+' : displayCount;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo.svg"
            alt="Starsoft"
            width={101}
            height={38}
            priority
          />
        </Link>

        <button
          className={styles.cartButton}
          onClick={toggle}
          aria-label={`Abrir carrinho com ${displayCount} ${displayCount === 1 ? 'item' : 'itens'}`}
        >
          <Image
            src="/images/bag.svg"
            alt=""
            width={33}
            height={33}
            aria-hidden="true"
          />
          <span className={styles.cartCount}>{displayCountText}</span>
        </button>
      </div>
    </header>
  );
});
