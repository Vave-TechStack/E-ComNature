'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const posts = {
  'ancient-wisdom-of-millets': {
    title: 'The Ancient Wisdom of Millets: Why Our Grandparents Were Right',
    content: 'Millets have been cultivated in India for over 5,000 years. These ancient grains were a staple in our ancestors\' diets, and modern science is now validating what they knew all along — millets are nutritional powerhouses.\n\nRich in fiber, protein, vitamins, and minerals, millets are naturally gluten-free and have a low glycemic index, making them excellent for diabetics and health-conscious individuals. From foxtail to finger millets, each variety offers unique health benefits.\n\nOur organic millets are grown using traditional farming methods without any chemical pesticides or fertilizers, preserving both the nutritional value and the environment.',
    image: 'https://images.pexels.com/photos/5486525/pexels-photo-5486525.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Nutrition',
    author: 'Dr. Lakshmi Prasad',
    date: 'March 15, 2026',
    readTime: '8 min read',
  },
  'forest-honey-medicinal-properties': {
    title: 'Forest Honey: Nature\'s Liquid Gold and Its Medicinal Properties',
    content: 'Forest honey is not just a sweetener — it\'s a powerful natural medicine. Harvested by tribal communities from wild beehives in deep forests, this raw honey contains enzymes, antioxidants, and antibacterial properties that processed honey lacks.\n\nUnlike commercial honey, raw forest honey is never heated or filtered, preserving its natural goodness. It has been used in traditional medicine for centuries to treat wounds, sore throats, digestive issues, and to boost immunity.\n\nOur honey is sourced directly from tribal harvesters in Araku Valley, ensuring fair compensation and authentic wild forest honey.',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=1200&q=80',
    category: 'Wellness',
    author: 'Priya Sharma',
    date: 'March 10, 2026',
    readTime: '6 min read',
  },
  'cold-pressed-vs-refined-oils': {
    title: 'Cold Pressed vs Refined Oils: What Your Kitchen Deserves',
    content: 'The difference between cold-pressed and refined oils is not just about taste — it\'s about your health. Cold-pressed oils are extracted by pressing oilseeds at low temperatures, preserving their natural nutrients, flavor, and aroma.\n\nRefined oils, on the other hand, are processed using high heat and chemical solvents, stripping away beneficial compounds and potentially creating harmful trans fats.\n\nOur wood-pressed oils use the traditional ghani method, where a wooden pestle slowly crushes oilseeds, keeping temperatures below 40°C. This preserves all the natural goodness.',
    image: 'https://images.pexels.com/photos/4110003/pexels-photo-4110003.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Healthy Living',
    author: 'Chef Arun Kumar',
    date: 'March 5, 2026',
    readTime: '7 min read',
  },
  'a2-ghee-benefits': {
    title: 'A2 Ghee: The Golden Elixir for Health and Wellness',
    content: 'A2 ghee, made from the milk of indigenous Indian cow breeds like Gir and Sahiwal, has been a cornerstone of traditional Indian cooking and Ayurveda for thousands of years. Unlike regular ghee, A2 ghee contains only the A2 beta-casein protein, which is easier to digest and less inflammatory.\n\nThe traditional bilona method involves churning curd to extract butter, which is then simmered to remove water and milk solids. This labor-intensive process preserves the rich nutrient profile, including fat-soluble vitamins A, D, E, and K, as well as butyric acid known for its gut-healing properties.\n\nOur A2 ghee comes from free-grazing Gir cows in Karnataka, ensuring the highest quality and ethical farming practices.',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=1200&q=80',
    category: 'Nutrition',
    author: 'Dr. Lakshmi Prasad',
    date: 'February 28, 2026',
    readTime: '5 min read',
  },
  'traditional-pickling-methods': {
    title: 'Traditional Pickling Methods: Preserving Without Preservatives',
    content: 'Indian pickling is an ancient art that combines science, tradition, and love. Unlike commercial pickles loaded with chemical preservatives, traditional pickles rely on natural preservation methods — salt, oil, and the natural fermentation process.\n\nThe key to a good pickle lies in the quality of ingredients. Our pickles use cold-pressed mustard oil, authentic spices sourced from hill regions, and sun-ripened vegetables. The traditional method involves sun-drying the vegetables, mixing them with roasted spices and salt, and allowing them to mature in earthen pots.\n\nThis slow, natural process not only preserves the vegetables but also enhances their flavor and nutritional value. Our Andhra-style mango pickle follows a family recipe that has been passed down through four generations.',
    image: 'https://images.pexels.com/photos/8477068/pexels-photo-8477068.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Recipes',
    author: 'Chef Arun Kumar',
    date: 'February 20, 2026',
    readTime: '6 min read',
  },
  'lakadong-turmeric-benefits': {
    title: 'Lakadong Turmeric: The Golden Spice of Meghalaya',
    content: 'Lakadong turmeric from the Jaintia Hills of Meghalaya is considered the world\'s finest turmeric variety, with a curcumin content of 7-12% — nearly 3-4 times higher than regular turmeric. Curcumin is the active compound responsible for turmeric\'s powerful anti-inflammatory and antioxidant properties.\n\nWhat makes Lakadong turmeric special is the unique microclimate and soil conditions of the region, combined with traditional farming practices passed down through generations. The turmeric is harvested by hand, sun-dried, and ground without any additives or adulteration.\n\nRegular consumption of Lakadong turmeric has been linked to reduced inflammation, improved joint health, better digestion, and enhanced immunity. Add a pinch to your curries, smoothies, or warm milk for a daily health boost.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80',
    category: 'Wellness',
    author: 'Priya Sharma',
    date: 'February 15, 2026',
    readTime: '7 min read',
  },
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts[slug as keyof typeof posts];

  if (!post) {
    return (
      <div className="min-h-screen bg-natural flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link href="/blog"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link><span>/</span>
            <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
            <span className="text-primary-600 font-medium truncate max-w-[200px]">{post.title}</span>
          </div>
        </div>
      </div>

      <article className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" priority />
          </div>

          <Badge className="bg-primary-100 text-primary-700 border-0 text-xs font-semibold mb-3">{post.category}</Badge>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mt-4 mb-8 pb-6 border-b border-primary-100">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{post.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{post.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.readTime}</span>
          </div>

          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
            {post.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed">{paragraph}</p>
            ))}
          </div>

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-primary-100">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="gap-2 text-gray-500"><Heart className="h-4 w-4" /> Like</Button>
              <Button variant="ghost" size="sm" className="gap-2 text-gray-500"><Share2 className="h-4 w-4" /> Share</Button>
            </div>
            <Link href="/products"><Button size="sm" className="gradient-primary text-white">Shop Natural Foods</Button></Link>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
