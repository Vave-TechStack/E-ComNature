import { useQuery } from '@tanstack/react-query';
import api from './api';
import type { ApiResponse, PaginatedResponse, Product, ProductFilter } from '@/types';

// ==================== MOCK PRODUCT DATA ====================

const productImages = {
  honey: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&q=80',
  millets: 'https://images.pexels.com/photos/5486525/pexels-photo-5486525.jpeg?auto=compress&cs=tinysrgb&w=600',
  oils: 'https://images.pexels.com/photos/4110003/pexels-photo-4110003.jpeg?auto=compress&cs=tinysrgb&w=600',
  spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
  ghee: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=600&q=80',
  tea: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=600',
  rice: 'https://images.pexels.com/photos/11284839/pexels-photo-11284839.jpeg?auto=compress&cs=tinysrgb&w=600',
  dryfruits: 'https://images.pexels.com/photos/1291712/pexels-photo-1291712.jpeg?auto=compress&cs=tinysrgb&w=600',
  jaggery: 'https://images.pexels.com/photos/6598173/pexels-photo-6598173.jpeg?auto=compress&cs=tinysrgb&w=600',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
  pickles: 'https://images.pexels.com/photos/8477068/pexels-photo-8477068.jpeg?auto=compress&cs=tinysrgb&w=600',
  herbal: 'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=600',
  organic: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80',
};

const mockProducts: Product[] = [
  // ==================== HONEY (8 products) ====================
  {
    id: 1, name: 'Wild Forest Honey (500g)', slug: 'wild-forest-honey',
    description: 'Harvested from pristine forests of Western Ghats by tribal communities.',
    shortDescription: 'Pure raw forest honey, unprocessed, rich in natural enzymes.',
    sku: 'HNY-FRH-500',
    category: { id: 1, name: 'Honey', slug: 'honey', level: 0, productCount: 12, isFeatured: true },
    brand: { id: 1, name: 'Araku Tribal Co-op', slug: 'araku-tribal', isFeatured: true, productCount: 15 },
    basePrice: 799, sellingPrice: 649, discountPercentage: 19,
    images: [{ id: 1, imageUrl: productImages.honey, isPrimary: true, altText: 'Forest Honey Jar' }],
    variants: [], specifications: [],
    averageRating: 4.8, ratingCount: 156, totalSold: 3200,
    availableStock: 60, isFeatured: true, isTrending: true, isNewArrival: true, isBestSeller: true,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 101, name: 'Sidr Honey Raw (250g)', slug: 'sidr-honey-raw',
    description: 'Premium sidr honey from the Thar Desert, known for its medicinal properties.',
    shortDescription: 'Rare sidr honey with rich taste and health benefits.',
    sku: 'HNY-SID-250',
    category: { id: 1, name: 'Honey', slug: 'honey', level: 0, productCount: 12, isFeatured: true },
    brand: { id: 1, name: 'Araku Tribal Co-op', slug: 'araku-tribal', isFeatured: true, productCount: 15 },
    basePrice: 999, sellingPrice: 849, discountPercentage: 15,
    images: [{ id: 1, imageUrl: productImages.honey, isPrimary: true, altText: 'Sidr Honey' }],
    variants: [], specifications: [],
    averageRating: 4.7, ratingCount: 89, totalSold: 1800,
    availableStock: 40, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-15T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 102, name: 'Lychee Honey (500g)', slug: 'lychee-honey',
    description: 'Delicate lychee honey from Meghalaya orchards, light and floral.',
    shortDescription: 'Light floral honey from Meghalaya lychee orchards.',
    sku: 'HNY-LYC-500',
    category: { id: 1, name: 'Honey', slug: 'honey', level: 0, productCount: 12, isFeatured: true },
    brand: { id: 12, name: 'Forest Remedies', slug: 'forest-remedies', isFeatured: true, productCount: 7 },
    basePrice: 699, sellingPrice: 549, discountPercentage: 21,
    images: [{ id: 1, imageUrl: productImages.honey, isPrimary: true, altText: 'Lychee Honey' }],
    variants: [], specifications: [],
    averageRating: 4.5, ratingCount: 67, totalSold: 900,
    availableStock: 55, isFeatured: false, isTrending: true, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-02-10T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 103, name: 'Mustard Honey (1kg)', slug: 'mustard-honey',
    description: 'Bold mustard honey from Rajasthan, rich in antioxidants.',
    shortDescription: 'Bold, pungent mustard honey from Rajasthan fields.',
    sku: 'HNY-MUS-1K',
    category: { id: 1, name: 'Honey', slug: 'honey', level: 0, productCount: 12, isFeatured: true },
    brand: { id: 1, name: 'Araku Tribal Co-op', slug: 'araku-tribal', isFeatured: true, productCount: 15 },
    basePrice: 599, sellingPrice: 479, discountPercentage: 20,
    images: [{ id: 1, imageUrl: productImages.honey, isPrimary: true, altText: 'Mustard Honey' }],
    variants: [], specifications: [],
    averageRating: 4.3, ratingCount: 45, totalSold: 700,
    availableStock: 70, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-20T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 104, name: 'Honey Gift Box (3 x 200g)', slug: 'honey-gift-box',
    description: 'Curated gift set with three artisanal honey varieties.',
    shortDescription: 'Premium gift box with forest, lychee & mustard honey.',
    sku: 'HNY-GFT-3x200',
    category: { id: 1, name: 'Honey', slug: 'honey', level: 0, productCount: 12, isFeatured: true },
    brand: { id: 1, name: 'Araku Tribal Co-op', slug: 'araku-tribal', isFeatured: true, productCount: 15 },
    basePrice: 1299, sellingPrice: 999, discountPercentage: 23,
    images: [{ id: 1, imageUrl: productImages.honey, isPrimary: true, altText: 'Honey Gift Box' }],
    variants: [], specifications: [],
    averageRating: 4.9, ratingCount: 210, totalSold: 450,
    availableStock: 25, isFeatured: true, isTrending: false, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-03-01T00:00:00.000Z', maxQuantity: 5,
  },

  // ==================== MILLETS (8 products) ====================
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
    id: 105, name: 'Ragi (Finger Millet) Flour (500g)', slug: 'ragi-finger-millet-flour',
    description: 'Stone-ground finger millet flour, rich in calcium and iron.',
    shortDescription: 'Traditional ragi flour for dosas, rotis and porridge.',
    sku: 'MLT-RAG-500',
    category: { id: 2, name: 'Millets', slug: 'millets', level: 0, productCount: 8, isFeatured: true },
    brand: { id: 2, name: 'Organic Valley', slug: 'organic-valley', isFeatured: true, productCount: 20 },
    basePrice: 179, sellingPrice: 149, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.millets, isPrimary: true, altText: 'Ragi Flour' }],
    variants: [], specifications: [],
    averageRating: 4.6, ratingCount: 123, totalSold: 2400,
    availableStock: 120, isFeatured: true, isTrending: true, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-05T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 106, name: 'Barnyard Millet (500g)', slug: 'barnyard-millet',
    description: 'Light and fluffy barnyard millet, perfect for rice replacement.',
    shortDescription: 'Low-calorie millet ideal for weight management.',
    sku: 'MLT-BRN-500',
    category: { id: 2, name: 'Millets', slug: 'millets', level: 0, productCount: 8, isFeatured: true },
    brand: { id: 2, name: 'Organic Valley', slug: 'organic-valley', isFeatured: true, productCount: 20 },
    basePrice: 199, sellingPrice: 169, discountPercentage: 15,
    images: [{ id: 1, imageUrl: productImages.millets, isPrimary: true, altText: 'Barnyard Millet' }],
    variants: [], specifications: [],
    averageRating: 4.3, ratingCount: 56, totalSold: 900,
    availableStock: 90, isFeatured: false, isTrending: false, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-02-20T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 107, name: 'Kodo Millet Whole (1kg)', slug: 'kodo-millet-whole',
    description: 'Traditional Kodo millet, a staple of tribal diets in Central India.',
    shortDescription: 'Ancient grain packed with antioxidants and fiber.',
    sku: 'MLT-KOD-1K',
    category: { id: 2, name: 'Millets', slug: 'millets', level: 0, productCount: 8, isFeatured: true },
    brand: { id: 2, name: 'Organic Valley', slug: 'organic-valley', isFeatured: true, productCount: 20 },
    basePrice: 249, sellingPrice: 199, discountPercentage: 20,
    images: [{ id: 1, imageUrl: productImages.millets, isPrimary: true, altText: 'Kodo Millet' }],
    variants: [], specifications: [],
    averageRating: 4.4, ratingCount: 78, totalSold: 1100,
    availableStock: 75, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-10T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 108, name: 'Millets Combo Pack (3 x 500g)', slug: 'millets-combo-pack',
    description: 'Try three popular millets: Foxtail, Ragi and Kodo.',
    shortDescription: 'Starter combo with three nutrient-rich millets.',
    sku: 'MLT-CMB-3x500',
    category: { id: 2, name: 'Millets', slug: 'millets', level: 0, productCount: 8, isFeatured: true },
    brand: { id: 2, name: 'Organic Valley', slug: 'organic-valley', isFeatured: true, productCount: 20 },
    basePrice: 549, sellingPrice: 449, discountPercentage: 18,
    images: [{ id: 1, imageUrl: productImages.millets, isPrimary: true, altText: 'Millets Combo' }],
    variants: [], specifications: [],
    averageRating: 4.7, ratingCount: 198, totalSold: 2100,
    availableStock: 60, isFeatured: true, isTrending: true, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-25T00:00:00.000Z', maxQuantity: 5,
  },

  // ==================== OILS (6 products) ====================
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
    id: 109, name: 'Wood Pressed Groundnut Oil (1L)', slug: 'wood-pressed-groundnut-oil',
    description: 'Traditionally extracted using wooden ghani at low temperature.',
    shortDescription: 'Aromatic groundnut oil for authentic South Indian cooking.',
    sku: 'OIL-GND-1L',
    category: { id: 3, name: 'Oils', slug: 'oils', level: 0, productCount: 6, isFeatured: true },
    brand: { id: 3, name: 'Gramiya', slug: 'gramiya', isFeatured: true, productCount: 8 },
    basePrice: 499, sellingPrice: 399, discountPercentage: 20,
    images: [{ id: 1, imageUrl: productImages.oils, isPrimary: true, altText: 'Groundnut Oil' }],
    variants: [], specifications: [],
    averageRating: 4.6, ratingCount: 189, totalSold: 3800,
    availableStock: 80, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-08T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 110, name: 'Sesame Oil (500ml)', slug: 'cold-pressed-sesame-oil',
    description: 'Pure sesame oil cold-pressed from black sesame seeds.',
    shortDescription: 'Rich, nutty sesame oil for tempering and cooking.',
    sku: 'OIL-SES-500',
    category: { id: 3, name: 'Oils', slug: 'oils', level: 0, productCount: 6, isFeatured: true },
    brand: { id: 3, name: 'Kerala Naturals', slug: 'kerala-naturals', isFeatured: true, productCount: 8 },
    basePrice: 349, sellingPrice: 299, discountPercentage: 14,
    images: [{ id: 1, imageUrl: productImages.oils, isPrimary: true, altText: 'Sesame Oil' }],
    variants: [], specifications: [],
    averageRating: 4.5, ratingCount: 112, totalSold: 2100,
    availableStock: 65, isFeatured: false, isTrending: false, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-02-15T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 111, name: 'Mustard Oil Cold Pressed (1L)', slug: 'cold-pressed-mustard-oil',
    description: 'Pungent mustard oil extracted from organic mustard seeds.',
    shortDescription: 'Bold mustard oil for North Indian and Bengali cooking.',
    sku: 'OIL-MUS-1L',
    category: { id: 3, name: 'Oils', slug: 'oils', level: 0, productCount: 6, isFeatured: true },
    brand: { id: 3, name: 'Gramiya', slug: 'gramiya', isFeatured: true, productCount: 8 },
    basePrice: 399, sellingPrice: 329, discountPercentage: 18,
    images: [{ id: 1, imageUrl: productImages.oils, isPrimary: true, altText: 'Mustard Oil' }],
    variants: [], specifications: [],
    averageRating: 4.4, ratingCount: 156, totalSold: 2800,
    availableStock: 50, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-12T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 112, name: 'Oil Combo Pack (3 x 500ml)', slug: 'oil-combo-pack',
    description: 'Try our best sellers: Coconut, Groundnut and Sesame oils.',
    shortDescription: 'Starter pack of three cold-pressed oils.',
    sku: 'OIL-CMB-3x500',
    category: { id: 3, name: 'Oils', slug: 'oils', level: 0, productCount: 6, isFeatured: true },
    brand: { id: 3, name: 'Kerala Naturals', slug: 'kerala-naturals', isFeatured: true, productCount: 8 },
    basePrice: 899, sellingPrice: 749, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.oils, isPrimary: true, altText: 'Oil Combo' }],
    variants: [], specifications: [],
    averageRating: 4.8, ratingCount: 267, totalSold: 1900,
    availableStock: 35, isFeatured: true, isTrending: true, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-18T00:00:00.000Z', maxQuantity: 5,
  },

  // ==================== SPICES (6 products) ====================
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
    id: 113, name: 'Malabar Black Pepper (100g)', slug: 'malabar-black-pepper',
    description: 'Whole black peppercorns from the Malabar coast, intensely aromatic.',
    shortDescription: 'Bold, pungent black pepper from Kerala spice gardens.',
    sku: 'SPC-BLP-100',
    category: { id: 4, name: 'Spices', slug: 'spices', level: 0, productCount: 10, isFeatured: true },
    brand: { id: 4, name: 'Meghalaya Naturals', slug: 'meghalaya-naturals', isFeatured: true, productCount: 6 },
    basePrice: 299, sellingPrice: 249, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.spices, isPrimary: true, altText: 'Black Pepper' }],
    variants: [], specifications: [],
    averageRating: 4.7, ratingCount: 198, totalSold: 3400,
    availableStock: 70, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-03T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 114, name: 'Kashmiri Red Chilli Powder (200g)', slug: 'kashmiri-red-chilli',
    description: 'Vibrant red chilli from Kashmir, mild heat with deep colour.',
    shortDescription: 'Premium Kashmiri chilli for rich colour and mild spice.',
    sku: 'SPC-CHL-200',
    category: { id: 4, name: 'Spices', slug: 'spices', level: 0, productCount: 10, isFeatured: true },
    brand: { id: 4, name: 'Meghalaya Naturals', slug: 'meghalaya-naturals', isFeatured: true, productCount: 6 },
    basePrice: 349, sellingPrice: 279, discountPercentage: 20,
    images: [{ id: 1, imageUrl: productImages.spices, isPrimary: true, altText: 'Kashmiri Chilli' }],
    variants: [], specifications: [],
    averageRating: 4.6, ratingCount: 145, totalSold: 2800,
    availableStock: 55, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-06T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 115, name: 'Ceylon Cinnamon Sticks (100g)', slug: 'ceylon-cinnamon-sticks',
    description: 'True Ceylon cinnamon, sweet and delicate, unlike common cassia.',
    shortDescription: 'Premium true cinnamon from Sri Lanka, sweet and aromatic.',
    sku: 'SPC-CIN-100',
    category: { id: 4, name: 'Spices', slug: 'spices', level: 0, productCount: 10, isFeatured: true },
    brand: { id: 4, name: 'Meghalaya Naturals', slug: 'meghalaya-naturals', isFeatured: true, productCount: 6 },
    basePrice: 399, sellingPrice: 329, discountPercentage: 18,
    images: [{ id: 1, imageUrl: productImages.spices, isPrimary: true, altText: 'Cinnamon Sticks' }],
    variants: [], specifications: [],
    averageRating: 4.8, ratingCount: 167, totalSold: 2100,
    availableStock: 40, isFeatured: true, isTrending: false, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-02-05T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 116, name: 'Spice Box Combo (5 x 100g)', slug: 'spice-box-combo',
    description: 'Five essential Indian spices in one curated box.',
    shortDescription: 'Curated set: Turmeric, Pepper, Chilli, Cumin and Coriander.',
    sku: 'SPC-CMB-5x100',
    category: { id: 4, name: 'Spices', slug: 'spices', level: 0, productCount: 10, isFeatured: true },
    brand: { id: 4, name: 'Meghalaya Naturals', slug: 'meghalaya-naturals', isFeatured: true, productCount: 6 },
    basePrice: 899, sellingPrice: 699, discountPercentage: 22,
    images: [{ id: 1, imageUrl: productImages.spices, isPrimary: true, altText: 'Spice Box' }],
    variants: [], specifications: [],
    averageRating: 4.9, ratingCount: 345, totalSold: 3200,
    availableStock: 30, isFeatured: true, isTrending: true, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-20T00:00:00.000Z', maxQuantity: 5,
  },

  // ==================== GHEE (4 products) ====================
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
    id: 117, name: 'A2 Sahiwal Cow Ghee (250ml)', slug: 'a2-sahiwal-cow-ghee',
    description: 'Ghee from Sahiwal cows, slightly nutty and deeply aromatic.',
    shortDescription: 'Premium A2 ghee from rare Sahiwal breed cows.',
    sku: 'GHE-SAH-250',
    category: { id: 5, name: 'Ghee', slug: 'ghee', level: 0, productCount: 4, isFeatured: true },
    brand: { id: 5, name: 'Gir Organic Farms', slug: 'gir-organic-farms', isFeatured: true, productCount: 5 },
    basePrice: 599, sellingPrice: 499, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.ghee, isPrimary: true, altText: 'Sahiwal Ghee' }],
    variants: [], specifications: [],
    averageRating: 4.7, ratingCount: 134, totalSold: 1900,
    availableStock: 45, isFeatured: false, isTrending: false, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-02-10T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 118, name: 'A2 Buffalo Ghee (500ml)', slug: 'a2-buffalo-ghee',
    description: 'Rich and creamy ghee from grass-fed Murrah buffaloes.',
    shortDescription: 'Dense, creamy buffalo ghee for festive cooking.',
    sku: 'GHE-BUF-500',
    category: { id: 5, name: 'Ghee', slug: 'ghee', level: 0, productCount: 4, isFeatured: true },
    brand: { id: 5, name: 'Gir Organic Farms', slug: 'gir-organic-farms', isFeatured: true, productCount: 5 },
    basePrice: 799, sellingPrice: 649, discountPercentage: 19,
    images: [{ id: 1, imageUrl: productImages.ghee, isPrimary: true, altText: 'Buffalo Ghee' }],
    variants: [], specifications: [],
    averageRating: 4.5, ratingCount: 89, totalSold: 1200,
    availableStock: 55, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-15T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 119, name: 'A2 Ghee Gift Tin (1L)', slug: 'a2-ghee-gift-tin',
    description: 'Premium Gir cow ghee in elegant gift tin, perfect for gifting.',
    shortDescription: 'Elegant gift tin of our best-selling A2 ghee.',
    sku: 'GHE-GFT-1L',
    category: { id: 5, name: 'Ghee', slug: 'ghee', level: 0, productCount: 4, isFeatured: true },
    brand: { id: 5, name: 'Gir Organic Farms', slug: 'gir-organic-farms', isFeatured: true, productCount: 5 },
    basePrice: 1799, sellingPrice: 1499, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.ghee, isPrimary: true, altText: 'Ghee Gift Tin' }],
    variants: [], specifications: [],
    averageRating: 4.9, ratingCount: 234, totalSold: 800,
    availableStock: 20, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-22T00:00:00.000Z', maxQuantity: 5,
  },

  // ==================== PICKLES (5 products) ====================
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
    id: 120, name: 'Lemon Pickle (300g)', slug: 'traditional-lemon-pickle',
    description: 'Tangy lemon pickle made with rock salt and cold-pressed mustard oil.',
    shortDescription: 'Zesty lemon pickle with traditional Andhra spices.',
    sku: 'PCL-LEM-300',
    category: { id: 6, name: 'Pickles', slug: 'pickles', level: 0, productCount: 5, isFeatured: true },
    brand: { id: 6, name: 'Grandma\'s Recipe', slug: 'grandmas-recipe', isFeatured: true, productCount: 4 },
    basePrice: 199, sellingPrice: 159, discountPercentage: 20,
    images: [{ id: 1, imageUrl: productImages.pickles, isPrimary: true, altText: 'Lemon Pickle' }],
    variants: [], specifications: [],
    averageRating: 4.3, ratingCount: 78, totalSold: 1100,
    availableStock: 60, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-10T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 121, name: 'Amla Pickle (250g)', slug: 'amla-pickle',
    description: 'Sour and tangy amla pickle, rich in Vitamin C.',
    shortDescription: 'Healthy amla pickle, great for immunity.',
    sku: 'PCL-AML-250',
    category: { id: 6, name: 'Pickles', slug: 'pickles', level: 0, productCount: 5, isFeatured: true },
    brand: { id: 6, name: 'Grandma\'s Recipe', slug: 'grandmas-recipe', isFeatured: true, productCount: 4 },
    basePrice: 179, sellingPrice: 149, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.pickles, isPrimary: true, altText: 'Amla Pickle' }],
    variants: [], specifications: [],
    averageRating: 4.2, ratingCount: 56, totalSold: 800,
    availableStock: 70, isFeatured: false, isTrending: false, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-02-25T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 122, name: 'Mixed Vegetable Pickle (400g)', slug: 'mixed-vegetable-pickle',
    description: 'Crunchy mixed vegetable pickle with carrots, cauliflower and chillies.',
    shortDescription: 'Crunchy veggie pickle with authentic Punjabi spices.',
    sku: 'PCL-MIX-400',
    category: { id: 6, name: 'Pickles', slug: 'pickles', level: 0, productCount: 5, isFeatured: true },
    brand: { id: 6, name: 'Grandma\'s Recipe', slug: 'grandmas-recipe', isFeatured: true, productCount: 4 },
    basePrice: 229, sellingPrice: 189, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.pickles, isPrimary: true, altText: 'Mixed Pickle' }],
    variants: [], specifications: [],
    averageRating: 4.5, ratingCount: 112, totalSold: 1400,
    availableStock: 50, isFeatured: true, isTrending: true, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-14T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 123, name: 'Ginger Pickle (200g)', slug: 'ginger-pickle',
    description: 'Spicy and tangy ginger pickle, a perfect digestive aid.',
    shortDescription: 'Fiery ginger pickle for spice lovers.',
    sku: 'PCL-GNG-200',
    category: { id: 6, name: 'Pickles', slug: 'pickles', level: 0, productCount: 5, isFeatured: true },
    brand: { id: 6, name: 'Grandma\'s Recipe', slug: 'grandmas-recipe', isFeatured: true, productCount: 4 },
    basePrice: 169, sellingPrice: 139, discountPercentage: 18,
    images: [{ id: 1, imageUrl: productImages.pickles, isPrimary: true, altText: 'Ginger Pickle' }],
    variants: [], specifications: [],
    averageRating: 4.1, ratingCount: 45, totalSold: 600,
    availableStock: 80, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-18T00:00:00.000Z', maxQuantity: 10,
  },

  // ==================== JAGGERY (4 products) ====================
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
    id: 124, name: 'Sugarcane Jaggery (1kg)', slug: 'sugarcane-jaggery',
    description: 'Traditional sugarcane jaggery, freshly made in winter.',
    shortDescription: 'Soft, golden sugarcane jaggery for everyday use.',
    sku: 'JGR-SUG-1K',
    category: { id: 7, name: 'Jaggery', slug: 'jaggery', level: 0, productCount: 3, isFeatured: true },
    brand: { id: 7, name: 'Tamil Traditional', slug: 'tamil-traditional', isFeatured: true, productCount: 6 },
    basePrice: 199, sellingPrice: 159, discountPercentage: 20,
    images: [{ id: 1, imageUrl: productImages.jaggery, isPrimary: true, altText: 'Sugarcane Jaggery' }],
    variants: [], specifications: [],
    averageRating: 4.4, ratingCount: 89, totalSold: 1800,
    availableStock: 110, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-08T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 125, name: 'Coconut Jaggery (500g)', slug: 'coconut-jaggery',
    description: 'Sweet coconut jaggery made from coconut palm sap.',
    shortDescription: 'Unique coconut-flavoured jaggery, rich in iron.',
    sku: 'JGR-COC-500',
    category: { id: 7, name: 'Jaggery', slug: 'jaggery', level: 0, productCount: 3, isFeatured: true },
    brand: { id: 7, name: 'Tamil Traditional', slug: 'tamil-traditional', isFeatured: true, productCount: 6 },
    basePrice: 249, sellingPrice: 199, discountPercentage: 20,
    images: [{ id: 1, imageUrl: productImages.jaggery, isPrimary: true, altText: 'Coconut Jaggery' }],
    variants: [], specifications: [],
    averageRating: 4.5, ratingCount: 56, totalSold: 900,
    availableStock: 75, isFeatured: false, isTrending: true, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-02-20T00:00:00.000Z', maxQuantity: 10,
  },

  // ==================== TEA (5 products) ====================
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
    id: 126, name: 'Darjeeling First Flush Tea (100g)', slug: 'darjeeling-first-flush',
    description: 'Light and floral Darjeeling first flush, the champagne of teas.',
    shortDescription: 'Delicate first flush Darjeeling with muscatel notes.',
    sku: 'TEA-DAR-100',
    category: { id: 8, name: 'Tea', slug: 'tea', level: 0, productCount: 7, isFeatured: true },
    brand: { id: 8, name: 'Assam Tea Co.', slug: 'assam-tea-co', isFeatured: true, productCount: 4 },
    basePrice: 599, sellingPrice: 499, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.tea, isPrimary: true, altText: 'Darjeeling Tea' }],
    variants: [], specifications: [],
    averageRating: 4.8, ratingCount: 198, totalSold: 1600,
    availableStock: 30, isFeatured: true, isTrending: true, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-05T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 127, name: 'Tulsi Green Tea (25 bags)', slug: 'tulsi-green-tea-bags',
    description: 'Organic green tea infused with holy basil for immunity.',
    shortDescription: 'Refreshing green tea with tulsi for daily wellness.',
    sku: 'TEA-TUL-25B',
    category: { id: 8, name: 'Tea', slug: 'tea', level: 0, productCount: 7, isFeatured: true },
    brand: { id: 8, name: 'Assam Tea Co.', slug: 'assam-tea-co', isFeatured: true, productCount: 4 },
    basePrice: 249, sellingPrice: 199, discountPercentage: 20,
    images: [{ id: 1, imageUrl: productImages.tea, isPrimary: true, altText: 'Tulsi Green Tea' }],
    variants: [], specifications: [],
    averageRating: 4.3, ratingCount: 234, totalSold: 3400,
    availableStock: 80, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-12T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 128, name: 'Masala Chai Blend (100g)', slug: 'masala-chai-blend',
    description: 'Aromatic masala chai blend with cardamom, ginger and cinnamon.',
    shortDescription: 'Ready-to-use masala chai spice blend.',
    sku: 'TEA-MSL-100',
    category: { id: 8, name: 'Tea', slug: 'tea', level: 0, productCount: 7, isFeatured: true },
    brand: { id: 8, name: 'Assam Tea Co.', slug: 'assam-tea-co', isFeatured: true, productCount: 4 },
    basePrice: 299, sellingPrice: 249, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.tea, isPrimary: true, altText: 'Masala Chai' }],
    variants: [], specifications: [],
    averageRating: 4.6, ratingCount: 167, totalSold: 2200,
    availableStock: 65, isFeatured: true, isTrending: true, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-02-01T00:00:00.000Z', maxQuantity: 10,
  },

  // ==================== DRY FRUITS (5 products) ====================
  {
    id: 9, name: 'Organic Raw Cashews (500g)', slug: 'organic-raw-cashews',
    description: 'Premium quality organic cashews sourced directly from farms in Kerala.',
    shortDescription: 'Jumbo size organic cashews, dry roasted and lightly salted.',
    sku: 'NUT-CSW-500',
    category: { id: 9, name: 'Dry Fruits', slug: 'dryfruits', level: 0, productCount: 6, isFeatured: true },
    brand: { id: 3, name: 'Kerala Naturals', slug: 'kerala-naturals', isFeatured: true, productCount: 8 },
    basePrice: 899, sellingPrice: 749, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.dryfruits, isPrimary: true, altText: 'Organic Cashews' }],
    variants: [], specifications: [],
    averageRating: 4.6, ratingCount: 89, totalSold: 1800,
    availableStock: 70, isFeatured: false, isTrending: false, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 129, name: 'Almonds Premium (500g)', slug: 'premium-almonds',
    description: 'Handpicked California almonds, ideal for snacking and cooking.',
    shortDescription: 'Crunchy premium almonds for healthy snacking.',
    sku: 'NUT-ALM-500',
    category: { id: 9, name: 'Dry Fruits', slug: 'dryfruits', level: 0, productCount: 6, isFeatured: true },
    brand: { id: 3, name: 'Kerala Naturals', slug: 'kerala-naturals', isFeatured: true, productCount: 8 },
    basePrice: 799, sellingPrice: 649, discountPercentage: 19,
    images: [{ id: 1, imageUrl: productImages.dryfruits, isPrimary: true, altText: 'Premium Almonds' }],
    variants: [], specifications: [],
    averageRating: 4.7, ratingCount: 234, totalSold: 3200,
    availableStock: 60, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-04T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 130, name: 'Walnuts Organic (250g)', slug: 'organic-walnuts',
    description: 'Premium organic walnuts from Kashmir, rich in Omega-3.',
    shortDescription: 'Brain-boosting Kashmiri walnuts, fresh and crunchy.',
    sku: 'NUT-WAL-250',
    category: { id: 9, name: 'Dry Fruits', slug: 'dryfruits', level: 0, productCount: 6, isFeatured: true },
    brand: { id: 3, name: 'Kerala Naturals', slug: 'kerala-naturals', isFeatured: true, productCount: 8 },
    basePrice: 549, sellingPrice: 449, discountPercentage: 18,
    images: [{ id: 1, imageUrl: productImages.dryfruits, isPrimary: true, altText: 'Organic Walnuts' }],
    variants: [], specifications: [],
    averageRating: 4.5, ratingCount: 112, totalSold: 1400,
    availableStock: 45, isFeatured: false, isTrending: true, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-02-08T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 131, name: 'Raisins Organic (250g)', slug: 'organic-raisins',
    description: 'Plump, seedless raisins from Nashik vineyards.',
    shortDescription: 'Sweet, juicy raisins perfect for desserts and snacking.',
    sku: 'NUT-RAI-250',
    category: { id: 9, name: 'Dry Fruits', slug: 'dryfruits', level: 0, productCount: 6, isFeatured: true },
    brand: { id: 3, name: 'Kerala Naturals', slug: 'kerala-naturals', isFeatured: true, productCount: 8 },
    basePrice: 299, sellingPrice: 249, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.dryfruits, isPrimary: true, altText: 'Organic Raisins' }],
    variants: [], specifications: [],
    averageRating: 4.3, ratingCount: 78, totalSold: 1100,
    availableStock: 85, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-16T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 132, name: 'Dry Fruits Trail Mix (300g)', slug: 'dry-fruits-trail-mix',
    description: 'Healthy mix of almonds, cashews, raisins and pumpkin seeds.',
    shortDescription: 'Perfect on-the-go snack with assorted dry fruits.',
    sku: 'NUT-TRL-300',
    category: { id: 9, name: 'Dry Fruits', slug: 'dryfruits', level: 0, productCount: 6, isFeatured: true },
    brand: { id: 3, name: 'Kerala Naturals', slug: 'kerala-naturals', isFeatured: true, productCount: 8 },
    basePrice: 449, sellingPrice: 379, discountPercentage: 16,
    images: [{ id: 1, imageUrl: productImages.dryfruits, isPrimary: true, altText: 'Trail Mix' }],
    variants: [], specifications: [],
    averageRating: 4.4, ratingCount: 156, totalSold: 1800,
    availableStock: 55, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-22T00:00:00.000Z', maxQuantity: 10,
  },

  // ==================== COFFEE (5 products) ====================
  {
    id: 10, name: 'Araku Valley Coffee Beans (500g)', slug: 'araku-valley-coffee-beans',
    description: 'Single origin organic Arabica coffee from the hills of Araku Valley.',
    shortDescription: 'Premium single-origin Arabica coffee, medium roast.',
    sku: 'COF-ARK-500',
    category: { id: 10, name: 'Coffee', slug: 'coffee', level: 0, productCount: 4, isFeatured: true },
    brand: { id: 1, name: 'Araku Tribal Co-op', slug: 'araku-tribal', isFeatured: true, productCount: 15 },
    basePrice: 599, sellingPrice: 499, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.coffee, isPrimary: true, altText: 'Coffee Beans' }],
    variants: [], specifications: [],
    averageRating: 4.7, ratingCount: 123, totalSold: 2400,
    availableStock: 50, isFeatured: true, isTrending: true, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 133, name: 'Coorg Organic Coffee (250g)', slug: 'coorg-organic-coffee',
    description: 'Rich Arabica coffee from the misty hills of Coorg.',
    shortDescription: 'Smooth, balanced Coorg coffee with chocolate notes.',
    sku: 'COF-CRG-250',
    category: { id: 10, name: 'Coffee', slug: 'coffee', level: 0, productCount: 4, isFeatured: true },
    brand: { id: 1, name: 'Araku Tribal Co-op', slug: 'araku-tribal', isFeatured: true, productCount: 15 },
    basePrice: 449, sellingPrice: 379, discountPercentage: 16,
    images: [{ id: 1, imageUrl: productImages.coffee, isPrimary: true, altText: 'Coorg Coffee' }],
    variants: [], specifications: [],
    averageRating: 4.6, ratingCount: 89, totalSold: 1500,
    availableStock: 65, isFeatured: false, isTrending: false, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-02-12T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 134, name: 'Chikmagalur Coffee Powder (500g)', slug: 'chikmagalur-coffee-powder',
    description: 'Traditional filter coffee powder from Chikmagalur plantations.',
    shortDescription: 'Classic South Indian filter coffee powder, dark roast.',
    sku: 'COF-CHK-500',
    category: { id: 10, name: 'Coffee', slug: 'coffee', level: 0, productCount: 4, isFeatured: true },
    brand: { id: 1, name: 'Araku Tribal Co-op', slug: 'araku-tribal', isFeatured: true, productCount: 15 },
    basePrice: 349, sellingPrice: 299, discountPercentage: 14,
    images: [{ id: 1, imageUrl: productImages.coffee, isPrimary: true, altText: 'Filter Coffee' }],
    variants: [], specifications: [],
    averageRating: 4.8, ratingCount: 267, totalSold: 4100,
    availableStock: 40, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-08T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 135, name: 'Cold Brew Coffee Concentrate (200ml)', slug: 'cold-brew-concentrate',
    description: 'Smooth cold brew concentrate, just add water or milk.',
    shortDescription: 'Ready-to-dilute cold brew, smooth and less acidic.',
    sku: 'COF-CBW-200',
    category: { id: 10, name: 'Coffee', slug: 'coffee', level: 0, productCount: 4, isFeatured: true },
    brand: { id: 1, name: 'Araku Tribal Co-op', slug: 'araku-tribal', isFeatured: true, productCount: 15 },
    basePrice: 299, sellingPrice: 249, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.coffee, isPrimary: true, altText: 'Cold Brew' }],
    variants: [], specifications: [],
    averageRating: 4.5, ratingCount: 134, totalSold: 1700,
    availableStock: 35, isFeatured: false, isTrending: true, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-03-01T00:00:00.000Z', maxQuantity: 10,
  },

  // ==================== HERBAL (5 products) ====================
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
  {
    id: 136, name: 'Triphala Powder (200g)', slug: 'triphala-powder',
    description: 'Classic Ayurvedic triphala blend of amla, bibhitaki and haritaki.',
    shortDescription: 'Traditional Ayurvedic digestive and detox supplement.',
    sku: 'HRB-TRI-200',
    category: { id: 12, name: 'Herbal', slug: 'herbal', level: 0, productCount: 9, isFeatured: true },
    brand: { id: 12, name: 'Forest Remedies', slug: 'forest-remedies', isFeatured: true, productCount: 7 },
    basePrice: 299, sellingPrice: 249, discountPercentage: 17,
    images: [{ id: 1, imageUrl: productImages.herbal, isPrimary: true, altText: 'Triphala Powder' }],
    variants: [], specifications: [],
    averageRating: 4.5, ratingCount: 134, totalSold: 2100,
    availableStock: 60, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-06T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 137, name: 'Brahmi Powder (100g)', slug: 'brahmi-powder',
    description: 'Pure brahmi powder for cognitive health and memory.',
    shortDescription: 'Ancient brain tonic for focus and mental clarity.',
    sku: 'HRB-BRA-100',
    category: { id: 12, name: 'Herbal', slug: 'herbal', level: 0, productCount: 9, isFeatured: true },
    brand: { id: 12, name: 'Forest Remedies', slug: 'forest-remedies', isFeatured: true, productCount: 7 },
    basePrice: 249, sellingPrice: 199, discountPercentage: 20,
    images: [{ id: 1, imageUrl: productImages.herbal, isPrimary: true, altText: 'Brahmi Powder' }],
    variants: [], specifications: [],
    averageRating: 4.4, ratingCount: 78, totalSold: 1300,
    availableStock: 50, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-10T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 138, name: 'Moringa Leaf Powder (150g)', slug: 'moringa-leaf-powder',
    description: 'Nutrient-dense moringa powder from organic farms.',
    shortDescription: 'Superfood moringa for energy and nutrition.',
    sku: 'HRB-MOR-150',
    category: { id: 12, name: 'Herbal', slug: 'herbal', level: 0, productCount: 9, isFeatured: true },
    brand: { id: 12, name: 'Forest Remedies', slug: 'forest-remedies', isFeatured: true, productCount: 7 },
    basePrice: 349, sellingPrice: 299, discountPercentage: 14,
    images: [{ id: 1, imageUrl: productImages.herbal, isPrimary: true, altText: 'Moringa Powder' }],
    variants: [], specifications: [],
    averageRating: 4.3, ratingCount: 67, totalSold: 900,
    availableStock: 40, isFeatured: false, isTrending: true, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-02-18T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 139, name: 'Herbal Wellness Box (4 x 50g)', slug: 'herbal-wellness-box',
    description: 'Try Ashwagandha, Brahmi, Moringa and Triphala in one box.',
    shortDescription: 'Ayurvedic starter kit with four herbal powders.',
    sku: 'HRB-BOX-4x50',
    category: { id: 12, name: 'Herbal', slug: 'herbal', level: 0, productCount: 9, isFeatured: true },
    brand: { id: 12, name: 'Forest Remedies', slug: 'forest-remedies', isFeatured: true, productCount: 7 },
    basePrice: 599, sellingPrice: 479, discountPercentage: 20,
    images: [{ id: 1, imageUrl: productImages.herbal, isPrimary: true, altText: 'Herbal Box' }],
    variants: [], specifications: [],
    averageRating: 4.7, ratingCount: 189, totalSold: 1500,
    availableStock: 30, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-28T00:00:00.000Z', maxQuantity: 5,
  },

  // ==================== RICE (4 products) ====================
  {
    id: 11, name: 'Organic Brown Rice (2kg)', slug: 'organic-brown-rice',
    description: 'Unpolished organic brown rice rich in fiber and nutrients.',
    shortDescription: 'Chemical-free unpolished brown rice from organic farms.',
    sku: 'RCE-BRN-2K',
    category: { id: 11, name: 'Rice', slug: 'rice', level: 0, productCount: 5, isFeatured: true },
    brand: { id: 2, name: 'Organic Valley', slug: 'organic-valley', isFeatured: true, productCount: 20 },
    basePrice: 249, sellingPrice: 199, discountPercentage: 20,
    images: [{ id: 1, imageUrl: productImages.rice, isPrimary: true, altText: 'Brown Rice' }],
    variants: [], specifications: [],
    averageRating: 4.4, ratingCount: 78, totalSold: 1600,
    availableStock: 90, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-01T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 140, name: 'Red Matta Rice (1kg)', slug: 'red-matta-rice',
    description: 'Kerala red matta rice, rich in iron and fibre.',
    shortDescription: 'Traditional Kerala rice for healthy meals.',
    sku: 'RCE-RED-1K',
    category: { id: 11, name: 'Rice', slug: 'rice', level: 0, productCount: 5, isFeatured: true },
    brand: { id: 2, name: 'Organic Valley', slug: 'organic-valley', isFeatured: true, productCount: 20 },
    basePrice: 199, sellingPrice: 169, discountPercentage: 15,
    images: [{ id: 1, imageUrl: productImages.rice, isPrimary: true, altText: 'Red Matta Rice' }],
    variants: [], specifications: [],
    averageRating: 4.5, ratingCount: 112, totalSold: 2200,
    availableStock: 80, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-05T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 141, name: 'Black Kavuni Rice (500g)', slug: 'black-kavuni-rice',
    description: 'Ancient black rice from Nicobar Islands, antioxidant-rich.',
    shortDescription: 'Rare black rice with deep purple colour and nutty taste.',
    sku: 'RCE-BLK-500',
    category: { id: 11, name: 'Rice', slug: 'rice', level: 0, productCount: 5, isFeatured: true },
    brand: { id: 2, name: 'Organic Valley', slug: 'organic-valley', isFeatured: true, productCount: 20 },
    basePrice: 399, sellingPrice: 349, discountPercentage: 13,
    images: [{ id: 1, imageUrl: productImages.rice, isPrimary: true, altText: 'Black Kavuni Rice' }],
    variants: [], specifications: [],
    averageRating: 4.6, ratingCount: 56, totalSold: 700,
    availableStock: 30, isFeatured: false, isTrending: true, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-02-25T00:00:00.000Z', maxQuantity: 10,
  },
  {
    id: 142, name: 'Jeera Samba Rice (1kg)', slug: 'jeera-samba-rice',
    description: 'Aromatic jeera samba rice from Tamil Nadu, perfect for biryani.',
    shortDescription: 'Fragrant small-grain rice for pulao and biryani.',
    sku: 'RCE-JSR-1K',
    category: { id: 11, name: 'Rice', slug: 'rice', level: 0, productCount: 5, isFeatured: true },
    brand: { id: 2, name: 'Organic Valley', slug: 'organic-valley', isFeatured: true, productCount: 20 },
    basePrice: 279, sellingPrice: 229, discountPercentage: 18,
    images: [{ id: 1, imageUrl: productImages.rice, isPrimary: true, altText: 'Jeera Samba Rice' }],
    variants: [], specifications: [],
    averageRating: 4.4, ratingCount: 89, totalSold: 1400,
    availableStock: 65, isFeatured: false, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-01-12T00:00:00.000Z', maxQuantity: 10,
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
      p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
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
          p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
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
