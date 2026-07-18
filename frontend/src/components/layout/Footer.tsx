import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ArrowRight, Leaf, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_NAME } from '@/lib/constants';

const footerLinks = {
  shop: {
    title: 'Shop by Category',
    links: [
      { label: 'Natural Honey', href: '/products?category=honey' },
      { label: 'Millets & Grains', href: '/products?category=millets' },
      { label: 'Cold Pressed Oils', href: '/products?category=oils' },
      { label: 'A2 Ghee & Dairy', href: '/products?category=ghee' },
      { label: 'Natural Spices', href: '/products?category=spices' },
      { label: 'Herbal Products', href: '/products?category=herbal' },
      { label: 'Dry Fruits & Nuts', href: '/products?category=dryfruits' },
      { label: 'Traditional Rice', href: '/products?category=rice' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/support' },
      { label: 'Track Your Order', href: '/tracking' },
      { label: 'Returns & Exchanges', href: '/returns' },
      { label: 'Shipping Information', href: '/shipping' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Wholesale Inquiry', href: '/wholesale' },
      { label: 'Bulk Orders', href: '/bulk' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About NatureKart', href: '/about' },
      { label: 'Our Farmers', href: '/farmers' },
      { label: 'Quality Promise', href: '/quality' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press & Media', href: '/press' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
};

const paymentMethods = [
  { name: 'Visa', icon: '💳' },
  { name: 'Mastercard', icon: '💳' },
  { name: 'UPI', icon: '📱' },
  { name: 'Net Banking', icon: '🏦' },
  { name: 'COD', icon: '💵' },
];

const certifications = [
  { name: 'FSSAI Certified', icon: '✅' },
  { name: 'Organic Certified', icon: '🌿' },
  { name: 'ISO 22000:2018', icon: '📋' },
  { name: 'Fair Trade', icon: '🤝' },
];

// SVG social icons
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

const socialLinks = [
  { icon: FacebookIcon, href: 'https://facebook.com/NatureKart', label: 'Facebook', color: 'hover:bg-blue-100 hover:text-blue-600' },
  { icon: TwitterIcon, href: 'https://x.com/NatureKart', label: 'Twitter', color: 'hover:bg-sky-100 hover:text-sky-500' },
  { icon: InstagramIcon, href: 'https://instagram.com/naturekart', label: 'Instagram', color: 'hover:bg-pink-100 hover:text-pink-600' },
  { icon: YoutubeIcon, href: 'https://youtube.com/@NatureKart', label: 'Youtube', color: 'hover:bg-red-100 hover:text-red-600' },
];

export function Footer() {
  return (
    <footer className="border-t border-primary-100 bg-gray-50">
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary-200">
                <span className="text-lg font-bold text-white">NK</span>
              </div>
              <div>
                <span className="text-xl font-bold gradient-text leading-tight block">{APP_NAME}</span>
                <span className="text-[10px] text-primary-600 font-medium tracking-wider uppercase block -mt-0.5">Pure & Natural Foods</span>
              </div>
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-gray-600 max-w-md">
              India&apos;s most trusted marketplace for pure, natural, and chemical-free food products. 
              We source directly from tribal communities, hill regions, and organic farms — 
              bringing you authentic foods that are good for you, good for farmers, and good for the planet.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>No. 42, MG Road, Indiranagar, Bangalore, Karnataka 560038</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <Phone className="h-4 w-4" />
                </div>
                <span>
                  <a href="tel:+9118001238900" className="hover:text-primary-600 transition-colors">+91 1800-123-8900</a>
                  <span className="text-gray-400 ml-2">(Mon-Sat, 9AM-7PM)</span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <Mail className="h-4 w-4" />
                </div>
                <a href="mailto:hello@naturekart.in" className="hover:text-primary-600 transition-colors">hello@naturekart.in</a>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Follow Us</p>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const SocialIcon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-primary-100 text-gray-400 transition-all ${social.color}`}
                      aria-label={social.label}
                    >
                      <SocialIcon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-all hover:text-primary-600 hover:translate-x-0.5 inline-flex items-center gap-1 group/link"
                    >
                      <ChevronRight className="h-3 w-3 text-primary-300 opacity-0 -ml-4 group-hover/link:opacity-100 group-hover/link:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Bar */}
      <div className="border-t border-primary-100 bg-white">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {certifications.map((cert) => (
                <div key={cert.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span>{cert.icon}</span>
                  <span className="font-medium">{cert.name}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">We accept:</span>
              <div className="flex items-center gap-2">
                {paymentMethods.map((pm) => (
                  <span key={pm.name} className="text-sm" title={pm.name}>{pm.icon}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-100 bg-primary-900">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4 py-5">
          <p className="text-xs text-primary-200">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved. | 
            <Link href="/terms" className="hover:text-white transition-colors ml-1">Terms</Link>
            <span className="mx-1.5">·</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span className="mx-1.5">·</span>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </p>
          <p className="text-xs text-primary-300">
            Made with 🌿 for a healthier India
          </p>
        </div>
      </div>
    </footer>
  );
}
