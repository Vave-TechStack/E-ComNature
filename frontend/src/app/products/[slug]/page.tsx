'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Heart, Share2, ShoppingCart, Check, Shield, Truck, RotateCcw,
  Minus, Plus, MapPin, Gift, ChevronDown,
  Users, Info, CreditCard, Package, RefreshCw, Sparkles,
  Leaf, Award, BadgePercent, PackageCheck, Store, ChevronRight,
  Eye, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ProductGallery } from '@/components/product/ProductGallery';
import { VariantSelector } from '@/components/product/VariantSelector';
import { ProductSpecs } from '@/components/product/ProductSpecs';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/slices/cartSlice';
import { usePageCategory } from '@/lib/contexts/PageCategoryContext';
import { cn, formatPrice, calculateDiscount, formatDate } from '@/lib/utils';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

// ==================== MOCK DATA ====================
const product: Product = {
  id: 1, name: 'Wild Forest Honey (500g)', slug: 'wild-forest-honey',
  description: 'Harvested from the pristine forests of the Western Ghats, our Wild Forest Honey is a pure, unprocessed raw honey collected by indigenous tribal communities using traditional methods passed down through generations. This monofloral honey carries the distinct floral notes of wild nectar-bearing trees, offering a rich, complex flavor profile with subtle woody and floral undertones. Naturally rich in antioxidants, enzymes, and antibacterial properties, it is the purest form of honey you can consume.',
  shortDescription: 'Pure raw forest honey harvested by tribal communities from Western Ghats. Rich in antioxidants, unprocessed, and full of natural enzymes.',
  sku: 'HNY-FRH-500',
  category: { id: 1, name: 'Honey', slug: 'honey', level: 0, productCount: 12, isFeatured: true },
  brand: { id: 1, name: 'Araku Tribal Co-op', slug: 'araku-tribal', isFeatured: true, productCount: 15 },
  basePrice: 799, sellingPrice: 649, discountPercentage: 19,
  images: [
    { id: 1, imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80', isPrimary: true, altText: 'Forest honey jar with honey dipper' },
    { id: 2, imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80', isPrimary: false, altText: 'Honey pouring from dipper' },
    { id: 3, imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80', isPrimary: false, altText: 'Honeycomb and honey jar' },
    { id: 4, imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80', isPrimary: false, altText: 'Forest honey packaging' },
  ],
  variants: [
    { id: 1, variantType: 'size', variantValue: '250g', color: '#D4A017', stock: 35, additionalPrice: 0, isActive: true },
    { id: 2, variantType: 'size', variantValue: '500g', color: '#B8860B', stock: 25, additionalPrice: 150, isActive: true },
    { id: 3, variantType: 'size', variantValue: '1kg', color: '#8B6914', stock: 0, additionalPrice: 350, isActive: false },
  ],
  specifications: [
    { id: 1, specKey: 'Source', specValue: 'Western Ghats Forest Region' },
    { id: 2, specKey: 'Type', specValue: 'Raw, Unprocessed, Wild Honey' },
    { id: 3, specKey: 'Shelf Life', specValue: '24 months from harvest' },
    { id: 4, specKey: 'Storage', specValue: 'Store in cool, dry place away from sunlight' },
    { id: 5, specKey: 'Flavor Notes', specValue: 'Woody, floral, with caramel undertones' },
    { id: 6, specKey: 'Net Weight', specValue: '500g' },
    { id: 7, specKey: 'Harvest Method', specValue: 'Traditional tribal honey hunting' },
    { id: 8, specKey: 'Certification', specValue: 'Chemical Free, No Added Sugar' },
  ],
  averageRating: 4.8, ratingCount: 156, totalSold: 3200,
  availableStock: 60, isFeatured: true, isTrending: true, isNewArrival: true, isBestSeller: true,
  tags: [], createdAt: '2026-01-15T00:00:00.000Z',
};

const mockReviews = [
  { id: 1, user: { firstName: 'Rajesh', lastName: 'Kumar', profileImage: '' }, rating: 5, title: 'Purest honey I have ever tasted!', review: 'This is the real deal. You can taste the difference from store-bought honey. The floral notes are amazing and it crystallizes naturally which shows it is unprocessed.', isVerifiedPurchase: true, createdAt: '2026-01-10T00:00:00.000Z', helpfulCount: 24 },
  { id: 2, user: { firstName: 'Priya', lastName: 'Sharma' }, rating: 5, title: 'Perfect for my morning tea', review: 'Absolutely love the flavor. A teaspoon in my morning tea gives it a wonderful natural sweetness. Will definitely order again.', isVerifiedPurchase: true, createdAt: '2026-01-05T00:00:00.000Z', helpfulCount: 15 },
  { id: 3, user: { firstName: 'Amit', lastName: 'Patel' }, rating: 4, title: 'Great quality honey', review: 'The honey is of excellent quality. You can see it is pure by the way it crystallizes. A bit expensive but worth it for the quality.', isVerifiedPurchase: true, createdAt: '2025-12-28T00:00:00.000Z', helpfulCount: 12 },
  { id: 4, user: { firstName: 'Sneha', lastName: 'Gupta' }, rating: 5, title: 'Feels good knowing it is pure', review: 'Knowing this is harvested ethically by tribal communities makes it even better. The taste is incredible and I feel healthier since switching to this honey.', isVerifiedPurchase: false, createdAt: '2025-12-20T00:00:00.000Z', helpfulCount: 8 },
];

const relatedProducts: Product[] = [
  { ...product, id: 2, name: 'Organic Millets Combo Pack', slug: 'millets-combo', sellingPrice: 599, basePrice: 749, averageRating: 4.6, ratingCount: 89, category: { id: 2, name: 'Millets', slug: 'millets', level: 0, productCount: 8, isFeatured: true } },
  { ...product, id: 3, name: 'Cold Pressed Virgin Coconut Oil', slug: 'coconut-oil', sellingPrice: 499, basePrice: 649, averageRating: 4.7, ratingCount: 234, category: { id: 3, name: 'Oils', slug: 'oils', level: 0, productCount: 6, isFeatured: true } },
  { ...product, id: 4, name: 'Lakadong Turmeric Powder', slug: 'lakadong-turmeric', sellingPrice: 349, basePrice: 449, averageRating: 4.9, ratingCount: 312, category: { id: 4, name: 'Spices', slug: 'spices', level: 0, productCount: 10, isFeatured: true } },
  { ...product, id: 5, name: 'A2 Gir Cow Ghee (500ml)', slug: 'a2-gir-cow-ghee', sellingPrice: 899, basePrice: 1099, averageRating: 4.8, ratingCount: 178, category: { id: 5, name: 'Ghee', slug: 'ghee', level: 0, productCount: 4, isFeatured: true } },
  { ...product, id: 6, name: 'Traditional Mango Pickle (500g)', slug: 'traditional-mango-pickle', sellingPrice: 199, basePrice: 249, averageRating: 4.4, ratingCount: 96, category: { id: 6, name: 'Pickles', slug: 'pickles', level: 0, productCount: 5, isFeatured: true } },
] as Product[];

const ratingDistribution = { 5: 156, 4: 52, 3: 18, 2: 6, 1: 2 };

const offers = [
  { icon: Gift, label: 'Combo Offer', desc: 'Buy 2 Get 10% Off on Honey Collection' },
  { icon: CreditCard, label: 'Bank Offer', desc: '10% Instant Discount on HDFC Credit Card' },
  { icon: Truck, label: 'Free Shipping', desc: 'Free delivery on orders above ₹499' },
  { icon: RefreshCw, label: 'Easy Returns', desc: '30-day return policy. No questions asked.' },
];

const sectionTabs = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'details', label: 'Details', icon: PackageCheck },
  { id: 'reviews', label: 'Reviews', icon: MessageCircle },
];

export default function ProductDetailPage() {
  const dispatch = useAppDispatch();
  const { setCategorySlug } = usePageCategory();
  const [selectedSize, setSelectedSize] = useState('500g');
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showMobileSticky, setShowMobileSticky] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [pincodeValid, setPincodeValid] = useState<boolean | null>(null);
  const [showOffers, setShowOffers] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [showTOC, setShowTOC] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCategorySlug(product.category.slug);
    return () => setCategorySlug(null);
  }, [product.category.slug, setCategorySlug]);

  const discount = calculateDiscount(product.sellingPrice, product.basePrice);
  const inStock = product.availableStock > 0;
  const lowStock = product.availableStock > 0 && product.availableStock <= 10;

  const [viewerCount] = useState(() => Math.floor(Math.random() * 40) + 12);

  const getDeliveryDate = useCallback(() => {
    const today = new Date();
    const est = new Date(today);
    est.setDate(est.getDate() + 3 + Math.floor(Math.random() * 2));
    return formatDate(est, 'MMM dd, yyyy');
  }, []);
  const [deliveryDate] = useState(getDeliveryDate);

  useEffect(() => {
    const handleScroll = () => setShowMobileSticky(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === detailsRef.current) setActiveSection('details');
            else if (entry.target === reviewsRef.current) setActiveSection('reviews');
            else setActiveSection('overview');
          }
        });
      },
      { rootMargin: '-200px 0px -50% 0px', threshold: 0 }
    );

    if (detailsRef.current) observer.observe(detailsRef.current);
    if (reviewsRef.current) observer.observe(reviewsRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setShowTOC(false);
    const el = sectionId === 'overview'
      ? document.getElementById('product-main')
      : sectionId === 'details' ? detailsRef.current : reviewsRef.current;
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddToCart = useCallback(() => {
    dispatch(addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0]?.imageUrl || '/images/placeholder.svg',
      variantId: undefined,
      variantInfo: selectedSize,
      quantity,
      unitPrice: product.sellingPrice,
      totalPrice: product.sellingPrice * quantity,
      isSavedForLater: false,
      isGiftWrap: false,
    }));
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      duration: 3000,
    });
  }, [dispatch, product, selectedSize, quantity]);

  const handleToggleWishlist = useCallback(() => {
    setIsInWishlist(!isInWishlist);
    toast.success(
      isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!',
      { icon: isInWishlist ? '💔' : '❤️', duration: 2000 }
    );
  }, [isInWishlist]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!', { icon: '📋', duration: 2000 });
    } catch {
      toast.error('Could not copy link', { duration: 2000 });
    }
  }, []);

  const handlePincodeCheck = useCallback(() => {
    setPincodeChecked(true);
    if (pincode.length === 6 && /^[1-9]\d{5}$/.test(pincode)) {
      setPincodeValid(Math.random() > 0.2);
    } else {
      setPincodeValid(false);
    }
  }, [pincode]);

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.images[0]?.imageUrl,
    brand: { '@type': 'Brand', name: product.brand?.name },
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      url: `https://ecomnature.com/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.sellingPrice,
      priceValidUntil: '2027-12-31',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating,
      reviewCount: product.ratingCount,
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ===== STICKY SECTION TOC ===== */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-noble-200 hidden lg:block"
      >
        <div className="container-luxury flex items-center gap-1">
          {sectionTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200',
                  activeSection === tab.id
                    ? 'border-primary-500 text-primary-700'
                    : 'border-transparent text-noble-500 hover:text-noble-700 hover:border-noble-300'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="min-h-screen bg-white pb-28 lg:pb-12">
        {/* ===== LUXURY TOP BAR ===== */}
        <div className="relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary-50/30 to-transparent pointer-events-none" />

          <div className="container-luxury py-4 md:py-6 relative">
            {/* ===== PREMIUM BREADCRUMB ===== */}
            <motion.nav
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs md:text-sm text-noble-400 mb-4 md:mb-6 overflow-x-auto scrollbar-hide"
              aria-label="Breadcrumb"
            >
              <a href="/" className="hover:text-primary-600 whitespace-nowrap transition-colors font-medium">Home</a>
              <ChevronRight aria-hidden="true" className="h-3 w-3 text-noble-300 shrink-0" />
              <a href="/products" className="hover:text-primary-600 whitespace-nowrap transition-colors font-medium">Products</a>
              <ChevronRight aria-hidden="true" className="h-3 w-3 text-noble-300 shrink-0" />
              <a href={`/products?category=${product.category.slug}`} className="hover:text-primary-600 whitespace-nowrap transition-colors font-medium">{product.category.name}</a>
              <ChevronRight aria-hidden="true" className="h-3 w-3 text-noble-300 shrink-0" />
              <span className="text-noble-800 font-semibold whitespace-nowrap truncate max-w-[150px] md:max-w-[300px]">{product.name}</span>
            </motion.nav>

            {/* ===== SOCIAL PROOF TOAST ===== */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2.5 rounded-2xl glass-strong px-4 py-2 text-xs text-noble-600 border border-primary-100/50"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <Users className="h-3.5 w-3.5 text-primary-500" />
              <span><strong className="text-noble-800">{viewerCount}</strong> people are viewing this right now</span>
            </motion.div>

            {/* ===== PRODUCT MAIN SECTION ===== */}
            <div id="product-main" className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
              {/* Gallery */}
              <ProductGallery images={product.images} productName={product.name} />

              {/* Product Info */}
              <div className="space-y-5 lg:space-y-6">
                {/* Brand & Title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {product.brand && (
                    <div className="flex items-center gap-2 mb-2">
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary-700 uppercase tracking-widest bg-primary-50/80 border border-primary-200/50 px-3 py-1.5 rounded-full"
                      >
                        <Store className="h-3 w-3" />
                        {product.brand.name}
                      </motion.span>
                      {product.isBestSeller && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 text-[10px] px-2.5 py-1 rounded-full shadow-sm">
                          <Award className="h-3 w-3 mr-0.5 inline" /> Best Seller
                        </Badge>
                      )}
                      {product.isNewArrival && (
                        <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 text-[10px] px-2.5 py-1 rounded-full shadow-sm">
                          <Sparkles className="h-3 w-3 mr-0.5 inline" /> New
                        </Badge>
                      )}
                    </div>
                  )}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading text-noble-900 leading-tight">
                    {product.name}
                  </h1>

                  {/* Rating & Sold */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={cn('h-4 w-4', star <= Math.round(product.averageRating) ? 'fill-amber-400 text-amber-400' : 'text-noble-200')} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-noble-800">{product.averageRating.toFixed(1)}</span>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors" onClick={() => scrollToSection('reviews')}>
                      {product.ratingCount} reviews
                    </button>
                    <span className="text-xs text-noble-300">|</span>
                    <span className="text-sm text-noble-500 flex items-center gap-1">
                      <Package className="h-3.5 w-3.5" />
                      {product.totalSold.toLocaleString()} sold
                    </span>
                  </div>
                </motion.div>

                {/* ===== PRICE SECTION ===== */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50/80 via-white to-primary-50/30 border border-primary-100/60 p-5 md:p-6"
                >
                  {/* Decorative elements */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-100/30 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-100/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative">
                    <div className="flex items-baseline gap-3">
                      <motion.span
                        key={product.sellingPrice}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-3xl md:text-4xl font-bold text-noble-900"
                      >
                        {formatPrice(product.sellingPrice)}
                      </motion.span>
                      {product.basePrice > product.sellingPrice && (
                        <>
                          <span className="text-lg md:text-xl text-noble-400 line-through">{formatPrice(product.basePrice)}</span>
                          <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs md:text-sm px-2.5 py-0.5 font-bold rounded-full shadow-sm">
                            -{Math.abs(discount)}% OFF
                          </Badge>
                        </>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs md:text-sm">
                      <span className="text-green-700 font-medium flex items-center gap-1.5 bg-green-50 border border-green-200/50 rounded-lg px-2.5 py-1">
                        <Check className="h-3 w-3" />
                        Inclusive of all taxes
                      </span>
                      <span className="text-noble-400">Free shipping above ₹499</span>
                    </div>

                    {/* Stock Status */}
                    <div className="mt-3 flex items-center gap-2.5">
                      {inStock ? (
                        <div className="flex items-center gap-2">
                          <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                          </span>
                          <span className="text-sm font-medium text-green-700">
                            {lowStock
                              ? `Only ${product.availableStock} left in stock — order soon!`
                              : 'In Stock'
                            }
                          </span>
                          <span className="text-xs text-noble-400">·</span>
                          <span className="text-xs text-noble-500">SKU: {product.sku}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-red-600">Currently out of stock</span>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* ===== OFFERS SECTION ===== */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-dashed border-amber-200/70 bg-amber-50/40 overflow-hidden"
                >
                  <button
                    onClick={() => setShowOffers(!showOffers)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold text-amber-800 hover:bg-amber-50/60 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 shadow-sm">
                        <BadgePercent className="h-4 w-4 text-white" />
                      </span>
                      Available Offers
                    </span>
                    <ChevronDown className={cn('h-4 w-4 text-amber-500 transition-transform duration-300', showOffers && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {showOffers && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 space-y-2.5">
                          {offers.map((offer, i) => {
                            const Icon = offer.icon;
                            return (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-3 p-3 rounded-xl bg-white border border-amber-100/80 hover:border-amber-200 transition-colors"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200/50">
                                  <Icon className="h-4 w-4 text-amber-700" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-noble-800">{offer.label}</p>
                                  <p className="text-xs text-noble-500 mt-0.5">{offer.desc}</p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <Separator className="bg-noble-100" />

                {/* ===== SHORT DESCRIPTION ===== */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-sm text-noble-600 leading-relaxed"
                >
                  {product.shortDescription}
                </motion.p>

                {/* ===== SIZE VARIANTS ===== */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <VariantSelector
                    label="Size"
                    type="default"
                    options={product.variants.map(v => ({
                      type: 'default',
                      value: v.variantValue,
                      color: v.colorCode || v.color || '#8B6914',
                      inStock: v.stock > 0,
                      label: `${v.variantValue}${v.additionalPrice > 0 ? ` (+${formatPrice(v.additionalPrice)})` : ''}`,
                    }))}
                    selectedValue={selectedSize}
                    onChange={setSelectedSize}
                  />
                </motion.div>

                {/* ===== QUANTITY SELECTOR ===== */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <p className="text-sm font-semibold text-noble-800 mb-2.5">Quantity</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-xl border-2 border-noble-200 overflow-hidden bg-white shadow-sm hover:border-noble-300 transition-colors">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="flex h-12 w-12 items-center justify-center text-noble-500 hover:bg-noble-50 hover:text-noble-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <motion.span
                        key={quantity}
                        initial={{ scale: 1.2, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex h-12 w-16 items-center justify-center border-x-2 border-noble-200 text-sm font-bold text-noble-900 select-none tabular-nums"
                      >
                        {quantity}
                      </motion.span>
                      <button
                        onClick={() => setQuantity(Math.min(product.maxQuantity || 10, quantity + 1))}
                        disabled={quantity >= (product.maxQuantity || 10)}
                        className="flex h-12 w-12 items-center justify-center text-noble-500 hover:bg-noble-50 hover:text-noble-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm">
                      <p className="text-noble-500">
                        <span className="font-bold text-noble-800 text-lg">{formatPrice(product.sellingPrice * quantity)}</span>
                        {' '}total
                      </p>
                      {quantity > 1 && (
                        <p className="text-xs text-noble-400">{formatPrice(product.sellingPrice)} each</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* ===== PINCODE CHECKER ===== */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl border border-noble-200 bg-gradient-to-br from-noble-50/50 to-white p-4"
                >
                  <p className="text-xs font-semibold text-noble-700 mb-2.5 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary-600" />
                    Check Delivery Availability
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Enter pincode"
                        value={pincode}
                        onChange={(e) => {
                          setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                          setPincodeChecked(false);
                          setPincodeValid(null);
                        }}
                        maxLength={6}
                        className={cn(
                          'h-11 pl-4 pr-10 border-noble-200 text-sm rounded-xl bg-white',
                          'focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
                          'placeholder:text-noble-400',
                          pincodeValid === true && 'border-green-500 bg-green-50/50',
                          pincodeValid === false && 'border-red-500 bg-red-50/50'
                        )}
                        aria-label="Enter delivery pincode"
                      />
                      {pincodeValid === true && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-11 text-xs font-semibold border-primary-300 text-primary-700 hover:bg-primary-50 hover:border-primary-400 rounded-xl px-5"
                      onClick={handlePincodeCheck}
                      disabled={pincode.length !== 6}
                    >
                      Check
                    </Button>
                  </div>
                  <AnimatePresence>
                    {pincodeChecked && pincodeValid === true && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200/50 rounded-xl px-3.5 py-2.5">
                          <Truck className="h-4 w-4 shrink-0 text-green-600" />
                          <span>Delivery by <strong>{deliveryDate}</strong> — <strong className="text-green-600">FREE</strong></span>
                        </div>
                      </motion.div>
                    )}
                    {pincodeChecked && pincodeValid === false && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200/50 rounded-xl px-3.5 py-2.5">
                          {pincode.length === 6 && /^[1-9]\d{5}$/.test(pincode)
                            ? 'Sorry, we do not deliver to this pincode yet.'
                            : 'Please enter a valid 6-digit pincode.'}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* ===== ACTION BUTTONS ===== */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Button
                    size="lg"
                    className="flex-1 gap-2 gradient-primary text-white text-base font-bold h-14 shadow-xl shadow-primary-200/50 hover:shadow-2xl hover:shadow-primary-300/50 transition-all duration-300 rounded-2xl"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart — {formatPrice(product.sellingPrice * quantity)}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      size="lg"
                      variant="outline"
                      className={cn(
                        'h-14 w-14 p-0 rounded-2xl border-2 transition-all duration-300',
                        isInWishlist
                          ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300'
                          : 'border-noble-200 text-noble-500 hover:border-noble-300 hover:bg-noble-50'
                      )}
                      onClick={handleToggleWishlist}
                      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <motion.div
                        animate={isInWishlist ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart className={cn('h-5 w-5 transition-transform', isInWishlist && 'fill-red-500')} />
                      </motion.div>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 w-14 p-0 rounded-2xl border-2 border-noble-200 text-noble-500 hover:border-noble-300 hover:bg-noble-50"
                      onClick={handleShare}
                      aria-label="Share product"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>

                {/* ===== TRUST BADGES ===== */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-3 gap-3"
                >
                  {[
                    { icon: Truck, label: 'Free Delivery', sub: 'Above ₹499' },
                    { icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
                    { icon: Shield, label: 'Secure', sub: '100% protected' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        whileHover={{ y: -2 }}
                        className="rounded-xl border border-noble-200 bg-white p-3.5 text-center hover:shadow-md hover:border-noble-300 transition-all duration-200 group"
                      >
                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 group-hover:from-primary-100 group-hover:to-primary-200 transition-all duration-200">
                          <Icon className="h-4 w-4 text-primary-600" />
                        </div>
                        <p className="mt-1.5 text-xs font-bold text-noble-700">{item.label}</p>
                        <p className="text-[10px] text-noble-400">{item.sub}</p>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* ===== KEY FEATURES BULLETS ===== */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="rounded-2xl border border-noble-200 bg-noble-50/30 p-4"
                >
                  <p className="text-xs font-bold text-noble-700 mb-3 flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5 text-primary-500" />
                    Key Features
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      '100% Pure & Natural',
                      'No Added Sugar or Preservatives',
                      'Ethically Sourced from Tribal Communities',
                      'Rich in Antioxidants & Enzymes',
                      'Unprocessed & Unfiltered',
                      'Traditional Harvest Methods',
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-noble-600">
                        <Check className="h-3 w-3 text-green-500 shrink-0" strokeWidth={3} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            <Separator className="my-10 md:my-14 bg-noble-100" />

            {/* ===== TABS (Details & Reviews) ===== */}
            <div ref={detailsRef}>
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start border-b border-noble-200 rounded-none bg-transparent p-0 h-auto overflow-x-auto scrollbar-hide gap-0">
                  <TabsTrigger
                    value="description"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 rounded-none px-5 md:px-8 py-3.5 text-xs md:text-sm font-semibold whitespace-nowrap text-noble-500 hover:text-noble-700 transition-colors"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="specifications"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 rounded-none px-5 md:px-8 py-3.5 text-xs md:text-sm font-semibold whitespace-nowrap text-noble-500 hover:text-noble-700 transition-colors"
                  >
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 rounded-none px-5 md:px-8 py-3.5 text-xs md:text-sm font-semibold whitespace-nowrap text-noble-500 hover:text-noble-700 transition-colors"
                  >
                    Reviews ({product.ratingCount})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="pt-6 md:pt-8">
                  <div className="max-w-3xl">
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm md:text-base text-noble-600 leading-relaxed"
                    >
                      {product.description}
                    </motion.p>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.specifications.slice(0, 4).map((spec, i) => (
                        <motion.div
                          key={spec.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3 rounded-xl bg-noble-50 border border-noble-100 p-3.5 hover:bg-noble-100/50 transition-colors"
                        >
                          <Info className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-noble-400 font-medium">{spec.specKey}</p>
                            <p className="text-sm font-semibold text-noble-800">{spec.specValue}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="specifications" className="pt-6 md:pt-8">
                  <ProductSpecs specifications={product.specifications.map(s => ({ key: s.specKey, value: s.specValue }))} />
                </TabsContent>

                <TabsContent value="reviews" className="pt-6 md:pt-8">
                  <div ref={reviewsRef}>
                    <ProductReviews
                      reviews={mockReviews}
                      averageRating={product.averageRating}
                      ratingCount={product.ratingCount}
                      ratingDistribution={ratingDistribution}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Separator className="my-10 md:my-14 bg-noble-100" />

            {/* ===== RELATED PRODUCTS ===== */}
            <RelatedProducts title="You May Also Like" products={relatedProducts} viewAllHref="/products?category=honey" />
            <RelatedProducts title="Frequently Bought Together" products={relatedProducts.slice(1, 4)} showScrollButtons={false} />
          </div>
        </div>
      </div>

      {/* ===== STICKY MOBILE BOTTOM BAR ===== */}
      <AnimatePresence>
        {showMobileSticky && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-noble-200 bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/10 lg:hidden safe-area-bottom"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-noble-900">{formatPrice(product.sellingPrice * quantity)}</p>
                {product.basePrice > product.sellingPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-noble-400 line-through">{formatPrice(product.basePrice)}</span>
                    <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] px-1.5 py-0 rounded-full">-{Math.abs(discount)}%</Badge>
                  </div>
                )}
              </div>
              <Button
                size="sm"
                className="gap-2 gradient-primary text-white font-bold h-12 px-6 text-sm shadow-xl shadow-primary-200/50 rounded-2xl flex-shrink-0"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-12 w-12 p-0 shrink-0 rounded-2xl border-2',
                  isInWishlist ? 'border-red-200 bg-red-50' : 'border-noble-200'
                )}
                onClick={handleToggleWishlist}
                aria-label="Toggle wishlist"
              >
                <Heart className={cn('h-4 w-4', isInWishlist && 'fill-red-500 text-red-500')} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
