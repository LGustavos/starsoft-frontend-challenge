export interface NFT {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NFTListResponse {
  products: NFT[];
  count: number;
}
