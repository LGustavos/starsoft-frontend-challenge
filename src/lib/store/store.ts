import { configureStore, Middleware } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import type { CartState, CartItem } from '@/types/cart';

// Versioned storage key for schema migration (client-version-localstorage)
const CART_STORAGE_KEY = 'nft-marketplace:cart:v2';

// Cache for localStorage reads (js-cache-storage)
let cachedPreloadedState: { cart: CartState } | undefined;

// Middleware para persistir carrinho no localStorage
const localStorageMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);

  // Verificar se é uma ação do cart
  if (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof (action as { type: string }).type === 'string' &&
    (action as { type: string }).type.startsWith('cart/')
  ) {
    try {
      const state = storeAPI.getState() as RootState;
      // Store only necessary fields (client-version-localstorage)
      const dataToStore = JSON.stringify({
        items: state.cart.items,
        updatedAt: Date.now(),
      });
      localStorage.setItem(CART_STORAGE_KEY, dataToStore);
    } catch {
      // Silently fail (e.g., in incognito mode, quota exceeded)
    }
  }

  return result;
};

// Recuperar estado do localStorage com cache
const getPreloadedState = (): { cart: CartState } | undefined => {
  if (typeof window === 'undefined') return undefined;

  // Return cached value if already read
  if (cachedPreloadedState !== undefined) return cachedPreloadedState;

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const { items } = JSON.parse(stored) as { items: CartItem[] };
      cachedPreloadedState = { cart: { items, isOpen: false } };
      return cachedPreloadedState;
    }
  } catch {
    // Silently fail
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
