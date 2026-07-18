import React from 'react';
import { render, screen } from '../test-utils';
import { CategorySection } from '@/components/home/CategorySection';

describe('CategorySection', () => {
  it('renders the section header', () => {
    render(<CategorySection />);

    expect(screen.getByText(/Shop by Category/i)).toBeInTheDocument();
    // Use getAllByText for text that appears in multiple places
    const categoryLabels = screen.getAllByText(/Categories/i);
    expect(categoryLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('renders category cards', () => {
    render(<CategorySection />);

    expect(screen.getByText('Natural Honey')).toBeInTheDocument();
    expect(screen.getByText('Millets & Grains')).toBeInTheDocument();
    expect(screen.getByText('Cold Pressed Oils')).toBeInTheDocument();
    expect(screen.getByText('Natural Spices')).toBeInTheDocument();
  });

  it('renders all category names', () => {
    render(<CategorySection />);

    expect(screen.getByText('A2 Ghee & Dairy')).toBeInTheDocument();
    expect(screen.getByText('Pickles & Snacks')).toBeInTheDocument();
    expect(screen.getByText('Herbal Tea & Powders')).toBeInTheDocument();
    expect(screen.getByText('Dry Fruits & Nuts')).toBeInTheDocument();
    expect(screen.getByText('Jaggery & Sweeteners')).toBeInTheDocument();
    expect(screen.getByText('Traditional Rice')).toBeInTheDocument();
    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.getByText('Herbal Products')).toBeInTheDocument();
  });

  it('renders "View All Categories" button', () => {
    render(<CategorySection />);

    const viewAll = screen.getAllByText(/View All Categories/i);
    expect(viewAll.length).toBeGreaterThanOrEqual(1);
  });

  it('links categories to correct product pages', () => {
    render(<CategorySection />);

    const honeyLink = screen.getByText('Natural Honey').closest('a');
    expect(honeyLink).toHaveAttribute('href', '/products?category=honey');
  });

  it('renders category descriptions', () => {
    render(<CategorySection />);

    expect(screen.getByText('Pure forest honey from tribal harvesters')).toBeInTheDocument();
  });
});
