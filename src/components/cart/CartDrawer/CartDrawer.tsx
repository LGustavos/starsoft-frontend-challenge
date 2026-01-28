'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/components/cart/CartItem/CartItem';
import { Button } from '@/components/ui/Button/Button';
import { EthIcon } from '@/components/ui/EthIcon/EthIcon';
import { formatPrice } from '@/lib/utils/formatters';
import styles from './CartDrawer.module.scss';

type CheckoutStatus = 'idle' | 'loading' | 'success';

const CHECKOUT_LOADING_MS = 2000;
const SUCCESS_DISPLAY_MS = 2500;

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const drawerVariants = {
  closed: { x: '100%' },
  open: { x: 0 },
};

const emptyCartIcon = (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 6H21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function CartDrawer() {
  const { items, total, isOpen, close, clear } = useCart();
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>('idle');

  const closeRef = useRef(close);
  closeRef.current = close;

  const handleCheckout = async () => {
    setCheckoutStatus('loading');

    await new Promise((resolve) => setTimeout(resolve, CHECKOUT_LOADING_MS));

    setCheckoutStatus('success');

    setTimeout(() => {
      clear();
      setCheckoutStatus('idle');
      close();
    }, SUCCESS_DISPLAY_MS);
  };

  useEffect(() => {
    if (!isOpen) {
      setCheckoutStatus('idle');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeRef.current();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={close}
            aria-hidden="true"
          />

          <motion.aside
            className={styles.drawer}
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <header className={styles.header}>
              <button
                className={styles.backButton}
                onClick={close}
                aria-label="Voltar"
              >
                <Image
                  src="/images/arrow-left.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
              </button>

              <h2 id="cart-title" className={styles.title}>
                Mochila de Compras
              </h2>
            </header>

            <div className={styles.content}>
              {items.length === 0 ? (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>
                    {emptyCartIcon}
                  </div>
                  <h3 className={styles.emptyTitle}>Sua mochila está vazia</h3>
                  <p className={styles.emptyDescription}>
                    Adicione itens à sua mochila para continuar
                  </p>
                  <Button variant="primary" size="md" onClick={close}>
                    Explorar NFTs
                  </Button>
                </div>
              ) : (
                <ul className={styles.list}>
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <CartItem key={item.nft.id} item={item} />
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className={styles.footer}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>TOTAL</span>
                  <div className={styles.totalValue}>
                    <EthIcon size={24} className={styles.ethIcon} />
                    <span>{formatPrice(total)} ETH</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleCheckout}
                  disabled={checkoutStatus !== 'idle'}
                >
                  {checkoutStatus === 'loading' && (
                    <span className={styles.spinner} aria-hidden="true" />
                  )}
                  {checkoutStatus === 'idle' && 'Finalizar Compra'}
                  {checkoutStatus === 'loading' && 'Processando...'}
                  {checkoutStatus === 'success' && 'Compra finalizada!'}
                </Button>
              </footer>
            )}

            <AnimatePresence>
              {checkoutStatus === 'success' && (
                <motion.div
                  className={styles.successOverlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className={styles.successIcon}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                  <motion.p
                    className={styles.successText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Compra finalizada!
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
