import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import { NewsletterCTA } from '@/components/home/NewsletterCTA';

describe('NewsletterCTA', () => {
  it('renders the heading and description', () => {
    render(<NewsletterCTA />);

    expect(screen.getByText(/Stay Connected/i)).toBeInTheDocument();
    expect(screen.getByText(/with Nature/i)).toBeInTheDocument();
    expect(screen.getByText(/Get notified about new harvests/i)).toBeInTheDocument();
  });

  it('renders the email input field', () => {
    render(<NewsletterCTA />);

    const input = screen.getByPlaceholderText(/enter your email/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders the subscribe button', () => {
    render(<NewsletterCTA />);

    const button = screen.getByRole('button', { name: /subscribe/i });
    expect(button).toBeInTheDocument();
  });

  it('shows success message after submitting email', () => {
    render(<NewsletterCTA />);

    const input = screen.getByPlaceholderText(/enter your email/i);
    const button = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    // The success message renders with an apostrophe that may appear as ' or &apos;
    expect(screen.getByText(/you.re subscribed/i)).toBeInTheDocument();
  });

  it('does not submit with empty email', () => {
    render(<NewsletterCTA />);

    const button = screen.getByRole('button', { name: /subscribe/i });
    fireEvent.click(button);

    // Should still show the form, not the success message
    expect(screen.queryByText(/you.re subscribed/i)).not.toBeInTheDocument();
  });

  it('renders trust indicators', () => {
    render(<NewsletterCTA />);

    expect(screen.getByText(/12,000\+ Farmers/i)).toBeInTheDocument();
    expect(screen.getByText(/50,000\+ Happy Customers/i)).toBeInTheDocument();
    expect(screen.getByText(/Secure & Private/i)).toBeInTheDocument();
  });

  it('has a required email input', () => {
    render(<NewsletterCTA />);

    const input = screen.getByPlaceholderText(/enter your email/i);
    expect(input).toBeRequired();
  });

  it('shows welcome gift message after subscribe', () => {
    render(<NewsletterCTA />);

    const input = screen.getByPlaceholderText(/enter your email/i);
    const button = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(input, { target: { value: 'user@example.com' } });
    fireEvent.click(button);

    expect(screen.getByText(/check your inbox/i)).toBeInTheDocument();
  });
});
