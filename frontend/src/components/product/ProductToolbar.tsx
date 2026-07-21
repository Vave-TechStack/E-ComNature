'use client';

import { LayoutGrid, List, ArrowUpDown, Leaf, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SORT_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type ViewMode = 'grid' | 'list';

interface ProductToolbarProps {
  totalProducts: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  currentPage: number;
  pageSize: number;
}

export function ProductToolbar({
  totalProducts,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  currentPage,
  pageSize,
}: ProductToolbarProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalProducts);

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-noble-200 bg-gradient-to-br from-white to-noble-50/50 p-4 shadow-sm"
    >
      {/* Results Count */}
      <div className="flex items-center gap-2.5 text-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100">
          <Leaf className="h-4 w-4 text-primary-600" />
        </div>
        <span className="text-noble-500">
          <motion.span
            key={totalProducts}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-bold text-primary-600"
          >
            {totalProducts.toLocaleString()}
          </motion.span>{' '}
          products found
          {totalProducts > 0 && (
            <span className="hidden sm:inline">
              {' '}· Showing{' '}
              <span className="font-semibold text-noble-800 tabular-nums">{start}–{end}</span>
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="hidden sm:block h-4 w-4 text-noble-400" />
          <Select value={sortBy} onValueChange={(value) => value && onSortChange(value)}>
            <SelectTrigger className="h-9 w-[160px] text-sm border-noble-200 rounded-xl focus:ring-primary-500 bg-white shadow-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-xl border border-noble-200 p-0.5 bg-noble-50/50 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-8 w-8 rounded-lg transition-all duration-200',
              viewMode === 'grid'
                ? 'bg-white shadow-sm text-primary-600 border border-noble-100'
                : 'text-noble-400 hover:text-primary-600 hover:bg-white/50'
            )}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-8 w-8 rounded-lg transition-all duration-200',
              viewMode === 'list'
                ? 'bg-white shadow-sm text-primary-600 border border-noble-100'
                : 'text-noble-400 hover:text-primary-600 hover:bg-white/50'
            )}
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
