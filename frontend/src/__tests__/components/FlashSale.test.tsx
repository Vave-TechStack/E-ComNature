import React from 'react';
import { render, screen } from '../test-utils';
import { FlashSale } from '@/components/home/FlashSale';

describe('FlashSale', () => {
  it('renders the flash sale section', () => {
    render(<FlashSale />);

    expect(screen.getByText(/Flash Sale/i)).toBeInTheDocument();
  });

  it('renders the timer labels', () => {
    render(<FlashSale />);

    expect(screen.getByText(/Hours/i)).toBeInTheDocument();
    expect(screen.getByText(/Minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/Seconds/i)).toBeInTheDocument();
  });

  it('renders the "Grab the Deals" button', () => {
    render(<FlashSale />);

    const grabDeals = screen.getByText(/Grab the Deals/i);
    expect(grabDeals).toBeInTheDocument();
  });

  it('renders the "Ends in" label', () => {
    render(<FlashSale />);

    expect(screen.getByText(/Ends in/i)).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(<FlashSale />);

    expect(screen.getByText(/Exclusive discounts on pure honey/i)).toBeInTheDocument();
  });

  it('renders timer blocks with numeric values', () => {
    render(<FlashSale />);

    // Timer blocks should show formatted numbers (00, 01, etc.)
    const timerElements = screen.getAllByText(/\d{2}/);
    expect(timerElements.length).toBeGreaterThanOrEqual(3);
  });
});
