import { render } from '@testing-library/react';
import { NFTSkeleton } from './NFTSkeleton';

describe('NFTSkeleton', () => {
  it('renders the skeleton card', () => {
    const { container } = render(<NFTSkeleton />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('is hidden from accessibility tree', () => {
    const { container } = render(<NFTSkeleton />);

    const skeletonCard = container.firstChild;
    expect(skeletonCard).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders all skeleton elements', () => {
    const { container } = render(<NFTSkeleton />);

    expect(container.querySelector('[class*="image"]')).toBeInTheDocument();

    expect(container.querySelector('[class*="content"]')).toBeInTheDocument();

    expect(container.querySelector('[class*="title"]')).toBeInTheDocument();
  });
});
