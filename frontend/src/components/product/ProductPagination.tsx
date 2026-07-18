'use client';

import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({ currentPage, totalPages, onPageChange }: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const delta = 2;
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <nav className="flex flex-col items-center gap-3" aria-label="Pagination">
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl border border-primary-100 text-gray-500 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="flex h-10 w-10 items-center justify-center text-sm text-gray-400">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'ghost'}
              size="icon"
              className={cn(
                'h-10 w-10 text-sm font-semibold rounded-xl transition-all',
                currentPage === page
                  ? 'gradient-primary text-white shadow-lg shadow-primary-200'
                  : 'border border-primary-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200'
              )}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl border border-primary-100 text-gray-500 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Leaf className="h-3 w-3 text-primary-300" />
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  );
}
