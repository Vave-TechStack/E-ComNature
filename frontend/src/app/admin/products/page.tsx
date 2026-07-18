'use client';

import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

const products = [
  { name: 'Forest Raw Honey (500g)', sku: 'HNY-FRH-500', category: 'Honey', price: 649, stock: 120, status: 'Active' },
  { name: 'Organic Foxtail Millet (1kg)', sku: 'MLT-FOX-1K', category: 'Millets', price: 249, stock: 85, status: 'Active' },
  { name: 'Cold Pressed Coconut Oil (1L)', sku: 'OIL-CCO-1L', category: 'Oils', price: 499, stock: 60, status: 'Active' },
  { name: 'Wood Pressed Sesame Oil (500ml)', sku: 'OIL-SES-500', category: 'Oils', price: 399, stock: 0, status: 'Out of Stock' },
  { name: 'Lakadong Turmeric Powder (250g)', sku: 'SPC-TUR-250', category: 'Spices', price: 349, stock: 45, status: 'Active' },
  { name: 'A2 Gir Cow Ghee (500ml)', sku: 'GHE-A2-500', category: 'Ghee', price: 899, stock: 30, status: 'Active' },
  { name: 'Traditional Mango Pickle (500g)', sku: 'PCL-MNG-500', category: 'Pickles', price: 199, stock: 0, status: 'Discontinued' },
  { name: 'Organic Palm Jaggery (500g)', sku: 'JGR-PLM-500', category: 'Jaggery', price: 179, stock: 95, status: 'Active' },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your product catalog</p>
        </div>
        <Button className="gap-2 gradient-primary"><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search products..." className="pl-10" />
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
        <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500">
          <option>All Categories</option>
          <option>Honey</option><option>Millets</option><option>Oils</option><option>Spices</option><option>Ghee</option><option>Pickles</option><option>Jaggery</option>
        </select>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">SKU</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.sku} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900 max-w-[250px] truncate">{product.name}</td>
                  <td className="py-3 px-4 text-gray-500">{product.sku}</td>
                  <td className="py-3 px-4"><Badge variant="outline">{product.category}</Badge></td>
                  <td className="py-3 px-4 font-medium text-gray-900">{formatPrice(product.price)}</td>
                  <td className="py-3 px-4">
                    <span className={product.stock === 0 ? 'text-red-600 font-medium' : 'text-gray-900'}>{product.stock}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={
                      product.status === 'Active' ? 'bg-green-100 text-green-700' :
                      product.status === 'Out of Stock' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }>{product.status}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
