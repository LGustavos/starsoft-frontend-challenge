import { configureStore, Middleware } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import type { CartState, CartItem } from '@/types/cart';

const CART_STORAGE_KEY = 'nft-marketplace:cart:v2';

let cachedPreloadedState: { cart: CartState } | undefined;

const localStorageMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);

  if (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof (action as { type: string }).type === 'string' &&
    (action as { type: string }).type.startsWith('cart/')
  ) {
    try {
      const state = storeAPI.getState() as RootState;
      const dataToStore = JSON.stringify({
        items: state.cart.items,
        updatedAt: Date.now(),
      });
      localStorage.setItem(CART_STORAGE_KEY, dataToStore);
    } catch {
    }
  }

  return result;
};

const getPreloadedState = (): { cart: CartState } | undefined => {
  if (typeof window === 'undefined') return undefined;

  if (cachedPreloadedState !== undefined) return cachedPreloadedState;

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const { items } = JSON.parse(stored) as { items: CartItem[] };
      cachedPreloadedState = { cart: { items, isOpen: false } };
      return cachedPreloadedState;
    }
  } catch {
  }
  return undefined;
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(localStorageMiddleware),
    preloadedState: getPreloadedState(),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
