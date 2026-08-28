'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const posts = [
  { id: 1, title: 'The Ancient Wisdom of Millets', excerpt: 'Discover the incredible health benefits of traditional millets that our ancestors thrived on.', image: 'https://images.pexels.com/photos/5486525/pexels-photo-5486525.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Nutrition', author: 'Dr. Lakshmi Prasad', date: 'Mar 15, 2026', readTime: '8 min read', slug: 'ancient-wisdom-of-millets' },
  { id: 2, title: 'Forest Honey: Nature\'s Liquid Gold', excerpt: 'Explore the journey of forest honey from tribal harvesters to your table.', image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80', category: 'Wellness', author: 'Priya Sharma', date: 'Mar 10, 2026', readTime: '6 min read', slug: 'forest-honey-medicinal-properties' },
  { id: 3, title: 'Cold Pressed vs Refined Oils', excerpt: 'Understand the critical difference between traditionally cold-pressed oils and refined oils.', image: 'https://images.pexels.com/photos/4110003/pexels-photo-4110003.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Healthy Living', author: 'Chef Arun Kumar', date: 'Mar 5, 2026', readTime: '7 min read', slug: 'cold-pressed-vs-refined-oils' },
  { id: 4, title: 'A2 Ghee: The Golden Elixir', excerpt: 'Learn why A2 ghee made from indigenous cow breeds is superior for your health.', image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=800&q=80', category: 'Nutrition', author: 'Dr. Lakshmi Prasad', date: 'Feb 28, 2026', readTime: '5 min read', slug: 'a2-ghee-benefits' },
  { id: 5, title: 'Traditional Pickling Methods', excerpt: 'Discover the art of traditional Indian pickling without preservatives.', image: 'https://images.pexels.com/photos/8477068/pexels-photo-8477068.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Recipes', author: 'Chef Arun Kumar', date: 'Feb 20, 2026', readTime: '6 min read', slug: 'traditional-pickling-methods' },
  { id: 6, title: 'Lakadong Turmeric: The Golden Spice', excerpt: 'Why this variety from Meghalaya is considered the world\'s best turmeric.', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80', category: 'Wellness', author: 'Priya Sharma', date: 'Feb 15, 2026', readTime: '7 min read', slug: 'lakadong-turmeric-benefits' },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link><span>/</span>
            <span className="text-primary-600 font-medium">Blog</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Stories from Nature&apos;s Kitchen</h1>
            <p className="text-gray-500 mt-2">Tips, recipes, and insights about natural foods, healthy living, and traditional wisdom</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/blog/${post.slug}`} className="group block rounded-2xl overflow-hidden bg-white border border-primary-100 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={post.image} alt={post.title} fill className="object-cover transition-all duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary-700 border-0 text-xs font-semibold">{post.category}</Badge>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-3 pt-3 border-t border-primary-100">
                      <User className="h-3 w-3" /><span>{post.author}</span>
                      <ArrowRight className="h-3 w-3 ml-auto text-primary-400 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
