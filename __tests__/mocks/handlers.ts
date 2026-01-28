import { http, HttpResponse } from 'msw';

// Mock data matching the real API structure
const mockNFTs = [
  {
    id: 1,
    name: 'Cool NFT #1',
    description: 'A cool NFT for testing',
    image: 'https://example.com/nft1.jpg',
    price: '0.5',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Cool NFT #2',
    description: 'Another cool NFT for testing',
    image: 'https://example.com/nft2.jpg',
    price: '1.0',
    createdAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Cool NFT #3',
    description: 'Yet another cool NFT',
    image: 'https://example.com/nft3.jpg',
    price: '1.5',
    createdAt: '2024-01-03T00:00:00.000Z',
  },
];

export const handlers = [
  // List products - matches real API response structure
  http.get('*/products', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const rows = Number(url.searchParams.get('rows')) || 12;

    const start = (page - 1) * rows;
    const end = start + rows;
    const products = mockNFTs.slice(start, end);

    return HttpResponse.json({
      products,
      count: mockNFTs.length,
    });
  }),

  // Get single product
  http.get('*/products/:id', ({ params }) => {
    const nft = mockNFTs.find((n) => n.id === Number(params.id));

    if (!nft) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(nft);
  }),
];

export { mockNFTs };
