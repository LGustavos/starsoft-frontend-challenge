'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  addItem,
  removeItem,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  selectIsCartOpen,
  selectIsItemInCart,
  selectItemQuantity,
} from '@/lib/store/slices/cartSlice';
import type { NFT } from '@/types/nft';

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartCount);
  const isOpen = useAppSelector(selectIsCartOpen);

  // Build index Map for O(1) lookups (js-index-maps)
  const itemsById = useMemo(
    () => new Map(items.map((item) => [item.nft.id, item])),
    [items]
  );

  const add = useCallback(
    (nft: NFT) => {
      dispatch(addItem(nft));
    },
    [dispatch]
  );

  const remove = useCallback(
    (id: number) => {
      dispatch(removeItem(id));
    },
    [dispatch]
  );

  const setQuantity = useCallback(
    (id: number, quantity: number) => {
      dispatch(updateQuantity({ id, quantity }));
    },
    [dispatch]
  );

  const increment = useCallback(
    (id: number) => {
      dispatch(incrementQuantity(id));
    },
    [dispatch]
  );

  const decrement = useCallback(
    (id: number) => {
      dispatch(decrementQuantity(id));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  const open = useCallback(() => {
    dispatch(openCart());
  }, [dispatch]);

  const close = useCallback(() => {
    dispatch(closeCart());
  }, [dispatch]);

  // O(1) lookup using Map instead of O(n) with .some()
  const isInCart = useCallback(
    (id: number) => {
      return itemsById.has(id);
    },
    [itemsById]
  );

  // O(1) lookup using Map instead of O(n) with .find()
  const getQuantity = useCallback(
    (id: number) => {
      return itemsById.get(id)?.quantity ?? 0;
    },
    [itemsById]
  );

  return {
    items,
    total,
    count,
    isOpen,
    add,
    remove,
    setQuantity,
    increment,
    decrement,
    clear,
    toggle,
    open,
    close,
    isInCart,
    getQuantity,
  };
}

// Selector hooks for specific use cases
export function useIsItemInCart(id: number) {
  return useAppSelector(selectIsItemInCart(id));
}

export function useItemQuantity(id: number) {
  return useAppSelector(selectItemQuantity(id));
}
