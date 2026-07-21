import { useQuery } from '@tanstack/react-query';
import api from './api';
import type { ApiResponse, PaginatedResponse, Product, ProductFilter } from '@/types';

// ==================== MOCK PRODUCT DATA ====================

const productImages = {
  honey: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&q=80',
  millets: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80',
  oils: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=600&q=80',
  spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
  ghee: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=600&q=80',
  tea: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
  dryfruits: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&q=80',
  jaggery: 'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=600&q=80',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
  pickles: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80',
  herbal: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
  organic: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80',
};

const mockProducts: Product[] = [
  {
    id: 1, name: 'Wild Forest Honey (500g)', slug: 'wild-forest-honey',
    description: 'Harvested from pristine forests of Western Ghats by tribal communities.',
    shortDescription: 'Pure raw forest honey, unprocessed, rich in natural enzymes.',
    sku: 'HNY-FRH-500',
    category: { id: 1, name: 'Honey', slug: 'honey', level: 0, productCount: 12, isFeatured: true },
    brand: { id: 1, name: 'Araku Tribal Co-op', slug: 'araku-tribal', isFeatured: true, productCount: 15 },
    basePrice: 799, sellingPrice: 649, discountPercentage: 19,
    images: [{ id: 1, imageUrl: productImages.honey, isPrimary: true, altText: 'Forest Honey Jar' }],
    variants: [],
    specifications: [],
    averageRating: 4.8, ratingCount: 156, totalSold: 3200,
    availableStock: 60, isFeatured: true, isTrending: true, isNewArrival: true, isBestSeller: true,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 2, name: 'Organic Foxtail Millet (1kg)', slug: 'organic-foxtail-millet',
    description: 'Premium organic foxtail millet grown in dryland regions.',
    shortDescription: 'Gluten-free, high-fiber organic millet perfect for healthy meals.',
    sku: 'MLT-FOX-1K',
    category: { id: 2, name: 'Millets', slug: 'millets', level: 0, productCount: 8, isFeatured: true },
    brand: { id: 2, name: 'Organic Valley', slug: 'organic-valley', isFeatured: true, productCount: 20 },
    basePrice: 299, sellingPrice: 249, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.millets, isPrimary: true, altText: 'Foxtail Millet' }],
    variants: [], specifications: [],
    averageRating: 4.5, ratingCount: 89, totalSold: 1800,
    availableStock: 85, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 3, name: 'Cold Pressed Coconut Oil (1L)', slug: 'cold-pressed-coconut-oil',
    description: 'Virgin coconut oil extracted using traditional cold press method.',
    shortDescription: 'Pure, chemical-free coconut oil for cooking and skincare.',
    sku: 'OIL-CCO-1L',
    category: { id: 3, name: 'Oils', slug: 'oils', level: 0, productCount: 6, isFeatured: true },
    brand: { id: 3, name: 'Kerala Naturals', slug: 'kerala-naturals', isFeatured: true, productCount: 8 },
    basePrice: 599, sellingPrice: 499, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.oils, isPrimary: true, altText: 'Coconut Oil Bottle' }],
    variants: [], specifications: [],
    averageRating: 4.7, ratingCount: 234, totalSold: 4500,
    availableStock: 60, isFeatured: true, isTrending: true, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 4, name: 'Lakadong Turmeric Powder (250g)', slug: 'lakadong-turmeric-powder',
    description: 'Premium Lakadong turmeric from Meghalaya with high curcumin content.',
    shortDescription: 'World\'s highest curcumin content turmeric from Meghalaya hills.',
    sku: 'SPC-TUR-250',
    category: { id: 4, name: 'Spices', slug: 'spices', level: 0, productCount: 10, isFeatured: true },
    brand: { id: 4, name: 'Meghalaya Naturals', slug: 'meghalaya-naturals', isFeatured: true, productCount: 6 },
    basePrice: 449, sellingPrice: 349, discountPercentage: 22,
    images: [{ id: 1, imageUrl: productImages.spices, isPrimary: true, altText: 'Turmeric Powder' }],
    variants: [], specifications: [],
    averageRating: 4.9, ratingCount: 312, totalSold: 5200,
    availableStock: 45, isFeatured: true, isTrending: true, isNewArrival: true, isBestSeller: true,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 5, name: 'A2 Gir Cow Ghee (500ml)', slug: 'a2-gir-cow-ghee',
    description: 'Traditional bilona churned A2 ghee from indigenous Gir cows.',
    shortDescription: 'Pure, rich A2 ghee made using traditional bilona method.',
    sku: 'GHE-A2-500',
    category: { id: 5, name: 'Ghee', slug: 'ghee', level: 0, productCount: 4, isFeatured: true },
    brand: { id: 5, name: 'Gir Organic Farms', slug: 'gir-organic-farms', isFeatured: true, productCount: 5 },
    basePrice: 1099, sellingPrice: 899, discountPercentage: 18,
    images: [{ id: 1, imageUrl: productImages.ghee, isPrimary: true, altText: 'A2 Ghee Jar' }],
    variants: [], specifications: [],
    averageRating: 4.8, ratingCount: 178, totalSold: 2800,
    availableStock: 30, isFeatured: true, isTrending: true, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 6, name: 'Traditional Mango Pickle (500g)', slug: 'traditional-mango-pickle',
    description: 'Homemade style mango pickle made with traditional recipe without preservatives.',
    shortDescription: 'Tangy, spicy traditional mango pickle made in small batches.',
    sku: 'PCL-MNG-500',
    category: { id: 6, name: 'Pickles', slug: 'pickles', level: 0, productCount: 5, isFeatured: true },
    brand: { id: 6, name: 'Grandma\'s Recipe', slug: 'grandmas-recipe', isFeatured: true, productCount: 4 },
    basePrice: 249, sellingPrice: 199, discountPercentage: 20,
    images: [{ id: 1, imageUrl: productImages.pickles, isPrimary: true, altText: 'Mango Pickle Jar' }],
    variants: [], specifications: [],
    averageRating: 4.4, ratingCount: 96, totalSold: 1500,
    availableStock: 40, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 7, name: 'Organic Palm Jaggery (500g)', slug: 'organic-palm-jaggery',
    description: 'Natural palm jaggery made from toddy palm sap, rich in minerals.',
    shortDescription: 'Unrefined, chemical-free palm jaggery with rich caramel flavor.',
    sku: 'JGR-PLM-500',
    category: { id: 7, name: 'Jaggery', slug: 'jaggery', level: 0, productCount: 3, isFeatured: true },
    brand: { id: 7, name: 'Tamil Traditional', slug: 'tamil-traditional', isFeatured: true, productCount: 6 },
    basePrice: 219, sellingPrice: 179, discountPercentage: 18,
    images: [{ id: 1, imageUrl: productImages.jaggery, isPrimary: true, altText: 'Palm Jaggery Block' }],
    variants: [], specifications: [],
    averageRating: 4.6, ratingCount: 67, totalSold: 1200,
    availableStock: 95, isFeatured: false, isTrending: false, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 8, name: 'Assam Organic Black Tea (250g)', slug: 'assam-organic-black-tea',
    description: 'Single estate organic black tea from Assam, rich and full-bodied.',
    shortDescription: 'Premium single-estate organic Assam tea with bold flavor.',
    sku: 'TEA-ASM-250',
    category: { id: 8, name: 'Tea', slug: 'tea', level: 0, productCount: 7, isFeatured: true },
    brand: { id: 8, name: 'Assam Tea Co.', slug: 'assam-tea-co', isFeatured: true, productCount: 4 },
    basePrice: 399, sellingPrice: 299, discountPercentage: 25,
    images: [{ id: 1, imageUrl: productImages.tea, isPrimary: true, altText: 'Assam Tea Leaves' }],
    variants: [], specifications: [],
    averageRating: 4.5, ratingCount: 145, totalSold: 2100,
    availableStock: 55, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 9, name: 'Organic Raw Cashews (500g)', slug: 'organic-raw-cashews',
    description: 'Premium quality organic cashews sourced directly from farms in Kerala.',
    shortDescription: 'Jumbo size organic cashews, dry roasted and lightly salted.',
    sku: 'NUT-CSW-500',
    category: { id: 9, name: 'Dry Fruits', slug: 'dryfruits', level: 0, productCount: 6, isFeatured: true },
    brand: { id: 9, name: 'Kerala Naturals', slug: 'kerala-naturals', isFeatured: true, productCount: 8 },
    basePrice: 899, sellingPrice: 749, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.dryfruits, isPrimary: true, altText: 'Organic Cashews' }],
    variants: [], specifications: [],
    averageRating: 4.6, ratingCount: 89, totalSold: 1800,
    availableStock: 70, isFeatured: false, isTrending: false, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 10, name: 'Araku Valley Coffee Beans (500g)', slug: 'araku-valley-coffee-beans',
    description: 'Single origin organic Arabica coffee from the hills of Araku Valley.',
    shortDescription: 'Premium single-origin Arabica coffee, medium roast.',
    sku: 'COF-ARK-500',
    category: { id: 10, name: 'Coffee', slug: 'coffee', level: 0, productCount: 4, isFeatured: true },
    brand: { id: 10, name: 'Araku Tribal Co-op', slug: 'araku-tribal', isFeatured: true, productCount: 15 },
    basePrice: 599, sellingPrice: 499, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.coffee, isPrimary: true, altText: 'Coffee Beans' }],
    variants: [], specifications: [],
    averageRating: 4.7, ratingCount: 123, totalSold: 2400,
    availableStock: 50, isFeatured: true, isTrending: true, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 11, name: 'Organic Brown Rice (2kg)', slug: 'organic-brown-rice',
    description: 'Unpolished organic brown rice rich in fiber and nutrients.',
    shortDescription: 'Chemical-free unpolished brown rice from organic farms.',
    sku: 'RCE-BRN-2K',
    category: { id: 11, name: 'Rice', slug: 'rice', level: 0, productCount: 5, isFeatured: true },
    brand: { id: 11, name: 'Organic Valley', slug: 'organic-valley', isFeatured: true, productCount: 20 },
    basePrice: 249, sellingPrice: 199, discountPercentage: 20,
    images: [{ id: 1, imageUrl: productImages.rice, isPrimary: true, altText: 'Brown Rice' }],
    variants: [], specifications: [],
    averageRating: 4.4, ratingCount: 78, totalSold: 1600,
    availableStock: 90, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 12, name: 'Herbal Ashwagandha Powder (200g)', slug: 'herbal-ashwagandha-powder',
    description: 'Pure organic ashwagandha root powder from the forests of Madhya Pradesh.',
    shortDescription: 'Traditional herbal supplement for vitality and wellness.',
    sku: 'HRB-ASH-200',
    category: { id: 12, name: 'Herbal', slug: 'herbal', level: 0, productCount: 9, isFeatured: true },
    brand: { id: 12, name: 'Forest Remedies', slug: 'forest-remedies', isFeatured: true, productCount: 7 },
    basePrice: 449, sellingPrice: 349, discountPercentage: 22,
    images: [{ id: 1, imageUrl: productImages.herbal, isPrimary: true, altText: 'Ashwagandha Powder' }],
    variants: [], specifications: [],
    averageRating: 4.3, ratingCount: 56, totalSold: 1100,
    availableStock: 35, isFeatured: false, isTrending: false, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
];

function getMockProducts(filters: ProductFilter): PaginatedResponse<Product> {
  let filtered = [...mockProducts];

  // Apply filters
  if (filters.category) {
    filtered = filtered.filter(p => p.category.slug === filters.category);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q)
    );
  }
  if (filters.brand && filters.brand.length > 0) {
    filtered = filtered.filter(p => filters.brand!.includes(p.brand.slug));
  }
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.sellingPrice >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.sellingPrice <= filters.maxPrice!);
  }
  if (filters.rating !== undefined) {
    filtered = filtered.filter(p => p.averageRating >= filters.rating!);
  }
  if (filters.inStock) {
    filtered = filtered.filter(p => p.availableStock > 0);
  }
  if (filters.onSale) {
    filtered = filtered.filter(p => p.discountPercentage > 0);
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price_asc': filtered.sort((a, b) => a.sellingPrice - b.sellingPrice); break;
      case 'price_desc': filtered.sort((a, b) => b.sellingPrice - a.sellingPrice); break;
      case 'rating_desc': filtered.sort((a, b) => b.averageRating - a.averageRating); break;
      case 'newest': filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      default: break; // popularity - keep original order
    }
  }

  // Pagination
  const page = filters.page || 1;
  const size = filters.size || 20;
  const start = (page - 1) * size;
  const end = start + size;
  const pageContent = filtered.slice(start, end);

  return {
    content: pageContent,
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / size),
    page: page - 1,
    currentPage: page,
    size,
    first: page === 1,
    last: end >= filtered.length,
    empty: pageContent.length === 0,
  };
}

// API functions
export const productApi = {
  async getProducts(filters: ProductFilter): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.size) params.set('size', filters.size.toString());
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.brand?.length) params.set('brand', filters.brand.join(','));
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.rating) params.set('rating', filters.rating.toString());
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.inStock) params.set('inStock', 'true');
    if (filters.onSale) params.set('onSale', 'true');

    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(
      `/products?${params.toString()}`
    );
    return response.data.data;
  },

  async getProduct(slug: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${slug}`);
    return response.data.data;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(`/products/search?q=${query}`);
    return response.data.data;
  },

  async getCategories() {
    const response = await api.get('/categories');
    return response.data.data;
  },

  async getBrands() {
    const response = await api.get('/brands');
    return response.data.data;
  },
};

// React Query hooks with mock fallback
export function useProducts(filters: ProductFilter) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      try {
        return await productApi.getProducts(filters);
      } catch {
        // Return mock data when API is unavailable
        return getMockProducts(filters);
      }
    },
    placeholderData: (previousData) => previousData,
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      try {
        return await productApi.getProduct(slug);
      } catch {
        return mockProducts.find(p => p.slug === slug) || null;
      }
    },
    enabled: !!slug,
    retry: 0,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      try {
        return await productApi.searchProducts(query);
      } catch {
        const q = query.toLowerCase();
        return mockProducts.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
        );
      }
    },
    enabled: query.length >= 2,
    retry: 0,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        return await productApi.getCategories();
      } catch {
        return Array.from(new Set(mockProducts.map(p => p.category)));
      }
    },
    staleTime: 30 * 60 * 1000,
    retry: 0,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      try {
        return await productApi.getBrands();
      } catch {
        return Array.from(new Set(mockProducts.map(p => p.brand)));
      }
    },
    staleTime: 30 * 60 * 1000,
    retry: 0,
  });
}
