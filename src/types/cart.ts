import type { NFT } from './nft';

export interface CartItem {
  nft: NFT;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
