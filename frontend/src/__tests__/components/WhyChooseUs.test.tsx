import React from 'react';
import { render, screen } from '../test-utils';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';

describe('WhyChooseUs', () => {
  it('renders the section header', () => {
    render(<WhyChooseUs />);

    expect(screen.getByText(/Why Choose Us/i)).toBeInTheDocument();
    expect(screen.getByText(/Why NatureKart/i)).toBeInTheDocument();
  });

  it('renders the subheading text', () => {
    render(<WhyChooseUs />);

    expect(screen.getByText(/We are more than a marketplace/i)).toBeInTheDocument();
  });

  it('renders all 6 reason cards', () => {
    render(<WhyChooseUs />);

    expect(screen.getByText('Forest Collection')).toBeInTheDocument();
    expect(screen.getByText('Chemical Free')).toBeInTheDocument();
    expect(screen.getByText('100% Organic')).toBeInTheDocument();
    expect(screen.getByText('Direct From Farmers')).toBeInTheDocument();
    expect(screen.getByText('Authenticity Guaranteed')).toBeInTheDocument();
    expect(screen.getByText('Fair Trade Pledged')).toBeInTheDocument();
  });

  it('renders descriptions for each reason', () => {
    render(<WhyChooseUs />);

    expect(screen.getByText(/sourced from the pristine forests/)).toBeInTheDocument();
    expect(screen.getByText(/No pesticides, no chemical fertilizers/)).toBeInTheDocument();
    expect(screen.getByText(/Certified organic products/)).toBeInTheDocument();
  });

  it('renders images with alt text matching reason titles', () => {
    render(<WhyChooseUs />);

    const forestImage = screen.getByAltText('Forest Collection');
    expect(forestImage).toBeInTheDocument();

    const chemicalFreeImage = screen.getByAltText('Chemical Free');
    expect(chemicalFreeImage).toBeInTheDocument();
  });

  it('renders all image placeholders from the reasons array', () => {
    render(<WhyChooseUs />);

    // All 6 alt texts should exist
    const altTexts = [
      'Forest Collection',
      'Chemical Free',
      '100% Organic',
      'Direct From Farmers',
      'Authenticity Guaranteed',
      'Fair Trade Pledged',
    ];

    altTexts.forEach(text => {
      expect(screen.getByAltText(text)).toBeInTheDocument();
    });
  });
});
