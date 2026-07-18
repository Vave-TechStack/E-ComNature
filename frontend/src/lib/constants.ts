export const APP_NAME = 'NatureKart';
export const APP_DESCRIPTION = 'Pure & Natural Foods — Direct from Farms, Forests & Tribal Communities';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_SIZE: 20,
  MAX_SIZE: 100,
};

export const ROLES = {
  CUSTOMER: 'ROLE_CUSTOMER',
  ADMIN: 'ROLE_ADMIN',
  WAREHOUSE_STAFF: 'ROLE_WAREHOUSE_STAFF',
  DELIVERY_STAFF: 'ROLE_DELIVERY_STAFF',
  CUSTOMER_SUPPORT: 'ROLE_CUSTOMER_SUPPORT',
  MARKETING: 'ROLE_MARKETING',
} as const;

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  PACKED: 'PACKED',
  SHIPPED: 'SHIPPED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
  REFUNDED: 'REFUNDED',
} as const;

export const PAYMENT_METHODS = {
  UPI: 'UPI',
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  NET_BANKING: 'NET_BANKING',
  WALLET: 'WALLET',
  COD: 'COD',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const CURRENCY = {
  SYMBOL: '₹',
  CODE: 'INR',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'All Products', href: '/products' },
  { label: 'Organic', href: '/products?category=organic' },
  { label: 'Honey', href: '/products?category=honey' },
  { label: 'Millets & Grains', href: '/products?category=millets' },
  { label: 'Oils & Ghee', href: '/products?category=oils' },
];

export const CATEGORY_ICONS: Record<string, string> = {
  honey: 'Droplets',
  millets: 'Wheat',
  rice: 'Grains',
  oils: 'Droplet',
  spices: 'Flame',
  ghee: 'CircleDot',
  dryfruits: 'Nut',
  tea: 'Leaf',
  pickles: 'GlassWater',
  jaggery: 'Candy',
  organic: 'Sprout',
  tribal: 'Feather',
  forest: 'TreePine',
  herbal: 'Flower2',
  handicrafts: 'Basket',
  coffee: 'Coffee',
};

export const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating: High to Low', value: 'rating_desc' },
];

export const RATING_OPTIONS = [5, 4, 3, 2, 1];
