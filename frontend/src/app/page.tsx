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
import { ProductCard } from '@/components/home/ProductCard';
import { Leaf, ArrowRight, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/slices/cartSlice';
import type { Product } from '@/types';

// ===================== MOCK PRODUCT DATA =====================
const naturalProducts: Product[] = [
  {
    id: 1, name: 'Pure Forest Honey – Tribal Harvest', slug: 'pure-forest-honey',
    description: 'Hand-collected by tribal communities from the deep forests of Araku Valley.', shortDescription: 'Raw forest honey sourced from tribal harvesters in Araku Valley.', sku: 'HNY-001',
    category: { id: 1, name: 'Natural Honey', slug: 'honey', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 1, name: 'Araku Tribal Co-op', slug: 'araku-tribal', isFeatured: false, productCount: 0 },
    basePrice: 899, sellingPrice: 599, discountPercentage: 33,
    images: [{ id: 1, imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&q=80', isPrimary: true }],
    variants: [
      { id: 1, variantType: 'weight', variantValue: '250g', additionalPrice: 0, stock: 50, isActive: true },
      { id: 2, variantType: 'weight', variantValue: '500g', additionalPrice: 250, stock: 30, isActive: true },
    ],
    specifications: [],
    averageRating: 4.8, ratingCount: 234, totalSold: 1500,
    availableStock: 100, isFeatured: true, isTrending: true, isNewArrival: true, isBestSeller: true,
    tags: [], createdAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 2, name: 'Organic Foxtail Millet (Korralu)', slug: 'organic-foxtail-millet',
    description: 'Naturally grown foxtail millet without any pesticides or chemical fertilizers.', shortDescription: 'Chemical-free foxtail millet from organic farms.', sku: 'MLT-001',
    category: { id: 2, name: 'Millets & Grains', slug: 'millets', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 2, name: 'Organic Valley', slug: 'organic-valley', isFeatured: false, productCount: 0 },
    basePrice: 350, sellingPrice: 249, discountPercentage: 29,
    images: [{ id: 2, imageUrl: 'https://images.pexels.com/photos/5486525/pexels-photo-5486525.jpeg?auto=compress&cs=tinysrgb&w=600', isPrimary: true }],
    variants: [
      { id: 3, variantType: 'weight', variantValue: '1kg', additionalPrice: 0, stock: 200, isActive: true },
      { id: 4, variantType: 'weight', variantValue: '5kg', additionalPrice: 800, stock: 50, isActive: true },
    ],
    specifications: [],
    averageRating: 4.5, ratingCount: 189, totalSold: 3200,
    availableStock: 200, isFeatured: true, isTrending: true, isNewArrival: true, isBestSeller: true,
    tags: [], createdAt: '2026-02-15T00:00:00.000Z',
  },
  {
    id: 3, name: 'Cold Pressed Wood Pressed Groundnut Oil', slug: 'cold-pressed-groundnut-oil',
    description: 'Traditionally extracted using wooden ghani at low temperatures.', shortDescription: 'Wood-pressed groundnut oil, chemical-free.', sku: 'OIL-001',
    category: { id: 3, name: 'Cold Pressed Oils', slug: 'oils', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 3, name: 'Gramiya', slug: 'gramiya', isFeatured: true, productCount: 0 },
    basePrice: 499, sellingPrice: 399, discountPercentage: 20,
    images: [{ id: 3, imageUrl: 'https://images.pexels.com/photos/4110003/pexels-photo-4110003.jpeg?auto=compress&cs=tinysrgb&w=600', isPrimary: true }],
    variants: [
      { id: 5, variantType: 'weight', variantValue: '500ml', additionalPrice: 0, stock: 150, isActive: true },
      { id: 6, variantType: 'weight', variantValue: '1L', additionalPrice: 350, stock: 100, isActive: true },
    ],
    specifications: [],
    averageRating: 4.6, ratingCount: 445, totalSold: 5600,
    availableStock: 150, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 4, name: 'A2 Desi Cow Ghee – Bilona Method', slug: 'a2-desi-cow-ghee',
    description: 'Traditional bilona method A2 ghee made from the milk of indigenous Gir cows.', shortDescription: 'Pure A2 ghee made using traditional bilona churning.', sku: 'GHE-001',
    category: { id: 4, name: 'A2 Ghee & Dairy', slug: 'ghee', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 4, name: 'Gir Farms', slug: 'gir-farms', isFeatured: false, productCount: 0 },
    basePrice: 1299, sellingPrice: 899, discountPercentage: 31,
    images: [{ id: 4, imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=600&q=80', isPrimary: true }],
    variants: [
      { id: 7, variantType: 'weight', variantValue: '500ml', additionalPrice: 0, stock: 80, isActive: true },
      { id: 8, variantType: 'weight', variantValue: '1L', additionalPrice: 750, stock: 40, isActive: true },
    ],
    specifications: [],
    averageRating: 4.9, ratingCount: 678, totalSold: 3400,
    availableStock: 80, isFeatured: true, isTrending: true, isNewArrival: false, isBestSeller: true,
    tags: [], createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 5, name: 'Traditional Palm Jaggery (Tad Gudd)', slug: 'traditional-palm-jaggery',
    description: 'Handcrafted palm jaggery from the sap of toddy palms.', shortDescription: 'Natural palm jaggery, chemical-free & mineral rich.', sku: 'JAG-001',
    category: { id: 5, name: 'Jaggery & Sweeteners', slug: 'jaggery', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 5, name: 'Traditional Harvest', slug: 'traditional-harvest', isFeatured: false, productCount: 0 },
    basePrice: 299, sellingPrice: 199, discountPercentage: 33,
    images: [{ id: 5, imageUrl: 'https://images.pexels.com/photos/6598173/pexels-photo-6598173.jpeg?auto=compress&cs=tinysrgb&w=600', isPrimary: true }],
    variants: [
      { id: 9, variantType: 'weight', variantValue: '500g', additionalPrice: 0, stock: 120, isActive: true },
      { id: 10, variantType: 'weight', variantValue: '1kg', additionalPrice: 150, stock: 60, isActive: true },
    ],
    specifications: [],
    averageRating: 4.4, ratingCount: 156, totalSold: 2800,
    availableStock: 120, isFeatured: false, isTrending: true, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-03-05T00:00:00.000Z',
  },
  {
    id: 6, name: 'Organic Turmeric Powder (Lakadong)', slug: 'organic-turmeric-lakadong',
    description: 'Premium Lakadong turmeric from Meghalaya, known for its high curcumin content.', shortDescription: 'Premium Lakadong turmeric with 7-12% curcumin.', sku: 'SPC-001',
    category: { id: 6, name: 'Natural Spices', slug: 'spices', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 6, name: 'Meghalaya Organic', slug: 'meghalaya-organic', isFeatured: true, productCount: 0 },
    basePrice: 599, sellingPrice: 449, discountPercentage: 25,
    images: [{ id: 6, imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80', isPrimary: true }],
    variants: [
      { id: 11, variantType: 'weight', variantValue: '250g', additionalPrice: 0, stock: 90, isActive: true },
      { id: 12, variantType: 'weight', variantValue: '500g', additionalPrice: 300, stock: 45, isActive: true },
    ],
    specifications: [],
    averageRating: 4.7, ratingCount: 345, totalSold: 4200,
    availableStock: 90, isFeatured: true, isTrending: false, isNewArrival: false, isBestSeller: false,
    tags: [], createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 7, name: 'Herbal Green Tea – Tulsi & Ginger', slug: 'herbal-green-tea-tulsi-ginger',
    description: 'Blend of organic green tea leaves with holy basil and ginger.', shortDescription: 'Organic green tea with tulsi and ginger blend.', sku: 'TEA-001',
    category: { id: 7, name: 'Herbal Tea & Powders', slug: 'herbal', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 7, name: 'Mountain Brew', slug: 'mountain-brew', isFeatured: false, productCount: 0 },
    basePrice: 450, sellingPrice: 349, discountPercentage: 22,
    images: [{ id: 7, imageUrl: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=600', isPrimary: true }],
    variants: [
      { id: 13, variantType: 'weight', variantValue: '100g', additionalPrice: 0, stock: 70, isActive: true },
      { id: 14, variantType: 'weight', variantValue: '200g', additionalPrice: 250, stock: 35, isActive: true },
    ],
    specifications: [],
    averageRating: 4.3, ratingCount: 234, totalSold: 1800,
    availableStock: 70, isFeatured: false, isTrending: true, isNewArrival: true, isBestSeller: false,
    tags: [], createdAt: '2026-03-10T00:00:00.000Z',
  },
  {
    id: 8, name: 'Homemade Mango Pickle – Andhra Style', slug: 'homemade-mango-pickle-andhra',
    description: 'Traditional Andhra-style mango pickle made with cold-pressed mustard oil.', shortDescription: 'Traditional Andhra mango pickle, no preservatives.', sku: 'PCK-001',
    category: { id: 8, name: 'Pickles & Snacks', slug: 'pickles', level: 0, productCount: 0, isFeatured: false },
    brand: { id: 8, name: "Grandma's Kitchen", slug: 'grandmas-kitchen', isFeatured: false, productCount: 0 },
    basePrice: 349, sellingPrice: 249, discountPercentage: 29,
    images: [{ id: 8, imageUrl: 'https://images.pexels.com/photos/8477068/pexels-photo-8477068.jpeg?auto=compress&cs=tinysrgb&w=600', isPrimary: true }],
    variants: [
      { id: 15, variantType: 'weight', variantValue: '400g', additionalPrice: 0, stock: 60, isActive: true },
    ],
    specifications: [],
    averageRating: 4.6, ratingCount: 567, totalSold: 8900,
    availableStock: 60, isFeatured: true, isTrending: false, isNewArrival: true, isBestSeller: true,
    tags: [], createdAt: '2026-02-20T00:00:00.000Z',
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

export default function HomePage() {
  const dispatch = useAppDispatch();

  return (
    <div className="min-h-screen bg-natural overflow-hidden">
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
                <span className="text-xs font-semibold text-secondary-600 uppercase tracking-[0.15em]">Limited Time Offers</span>
              </div>
              <h2 className="section-title">Today&apos;s Deals</h2>
              <p className="mt-1.5 text-noble-500">Grab these amazing discounts before they&apos;re gone!</p>
            </div>
            <Link href="/products?sort=discount" className="hidden sm:block mt-4 sm:mt-0">
              <Button variant="outline" className="gap-2 border-secondary-200 text-secondary-700 hover:bg-secondary-50 group">
                View All Deals
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {dealProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={product} priority={i < 4} />
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link href="/products?sort=discount">
              <Button variant="outline" className="gap-2 border-secondary-200 text-secondary-700 text-xs font-semibold">
                View All Deals <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 4. BEST SELLERS ===== */}
      <ProductSection
        title="Best Sellers"
        subtitle="Most loved natural products by our community"
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
                <span className="text-xs font-semibold text-primary-600 uppercase tracking-[0.15em]">Certified Organic</span>
              </div>
              <h2 className="section-title">Organic Collection</h2>
              <p className="mt-1.5 text-noble-500">Certified organic products grown without chemicals</p>
            </div>
            <Link href="/products?category=organic" className="hidden sm:block mt-4 sm:mt-0">
              <Button variant="outline" className="gap-2 border-primary-200 text-primary-700 hover:bg-primary-50 group">
                View All Organic
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {organicProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link href="/products?category=organic">
              <Button variant="outline" className="gap-2 border-primary-200 text-primary-700 text-xs font-semibold">
                View All Organic <ArrowRight className="h-4 w-4" />
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
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-[0.15em]">Videos</span>
              <span className="h-1 w-6 rounded-full bg-primary-600" />
            </div>
            <h2 className="section-title">Featured Videos</h2>
            <p className="mt-3 text-noble-500 max-w-2xl mx-auto">
              Watch the journey of your food from farm to table
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'Honey Harvesting in Araku Valley', desc: 'Watch tribal communities harvest wild forest honey using traditional methods.', image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80' },
              { title: 'Organic Millet Farming', desc: 'See how our farmers grow chemical-free millets in the hills of Tamil Nadu.', image: 'https://images.pexels.com/photos/5486525/pexels-photo-5486525.jpeg?auto=compress&cs=tinysrgb&w=800' },
              { title: 'Traditional Oil Pressing', desc: 'Experience the traditional wooden ghani method of cold-pressing oils.', image: 'https://images.pexels.com/photos/4110003/pexels-photo-4110003.jpeg?auto=compress&cs=tinysrgb&w=800' },
            ].map((video, i) => (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-2xl overflow-hidden bg-noble-900 aspect-video cursor-pointer"
              >
                <img
                  src={video.image}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-heading text-lg mb-1">{video.title}</h3>
                  <p className="text-white/70 text-sm line-clamp-2">{video.desc}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                    <div className="h-0 w-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-white ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 11. CUSTOMER REVIEWS ===== */}
      <CustomerReviews />

      {/* ===== 12. INSTAGRAM GALLERY ===== */}
      <InstagramGallery />

      {/* ===== 13. BLOG ===== */}
      <BlogSection />

      {/* ===== 14. NEWSLETTER ===== */}
      <NewsletterCTA />
    </div>
  );
}
