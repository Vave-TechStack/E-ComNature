'use client';

import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-3"
      aria-label="Pagination"
    >
      <div className="flex items-center gap-1.5">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-noble-200 text-noble-500 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white shadow-sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>

        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-10 w-10 items-center justify-center text-sm text-noble-400"
            >
              ...
            </span>
          ) : (
            <motion.button
              key={page}
              whileHover={currentPage !== page ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'h-10 w-10 text-sm font-semibold rounded-xl transition-all duration-200 relative',
                currentPage === page
                  ? 'text-white shadow-lg shadow-primary-200'
                  : 'border border-noble-200 text-noble-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 bg-white shadow-sm'
              )}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {currentPage === page && (
                <motion.span
                  layoutId="activePage"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-600 to-emerald-500"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">{page}</span>
            </motion.button>
          )
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-noble-200 text-noble-500 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white shadow-sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-1.5 text-xs text-noble-400"
      >
        <div className="h-px w-6 bg-gradient-to-r from-transparent via-noble-300 to-transparent" />
        <Leaf className="h-3 w-3 text-primary-300" />
        <span>Page {currentPage} of {totalPages}</span>
        <div className="h-px w-6 bg-gradient-to-r from-transparent via-noble-300 to-transparent" />
      </motion.div>
    </motion.nav>
  );
}
