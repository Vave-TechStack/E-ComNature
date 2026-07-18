import { describe, it, expect } from 'vitest';
import { cn, formatPrice, formatDate, getInitials, timeAgo, calculateDiscount } from '@/lib/utils';

describe('cn (classnames utility)', () => {
  it('should merge classnames correctly', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('should merge Tailwind classes properly', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });

  it('should handle undefined and null values', () => {
    expect(cn('test', undefined, null, 'value')).toBe('test value');
  });
});

describe('formatPrice', () => {
  it('should format price in INR', () => {
    const formatted = formatPrice(799);
    expect(formatted).toContain('₹');
    expect(formatted).toContain('799');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toContain('0');
  });

  it('should handle large numbers', () => {
    const formatted = formatPrice(150000);
    expect(formatted).toContain('₹');
  });

  it('should round to integer (no decimals)', () => {
    const formatted = formatPrice(499.99);
    // Intl format in en-IN for 499.99 with maxFractionDigits: 0 = ₹500
    expect(formatted).not.toContain('.');
  });
});

describe('formatDate', () => {
  it('should format a date string', () => {
    const date = '2026-01-15T00:00:00.000Z';
    const formatted = formatDate(date);
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Jan');
  });

  it('should format with MMM yy pattern', () => {
    const date = '2026-01-15T00:00:00.000Z';
    const formatted = formatDate(date, 'MMM yy');
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('26');
  });

  it('should handle Date object', () => {
    const date = new Date('2026-03-20');
    const formatted = formatDate(date);
    expect(formatted).toContain('Mar');
    expect(formatted).toContain('2026');
  });
});

describe('getInitials', () => {
  it('should get initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('should handle single name', () => {
    expect(getInitials('John')).toBe('J');
  });

  it('should handle multiple names', () => {
    expect(getInitials('John Michael Doe')).toBe('JM');
  });

  it('should convert to uppercase', () => {
    expect(getInitials('john doe')).toBe('JD');
  });
});

describe('timeAgo', () => {
  it('should return "Just now" for recent dates', () => {
    expect(timeAgo(new Date())).toBe('Just now');
  });

  it('should return minutes ago', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(timeAgo(fiveMinAgo)).toBe('5m ago');
  });

  it('should return hours ago', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(timeAgo(threeHoursAgo)).toBe('3h ago');
  });

  it('should return days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(timeAgo(twoDaysAgo)).toBe('2d ago');
  });
});

describe('calculateDiscount', () => {
  it('should calculate discount percentage', () => {
    expect(calculateDiscount(799, 999)).toBe(20);
  });

  it('should return 0 when original price is 0', () => {
    expect(calculateDiscount(500, 0)).toBe(0);
  });

  it('should return 0 when original price is negative', () => {
    expect(calculateDiscount(500, -100)).toBe(0);
  });

  it('should handle no discount', () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });
});
