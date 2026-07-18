'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Clock, TrendingUp, Mic, MicOff, X, ArrowRight,
  Loader2, Sparkles, Leaf, Package
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useSearchProducts } from '@/services/products';
import type { Product } from '@/types';

const SEARCH_HISTORY_KEY = 'naturekart_search_history';
const MAX_HISTORY = 8;

const trendingSearches = [
  'Forest Honey', 'Organic Millets', 'Cold Pressed Oil', 'A2 Ghee',
  'Lakadong Turmeric', 'Palm Jaggery', 'Cashews', 'Green Tea',
];

const searchCategories = [
  { name: 'Honey', slug: 'honey' },
  { name: 'Millets', slug: 'millets' },
  { name: 'Oils', slug: 'oils' },
  { name: 'Spices', slug: 'spices' },
  { name: 'Ghee', slug: 'ghee' },
];

interface SearchDropdownProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

// ====== Search History Helpers ======
function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveSearchHistory(query: string) {
  try {
    const history = getSearchHistory().filter(h => h !== query);
    history.unshift(query);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch { /* ignore */ }
}

function clearSearchHistory() {
  try { localStorage.removeItem(SEARCH_HISTORY_KEY); } catch { /* ignore */ }
}

// ====== Voice Search Hook ======
function useVoiceSearch(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        onResultRef.current(text);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []); // Empty deps — recognition created once; uses ref for onResult

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch { setIsListening(false); }
    }
  }, [isListening]);

  return { isListening, isSupported, toggleListening };
}

// ====== Results Section ======
function ProductResultItem({ product, onSelect }: { product: Product; onSelect: () => void }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={onSelect}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-primary-50 transition-colors group"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-primary-50">
        <Image
          src={product.images[0]?.imageUrl || '/images/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
          {product.name}
        </p>
        <p className="text-xs text-gray-500 truncate">{product.shortDescription}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-primary-700">{formatPrice(product.sellingPrice)}</p>
        {product.discountPercentage > 0 && (
          <p className="text-[10px] text-green-600 font-medium">-{product.discountPercentage}% off</p>
        )}
      </div>
    </Link>
  );
}

// ====== Main Dropdown Component ======
export function SearchDropdown({ query, onQueryChange, onSubmit, onClose, isOpen }: SearchDropdownProps) {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading, isError } = useSearchProducts(query);

  // Load history on mount
  useEffect(() => { setSearchHistory(getSearchHistory()); }, []);

  // Debounced search
  const debouncedQuery = useDebounce(query, 300);
  const showProducts = debouncedQuery.length >= 2;

  // Keyboard navigation
  const getTotalItems = useCallback(() => {
    let count = 0;
    if (!query && searchHistory.length > 0) count += searchHistory.length;
    if (!query) count += trendingSearches.length;
    if (showProducts && searchResults?.length) count += searchResults.length;
    return count;
  }, [query, searchHistory.length, showProducts, searchResults?.length]);

  // Global keyboard navigation for search dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const total = getTotalItems();
      if (total === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => (prev + 1) % total);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => (prev - 1 + total) % total);
          break;
        case 'Enter':
          if (activeIndex >= 0) {
            e.preventDefault();
            if (!query && searchHistory.length > 0 && activeIndex < searchHistory.length) {
              onSubmit(searchHistory[activeIndex]);
              return;
            }
            if (!query && activeIndex >= searchHistory.length && activeIndex < searchHistory.length + trendingSearches.length) {
              const ti = activeIndex - searchHistory.length;
              onSubmit(trendingSearches[ti]);
              return;
            }
            if (showProducts && searchResults?.length) {
              const pi = activeIndex - (searchHistory.length + trendingSearches.length);
              if (pi >= 0 && pi < searchResults.length) {
                router.push(`/products/${searchResults[pi].slug}`);
                onClose();
                return;
              }
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, getTotalItems, query, searchHistory, searchResults, showProducts, onSubmit, router, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-search-item]');
      if (items[activeIndex]) {
        items[activeIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  // Reset active index on query change
  useEffect(() => { setActiveIndex(-1); }, [query]);

  if (!isOpen) return null;

  const hasHistory = !query && searchHistory.length > 0;
  const hasTrending = !query && trendingSearches.length > 0;
  const hasResults = showProducts && searchResults && searchResults.length > 0;
  const showEmptyState = showProducts && !isLoading && !isError && (!searchResults || searchResults.length === 0);
  const showLoading = showProducts && isLoading;
  const showError = showProducts && isError;

  let itemIndex = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-primary-100 overflow-hidden z-50"
    >
      <div ref={listRef} className="max-h-[70vh] overflow-y-auto scrollbar-hide py-2">
        {/* ===== Search History ===== */}
        {hasHistory && (
          <div className="px-3 py-1.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <Clock className="h-3 w-3" />
                Recent Searches
              </span>
              <button
                onClick={() => { clearSearchHistory(); setSearchHistory([]); }}
                className="text-[10px] text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {searchHistory.map((item) => {
                const idx = itemIndex++;
                return (
                  <button
                    key={item}
                    data-search-item
                    data-active={activeIndex === idx}
                    onClick={() => onSubmit(item)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      activeIndex === idx
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    {item}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newHistory = searchHistory.filter(h => h !== item);
                        setSearchHistory(newHistory);
                        try { localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory)); } catch {}
                      }}
                      className="ml-1 text-primary-400 hover:text-primary-600"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {hasHistory && hasTrending && <div className="mx-3 my-1 border-t border-primary-100" />}

        {/* ===== Trending Searches ===== */}
        {hasTrending && (
          <div className="px-3 py-1.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingUp className="h-3 w-3 text-accent-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trending</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {trendingSearches.map((term) => {
                const idx = itemIndex++;
                return (
                  <button
                    key={term}
                    data-search-item
                    data-active={activeIndex === idx}
                    onClick={() => onSubmit(term)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      activeIndex === idx
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-accent-50 text-accent-600 hover:bg-accent-100'
                    )}
                  >
                    <Sparkles className="h-3 w-3" />
                    {term}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== Category Chips ===== */}
        {!query && (
          <div className="px-3 py-1.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Package className="h-3 w-3 text-primary-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {searchCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-600 text-xs font-medium hover:bg-primary-100 transition-colors"
                >
                  <Leaf className="h-3 w-3" />
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Divider before search results */}
        {showProducts && (hasHistory || hasTrending) && (
          <div className="mx-3 my-1 border-t border-primary-100" />
        )}

        {/* ===== Product Search Results ===== */}
        {showProducts && (
          <div className="px-3 py-1.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Search className="h-3 w-3 text-primary-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Products
              </span>
              {!isLoading && searchResults && (
                <span className="text-xs text-gray-400">({searchResults.length})</span>
              )}
            </div>

            {/* Loading */}
            {showLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary-400" />
                <span className="ml-2 text-sm text-gray-500">Searching...</span>
              </div>
            )}

            {/* Error */}
            {showError && (
              <div className="flex items-center justify-center py-6 text-sm text-red-500">
                <X className="h-4 w-4 mr-1.5" />
                Search failed. Try again.
              </div>
            )}

            {/* Empty */}
            {showEmptyState && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 border-2 border-primary-100 mb-3">
                  <Package className="h-6 w-6 text-primary-300" />
                </div>
                <p className="text-sm font-medium text-gray-900">No results found</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Try adjusting your search terms
                </p>
              </div>
            )}

            {/* Results */}
            {hasResults && (
              <div className="space-y-0.5">
                {searchResults.slice(0, 5).map((product) => {
                  const idx = itemIndex++;
                  return (
                    <div
                      key={product.id}
                      data-search-item
                      data-active={activeIndex === idx}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        'rounded-xl transition-colors',
                        activeIndex === idx ? 'bg-primary-50' : ''
                      )}
                    >
                      <ProductResultItem product={product} onSelect={onClose} />
                    </div>
                  );
                })}

                {/* View All Results */}
                <Link
                  href={`/products?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors mt-1"
                >
                  View all results for &ldquo;{query}&rdquo;
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-primary-100 bg-primary-50/50 px-4 py-2.5 flex items-center justify-between text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <Search className="h-3 w-3" />
          <span className="hidden sm:inline">Press <kbd className="px-1 py-0.5 rounded bg-white border border-primary-200 text-[9px] font-mono">Esc</kbd> to close</span>
        </span>
        <span className="flex items-center gap-2">
          <span><kbd className="px-1 py-0.5 rounded bg-white border border-primary-200 text-[9px] font-mono">↑↓</kbd> Navigate</span>
          <span><kbd className="px-1 py-0.5 rounded bg-white border border-primary-200 text-[9px] font-mono">Enter</kbd> Select</span>
        </span>
      </div>
    </motion.div>
  );
}

// ====== Debounce Hook ======
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// ====== Voice Search Button ======
export function VoiceSearchButton({ onResult }: { onResult: (text: string) => void }) {
  const { isListening, isSupported, toggleListening } = useVoiceSearch(onResult);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={cn(
        'absolute right-16 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all',
        isListening
          ? 'text-red-500 bg-red-50 animate-pulse'
          : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'
      )}
      aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
      title={isListening ? 'Listening...' : 'Voice search'}
    >
      {isListening ? (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Mic className="h-4 w-4" />
        </motion.div>
      ) : (
        <MicOff className="h-4 w-4" />
      )}
    </button>
  );
}

// ====== Export search history helpers ======
export { getSearchHistory, saveSearchHistory, clearSearchHistory, useDebounce };
