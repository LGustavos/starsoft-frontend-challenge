'use client';

import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { EthIcon } from '@/components/ui/EthIcon/EthIcon';
import { formatPrice } from '@/lib/utils/formatters';
import type { CartItem as CartItemType } from '@/types/cart';
import styles from './CartItem.module.scss';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = memo(function CartItem({ item }: CartItemProps) {
  const { increment, decrement, remove } = useCart();
  const { nft, quantity } = item;

  return (
    <motion.li
      className={styles.item}
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className={styles.imageWrapper}>
        <Image src={nft.image} alt={nft.name} fill sizes="100px" className={styles.image} />
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <h4 className={styles.name}>{nft.name}</h4>
          <p className={styles.description}>{nft.description}</p>
          <div className={styles.priceRow}>
            <EthIcon size={24} className={styles.ethIcon} />
            <span className={styles.price}>{formatPrice(nft.price)} ETH</span>
          </div>
        </div>

        <div className={styles.actions}>
          <div className={styles.quantityControls}>
            <button
              className={styles.quantityButton}
              onClick={() => decrement(nft.id)}
              aria-label="Diminuir quantidade"
            >
              −
            </button>
            <span className={styles.quantity}>{quantity}</span>
            <button
              className={styles.quantityButton}
              onClick={() => increment(nft.id)}
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>

          <button
            className={styles.removeButton}
            onClick={() => remove(nft.id)}
            aria-label={`Remover ${nft.name} do carrinho`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 6H5H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.li>
  );
});
