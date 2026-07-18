'use client';

import { Search, Filter, MoreHorizontal, Mail, Ban, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials, formatDate } from '@/lib/utils';

const customers = [
  { name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '+91 9876543210', orders: 24, spent: 289000, joined: '2025-06-15', status: 'Active', avatar: '' },
  { name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 9876543211', orders: 18, spent: 156000, joined: '2025-07-22', status: 'Active', avatar: '' },
  { name: 'Amit Patel', email: 'amit@email.com', phone: '+91 9876543212', orders: 32, spent: 425000, joined: '2025-05-10', status: 'Active', avatar: '' },
  { name: 'Sneha Gupta', email: 'sneha@email.com', phone: '+91 9876543213', orders: 5, spent: 35000, joined: '2025-11-05', status: 'Inactive', avatar: '' },
  { name: 'Vikram Singh', email: 'vikram@email.com', phone: '+91 9876543214', orders: 45, spent: 678000, joined: '2025-03-18', status: 'Active', avatar: '' },
  { name: 'Neha Verma', email: 'neha@email.com', phone: '+91 9876543215', orders: 2, spent: 8000, joined: '2026-01-02', status: 'Active', avatar: '' },
  { name: 'Rahul Jain', email: 'rahul@email.com', phone: '+91 9876543216', orders: 12, spent: 98000, joined: '2025-09-14', status: 'Active', avatar: '' },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">View and manage your customers</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search customers..." className="pl-10" />
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => (
          <div key={customer.email} className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback className="bg-primary-100 text-primary-700">{getInitials(customer.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                  <p className="text-xs text-gray-500">{customer.email}</p>
                </div>
              </div>
              <Badge className={customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {customer.status}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-3 text-center text-sm">
              <div>
                <p className="font-semibold text-gray-900">{customer.orders}</p>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">₹{(customer.spent / 1000).toFixed(1)}K</p>
                <p className="text-xs text-gray-500">Spent</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-xs">{formatDate(customer.joined, 'MMM yy')}</p>
                <p className="text-xs text-gray-500">Joined</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1 gap-1"><Mail className="h-3 w-3" /> Email</Button>
              <Button variant="ghost" size="sm" className="flex-1 gap-1"><Star className="h-3 w-3" /> View</Button>
              <Button variant="ghost" size="sm" className="flex-1 gap-1 text-red-500"><Ban className="h-3 w-3" /> Block</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
