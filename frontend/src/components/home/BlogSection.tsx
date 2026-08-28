'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'The Ancient Wisdom of Millets: Why Our Grandparents Were Right',
    excerpt: 'Discover the incredible health benefits of traditional millets that our ancestors thrived on. From foxtail to finger millets, learn how these ancient grains can transform your health.',
    image: 'https://images.pexels.com/photos/5486525/pexels-photo-5486525.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Nutrition',
    author: 'Dr. Lakshmi Prasad',
    date: 'Mar 15, 2026',
    readTime: '8 min read',
    slug: 'ancient-wisdom-of-millets',
  },
  {
    id: 2,
    title: "Forest Honey: Nature's Liquid Gold and Its Medicinal Properties",
    excerpt: 'Explore the journey of forest honey from tribal harvesters to your table. Learn about its antibacterial properties, antioxidant content, and how to identify pure raw honey.',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80',
    category: 'Wellness',
    author: 'Priya Sharma',
    date: 'Mar 10, 2026',
    readTime: '6 min read',
    slug: 'forest-honey-medicinal-properties',
  },
  {
    id: 3,
    title: 'Cold Pressed vs Refined Oils: What Your Kitchen Deserves',
    excerpt: 'Understand the critical difference between traditionally cold-pressed oils and refined oils. Why the wood-pressed method matters for your health and cooking.',
    image: 'https://images.pexels.com/photos/4110003/pexels-photo-4110003.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Healthy Living',
    author: 'Chef Arun Kumar',
    date: 'Mar 5, 2026',
    readTime: '7 min read',
    slug: 'cold-pressed-vs-refined-oils',
  },
];

const categoryColors: Record<string, string> = {
  Nutrition: 'bg-primary-600',
  Wellness: 'bg-secondary-600',
  'Healthy Living': 'bg-accent-600',
};

export function BlogSection() {
  return (
    <section className="section-padding bg-white dark:bg-noble-900 overflow-hidden">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="divider-accent" />
              <span className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-[0.15em]">Our Blog</span>
            </div>
            <h2 className="heading-md text-noble-800 dark:text-noble-100">Stories from Nature&apos;s Kitchen</h2>
            <p className="mt-2 text-noble-400 max-w-2xl text-sm">
              Tips, recipes, and insights about natural foods, healthy living, and traditional wisdom
            </p>
          </div>
          <Link href="/blog" className="hidden sm:block mt-4 sm:mt-0">
            <Button variant="outline" className="gap-2 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 group rounded-xl">
              View All Articles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <div className="card-premium overflow-hidden flex flex-col h-full">
                  {/* Image */}
                  <div className="relative h-52 md:h-56 overflow-hidden rounded-[5px] shrink-0">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading={index < 2 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={cn(
                        'text-white border-0 text-xs font-semibold px-3 py-1 shadow-lg',
                        categoryColors[post.category] || 'bg-primary-500'
                      )}>
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6 flex flex-col flex-1">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-noble-400 dark:text-noble-500 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-primary-400" />
                        {post.date}
                      </span>
                      <span className="text-noble-200">·</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-primary-400" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base md:text-lg font-bold text-noble-800 dark:text-noble-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2 leading-snug">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-noble-400 dark:text-noble-500 leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Footer */}
                    <div className="flex items-center gap-2 text-xs text-noble-400 pt-3 border-t border-primary-100/50 dark:border-noble-700">
                      <User className="h-3 w-3 text-primary-400" />
                      <span className="text-noble-500">{post.author}</span>
                      <BookOpen className="h-3 w-3 text-primary-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      <ArrowRight className="h-3 w-3 text-primary-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Accent line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/blog">
            <Button variant="outline" className="gap-2 border-primary-200 text-primary-600 rounded-xl">
              View All Articles
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
