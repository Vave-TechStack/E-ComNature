'use client';

import { useState } from 'react';
import {
  Save, Camera, Loader2, Smartphone, Laptop, Tablet, XCircle, LogOut,
  AlertTriangle, CheckCircle2, ShieldCheck, Mail, Phone, User as UserIcon,
  Calendar, VenetianMask
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: 'Male',
    dob: '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSaving(false);
    setIsEditing(false);
  };

  const displayName = user
    ? (user.displayName || `${user.firstName} ${user.lastName}`.trim())
    : 'Guest';
  const initials = user ? getInitials(displayName) : 'G';

  return (
    <div className="space-y-5">

      {/* Profile card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Personal Information</h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage your name, contact details and more</p>
          </div>
          <Button
            variant={isEditing ? 'ghost' : 'outline'}
            size="sm"
            className={cn(
              'rounded-xl text-xs font-semibold h-8',
              isEditing ? 'text-gray-500' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
            )}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : '✏️ Edit Profile'}
          </Button>
        </div>

        <div className="p-6">
          {/* Avatar + name row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6">
            <div className="relative mx-auto sm:mx-0 shrink-0">
              <Avatar className="h-24 w-24 ring-4 ring-emerald-100">
                <AvatarImage src={user?.profileImage || ''} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-600 text-white text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 rounded-full bg-emerald-600 p-2 text-white shadow-md hover:bg-emerald-700 transition-colors">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              )}
              {/* Online dot */}
              <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-900">{displayName}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{user?.email || '—'}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                {user?.emailVerified && (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1 px-2 py-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Email Verified
                  </Badge>
                )}
                {user?.phoneVerified && (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] gap-1 px-2 py-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Phone Verified
                  </Badge>
                )}
                {user?.role && (
                  <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] px-2 py-0.5">
                    {user.role === 'ROLE_ADMIN' ? '⚡ Admin' : '🛍️ Customer'}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                <UserIcon className="h-3 w-3" /> First Name
              </label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                disabled={!isEditing}
                className="h-11 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-600 focus:border-emerald-400 focus:ring-emerald-200"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                <UserIcon className="h-3 w-3" /> Last Name
              </label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                disabled={!isEditing}
                className="h-11 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-600 focus:border-emerald-400 focus:ring-emerald-200"
                placeholder="Last name"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                <Mail className="h-3 w-3" /> Email
              </label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={!isEditing}
                type="email"
                className="h-11 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-600 focus:border-emerald-400 focus:ring-emerald-200"
                placeholder="Email address"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                <Phone className="h-3 w-3" /> Phone
              </label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={!isEditing}
                className="h-11 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-600 focus:border-emerald-400 focus:ring-emerald-200"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                <VenetianMask className="h-3 w-3" /> Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                disabled={!isEditing}
                className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 disabled:bg-gray-50 disabled:text-gray-600 transition-colors"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                <Calendar className="h-3 w-3" /> Date of Birth
              </label>
              <Input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                disabled={!isEditing}
                className="h-11 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-600 focus:border-emerald-400 focus:ring-emerald-200"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-4 gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="rounded-xl h-10 px-5 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl h-10 px-6 text-sm bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg shadow-emerald-200/50 gap-2"
              >
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Account Security */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <h2 className="text-base font-bold text-gray-900">Account Security</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Protect your account with strong security</p>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Password</p>
              <p className="text-xs text-gray-500 mt-0.5">Last changed 3 months ago</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs h-8 border-gray-200 hover:border-emerald-300 hover:text-emerald-700">
              Change
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:bg-emerald-500 peer-checked:after:translate-x-full" />
            </label>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Active Sessions</h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage devices where you&apos;re signed in</p>
          </div>
          <Button variant="ghost" size="sm" className="text-red-500 gap-1.5 text-xs rounded-xl hover:bg-red-50">
            <LogOut className="h-3.5 w-3.5" /> Sign Out All
          </Button>
        </div>
        <div className="p-4 space-y-2">
          {[
            { device: 'Chrome on Windows 11', DeviceIcon: Laptop, location: 'Bangalore, India', lastActive: 'Active now', isCurrent: true, ip: '192.168.1.100' },
            { device: 'Safari on iPhone 15', DeviceIcon: Smartphone, location: 'Bangalore, India', lastActive: '2 hours ago', isCurrent: false, ip: '192.168.1.101' },
            { device: 'Chrome on iPad', DeviceIcon: Tablet, location: 'Mumbai, India', lastActive: '1 day ago', isCurrent: false, ip: '203.45.67.89' },
          ].map((session, i) => {
            const { DeviceIcon } = session;
            return (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-4 transition-colors',
                  session.isCurrent ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-100 bg-gray-50/30 hover:border-gray-200'
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl shrink-0',
                  session.isCurrent ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                )}>
                  <DeviceIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{session.device}</p>
                    {session.isCurrent && (
                      <Badge className="bg-emerald-500 text-white border-0 text-[10px] px-2 py-0 h-4">Current</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{session.location} · IP: {session.ip}</p>
                  <p className={cn('text-xs mt-0.5 font-medium', session.isCurrent ? 'text-emerald-600' : 'text-gray-400')}>
                    {session.isCurrent ? '🟢 ' : ''}{session.lastActive}
                  </p>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-lg shrink-0"
                    aria-label={`Sign out ${session.device}`}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}

          <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 mt-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              If you notice an unrecognized device, sign it out immediately and change your password.
              All sessions are encrypted and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
