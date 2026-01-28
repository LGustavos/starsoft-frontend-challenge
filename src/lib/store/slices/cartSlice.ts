import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { NFT } from '@/types/nft';
import type { CartState } from '@/types/cart';

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<NFT>) => {
      const existingItem = state.items.find((item) => item.nft.id === action.payload.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ nft: action.payload, quantity: 1 });
      }
    },

    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.nft.id !== action.payload);
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item) => item.nft.id === action.payload.id);

      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);

        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i.nft.id !== action.payload.id);
        }
      }
    },

    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((item) => item.nft.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((item) => item.nft.id === action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.nft.id !== action.payload);
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + parseFloat(item.nft.price) * item.quantity, 0);

export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export const selectIsCartOpen = (state: { cart: CartState }) => state.cart.isOpen;

export const selectIsItemInCart = (id: number) => (state: { cart: CartState }) =>
  state.cart.items.some((item) => item.nft.id === id);

export const selectItemQuantity = (id: number) => (state: { cart: CartState }) =>
  state.cart.items.find((item) => item.nft.id === id)?.quantity ?? 0;

export default cartSlice.reducer;
