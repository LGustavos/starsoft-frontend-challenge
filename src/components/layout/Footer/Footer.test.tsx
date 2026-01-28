import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the footer element', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('displays the copyright text', () => {
    render(<Footer />);

    expect(screen.getByText('STARSOFT © TODOS OS DIREITOS RESERVADOS')).toBeInTheDocument();
  });
});
