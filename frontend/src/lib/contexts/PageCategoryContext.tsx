'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface PageCategoryContextType {
  /** The category slug of the current product detail page, or null if not on a product page */
  categorySlug: string | null;
  /** Set the current product page's category slug */
  setCategorySlug: (slug: string | null) => void;
}

const PageCategoryContext = createContext<PageCategoryContextType>({
  categorySlug: null,
  setCategorySlug: () => {},
});

export function PageCategoryProvider({ children }: { children: ReactNode }) {
  const [categorySlug, setCategorySlug] = useState<string | null>(null);

  const handleSetCategorySlug = useCallback((slug: string | null) => {
    setCategorySlug(slug);
  }, []);

  return (
    <PageCategoryContext.Provider
      value={{ categorySlug, setCategorySlug: handleSetCategorySlug }}
    >
      {children}
    </PageCategoryContext.Provider>
  );
}

export function usePageCategory() {
  return useContext(PageCategoryContext);
}
