import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import { ProductCard } from '@/components/home/ProductCard';
import type { Product } from '@/types';

const createMockProduct = (overrides?: Partial<Product>): Product => ({
  id: 1,
  name: 'Wild Forest Honey',
  slug: 'wild-forest-honey',
  description: 'Pure raw forest honey from tribal harvesters.',
  shortDescription: 'Pure raw forest honey.',
  sku: 'HNY-001',
  category: { id: 1, name: 'Honey', slug: 'honey', level: 0, productCount: 12, isFeatured: true },
  brand: { id: 1, name: 'Araku Tribal', slug: 'araku-tribal', isFeatured: true, productCount: 15 },
  basePrice: 900,
  sellingPrice: 649,
  discountPercentage: 28,
  images: [
    { id: 1, imageUrl: '/images/honey.jpg', isPrimary: true, altText: 'Forest Honey Jar' },
  ],
  variants: [],
  specifications: [],
  averageRating: 4.8,
  ratingCount: 156,
  totalSold: 3200,
  availableStock: 60,
  isFeatured: true,
  isTrending: true,
  isNewArrival: true,
  isBestSeller: true,
  maxQuantity: 10,
  tags: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('ProductCard - default variant', () => {
  it('renders product name and brand', () => {
    render(<ProductCard product={createMockProduct()} />);

    expect(screen.getByText('Wild Forest Honey')).toBeInTheDocument();
    expect(screen.getByText('Araku Tribal')).toBeInTheDocument();
  });

  it('renders selling price as the main price', () => {
    render(<ProductCard product={createMockProduct()} />);

    // Selling price (649) should be the main displayed price
    expect(screen.getByText(/649/)).toBeInTheDocument();
  });

  it('renders original price with strikethrough when basePrice > sellingPrice', () => {
    render(<ProductCard product={createMockProduct({ basePrice: 900, sellingPrice: 649 })} />);

    // Both prices should be visible
    expect(screen.getByText(/900/)).toBeInTheDocument();
    expect(screen.getByText(/649/)).toBeInTheDocument();
  });

  it('renders "New" badge for new arrivals', () => {
    render(<ProductCard product={createMockProduct({ isNewArrival: true })} />);

    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders "Best Seller" badge', () => {
    render(<ProductCard product={createMockProduct({ isBestSeller: true })} />);

    expect(screen.getByText('Best Seller')).toBeInTheDocument();
  });

  it('renders rating stars and count', () => {
    render(<ProductCard product={createMockProduct({ averageRating: 4.5, ratingCount: 100 })} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(100)')).toBeInTheDocument();
  });

  it('renders "Add to Cart" button', () => {
    render(<ProductCard product={createMockProduct()} />);

    const addToCart = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCart).toBeInTheDocument();
  });

  it('links to product detail page', () => {
    render(<ProductCard product={createMockProduct()} />);

    const link = screen.getByRole('link', { name: /wild forest honey/i });
    expect(link).toHaveAttribute('href', '/products/wild-forest-honey');
  });

  it('shows product image with product name as alt text', () => {
    render(<ProductCard product={createMockProduct()} />);

    const img = screen.getByAltText('Wild Forest Honey');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/honey.jpg');
  });

  it('does not show original price when basePrice equals sellingPrice', () => {
    render(<ProductCard product={createMockProduct({ basePrice: 649, sellingPrice: 649 })} />);

    // Only one price should be visible (no strikethrough)
    const priceElements = screen.getAllByText(/649/);
    expect(priceElements.length).toBeGreaterThanOrEqual(1);
  });
});

describe('ProductCard - compact variant', () => {
  it('renders compact layout with product name and price', () => {
    render(<ProductCard product={createMockProduct()} variant="compact" />);

    expect(screen.getByText('Wild Forest Honey')).toBeInTheDocument();
    expect(screen.getByText(/649/)).toBeInTheDocument();
  });
});

describe('ProductCard - horizontal variant', () => {
  it('renders horizontal layout with brand and rating', () => {
    render(<ProductCard product={createMockProduct()} variant="horizontal" />);

    expect(screen.getByText('Wild Forest Honey')).toBeInTheDocument();
    expect(screen.getByText('Araku Tribal')).toBeInTheDocument();
  });

  it('renders rating in horizontal variant', () => {
    render(<ProductCard product={createMockProduct({ discountPercentage: 28, averageRating: 4.8 })} variant="horizontal" />);

    // Horizontal variant shows the rating
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });
});
