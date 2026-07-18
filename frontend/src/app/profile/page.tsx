'use client';

import { useState } from 'react';
import { Save, Camera, Loader2, Smartphone, Laptop, Tablet, XCircle, LogOut, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh@email.com',
    phone: '+91 9876543210', gender: 'Male', dob: '1990-06-15',
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
        <Button variant={isEditing ? 'ghost' : 'outline'} size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="text-center">
          <div className="relative mx-auto w-fit">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary-100 text-primary-700 text-xl">{getInitials(form.firstName + ' ' + form.lastName)}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 rounded-full bg-primary-600 p-2 text-white shadow-md hover:bg-primary-700">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-2 text-sm font-medium text-gray-900">{form.firstName} {form.lastName}</p>
          <p className="text-xs text-gray-500">{form.email}</p>
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} disabled={!isEditing} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} disabled={!isEditing} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!isEditing} type="email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={!isEditing} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} disabled={!isEditing}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500">
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} disabled={!isEditing} />
            </div>
          </div>
          {isEditing && (
            <div className="flex justify-end pt-2">
              <Button onClick={handleSave} disabled={isSaving} className="gap-2 gradient-primary">
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Security</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Password</p>
              <p className="text-xs text-gray-500">Last changed 3 months ago</p>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500">Add an extra layer of security</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary-600 peer-checked:after:translate-x-full" />
            </label>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Active Sessions / Device Management */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Active Sessions</h3>
          <Button variant="ghost" size="sm" className="text-red-500 gap-1.5 text-xs">
            <LogOut className="h-3.5 w-3.5" /> Sign Out All
          </Button>
        </div>
        <p className="text-xs text-gray-500 mb-3">Manage devices where you&apos;re currently logged in</p>
        <div className="space-y-3">
          {[
            { device: 'Chrome on Windows 11', type: Laptop, icon: '🖥️', location: 'Bangalore, India', lastActive: 'Active now', isCurrent: true, ip: '192.168.1.100' },
            { device: 'Safari on iPhone 15', type: Smartphone, icon: '📱', location: 'Bangalore, India', lastActive: '2 hours ago', isCurrent: false, ip: '192.168.1.101' },
            { device: 'Chrome on iPad', type: Tablet, icon: '📱', location: 'Mumbai, India', lastActive: '1 day ago', isCurrent: false, ip: '203.45.67.89' },
          ].map((session, i) => {
            const DeviceIcon = session.type;
            return (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-colors">
                <div className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg shrink-0',
                  session.isCurrent ? 'bg-primary-50' : 'bg-gray-50'
                )}>
                  <DeviceIcon className={cn('h-4 w-4', session.isCurrent ? 'text-primary-600' : 'text-gray-400')} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{session.device}</p>
                    {session.isCurrent && (
                      <Badge className="bg-primary-100 text-primary-700 border-0 text-[10px]">Current</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{session.location} · IP: {session.ip}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    <span className={cn(session.isCurrent ? 'text-green-600' : 'text-gray-400')}>
                      {session.isCurrent ? '🟢 ' : ''}{session.lastActive}
                    </span>
                  </p>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 shrink-0"
                    aria-label={`Sign out from ${session.device}`}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Security Tips */}
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 p-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            If you notice any unrecognized device, sign it out immediately and change your password.
            All sessions are encrypted and monitored for suspicious activity.
          </p>
        </div>
      </div>
    </div>
  );
}
