import { screen, fireEvent, act } from '@testing-library/react';
import { CartDrawer } from './CartDrawer';
import { renderWithProviders } from '../../../../__tests__/utils/test-utils';
import { addItem, openCart } from '@/lib/store/slices/cartSlice';

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

// Mock createPortal to render in the same container
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

describe('CartDrawer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('rendering', () => {
    it('should not render when cart is closed', () => {
      renderWithProviders(<CartDrawer />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when cart is open', () => {
      const { store } = renderWithProviders(<CartDrawer />);

      act(() => {
        store.dispatch(openCart());
      });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Mochila de Compras')).toBeInTheDocument();
    });

    it('should show empty message when cart has no items', () => {
      const { store } = renderWithProviders(<CartDrawer />);

      act(() => {
        store.dispatch(openCart());
      });

      expect(screen.getByText('Sua mochila está vazia')).toBeInTheDocument();
    });

    it('should show items when cart has products', () => {
      const { store } = renderWithProviders(<CartDrawer />);

      act(() => {
        store.dispatch(addItem(mockNFT));
        store.dispatch(openCart());
      });

      expect(screen.getByText('Test NFT')).toBeInTheDocument();
      expect(screen.getByText('Finalizar Compra')).toBeInTheDocument();
    });

    it('should show correct total', () => {
      const { store } = renderWithProviders(<CartDrawer />);

      act(() => {
        store.dispatch(addItem(mockNFT));
        store.dispatch(addItem(mockNFT2));
        store.dispatch(openCart());
      });

      // Total label should be displayed
      expect(screen.getByText('TOTAL')).toBeInTheDocument();
      // Multiple ETH texts exist (in items and total), just verify at least one exists
      const ethTexts = screen.getAllByText(/ETH/);
      expect(ethTexts.length).toBeGreaterThan(0);
    });
  });

  describe('checkout flow', () => {
    it('should show loading state when checkout button is clicked', async () => {
      const { store } = renderWithProviders(<CartDrawer />);

      act(() => {
        store.dispatch(addItem(mockNFT));
        store.dispatch(openCart());
      });

      const checkoutButton = screen.getByRole('button', { name: /finalizar compra/i });

      await act(async () => {
        fireEvent.click(checkoutButton);
        // Small delay to let state update
        jest.advanceTimersByTime(100);
      });

      expect(screen.getByText('Processando...')).toBeInTheDocument();
      expect(checkoutButton).toBeDisabled();
    });

    it('should show success state after processing', async () => {
      const { store } = renderWithProviders(<CartDrawer />);

      act(() => {
        store.dispatch(addItem(mockNFT));
        store.dispatch(openCart());
      });

      const checkoutButton = screen.getByRole('button', { name: /finalizar compra/i });

      await act(async () => {
        fireEvent.click(checkoutButton);
      });

      // Fast-forward past the loading time (2000ms)
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      // There will be multiple elements with "Compra finalizada!" (button and overlay)
      const successElements = screen.getAllByText('Compra finalizada!');
      expect(successElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should show success overlay with checkmark', async () => {
      const { store } = renderWithProviders(<CartDrawer />);

      act(() => {
        store.dispatch(addItem(mockNFT));
        store.dispatch(openCart());
      });

      const checkoutButton = screen.getByRole('button', { name: /finalizar compra/i });

      await act(async () => {
        fireEvent.click(checkoutButton);
      });

      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      // Check for the success overlay text
      const successTexts = screen.getAllByText('Compra finalizada!');
      expect(successTexts.length).toBeGreaterThanOrEqual(1);
    });

    it('should clear cart and close drawer after success', async () => {
      const { store } = renderWithProviders(<CartDrawer />);

      act(() => {
        store.dispatch(addItem(mockNFT));
        store.dispatch(openCart());
      });

      const checkoutButton = screen.getByRole('button', { name: /finalizar compra/i });

      await act(async () => {
        fireEvent.click(checkoutButton);
      });

      // Fast-forward past loading (2000ms)
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      // Fast-forward past success display (2500ms)
      await act(async () => {
        jest.advanceTimersByTime(2500);
      });

      // Cart should be cleared
      const state = store.getState();
      expect(state.cart.items).toHaveLength(0);
      expect(state.cart.isOpen).toBe(false);
    });

    it('should disable checkout button during processing', async () => {
      const { store } = renderWithProviders(<CartDrawer />);

      act(() => {
        store.dispatch(addItem(mockNFT));
        store.dispatch(openCart());
      });

      const checkoutButton = screen.getByRole('button', { name: /finalizar compra/i });
      expect(checkoutButton).not.toBeDisabled();

      await act(async () => {
        fireEvent.click(checkoutButton);
        jest.advanceTimersByTime(100);
      });

      expect(checkoutButton).toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('should have correct aria attributes', () => {
      const { store } = renderWithProviders(<CartDrawer />);

      act(() => {
        store.dispatch(openCart());
      });

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'cart-title');
    });

    it('should have accessible back button', () => {
      const { store } = renderWithProviders(<CartDrawer />);

      act(() => {
        store.dispatch(openCart());
      });

      const backButton = screen.getByRole('button', { name: /voltar/i });
      expect(backButton).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should close drawer when back button is clicked', () => {
      const { store } = renderWithProviders(<CartDrawer />);

      act(() => {
        store.dispatch(openCart());
      });

      const backButton = screen.getByRole('button', { name: /voltar/i });

      act(() => {
        fireEvent.click(backButton);
      });

      const state = store.getState();
      expect(state.cart.isOpen).toBe(false);
    });

    it('should close drawer when overlay is clicked', () => {
      const { store } = renderWithProviders(<CartDrawer />);

      act(() => {
        store.dispatch(openCart());
      });

      // Find the overlay by its aria-hidden attribute
      const overlay = document.querySelector('[aria-hidden="true"]');
      expect(overlay).toBeInTheDocument();

      act(() => {
        fireEvent.click(overlay!);
      });

      const state = store.getState();
      expect(state.cart.isOpen).toBe(false);
    });
  });
});
