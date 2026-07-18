'use client';

import { LayoutGrid, List, ArrowUpDown, Leaf } from 'lucide-react';
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
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
      {/* Results Count */}
      <div className="flex items-center gap-2 text-sm">
        <Leaf className="h-4 w-4 text-primary-500" />
        <span className="text-gray-600">
          <span className="font-bold text-primary-700">{totalProducts.toLocaleString()}</span> products found
          {totalProducts > 0 && (
            <span className="hidden sm:inline">
              {' '}· Showing <span className="font-semibold text-gray-900">{start}–{end}</span>
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="hidden sm:block h-4 w-4 text-primary-400" />
          <Select value={sortBy} onValueChange={(value) => value && onSortChange(value)}>
            <SelectTrigger className="h-9 w-[160px] text-sm border-primary-200 rounded-xl focus:ring-primary-500">
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
        <div className="flex items-center rounded-xl border border-primary-200 p-0.5 bg-primary-50/30">
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8 rounded-lg', viewMode === 'grid' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-400 hover:text-primary-600')}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8 rounded-lg', viewMode === 'list' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-400 hover:text-primary-600')}
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
