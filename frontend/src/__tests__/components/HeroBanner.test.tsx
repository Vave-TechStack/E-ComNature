import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import { HeroBanner } from '@/components/home/HeroBanner';

describe('HeroBanner', () => {
  it('renders without crashing', () => {
    expect(() => render(<HeroBanner />)).not.toThrow();
  });

  it('renders the navigation arrows', () => {
    render(<HeroBanner />);

    expect(screen.getByLabelText(/previous slide/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/next slide/i)).toBeInTheDocument();
  });

  it('renders 6 slide indicator dots', () => {
    render(<HeroBanner />);

    const dots = screen.getAllByLabelText(/go to slide/i);
    expect(dots.length).toBe(6);
  });

  it('renders the slide counter showing first slide', () => {
    render(<HeroBanner />);

    expect(screen.getByText(/01 \/ 06/)).toBeInTheDocument();
  });

  it('renders the first slide CTA button', () => {
    render(<HeroBanner />);

    expect(screen.getByText('Shop Honey')).toBeInTheDocument();
  });

  it('renders the first slide secondary CTA', () => {
    render(<HeroBanner />);

    expect(screen.getByText('Explore Products')).toBeInTheDocument();
  });

  it('links first slide CTA to honey category', () => {
    render(<HeroBanner />);

    const honeyLink = screen.getByText('Shop Honey').closest('a');
    expect(honeyLink).toHaveAttribute('href', '/products?category=honey');
  });

  it('renders trust badges', () => {
    render(<HeroBanner />);

    expect(screen.getByText(/100% Organic/)).toBeInTheDocument();
    expect(screen.getByText(/Authenticity Guaranteed/)).toBeInTheDocument();
    expect(screen.getByText(/Direct from Farmers/)).toBeInTheDocument();
  });

  it('renders the first slide subtitle', () => {
    render(<HeroBanner />);

    expect(screen.getByText(/Direct from Tribal Harvesters/)).toBeInTheDocument();
  });

  it('renders the first slide tag badge', () => {
    render(<HeroBanner />);

    expect(screen.getByText(/Wild Harvest/)).toBeInTheDocument();
  });

  it('shows next slide content after clicking dot indicator', () => {
    render(<HeroBanner />);

    // Click on the 3rd dot to go to slide 3
    const dots = screen.getAllByLabelText(/go to slide/i);
    fireEvent.click(dots[2]);

    // Slide 3 has "Shop Oils" CTA
    expect(screen.getByText('Shop Oils')).toBeInTheDocument();
  });

  it('shows last slide content after clicking 6th dot', () => {
    render(<HeroBanner />);

    const dots = screen.getAllByLabelText(/go to slide/i);
    fireEvent.click(dots[5]);

    // Slide 6 has "Shop Ghee" CTA
    expect(screen.getByText('Shop Ghee')).toBeInTheDocument();
  });

  it('navigates slides with arrow buttons', () => {
    render(<HeroBanner />);

    // Go forward 3 times
    const nextButton = screen.getByLabelText(/next slide/i);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    // Should be on slide 4
    expect(screen.getByText('Explore Spices')).toBeInTheDocument();

    // Go back 1
    const prevButton = screen.getByLabelText(/previous slide/i);
    fireEvent.click(prevButton);

    // Should be on slide 3
    expect(screen.getByText('Shop Oils')).toBeInTheDocument();
  });

  it('updates slide counter after navigation', () => {
    render(<HeroBanner />);

    const nextButton = screen.getByLabelText(/next slide/i);
    fireEvent.click(nextButton);

    // After clicking next from slide 1, counter should show 02 / 06
    expect(screen.getByText(/02 \/ 06/)).toBeInTheDocument();
  });
});
