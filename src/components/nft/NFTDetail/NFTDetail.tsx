'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useNFT } from '@/hooks/useNFT';
import { useCart, useIsItemInCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button/Button';
import { EthIcon } from '@/components/ui/EthIcon/EthIcon';
import { formatPrice } from '@/lib/utils/formatters';
import styles from './NFTDetail.module.scss';

interface NFTDetailProps {
  id: number;
}

export function NFTDetail({ id }: NFTDetailProps) {
  const { data: nft, isLoading, isError } = useNFT(id);
  const { add } = useCart();
  const isInCart = useIsItemInCart(id);

  if (isLoading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (isError || !nft) {
    return (
      <div className={styles.error}>
        <p>NFT não encontrado</p>
        <Link href="/">
          <Button variant="primary">Voltar ao início</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    add(nft);
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href="/" className={styles.backLink}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M19 12H5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 19L5 12L12 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Voltar</span>
      </Link>

      <div className={styles.content}>
        <motion.div
          className={styles.imageWrapper}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Image
            src={nft.image}
            alt={nft.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={styles.image}
            priority
          />
        </motion.div>

        <motion.div
          className={styles.info}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h1 className={styles.title}>{nft.name}</h1>

          <p className={styles.description}>{nft.description}</p>

          <div className={styles.priceSection}>
            <span className={styles.priceLabel}>Preço</span>
            <div className={styles.priceValue}>
              <EthIcon size={32} className={styles.ethIcon} />
              <span>{formatPrice(nft.price)} ETH</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              variant={isInCart ? 'secondary' : 'primary'}
              size="lg"
              fullWidth
              onClick={handleAddToCart}
            >
              {isInCart ? 'Adicionado' : 'COMPRAR'}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
