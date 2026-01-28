'use client';

import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCart, useIsItemInCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button/Button';
import { EthIcon } from '@/components/ui/EthIcon/EthIcon';
import { formatPrice } from '@/lib/utils/formatters';
import type { NFT } from '@/types/nft';
import styles from './NFTCard.module.scss';

interface NFTCardProps {
  nft: NFT;
  index?: number;
  isNewlyLoaded?: boolean;
}

export const NFTCard = memo(function NFTCard({ nft, index = 0, isNewlyLoaded = false }: NFTCardProps) {
  const { add } = useCart();
  const isInCart = useIsItemInCart(nft.id);

  const handleAddToCart = () => {
    add(nft);
  };

  return (
    <motion.article
      className={styles.card}
      initial={isNewlyLoaded ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: isNewlyLoaded ? 0 : index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={nft.image}
          alt={nft.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={styles.image}
          priority={index < 4}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{nft.name}</h3>
        <p className={styles.description}>{nft.description}</p>

        <div className={styles.priceRow}>
          <EthIcon size={24} className={styles.ethIcon} />
          <span className={styles.priceValue}>{formatPrice(nft.price)} ETH</span>
        </div>

        <Button
          variant={isInCart ? 'secondary' : 'primary'}
          size="md"
          fullWidth
          onClick={handleAddToCart}
          aria-label={
            isInCart ? `${nft.name} adicionado` : `Adicionar ${nft.name} ao carrinho`
          }
        >
          {isInCart ? 'Adicionado' : 'COMPRAR'}
        </Button>
      </div>
    </motion.article>
  );
});
