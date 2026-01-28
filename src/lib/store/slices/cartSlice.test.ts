import cartReducer, {
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
} from './cartSlice';
import type { CartState } from '@/types/cart';

const mockNFT = {
  id: 1,
  name: 'Test NFT',
  description: 'Test description',
  image: 'https://example.com/test.jpg',
  price: '1.5',
};

const mockNFT2 = {
  id: 2,
  name: 'Test NFT 2',
  description: 'Test description 2',
  image: 'https://example.com/test2.jpg',
  price: '2.0',
};

describe('cartSlice', () => {
  const initialState: CartState = {
    items: [],
    isOpen: false,
  };

  describe('addItem', () => {
    it('should add a new item to empty cart', () => {
      const state = cartReducer(initialState, addItem(mockNFT));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].nft).toEqual(mockNFT);
      expect(state.items[0].quantity).toBe(1);
    });

    it('should increment quantity for existing item', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ nft: mockNFT, quantity: 1 }],
      };

      const state = cartReducer(stateWithItem, addItem(mockNFT));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
    });

    it('should add different items separately', () => {
      let state = cartReducer(initialState, addItem(mockNFT));
      state = cartReducer(state, addItem(mockNFT2));

      expect(state.items).toHaveLength(2);
      expect(state.items[0].nft.id).toBe(1);
      expect(state.items[1].nft.id).toBe(2);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ nft: mockNFT, quantity: 1 }],
      };

      const state = cartReducer(stateWithItem, removeItem(mockNFT.id));

      expect(state.items).toHaveLength(0);
    });

    it('should not affect other items when removing one', () => {
      const stateWithItems: CartState = {
        ...initialState,
        items: [
          { nft: mockNFT, quantity: 1 },
          { nft: mockNFT2, quantity: 2 },
        ],
      };

      const state = cartReducer(stateWithItems, removeItem(mockNFT.id));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].nft.id).toBe(2);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ nft: mockNFT, quantity: 1 }],
      };

      const state = cartReducer(stateWithItem, updateQuantity({ id: mockNFT.id, quantity: 5 }));

      expect(state.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is 0', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ nft: mockNFT, quantity: 1 }],
      };

      const state = cartReducer(stateWithItem, updateQuantity({ id: mockNFT.id, quantity: 0 }));

      expect(state.items).toHaveLength(0);
    });

    it('should not allow negative quantity', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ nft: mockNFT, quantity: 1 }],
      };

      const state = cartReducer(stateWithItem, updateQuantity({ id: mockNFT.id, quantity: -5 }));

      expect(state.items).toHaveLength(0);
    });
  });

  describe('incrementQuantity', () => {
    it('should increment item quantity by 1', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ nft: mockNFT, quantity: 2 }],
      };

      const state = cartReducer(stateWithItem, incrementQuantity(mockNFT.id));

      expect(state.items[0].quantity).toBe(3);
    });
  });

  describe('decrementQuantity', () => {
    it('should decrement item quantity by 1', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ nft: mockNFT, quantity: 3 }],
      };

      const state = cartReducer(stateWithItem, decrementQuantity(mockNFT.id));

      expect(state.items[0].quantity).toBe(2);
    });

    it('should remove item when quantity reaches 0', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ nft: mockNFT, quantity: 1 }],
      };

      const state = cartReducer(stateWithItem, decrementQuantity(mockNFT.id));

      expect(state.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const stateWithItems: CartState = {
        ...initialState,
        items: [
          { nft: mockNFT, quantity: 2 },
          { nft: mockNFT2, quantity: 3 },
        ],
      };

      const state = cartReducer(stateWithItems, clearCart());

      expect(state.items).toHaveLength(0);
    });
  });

  describe('cart visibility actions', () => {
    it('toggleCart should toggle isOpen state', () => {
      const state1 = cartReducer(initialState, toggleCart());
      expect(state1.isOpen).toBe(true);

      const state2 = cartReducer(state1, toggleCart());
      expect(state2.isOpen).toBe(false);
    });

    it('openCart should set isOpen to true', () => {
      const state = cartReducer(initialState, openCart());
      expect(state.isOpen).toBe(true);
    });

    it('closeCart should set isOpen to false', () => {
      const stateOpen: CartState = { ...initialState, isOpen: true };
      const state = cartReducer(stateOpen, closeCart());
      expect(state.isOpen).toBe(false);
    });
  });

  describe('selectors', () => {
    const stateWithItems = {
      cart: {
        items: [
          { nft: { ...mockNFT, price: '1.5' }, quantity: 2 },
          { nft: { ...mockNFT2, price: '2.0' }, quantity: 1 },
        ],
        isOpen: true,
      },
    };

    it('selectCartItems should return cart items', () => {
      expect(selectCartItems(stateWithItems)).toEqual(stateWithItems.cart.items);
    });

    it('selectCartTotal should calculate total correctly', () => {
      expect(selectCartTotal(stateWithItems)).toBe(5.0);
    });

    it('selectCartCount should count total items', () => {
      expect(selectCartCount(stateWithItems)).toBe(3);
    });

    it('selectIsCartOpen should return isOpen state', () => {
      expect(selectIsCartOpen(stateWithItems)).toBe(true);
    });
  });
});
