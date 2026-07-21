'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, GraduationCap, Shield, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const STAFF = [
  { id: 1, name: 'Priya Menon', email: 'priya@naturekart.in', phone: '+91 98451 12340', role: 'Super Admin', dept: 'Management', active: true, joined: '2024-01-15', lastLogin: '2 hours ago' },
  { id: 2, name: 'Arjun Sharma', email: 'arjun@naturekart.in', phone: '+91 99871 43210', role: 'Product Manager', dept: 'Catalog', active: true, joined: '2024-03-20', lastLogin: 'Today' },
  { id: 3, name: 'Sunitha Rao', email: 'sunitha@naturekart.in', phone: '+91 87654 32100', role: 'Order Manager', dept: 'Operations', active: true, joined: '2024-02-10', lastLogin: '1 day ago' },
  { id: 4, name: 'Rahul Iyer', email: 'rahul@naturekart.in', phone: '+91 76543 21000', role: 'Marketing Head', dept: 'Marketing', active: true, joined: '2024-04-05', lastLogin: '3 hours ago' },
  { id: 5, name: 'Meena Pillai', email: 'meena@naturekart.in', phone: '+91 65432 10900', role: 'Support Agent', dept: 'Customer Support', active: true, joined: '2024-05-12', lastLogin: 'Yesterday' },
  { id: 6, name: 'Kiran Nair', email: 'kiran@naturekart.in', phone: '+91 54321 09800', role: 'Content Writer', dept: 'Marketing', active: false, joined: '2024-06-01', lastLogin: '2 weeks ago' },
  { id: 7, name: 'Ananya Krishnan', email: 'ananya@naturekart.in', phone: '+91 43210 98700', role: 'Inventory Analyst', dept: 'Operations', active: true, joined: '2024-07-08', lastLogin: 'Today' },
];

const ROLE_COLORS: Record<string, string> = {
  'Super Admin': 'bg-red-100 text-red-700 border-red-200',
  'Product Manager': 'bg-blue-100 text-blue-700 border-blue-200',
  'Order Manager': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Marketing Head': 'bg-violet-100 text-violet-700 border-violet-200',
  'Support Agent': 'bg-amber-100 text-amber-700 border-amber-200',
  'Content Writer': 'bg-pink-100 text-pink-700 border-pink-200',
  'Inventory Analyst': 'bg-teal-100 text-teal-700 border-teal-200',
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

function getInitials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminStaffPage() {
  const [search, setSearch] = useState('');

  const filtered = STAFF.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div {...fade()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-50 to-cyan-100">
              <GraduationCap className="h-4 w-4 text-teal-600" />
            </div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Team</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="text-sm text-gray-400 mt-0.5">{STAFF.filter(s => s.active).length} active members</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-200/50 rounded-xl h-9 shrink-0">
          <Plus className="h-3.5 w-3.5" /> Add Staff
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade(0.06)} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Staff', value: STAFF.length, bg: 'bg-gray-50', color: 'text-gray-800' },
          { label: 'Active', value: STAFF.filter(s => s.active).length, bg: 'bg-emerald-50', color: 'text-emerald-700' },
          { label: 'Departments', value: [...new Set(STAFF.map(s => s.dept))].length, bg: 'bg-blue-50', color: 'text-blue-700' },
          { label: 'Online Today', value: STAFF.filter(s => s.lastLogin === 'Today' || s.lastLogin.includes('hours')).length, bg: 'bg-teal-50', color: 'text-teal-700' },
        ].map((s) => (
          <div key={s.label} className={cn('rounded-xl border border-gray-200 p-3 text-center', s.bg)}>
            <p className={cn('text-xl font-extrabold', s.color)}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div {...fade(0.1)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, role or department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-gray-200 bg-white focus:border-emerald-400"
          />
        </div>
      </motion.div>

      {/* Staff cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((member, i) => (
          <motion.div key={member.id} {...fade(i * 0.04)}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-700 font-bold text-sm">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{member.name}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">{member.dept}</p>
                  </div>
                  <div className={cn(
                    'h-2 w-2 rounded-full mt-1.5 shrink-0',
                    member.active ? 'bg-emerald-500' : 'bg-gray-300'
                  )} />
                </div>
                <div className="mt-2">
                  <Badge className={cn('text-[10px] border', ROLE_COLORS[member.role] || 'bg-gray-100 text-gray-500')}>
                    <Shield className="h-2.5 w-2.5 mr-1" />
                    {member.role}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail className="h-3 w-3 text-gray-400 shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Phone className="h-3 w-3 text-gray-400 shrink-0" />
                <span>{member.phone}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="text-[11px] text-gray-400">
                Last seen: <span className="font-medium text-gray-600">{member.lastLogin}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
