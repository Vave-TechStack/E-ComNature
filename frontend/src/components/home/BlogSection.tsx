'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
    category: 'Nutrition',
    author: 'Dr. Lakshmi Prasad',
    date: 'Mar 15, 2026',
    readTime: '8 min read',
    slug: 'ancient-wisdom-of-millets',
  },
  {
    id: 2,
    title: 'Forest Honey: Nature\'s Liquid Gold and Its Medicinal Properties',
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
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
    category: 'Healthy Living',
    author: 'Chef Arun Kumar',
    date: 'Mar 5, 2026',
    readTime: '7 min read',
    slug: 'cold-pressed-vs-refined-oils',
  },
];

export function BlogSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-primary-50/30 overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-14">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1 w-6 rounded-full bg-primary-600" />
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Our Blog</span>
            </div>
            <h2 className="section-title">Stories from Nature&apos;s Kitchen</h2>
            <p className="mt-1.5 text-gray-500 max-w-2xl">
              Tips, recipes, and insights about natural foods, healthy living, and traditional wisdom
            </p>
          </div>
          <Link href="/blog" className="hidden sm:block mt-4 sm:mt-0">
            <Button variant="outline" className="gap-2 border-primary-200 text-primary-700 hover:bg-primary-50 group">
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="rounded-2xl overflow-hidden bg-white border border-primary-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-52 md:h-56 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 backdrop-blur-sm text-primary-700 border-0 text-xs font-semibold">
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-3 border-t border-primary-100">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                      <ArrowRight className="h-3 w-3 ml-auto text-primary-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/blog">
            <Button variant="outline" className="gap-2 border-primary-200 text-primary-700">
              View All Articles
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
