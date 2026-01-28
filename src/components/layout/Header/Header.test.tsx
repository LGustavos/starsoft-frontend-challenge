import { screen, fireEvent, act } from '@testing-library/react';
import { Header } from './Header';
import { renderWithProviders } from '../../../../__tests__/utils/test-utils';
import { addItem } from '@/lib/store/slices/cartSlice';

const mockNFT = {
  id: 1,
  name: 'Test NFT',
  description: 'Test description',
  image: 'https://example.com/test.jpg',
  price: '1.5',
};

describe('Header', () => {
  it('renders the header element', () => {
    renderWithProviders(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('renders the logo link', () => {
    renderWithProviders(<Header />);

    const logoLink = screen.getByRole('link');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders the cart button', () => {
    renderWithProviders(<Header />);

    const cartButton = screen.getByRole('button');
    expect(cartButton).toBeInTheDocument();
  });

  it('shows cart count as 0 initially', async () => {
    renderWithProviders(<Header />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const cartButton = screen.getByRole('button');
    expect(cartButton).toHaveTextContent('0');
  });

  it('updates cart count when items are added', async () => {
    const { store } = renderWithProviders(<Header />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      store.dispatch(addItem(mockNFT));
    });

    const cartButton = screen.getByRole('button');
    expect(cartButton).toHaveTextContent('1');
  });

  it('shows 99+ when cart has more than 99 items', async () => {
    const { store } = renderWithProviders(<Header />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      for (let i = 0; i < 100; i++) {
        store.dispatch(addItem({ ...mockNFT, id: i }));
      }
    });

    const cartButton = screen.getByRole('button');
    expect(cartButton).toHaveTextContent('99+');
  });

  it('has accessible label for cart button', async () => {
    const { store } = renderWithProviders(<Header />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      store.dispatch(addItem(mockNFT));
    });

    const cartButton = screen.getByRole('button');
    expect(cartButton).toHaveAttribute('aria-label', 'Abrir carrinho com 1 item');
  });

  it('toggles cart when cart button is clicked', () => {
    const { store } = renderWithProviders(<Header />);

    const cartButton = screen.getByRole('button');
    fireEvent.click(cartButton);

    const state = store.getState();
    expect(state.cart.isOpen).toBe(true);
  });
});
