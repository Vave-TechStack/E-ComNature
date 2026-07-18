'use client';

import { useState } from 'react';
import { Search, Filter, Download, Eye, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

const orders = [
  { id: '#ORD-45689', customer: 'Rajesh Kumar', email: 'rajesh@email.com', items: 3, amount: 12499, status: 'Delivered', payment: 'Paid', date: '15 Jan 2026' },
  { id: '#ORD-45690', customer: 'Priya Sharma', email: 'priya@email.com', items: 1, amount: 4599, status: 'Processing', payment: 'Pending', date: '15 Jan 2026' },
  { id: '#ORD-45691', customer: 'Amit Patel', email: 'amit@email.com', items: 5, amount: 28999, status: 'Shipped', payment: 'Paid', date: '14 Jan 2026' },
  { id: '#ORD-45692', customer: 'Sneha Gupta', email: 'sneha@email.com', items: 2, amount: 8999, status: 'Pending', payment: 'Unpaid', date: '14 Jan 2026' },
  { id: '#ORD-45693', customer: 'Vikram Singh', email: 'vikram@email.com', items: 4, amount: 19999, status: 'Delivered', payment: 'Paid', date: '13 Jan 2026' },
  { id: '#ORD-45694', customer: 'Neha Verma', email: 'neha@email.com', items: 1, amount: 2999, status: 'Cancelled', payment: 'Refunded', date: '13 Jan 2026' },
  { id: '#ORD-45695', customer: 'Rahul Jain', email: 'rahul@email.com', items: 6, amount: 45999, status: 'Processing', payment: 'Paid', date: '12 Jan 2026' },
  { id: '#ORD-45696', customer: 'Ananya Reddy', email: 'ananya@email.com', items: 2, amount: 15999, status: 'Delivered', payment: 'Paid', date: '12 Jan 2026' },
  { id: '#ORD-45697', customer: 'Deepak Joshi', email: 'deepak@email.com', items: 3, amount: 7499, status: 'Returned', payment: 'Refunded', date: '11 Jan 2026' },
  { id: '#ORD-45698', customer: 'Kavita Singh', email: 'kavita@email.com', items: 1, amount: 12999, status: 'Shipped', payment: 'Paid', date: '11 Jan 2026' },
];

export default function OrdersPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">Manage all customer orders</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
        <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500">
          <option>All Status</option>
          <option>Pending</option>
          <option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
        </select>
        <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500">
          <option>All Payment</option>
          <option>Paid</option><option>Pending</option><option>Refunded</option><option>Unpaid</option>
        </select>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Items</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Payment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{order.items}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{formatPrice(order.amount)}</td>
                  <td className="py-3 px-4">
                    <Badge className={
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }>{order.status}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className={order.payment === 'Paid' ? 'text-green-700 border-green-200' : order.payment === 'Refunded' ? 'text-gray-500 border-gray-200' : 'text-yellow-700 border-yellow-200'}>{order.payment}</Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{order.date}</td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 p-4">
          <p className="text-sm text-gray-500">Showing 1-10 of 1,245 orders</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
