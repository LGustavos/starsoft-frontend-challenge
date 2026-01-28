import { screen, fireEvent } from '@testing-library/react';
import { NFTCard } from './NFTCard';
import { renderWithProviders } from '../../../../__tests__/utils/test-utils';

const mockNFT = {
  id: 1,
  name: 'Test NFT',
  description: 'A beautiful test NFT for testing purposes',
  image: 'https://example.com/test.jpg',
  price: '1.5',
};

describe('NFTCard', () => {
  it('renders NFT information correctly', () => {
    renderWithProviders(<NFTCard nft={mockNFT} />);

    expect(screen.getByText('Test NFT')).toBeInTheDocument();
    expect(screen.getByText('A beautiful test NFT for testing purposes')).toBeInTheDocument();
    expect(screen.getByText('1.50 ETH')).toBeInTheDocument();
  });

  it('renders image with correct alt text', () => {
    renderWithProviders(<NFTCard nft={mockNFT} />);

    const image = screen.getByRole('img', { name: 'Test NFT' });
    expect(image).toBeInTheDocument();
  });

  it('shows "COMPRAR" button initially', () => {
    renderWithProviders(<NFTCard nft={mockNFT} />);

    expect(screen.getByRole('button', { name: /adicionar test nft ao carrinho/i })).toBeInTheDocument();
    expect(screen.getByText('COMPRAR')).toBeInTheDocument();
  });

  it('adds item to cart when button is clicked', () => {
    const { store } = renderWithProviders(<NFTCard nft={mockNFT} />);

    const addButton = screen.getByRole('button', { name: /adicionar test nft ao carrinho/i });
    fireEvent.click(addButton);

    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].nft.id).toBe(1);
    expect(state.cart.items[0].quantity).toBe(1);
  });

  it('changes button text to "Adicionado" after adding to cart', () => {
    const { store } = renderWithProviders(<NFTCard nft={mockNFT} />);

    // Verify cart is initially empty
    expect(store.getState().cart.items).toHaveLength(0);

    const addButton = screen.getByRole('button');
    expect(addButton).toHaveTextContent('COMPRAR');

    fireEvent.click(addButton);

    expect(screen.getByText('Adicionado')).toBeInTheDocument();
  });

  it('increments quantity when clicking add button multiple times', () => {
    const { store } = renderWithProviders(<NFTCard nft={mockNFT} />);

    // Get the button
    const button = screen.getByRole('button');

    // Click three times
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    const state = store.getState();
    expect(state.cart.items[0].quantity).toBe(3);
  });

  it('has accessible button label', () => {
    const { store } = renderWithProviders(<NFTCard nft={mockNFT} />);

    // Verify cart is initially empty
    expect(store.getState().cart.items).toHaveLength(0);

    const button = screen.getByRole('button');
    expect(button).toHaveAccessibleName('Adicionar Test NFT ao carrinho');
  });

  it('formats price correctly', () => {
    const nftWithLongPrice = { ...mockNFT, price: '123.456789' };
    renderWithProviders(<NFTCard nft={nftWithLongPrice} />);

    expect(screen.getByText('123.46 ETH')).toBeInTheDocument();
  });
});
