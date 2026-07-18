import type { MetadataRoute } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TODAY = new Date().toISOString().split('T')[0];

// Static blog slugs (sample — in production these would come from the CMS API)
const BLOG_SLUGS = [
  'benefits-of-raw-honey',
  'ancient-grains-why-millets-are-making-a-comeback',
  'cold-pressed-oils-vs-refined-oils',
  'growing-organic-food-in-india-a-complete-guide',
  'ayurvedic-superfoods-for-immunity-boost',
  'tribal-farming-practices-sustainable-agriculture',
  'a2-ghee-benefits-why-gir-cow-ghee-is-precious',
  'lakadong-turmeric-the-golden-spice-of-meghalaya',
];

// Product slugs from the mock data (in production these would come from the API)
const PRODUCT_SLUGS = [
  'wild-forest-honey',
  'organic-foxtail-millet',
  'cold-pressed-coconut-oil',
  'lakadong-turmeric-powder',
  'a2-gir-cow-ghee',
  'traditional-mango-pickle',
  'organic-palm-jaggery',
  'assam-organic-black-tea',
  'organic-raw-cashews',
  'araku-valley-coffee-beans',
  'organic-brown-rice',
  'herbal-ashwagandha-powder',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    {
      url: `${APP_URL}/`,
      lastModified: TODAY,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${APP_URL}/about`,
      lastModified: TODAY,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${APP_URL}/products`,
      lastModified: TODAY,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${APP_URL}/categories`,
      lastModified: TODAY,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${APP_URL}/blog`,
      lastModified: TODAY,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${APP_URL}/cart`,
      lastModified: TODAY,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${APP_URL}/wishlist`,
      lastModified: TODAY,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${APP_URL}/faqs`,
      lastModified: TODAY,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${APP_URL}/farmers`,
      lastModified: TODAY,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${APP_URL}/bulk`,
      lastModified: TODAY,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${APP_URL}/careers`,
      lastModified: TODAY,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${APP_URL}/press`,
      lastModified: TODAY,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${APP_URL}/privacy`,
      lastModified: TODAY,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      url: `${APP_URL}/terms`,
      lastModified: TODAY,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      url: `${APP_URL}/shipping`,
      lastModified: TODAY,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${APP_URL}/returns`,
      lastModified: TODAY,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${APP_URL}/quality`,
      lastModified: TODAY,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${APP_URL}/tracking`,
      lastModified: TODAY,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${APP_URL}/wholesale`,
      lastModified: TODAY,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${APP_URL}/sitemap`,
      lastModified: TODAY,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${APP_URL}/support`,
      lastModified: TODAY,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // Dynamic product pages
  const productPages = PRODUCT_SLUGS.map((slug) => ({
    url: `${APP_URL}/products/${slug}`,
    lastModified: TODAY,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic blog pages
  const blogPages = BLOG_SLUGS.map((slug) => ({
    url: `${APP_URL}/blog/${slug}`,
    lastModified: TODAY,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
