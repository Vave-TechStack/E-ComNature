'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Heart, Share2, ShoppingCart, Check, Shield, Truck, RotateCcw,
  Minus, Plus, MapPin, Copy, ExternalLink, Clock, Zap, Gift, ChevronDown,
  Users, Info, CreditCard, ChevronUp, X, Package, RefreshCw, Sparkles
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
    { id: 4, imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80', isPrimary: false, altText: 'Forest honey packaging' },
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

// Banner offers
const offers = [
  { icon: Gift, label: 'Combo Offer', desc: 'Buy 2 Get 10% Off on Honey Collection' },
  { icon: CreditCard, label: 'Bank Offer', desc: '10% Instant Discount on HDFC Credit Card' },
  { icon: Truck, label: 'Free Shipping', desc: 'Free delivery on orders above ₹499' },
  { icon: RefreshCw, label: 'Easy Returns', desc: '30-day return policy. No questions asked.' },
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

  // Tell the Header which category to highlight when on this product detail page
  useEffect(() => {
    setCategorySlug(product.category.slug);
    return () => setCategorySlug(null);
  }, [product.category.slug, setCategorySlug]);

  const discount = calculateDiscount(product.sellingPrice, product.basePrice);
  const inStock = product.availableStock > 0;
  const lowStock = product.availableStock > 0 && product.availableStock <= 10;

  // Social proof: random viewer count
  const [viewerCount] = useState(() => Math.floor(Math.random() * 40) + 12);

  // Estimate delivery date
  const getDeliveryDate = useCallback(() => {
    const today = new Date();
    const est = new Date(today);
    est.setDate(est.getDate() + 3 + Math.floor(Math.random() * 2));
    return formatDate(est, 'MMM dd, yyyy');
  }, []);
  const [deliveryDate] = useState(getDeliveryDate);

  // Sticky mobile bar on scroll
  useEffect(() => {
    const handleScroll = () => setShowMobileSticky(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!', { icon: '📋', duration: 2000 });
    } catch {
      toast.error('Could not copy link', { duration: 2000 });
    }
  }, []);

  const handlePincodeCheck = useCallback(() => {
    setPincodeChecked(true);
    if (pincode.length === 6 && /^[1-9]\d{5}$/.test(pincode)) {
      setPincodeValid(Math.random() > 0.2); // 80% chance of availability
    } else {
      setPincodeValid(false);
    }
  }, [pincode]);

  // JSON-LD structured data for SEO
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

      <div className="min-h-screen bg-white pb-28 lg:pb-12">
        <div className="container-custom py-4 md:py-6">
          {/* ===== BREADCRUMB ===== */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6 overflow-x-auto scrollbar-hide" aria-label="Breadcrumb">
            <a href="/" className="hover:text-primary-600 whitespace-nowrap transition-colors">Home</a>
            <ChevronDown aria-hidden="true" className="h-3 w-3 -rotate-90 text-gray-300 shrink-0" />
            <a href="/products" className="hover:text-primary-600 whitespace-nowrap transition-colors">Products</a>
            <ChevronDown aria-hidden="true" className="h-3 w-3 -rotate-90 text-gray-300 shrink-0" />
            <a href={`/products?category=${product.category.slug}`} className="hover:text-primary-600 whitespace-nowrap transition-colors">{product.category.name}</a>
            <ChevronDown aria-hidden="true" className="h-3 w-3 -rotate-90 text-gray-300 shrink-0" />
            <span className="text-gray-900 font-medium whitespace-nowrap truncate max-w-[150px] md:max-w-[300px]">{product.name}</span>
          </nav>

          {/* ===== SOCIAL PROOF TOAST ===== */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3.5 py-1.5 text-xs text-green-700"
          >
            <Users className="h-3.5 w-3.5 text-green-500" />
            <span><strong>{viewerCount}</strong> people are viewing this right now</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-1" />
          </motion.div>

          {/* ===== PRODUCT MAIN SECTION ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Gallery */}
            <ProductGallery images={product.images} productName={product.name} />

            {/* Product Info */}
            <div className="space-y-5 lg:space-y-6">
              {/* Brand & Title */}
              <div>
                {product.brand && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 px-2.5 py-1 rounded-full">
                      {product.brand.name}
                    </span>
                    {product.isBestSeller && (
                      <Badge className="bg-amber-500 text-white border-0 text-[10px] px-2 py-0.5">
                        <Zap className="h-3 w-3 mr-0.5 inline" /> Best Seller
                      </Badge>
                    )}
                  </div>
                )}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Sold */}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={cn('h-4 w-4', star <= Math.round(product.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200')} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{product.averageRating.toFixed(1)}</span>
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                    {product.ratingCount} reviews
                  </button>
                  <span className="text-sm text-gray-300">|</span>
                  <span className="text-sm text-gray-500">{product.totalSold.toLocaleString()} sold</span>
                </div>
              </div>

              {/* ===== PRICE SECTION ===== */}
              <div className="rounded-xl bg-gradient-to-r from-primary-50 to-white border border-primary-100 p-4 md:p-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900">{formatPrice(product.sellingPrice)}</span>
                  {product.basePrice > product.sellingPrice && (
                    <>
                      <span className="text-base md:text-lg text-gray-400 line-through">{formatPrice(product.basePrice)}</span>
                      <Badge className="bg-red-500 text-white text-xs md:text-sm px-2 py-0.5 font-semibold">
                        -{Math.abs(discount)}% OFF
                      </Badge>
                    </>
                  )}
                </div>
                <p className="mt-1.5 text-xs md:text-sm text-green-700 font-medium flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" />
                  Inclusive of all taxes. Free shipping above ₹499.
                </p>

                {/* Stock Status */}
                <div className="mt-3 flex items-center gap-2">
                  {inStock ? (
                    <>
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
                    </>
                  ) : (
                    <span className="text-sm font-medium text-red-600">Currently out of stock</span>
                  )}
                </div>
              </div>

              {/* ===== OFFERS SECTION ===== */}
              <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/50 overflow-hidden">
                <button
                  onClick={() => setShowOffers(!showOffers)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-amber-800 hover:bg-amber-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-amber-500" />
                    Available Offers
                  </span>
                  <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', showOffers && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {showOffers && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 space-y-2.5">
                        {offers.map((offer, i) => {
                          const Icon = offer.icon;
                          return (
                            <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-amber-100">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                                <Icon className="h-4 w-4 text-amber-700" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-900">{offer.label}</p>
                                <p className="text-xs text-gray-600">{offer.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Separator />

              {/* ===== SHORT DESCRIPTION ===== */}
              <p className="text-sm text-gray-600 leading-relaxed">{product.shortDescription}</p>

              {/* ===== SIZE VARIANTS ===== */}
              <VariantSelector
                label="Size"
                type="color"
                options={product.variants.map(v => ({
                  type: 'color', value: v.variantValue,
                  color: v.colorCode || v.color || '#8B6914',
                  inStock: v.stock > 0,
                }))}
                selectedValue={selectedSize}
                onChange={setSelectedSize}
              />

              {/* ===== QUANTITY SELECTOR ===== */}
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2.5">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-xl border-2 border-gray-200 overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <motion.span
                      key={quantity}
                      initial={{ scale: 1.2, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex h-11 w-16 items-center justify-center border-x-2 border-gray-200 text-sm font-bold text-gray-900 select-none"
                    >
                      {quantity}
                    </motion.span>
                    <button
                      onClick={() => setQuantity(Math.min(product.maxQuantity || 10, quantity + 1))}
                      disabled={quantity >= (product.maxQuantity || 10)}
                      className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">
                      <span className="font-semibold text-gray-900">{formatPrice(product.sellingPrice * quantity)}</span>
                      {' '}total
                    </p>
                    {quantity > 1 && (
                      <p className="text-xs text-gray-400">{formatPrice(product.sellingPrice)} each</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ===== PINCODE CHECKER ===== */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
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
                        'h-10 pl-3 pr-8 border-gray-300 text-sm',
                        pincodeValid === true && 'border-green-500 bg-green-50',
                        pincodeValid === false && 'border-red-500 bg-red-50'
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
                    className="h-10 text-xs font-semibold border-primary-300 text-primary-700 hover:bg-primary-50"
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
                      <div className="mt-2 flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
                        <Truck className="h-3.5 w-3.5 shrink-0" />
                        <span>Delivery by <strong>{deliveryDate}</strong> — <strong>FREE</strong></span>
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
                      <div className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                        {pincode.length === 6 && /^[1-9]\d{5}$/.test(pincode)
                          ? 'Sorry, we do not deliver to this pincode yet.'
                          : 'Please enter a valid 6-digit pincode.'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ===== ACTION BUTTONS ===== */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2 gradient-primary text-white text-base font-semibold h-12 shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 transition-all duration-300"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className={cn('h-5 w-5 transition-transform', quantity > 0 && 'group-hover:scale-110')} />
                  Add to Cart
                </Button>
                <div className="flex gap-2">
                  <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                      'h-12 w-12 p-0 transition-all duration-300',
                      isInWishlist && 'border-red-300 bg-red-50 text-red-500 hover:bg-red-100'
                    )}
                    onClick={handleToggleWishlist}
                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={cn('h-5 w-5 transition-transform', isInWishlist && 'fill-red-500 scale-110')} />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-12 p-0"
                    onClick={handleShare}
                    aria-label="Share product"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* ===== TRUST BADGES ===== */}
              <div className="grid grid-cols-3 gap-3 rounded-xl border border-gray-200 p-3.5 bg-gray-50/30">
                {[
                  { icon: Truck, label: 'Free Delivery', sub: 'Above ₹499' },
                  { icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
                  { icon: Shield, label: 'Secure', sub: '100% protected' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="text-center">
                      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                        <Icon className="h-4 w-4 text-primary-600" />
                      </div>
                      <p className="mt-1 text-[11px] font-semibold text-gray-700">{item.label}</p>
                      <p className="text-[10px] text-gray-400">{item.sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Separator className="my-8 md:my-12" />

          {/* ===== TABS ===== */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-gray-200 rounded-none bg-transparent p-0 h-auto overflow-x-auto scrollbar-hide">
              <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 rounded-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 rounded-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 rounded-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap">
                Reviews ({product.ratingCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="max-w-3xl">
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.specifications.slice(0, 4).map((spec) => (
                    <div key={spec.id} className="flex items-start gap-3 rounded-xl bg-gray-50 border border-gray-100 p-3.5">
                      <Info className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">{spec.specKey}</p>
                        <p className="text-sm font-medium text-gray-900">{spec.specValue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="pt-6">
              <ProductSpecs specifications={product.specifications.map(s => ({ key: s.specKey, value: s.specValue }))} />
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              <ProductReviews
                reviews={mockReviews}
                averageRating={product.averageRating}
                ratingCount={product.ratingCount}
                ratingDistribution={ratingDistribution}
              />
            </TabsContent>
          </Tabs>

          <Separator className="my-8 md:my-12" />

          {/* ===== RELATED PRODUCTS ===== */}
          <RelatedProducts title="You May Also Like" products={relatedProducts} viewAllHref="/products?category=honey" />
          <RelatedProducts title="Frequently Bought Together" products={relatedProducts.slice(1, 4)} />
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
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-2xl shadow-black/10 lg:hidden safe-area-bottom"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-gray-900">{formatPrice(product.sellingPrice)}</p>
                {product.basePrice > product.sellingPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 line-through">{formatPrice(product.basePrice)}</span>
                    <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0">-{Math.abs(discount)}%</Badge>
                  </div>
                )}
              </div>
              <Button
                size="sm"
                className="gap-2 gradient-primary text-white font-semibold h-11 px-6 text-sm shadow-lg flex-shrink-0"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn('h-11 w-11 p-0 shrink-0', isInWishlist && 'border-red-300 bg-red-50')}
                onClick={handleToggleWishlist}
                aria-label="Toggle wishlist"
              >
                <Heart className={cn('h-4 w-4', isInWishlist && 'fill-red-500')} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
