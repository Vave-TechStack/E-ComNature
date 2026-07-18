'use client';

import { HeroBanner } from '@/components/home/HeroBanner';
import { CategorySection } from '@/components/home/CategorySection';
import { FarmerStory } from '@/components/home/FarmerStory';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { CustomerReviews } from '@/components/home/CustomerReviews';
import { InstagramGallery } from '@/components/home/InstagramGallery';
import { BlogSection } from '@/components/home/BlogSection';
import { NewsletterCTA } from '@/components/home/NewsletterCTA';
import { ProductSection } from '@/components/home/ProductSection';
import { FlashSale } from '@/components/home/FlashSale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, ArrowRight, Sparkles, Timer, Heart, ShoppingCart, Star, Zap, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/slices/cartSlice';
import type { Product } from '@/types';

// ===================== MOCK PRODUCT DATA =====================
const naturalProducts: Product[] = [
  {
    id: 1, name: 'Pure Forest Honey – Tribal Harvest', slug: 'pure-forest-honey',
    description: 'Hand-collected by tribal communities from the deep forests of Araku Valley. Unprocessed, unfiltered, and 100% pure.', shortDescription: 'Raw forest honey sourced from tribal harvesters in Araku Valley.', sku: 'HNY-001',
    category: { id: 1, name: 'Natural Honey', slug: 'honey', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 1, name: 'Araku Tribal Co-op', slug: 'araku-tribal', isFeatured: false, productCount: 0 },
    basePrice: 899, sellingPrice: 599, discountPercentage: 33,
    images: [{ id: 1, imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&q=80', isPrimary: true }],
    variants: [
      { id: 1, variantType: 'weight', variantValue: '250g', additionalPrice: 0, stock: 50, isActive: true },
      { id: 2, variantType: 'weight', variantValue: '500g', additionalPrice: 250, stock: 30, isActive: true },
    ],
    specifications: [{ id: 1, specKey: 'Source', specValue: 'Araku Valley, Andhra Pradesh' }, { id: 2, specKey: 'Harvest', specValue: 'January 2026' }],
    averageRating: 4.8, ratingCount: 234, totalSold: 1500,
    availableStock: 100, isFeatured: true, isTrending: true, isNewArrival: true, isBestSeller: true,
    tags: [{ id: 1, name: 'Organic', slug: 'organic' }, { id: 2, name: 'Tribal', slug: 'tribal' }],
    createdAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 2, name: 'Organic Foxtail Millet (Korralu)', slug: 'organic-foxtail-millet',
    description: 'Naturally grown foxtail millet without any pesticides or chemical fertilizers. Rich in fiber and protein.', shortDescription: 'Chemical-free foxtail millet from organic farms.', sku: 'MLT-001',
    category: { id: 2, name: 'Millets & Grains', slug: 'millets', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 2, name: 'Organic Valley', slug: 'organic-valley', isFeatured: false, productCount: 0 },
    basePrice: 350, sellingPrice: 249, discountPercentage: 29,
    images: [{ id: 2, imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&q=80', isPrimary: true }],
    variants: [
      { id: 3, variantType: 'weight', variantValue: '1kg', additionalPrice: 0, stock: 200, isActive: true },
      { id: 4, variantType: 'weight', variantValue: '5kg', additionalPrice: 800, stock: 50, isActive: true },
    ],
    specifications: [{ id: 3, specKey: 'Source', specValue: 'Dindigul, Tamil Nadu' }, { id: 4, specKey: 'Certification', specValue: 'Organic (IND-ORG-001)' }],
    averageRating: 4.5, ratingCount: 189, totalSold: 3200,
    availableStock: 200, isFeatured: true, isTrending: true, isNewArrival: true, isBestSeller: true,
    tags: [{ id: 3, name: 'Organic', slug: 'organic' }, { id: 4, name: 'Gluten Free', slug: 'gluten-free' }],
    createdAt: '2026-02-15T00:00:00.000Z',
  },
  {
    id: 3, name: 'Cold Pressed Wood Pressed Groundnut Oil', slug: 'cold-pressed-groundnut-oil',
    description: 'Traditionally extracted using wooden ghani at low temperatures to preserve all natural nutrients and flavor.', shortDescription: 'Wood-pressed groundnut oil, chemical-free.', sku: 'OIL-001',
    category: { id: 3, name: 'Cold Pressed Oils', slug: 'oils', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 3, name: 'Gramiya', slug: 'gramiya', isFeatured: true, productCount: 0 },
    basePrice: 499, sellingPrice: 399, discountPercentage: 20,
    images: [{ id: 3, imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80', isPrimary: true }],
    variants: [
      { id: 5, variantType: 'weight', variantValue: '500ml', additionalPrice: 0, stock: 150, isActive: true },
      { id: 6, variantType: 'weight', variantValue: '1L', additionalPrice: 350, stock: 100, isActive: true },
    ],
    specifications: [{ id: 5, specKey: 'Method', specValue: 'Wood Pressed (Ghani)' }, { id: 6, specKey: 'Source', specValue: 'Chittoor, Andhra Pradesh' }],
    averageRating: 4.6, ratingCount: 445, totalSold: 5600,
    availableStock: 150, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [{ id: 5, name: 'Cold Pressed', slug: 'cold-pressed' }],
    createdAt: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 4, name: 'A2 Desi Cow Ghee – Bilona Method', slug: 'a2-desi-cow-ghee',
    description: 'Traditional bilona method A2 ghee made from the milk of indigenous Gir cows. Rich, aromatic, and packed with nutrients.', shortDescription: 'Pure A2 ghee made using traditional bilona churning.', sku: 'GHE-001',
    category: { id: 4, name: 'A2 Ghee & Dairy', slug: 'ghee', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 4, name: 'Gir Farms', slug: 'gir-farms', isFeatured: false, productCount: 0 },
    basePrice: 1299, sellingPrice: 899, discountPercentage: 31,
    images: [{ id: 4, imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=600&q=80', isPrimary: true }],
    variants: [
      { id: 7, variantType: 'weight', variantValue: '500ml', additionalPrice: 0, stock: 80, isActive: true },
      { id: 8, variantType: 'weight', variantValue: '1L', additionalPrice: 750, stock: 40, isActive: true },
    ],
    specifications: [{ id: 7, specKey: 'Method', specValue: 'Bilona (Traditional Churning)' }, { id: 8, specKey: 'Cow Breed', specValue: 'Gir' }],
    averageRating: 4.9, ratingCount: 678, totalSold: 3400,
    availableStock: 80, isFeatured: true, isTrending: true, isNewArrival: false, isBestSeller: true,
    tags: [{ id: 6, name: 'A2', slug: 'a2' }, { id: 7, name: 'Organic', slug: 'organic' }],
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 5, name: 'Traditional Palm Jaggery (Tad Gudd)', slug: 'traditional-palm-jaggery',
    description: 'Handcrafted palm jaggery from the sap of toddy palms. Chemical-free, rich in minerals, and a healthy alternative to refined sugar.', shortDescription: 'Natural palm jaggery, chemical-free & mineral rich.', sku: 'JAG-001',
    category: { id: 5, name: 'Jaggery & Sweeteners', slug: 'jaggery', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 5, name: 'Traditional Harvest', slug: 'traditional-harvest', isFeatured: false, productCount: 0 },
    basePrice: 299, sellingPrice: 199, discountPercentage: 33,
    images: [{ id: 5, imageUrl: 'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=600&q=80', isPrimary: true }],
    variants: [
      { id: 9, variantType: 'weight', variantValue: '500g', additionalPrice: 0, stock: 120, isActive: true },
      { id: 10, variantType: 'weight', variantValue: '1kg', additionalPrice: 150, stock: 60, isActive: true },
    ],
    specifications: [{ id: 9, specKey: 'Source', specValue: 'Maharashtra' }, { id: 10, specKey: 'Type', specValue: 'Palm (Tad)' }],
    averageRating: 4.4, ratingCount: 156, totalSold: 2800,
    availableStock: 120, isFeatured: false, isTrending: true, isNewArrival: true, isBestSeller: false,
    tags: [{ id: 8, name: 'Natural Sweetener', slug: 'natural-sweetener' }],
    createdAt: '2026-03-05T00:00:00.000Z',
  },
  {
    id: 6, name: 'Organic Turmeric Powder (Lakadong)', slug: 'organic-turmeric-lakadong',
    description: 'Premium Lakadong turmeric from Meghalaya, known for its high curcumin content (7-12%). Pure, unadulterated, and chemical-free.', shortDescription: 'Premium Lakadong turmeric with 7-12% curcumin.', sku: 'SPC-001',
    category: { id: 6, name: 'Natural Spices', slug: 'spices', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 6, name: 'Meghalaya Organic', slug: 'meghalaya-organic', isFeatured: true, productCount: 0 },
    basePrice: 599, sellingPrice: 449, discountPercentage: 25,
    images: [{ id: 6, imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80', isPrimary: true }],
    variants: [
      { id: 11, variantType: 'weight', variantValue: '250g', additionalPrice: 0, stock: 90, isActive: true },
      { id: 12, variantType: 'weight', variantValue: '500g', additionalPrice: 300, stock: 45, isActive: true },
    ],
    specifications: [{ id: 11, specKey: 'Origin', specValue: 'Lakadong, Meghalaya' }, { id: 12, specKey: 'Curcumin', specValue: '7-12%' }],
    averageRating: 4.7, ratingCount: 345, totalSold: 4200,
    availableStock: 90, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [{ id: 9, name: 'Organic', slug: 'organic' }, { id: 10, name: 'Premium', slug: 'premium' }],
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 7, name: 'Herbal Green Tea – Tulsi & Ginger', slug: 'herbal-green-tea-tulsi-ginger',
    description: 'Blend of organic green tea leaves with holy basil (tulsi) and ginger. Immunity boosting, caffeine controlled.', shortDescription: 'Organic green tea with tulsi and ginger blend.', sku: 'TEA-001',
    category: { id: 7, name: 'Herbal Tea & Powders', slug: 'herbal', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 7, name: 'Mountain Brew', slug: 'mountain-brew', isFeatured: false, productCount: 0 },
    basePrice: 450, sellingPrice: 349, discountPercentage: 22,
    images: [{ id: 7, imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80', isPrimary: true }],
    variants: [
      { id: 13, variantType: 'weight', variantValue: '100g', additionalPrice: 0, stock: 70, isActive: true },
      { id: 14, variantType: 'weight', variantValue: '200g', additionalPrice: 250, stock: 35, isActive: true },
    ],
    specifications: [{ id: 13, specKey: 'Type', specValue: 'Green Tea with Herbs' }, { id: 14, specKey: 'Region', specValue: 'Munnar, Kerala' }],
    averageRating: 4.3, ratingCount: 234, totalSold: 1800,
    availableStock: 70, isFeatured: false, isTrending: true, isNewArrival: true, isBestSeller: false,
    tags: [{ id: 11, name: 'Herbal', slug: 'herbal' }, { id: 12, name: 'Immunity', slug: 'immunity' }],
    createdAt: '2026-03-10T00:00:00.000Z',
  },
  {
    id: 8, name: 'Homemade Mango Pickle – Andhra Style', slug: 'homemade-mango-pickle-andhra',
    description: 'Traditional Andhra-style mango pickle made with cold-pressed mustard oil, authentic spices, and zero preservatives.', shortDescription: 'Traditional Andhra mango pickle, no preservatives.', sku: 'PCK-001',
    category: { id: 8, name: 'Pickles & Snacks', slug: 'pickles', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 8, name: "Grandma's Kitchen", slug: 'grandmas-kitchen', isFeatured: false, productCount: 0 },
    basePrice: 349, sellingPrice: 249, discountPercentage: 29,
    images: [{ id: 8, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80', isPrimary: true }],
    variants: [
      { id: 15, variantType: 'weight', variantValue: '400g', additionalPrice: 0, stock: 60, isActive: true },
    ],
    specifications: [{ id: 15, specKey: 'Style', specValue: 'Andhra Style' }, { id: 16, specKey: 'Preservatives', specValue: 'None' }],
    averageRating: 4.6, ratingCount: 567, totalSold: 8900,
    availableStock: 60, isFeatured: true, isTrending: false, isNewArrival: true, isBestSeller: true,
    tags: [{ id: 13, name: 'Homemade', slug: 'homemade' }],
    createdAt: '2026-02-20T00:00:00.000Z',
  },
];

const seasonalProducts = naturalProducts.slice(0, 4);
const bestSellers = [...naturalProducts].filter(p => p.isBestSeller);
const organicProducts = naturalProducts.filter(p => p.tags.some(t => t.slug === 'organic'));
const freshArrivals = naturalProducts.slice(3, 8);

// ===================== DEAL PRODUCTS =====================
const dealProducts = [
  { ...naturalProducts[0], sellingPrice: 499, basePrice: 899, discountPercentage: 45, availableStock: 35 },
  { ...naturalProducts[1], sellingPrice: 199, basePrice: 350, discountPercentage: 43, availableStock: 50 },
  { ...naturalProducts[3], sellingPrice: 749, basePrice: 1299, discountPercentage: 42, availableStock: 20 },
  { ...naturalProducts[5], sellingPrice: 349, basePrice: 599, discountPercentage: 42, availableStock: 25 },
];

// ===================== HEALTHY LIFESTYLE SECTION DATA =====================
const lifestyleItems = [
  {
    title: 'Start Your Day with Millets',
    desc: 'Replace refined grains with nutrient-rich traditional millets for sustained energy.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  },
  {
    title: 'Cook with Cold Pressed Oils',
    desc: 'Switch to wood-pressed oils for healthier cooking and authentic flavors.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
  },
  {
    title: 'Embrace Traditional Foods',
    desc: 'Rediscover the wisdom of our ancestors through natural, unprocessed foods.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
  },
];

// ===================== FEATURED VIDEOS DATA =====================
const featuredVideos = [
  {
    title: 'Honey Harvesting in Araku Valley',
    desc: 'Watch tribal communities harvest wild forest honey using traditional methods.',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80',
  },
  {
    title: 'Organic Millet Farming',
    desc: 'See how our farmers grow chemical-free millets in the hills of Tamil Nadu.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80',
  },
  {
    title: 'Traditional Oil Pressing',
    desc: 'Experience the traditional wooden ghani method of cold-pressing oils.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
  },
];

export default function HomePage() {
  const dispatch = useAppDispatch();

  const handleAddToCart = (product: Product) => {
    const primaryImage = product.images?.[0]?.imageUrl || '';
    dispatch(addItem({
      productId: product.id,
      productName: product.name,
      productImage: primaryImage,
      quantity: 1,
      unitPrice: product.sellingPrice,
      totalPrice: product.sellingPrice,
      isSavedForLater: false,
      isGiftWrap: false,
    }));
  };

  return (
    <div className="min-h-screen bg-natural">
      {/* ===== 1. HERO BANNER ===== */}
      <HeroBanner />

      {/* ===== 2. FEATURED CATEGORIES ===== */}
      <CategorySection />

      {/* ===== 3. TODAY'S DEALS ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-accent-500" />
                <span className="text-xs font-semibold text-accent-600 uppercase tracking-widest">Limited Time Offers</span>
              </div>
              <h2 className="section-title">Today&apos;s Deals</h2>
              <p className="mt-1.5 text-gray-500">Grab these amazing discounts before they&apos;re gone!</p>
            </div>
            <Link href="/products?sort=discount" className="hidden sm:block mt-4 sm:mt-0">
              <Button variant="outline" className="gap-2 border-accent-300 text-accent-700 hover:bg-accent-50 group">
                View All Deals
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {dealProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="group relative rounded-2xl bg-white border-2 border-accent-100 hover:border-accent-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
                  {/* Deal Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-accent-500 text-white border-0 text-xs font-bold px-2.5 py-1 shadow-lg shadow-accent-500/30">
                      {product.discountPercentage}% OFF
                    </Badge>
                  </div>

                  {/* Timer Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs border-0 gap-1 px-2 py-1">
                      <Timer className="h-3 w-3 text-red-500" />
                      <span className="text-red-500 font-semibold">12:45:30</span>
                    </Badge>
                  </div>

                  {/* Wishlist Button */}
                  <button className="absolute right-3 bottom-20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                    </div>
                  </button>

                  {/* Image */}
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-primary-50">
                      <Image
                        src={product.images[0].imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        loading="lazy"
                      />
                      {/* Quick add overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="sm" className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold text-xs gap-1.5">
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Quick Add
                        </Button>
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-3 md:p-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors min-h-[2.5rem]">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                        <span className="text-xs font-medium text-gray-700">{product.averageRating}</span>
                      </div>
                      <span className="text-xs text-gray-400">({product.ratingCount})</span>
                    </div>

                    {/* Weight */}
                    <p className="text-xs text-gray-400 mt-1">{product.variants[0]?.variantValue}</p>

                    {/* Price */}
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">{formatPrice(product.sellingPrice)}</span>
                      <span className="text-sm text-gray-400 line-through">{formatPrice(product.basePrice)}</span>
                    </div>

                    {/* Stock Bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-orange-600 font-medium">
                          Only {product.availableStock} left
                        </span>
                        <span className="text-gray-400">
                          {Math.max(0, Math.round(((100 - product.availableStock) / 100) * 100))}% sold
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent-500 to-red-500"
                          style={{ width: `${Math.max(0, Math.min(100, 100 - product.availableStock))}%` }}
                        />
                      </div>
                    </div>

                    {/* Add to Cart & Buy Now Buttons */}
                    <div className="mt-3 flex gap-2">
                      <Button 
                        className="flex-1 gap-2 gradient-primary text-white font-semibold text-xs shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-300 transition-all"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Add
                      </Button>
                      <Link href={`/products/${product.slug}`} className="flex-[0.6]">
                        <Button 
                          variant="outline" 
                          className="w-full gap-1.5 border-primary-200 text-primary-700 hover:bg-primary-50 text-xs font-semibold"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile View All */}
          <div className="mt-6 text-center sm:hidden">
            <Link href="/products?sort=discount">
              <Button variant="outline" className="gap-2 border-accent-300 text-accent-700">
                View All Deals
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 4. BEST SELLERS ===== */}
      <ProductSection
        title="Best Sellers"
        subtitle="Most loved natural products by our community — tried, tested, and trusted"
        products={bestSellers.length ? bestSellers : naturalProducts}
        viewAllHref="/products?sort=bestsellers"
        variant="grid"
      />

      {/* ===== 5. FLASH SALE ===== */}
      <FlashSale />

      {/* ===== 6. ORGANIC COLLECTIONS ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="h-4 w-4 text-primary-600" />
                <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Certified Organic</span>
              </div>
              <h2 className="section-title">Organic Collection</h2>
              <p className="mt-1.5 text-gray-500">Certified organic products grown without chemicals or pesticides — pure & safe</p>
            </div>
            <Link href="/products?category=organic" className="hidden sm:block mt-4 sm:mt-0">
              <Button variant="outline" className="gap-2 border-primary-200 text-primary-700 hover:bg-primary-50 group">
                View All Organic
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {organicProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="group block rounded-2xl border border-primary-100 bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-primary-50">
                    <Image
                      src={product.images[0].imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      loading="lazy"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary-600 text-white border-0 text-xs font-semibold px-2.5 py-1 shadow-lg">
                      Organic
                    </Badge>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="h-4 w-4 text-white drop-shadow-md" />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-primary-600 font-medium mb-1">{product.brand.name}</p>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                      <span className="text-xs font-medium text-gray-700">{product.averageRating}</span>
                      <span className="text-xs text-gray-400">({product.ratingCount})</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">{formatPrice(product.sellingPrice)}</span>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(product.basePrice)}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="mt-3 w-full gap-1.5 bg-primary-600 text-white hover:bg-primary-700 text-xs font-semibold"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add to Cart
                    </Button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile View All */}
          <div className="mt-6 text-center sm:hidden">
            <Link href="/products?category=organic">
              <Button variant="outline" className="gap-2 border-primary-200 text-primary-700">
                View All Organic
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 7. FRESH ARRIVALS ===== */}
      <ProductSection
        title="Fresh Arrivals"
        subtitle="Newest additions to our natural foods collection"
        products={freshArrivals}
        viewAllHref="/products?sort=newest"
        variant="carousel"
      />

      {/* ===== 8. FARMER STORY ===== */}
      <FarmerStory />

      {/* ===== 9. WHY CHOOSE US ===== */}
      <WhyChooseUs />

      {/* ===== 10. FEATURED VIDEOS ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-1 w-6 rounded-full bg-primary-600" />
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Videos</span>
              <span className="h-1 w-6 rounded-full bg-primary-600" />
            </div>
            <h2 className="section-title">Featured Videos</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Watch the journey of your food from farm to table — see the passion behind every product
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {featuredVideos.map((video, i) => (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-gray-900 cursor-pointer"
              >
                <div className="relative h-64 md:h-72">
                  <Image
                    src={video.image}
                    alt={video.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105 opacity-80"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
                      <svg className="h-6 w-6 text-primary-700 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-bold text-base md:text-lg">{video.title}</h3>
                    <p className="text-white/70 text-sm mt-1">{video.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 11. HEALTHY LIFESTYLE ===== */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-primary-50 to-white overflow-hidden">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-1 w-6 rounded-full bg-accent-500" />
              <span className="text-xs font-semibold text-accent-600 uppercase tracking-widest">Healthy Living</span>
              <span className="h-1 w-6 rounded-full bg-accent-500" />
            </div>
            <h2 className="section-title">Embrace a Natural Lifestyle</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Small changes in your diet can lead to remarkable improvements in your health and wellbeing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {lifestyleItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl h-96"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm md:text-base text-white/80 max-w-xs">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 12. CUSTOMER REVIEWS ===== */}
      <CustomerReviews />

      {/* ===== 13. INSTAGRAM GALLERY ===== */}
      <InstagramGallery />

      {/* ===== 14. BLOG SECTION ===== */}
      <BlogSection />

      {/* ===== 15. NEWSLETTER ===== */}
      <NewsletterCTA />
    </div>
  );
}
