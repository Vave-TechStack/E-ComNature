'use client';

import { useState, useRef, useCallback, DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, RotateCcw, RefreshCw, CheckCircle, Loader2, Package, Camera,
  X, Upload, Image as ImageIcon, AlertTriangle, Truck, Calendar, Clock,
  FileText, Download, Printer, MapPin, ChevronRight, CircleCheck,
  AlertCircle, Info, Shield, Star, ThumbsDown, Ruler, PackageX
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ==================== DATA ====================

const reasonOptions = [
  { value: 'defective', label: 'Product is defective', icon: AlertTriangle, desc: 'Item doesn\'t work or has manufacturing defects' },
  { value: 'wrong', label: 'Wrong item received', icon: PackageX, desc: 'Item doesn\'t match what I ordered' },
  { value: 'damaged', label: 'Damaged in transit', icon: ThumbsDown, desc: 'Item arrived broken or damaged' },
  { value: 'missing', label: 'Missing parts/accessories', icon: Package, desc: 'Package arrived incomplete' },
  { value: 'quality', label: 'Quality not as expected', icon: Star, desc: 'Product quality doesn\'t match description' },
  { value: 'changed', label: 'Changed my mind', icon: RotateCcw, desc: 'No longer need this item (30-day policy)' },
];

const orders = [
  { id: 'ORD-45689', date: '15 Jan 2026', total: 12499, status: 'Delivered', items: 3 },
  { id: 'ORD-45685', date: '10 Jan 2026', total: 8999, status: 'Delivered', items: 2 },
  { id: 'ORD-45680', date: '28 Dec 2025', total: 25999, status: 'Delivered', items: 5 },
];

const orderProducts: Record<string, { id: number; name: string; price: number; image: string }[]> = {
  'ORD-45689': [
    { id: 1, name: 'Forest Raw Honey (500g)', price: 649, image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=200&q=80' },
    { id: 2, name: 'Organic Foxtail Millet (1kg)', price: 249, image: 'https://images.pexels.com/photos/5486525/pexels-photo-5486525.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { id: 3, name: 'Cold Pressed Coconut Oil (1L)', price: 499, image: 'https://images.pexels.com/photos/4110003/pexels-photo-4110003.jpeg?auto=compress&cs=tinysrgb&w=200' },
  ],
  'ORD-45685': [
    { id: 4, name: 'A2 Gir Cow Ghee (500ml)', price: 899, image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=200&q=80' },
    { id: 5, name: 'Lakadong Turmeric (250g)', price: 349, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80' },
  ],
  'ORD-45680': [
    { id: 6, name: 'Traditional Mango Pickle (500g)', price: 199, image: 'https://images.pexels.com/photos/8477068/pexels-photo-8477068.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { id: 7, name: 'Organic Palm Jaggery (500g)', price: 179, image: 'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=200&q=80' },
    { id: 8, name: 'Herbal Green Tea (100g)', price: 349, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&q=80' },
  ],
};

const pickupSlots = [
  { day: 'Tomorrow', date: '17 Jan', slots: ['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM'] },
  { day: 'Saturday', date: '18 Jan', slots: ['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM'] },
  { day: 'Monday', date: '20 Jan', slots: ['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM'] },
];

const refundTimelineSteps = [
  { label: 'Request Submitted', desc: 'We\'ve received your request', duration: 'Just now', icon: FileText },
  { label: 'Item Picked Up', desc: 'Courier collects from your address', duration: '1-2 days', icon: Truck },
  { label: 'Quality Check', desc: 'Item inspected at our facility', duration: '2-3 days', icon: CheckCircle },
  { label: 'Refund Initiated', desc: 'Amount credited to your account', duration: '3-5 business days', icon: Shield },
];

const returnStatusData = {
  id: 'RET-0042',
  type: 'Return' as const,
  status: 'Item Picked Up',
  items: ['Forest Raw Honey (500g)', 'Organic Foxtail Millet (1kg)'],
  refundAmount: 898,
  estimatedRefund: '22 Jan 2026',
  timeline: [
    { label: 'Request Submitted', date: '14 Jan 2026, 10:30 AM', completed: true },
    { label: 'Item Picked Up', date: '15 Jan 2026, 2:00 PM', completed: true },
    { label: 'Quality Check', date: 'Expected by 18 Jan', completed: false },
    { label: 'Refund Initiated', date: 'Expected by 22 Jan', completed: false },
  ],
};

// ==================== COMPONENTS ====================

function ImageUpload({ images, setImages }: { images: string[]; setImages: (v: string[]) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setImages([...images, ev.target.result as string]);
      };
      reader.readAsDataURL(f);
    });
  }, [images, setImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setImages([...images, ev.target.result as string]);
      };
      reader.readAsDataURL(f);
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images (Optional)</label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all',
          isDragging ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-gray-400 bg-white'
        )}
      >
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
        <Upload className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 5MB each (max 5 images)</p>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
              <Image src={img} alt={`Upload ${i + 1}`} fill className="object-cover" sizes="80px" />
              <button
                onClick={(e) => { e.stopPropagation(); setImages(images.filter((_, idx) => idx !== i)); }}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < current;
        const isCurrent = stepNum === current;
        return (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300',
              isCompleted ? 'bg-primary-600 text-white' :
              isCurrent ? 'bg-primary-700 text-white shadow-md shadow-primary-200' :
              'bg-noble-100 text-noble-400'
            )}>
              {isCompleted ? <CheckCircle className="h-4 w-4" /> : stepNum}
            </div>
            {i < total - 1 && (
              <div className="flex-1 h-0.5 rounded-full bg-gray-100">
                <div className={cn(
                  'h-full rounded-full transition-all duration-500',
                  isCompleted ? 'bg-primary-500 w-full' : 'bg-noble-200 w-0'
                )} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ==================== MAIN PAGE ====================

export default function ReturnsPage() {
  const [step, setStep] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [requestType, setRequestType] = useState<'return' | 'replacement' | null>(null);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedPickupDay, setSelectedPickupDay] = useState('');
  const [selectedPickupSlot, setSelectedPickupSlot] = useState('');
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const toggleProduct = (id: number) => {
    setSelectedProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleGenerateLabel = async () => {
    setIsGeneratingLabel(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsGeneratingLabel(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  // ===== Submitted State =====
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50/30 via-white to-white">
        <div className="container-custom py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-lg text-center"
          >
            {/* Animated Checkmark */}
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 120 120">
                <motion.circle
                  cx="60" cy="60" r="55"
                  fill="none" stroke="#3D7A3D" strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.2 }}
                />
              </svg>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
              >
                <CheckCircle className="h-14 w-14 text-primary-600" />
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-2xl font-bold text-gray-900"
            >
              Request Submitted Successfully! 🎉
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-2 text-gray-500"
            >
              {requestType === 'return' ? 'Return' : 'Replacement'} request for <span className="font-semibold text-gray-900">{selectedProducts.length}</span> item(s) has been submitted.
              We&apos;ll review it within <span className="font-semibold text-gray-900">24-48 hours</span>.
            </motion.p>

            {/* Request ID */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-200 px-5 py-2"
            >
              <FileText className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Request ID: RET-{Date.now().toString(36).toUpperCase()}</span>
            </motion.div>

            {/* Refund Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-left"
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary-600" /> Refund Timeline
              </h3>
              <div className="space-y-4">
                {refundTimelineSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="flex gap-3">
                      <div className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        i === 0 ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-medium', i === 0 ? 'text-gray-900' : 'text-gray-500')}>{step.label}</p>
                        <p className="text-xs text-gray-400">{step.desc}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{step.duration}</p>
                      </div>
                      {i === 0 && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Return Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-4"
            >
              <Button
                variant="outline"
                className="w-full gap-2 border-primary-200 text-primary-700 hover:bg-primary-50 h-12"
                onClick={handleGenerateLabel}
                disabled={isGeneratingLabel}
              >
                {isGeneratingLabel ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Generating Label...</>
                ) : (
                  <><Download className="h-5 w-5" /> Download Return Label (PDF)</>
                )}
              </Button>
            </motion.div>

            {/* Print Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              className="mt-2"
            >
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-gray-500"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" /> Print Label
              </Button>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link href="/orders">
                <Button variant="outline" className="w-full border-gray-300 gap-2">
                  <Package className="h-4 w-4" /> View Orders
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full gradient-primary gap-2 shadow-lg shadow-primary-200">
                  <ArrowLeft className="h-4 w-4" /> Continue Shopping
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ===== Status Tracking View =====
  if (showStatus) {
    const status = returnStatusData;
    return (
      <div className="min-h-screen bg-noble-50">
        <div className="border-b border-noble-200 bg-white">
          <div className="container-custom py-6">
            <button onClick={() => setShowStatus(false)} className="inline-flex items-center gap-2 text-sm text-noble-500 hover:text-noble-900 mb-2">
              <ArrowLeft className="h-4 w-4" /> Back to Returns
            </button>
            <h1 className="text-2xl font-heading text-noble-900">Return Status</h1>
            <p className="mt-1 text-sm text-noble-500">Request #{status.id}</p>
          </div>
        </div>
        <div className="container-custom py-6 max-w-2xl mx-auto space-y-6">
          {/* Status Card */}
          <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="bg-primary-100 text-primary-700 border-primary-200 mb-2">{status.status}</Badge>
                <h2 className="text-lg font-bold text-gray-900">{status.type} Request</h2>
                <p className="text-sm text-gray-500 mt-1">{status.items.join(', ')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Refund Amount</p>
                <p className="text-2xl font-bold text-primary-700">₹{status.refundAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Est. by {status.estimatedRefund}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-noble-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-noble-900 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-600" /> Tracking Timeline
            </h3>
            <div className="space-y-0">
              {status.timeline.map((t, i) => (
                <div key={t.label} className="flex gap-4 pb-6 last:pb-0 relative">
                  {i < status.timeline.length - 1 && (
                    <div className={cn(
                      'absolute left-[15px] top-8 w-0.5 h-full',
                      t.completed ? 'bg-primary-300' : 'bg-noble-200'
                    )} />
                  )}
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full z-10',
                    t.completed ? 'bg-primary-100 text-primary-600' : 'bg-noble-100 text-noble-400'
                  )}>
                    {t.completed ? <CheckCircle className="h-4 w-4" /> : <div className="h-3 w-3 rounded-full bg-noble-300" />}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className={cn('text-sm font-medium', t.completed ? 'text-noble-900' : 'text-noble-500')}>{t.label}</p>
                    <p className={cn('text-xs', t.completed ? 'text-noble-500' : 'text-noble-400')}>{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleGenerateLabel} disabled={isGeneratingLabel}>
              {isGeneratingLabel ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Label
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Link href="/support" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <AlertCircle className="h-4 w-4" /> Need Help?
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===== Main Form =====
  return (
    <div className="min-h-screen bg-noble-50">
      {/* Header */}
      <div className="border-b border-noble-200 bg-white">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/support" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2">
                <ArrowLeft className="h-4 w-4" /> Back to Support
              </Link>
            <h1 className="text-2xl font-heading text-noble-900">Return / Replace Items</h1>
            <p className="mt-1 text-sm text-noble-500">Step {step} of 5</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary-600 gap-1.5" onClick={() => setShowStatus(true)}>
              <Package className="h-4 w-4" /> Track Existing
            </Button>
          </div>

          {/* Step Progress */}
          <div className="mt-6">
            <StepProgress current={step} total={5} />
          </div>
        </div>
      </div>

      <div className="container-custom py-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ===== STEP 1: Request Type ===== */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="text-lg font-heading text-noble-900">What would you like to do?</h2>
                <p className="text-sm text-noble-500 mt-1">Select the type of request you want to initiate</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setRequestType('return'); setStep(2); }}
                  className={cn(
                    'group relative rounded-2xl border-2 p-6 text-center transition-all hover:shadow-lg',
                    requestType === 'return' ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-noble-200 bg-white hover:border-primary-300 hover:-translate-y-0.5'
                  )}
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-200">
                    <RotateCcw className="h-7 w-7 text-white" />
                  </div>
                  <p className="mt-4 text-lg font-heading text-noble-900">Return</p>
                  <p className="mt-1 text-xs text-noble-500 leading-relaxed">Get a full refund for your purchase. Free pickup from your address.</p>
                  <Badge className="mt-3 bg-green-50 text-green-700 border-green-200">30-Day Policy</Badge>
                </button>
                <button
                  onClick={() => { setRequestType('replacement'); setStep(2); }}
                  className={cn(
                    'group relative rounded-2xl border-2 p-6 text-center transition-all hover:shadow-lg',
                    requestType === 'replacement' ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-noble-200 bg-white hover:border-primary-300 hover:-translate-y-0.5'
                  )}
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg shadow-accent-200">
                    <RefreshCw className="h-7 w-7 text-white" />
                  </div>
                  <p className="mt-4 text-lg font-heading text-noble-900">Replacement</p>
                  <p className="mt-1 text-xs text-noble-500 leading-relaxed">Exchange with a new identical item. Subject to stock availability.</p>
                  <Badge className="mt-3 bg-accent-50 text-accent-700 border-accent-200">Free Exchange</Badge>
                </button>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-primary-50 border border-primary-100 p-4">
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary-800">Return Policy</p>
                  <p className="text-xs text-primary-600 mt-0.5">Items can be returned within 30 days of delivery in original condition. Replacement is subject to stock availability. Refunds are processed within 5-7 business days after pickup.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 2: Select Order ===== */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
              <h2 className="text-lg font-heading text-noble-900">Select Order</h2>
              <p className="text-sm text-noble-500 mt-1">Choose the order containing items you want to {requestType}</p>
              </div>
              <div className="space-y-3">
                {orders.filter(o => o.status === 'Delivered').map((order) => (
                  <button
                    key={order.id}
                    onClick={() => { setSelectedOrder(order.id); setSelectedProducts([]); setStep(3); }}
                    className={cn(
                      'w-full text-left rounded-xl border-2 p-4 transition-all hover:shadow-md',
                      selectedOrder === order.id ? 'border-primary-500 bg-primary-50' : 'border-noble-200 bg-white hover:border-noble-300'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-noble-900">{order.id}</p>
                        <p className="text-xs text-noble-500">{order.date} · {order.items} items</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-bold text-noble-900">₹{order.total.toLocaleString()}</p>
                        <ChevronRight className="h-4 w-4 text-noble-400" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 3: Select Products ===== */}
          {step === 3 && selectedOrder && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Select Items</h2>
                  <p className="text-sm text-gray-500 mt-1">Choose which items to {requestType}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="text-primary-600">Change Order</Button>
              </div>
              <div className="space-y-3">
                {(orderProducts[selectedOrder] || []).map((p) => (
                  <label
                    key={p.id}
                    className={cn(
                      'flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all',
                      selectedProducts.includes(p.id) ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(p.id)}
                      onChange={() => toggleProduct(p.id)}
                      className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-primary-50">
                      <Image src={p.image} alt={p.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">Order {selectedOrder}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">₹{p.price.toLocaleString()}</p>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                <Button onClick={() => setStep(4)} disabled={selectedProducts.length === 0} className="flex-[2] gradient-primary">
                  Continue to Reason
                </Button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 4: Reason & Details ===== */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Reason & Details</h2>
                <p className="text-sm text-gray-500 mt-1">Help us understand why you're {requestType === 'return' ? 'returning' : 'replacing'} this item</p>
              </div>

              {/* Reason Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for {requestType}</label>
                <div className="space-y-2">
                  {reasonOptions.map((r) => {
                    const Icon = r.icon;
                    const isSelected = reason === r.value;
                    return (
                      <label
                        key={r.value}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all',
                          isSelected ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                        )}
                      >
                        <input type="radio" name="reason" value={r.value} checked={isSelected} onChange={(e) => setReason(e.target.value)} className="mt-1 h-4 w-4 text-primary-600" />
                        <div className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                          isSelected ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{r.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Please provide more details about the issue... (optional)"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none transition-all"
                />
              </div>

              {/* Image Upload */}
              <ImageUpload images={images} setImages={setImages} />

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">Back</Button>
                <Button onClick={() => setStep(5)} disabled={!reason} className="flex-[2] gradient-primary">
                  Continue to Pickup
                </Button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 5: Pickup & Submit ===== */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Schedule Pickup</h2>
                <p className="text-sm text-gray-500 mt-1">Choose a convenient time for free pickup from your address</p>
              </div>

              {/* Pickup Address */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pickup Address</p>
                    <p className="text-xs text-gray-500">42, MG Road, Indiranagar, Bangalore - 560038</p>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary-600 mt-1">Change Address</Button>
                  </div>
                </div>
              </div>

              {/* Pickup Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Available Slots</label>
                <div className="space-y-4">
                  {pickupSlots.map((day) => (
                    <div key={day.date}>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary-600" />
                        <span className="text-sm font-semibold text-gray-800">{day.day}</span>
                        <span className="text-xs text-gray-400">{day.date}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {day.slots.map((slot) => {
                          const isSelected = selectedPickupDay === day.date && selectedPickupSlot === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => { setSelectedPickupDay(day.date); setSelectedPickupSlot(slot); }}
                              className={cn(
                                'flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all',
                                isSelected ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                              )}
                            >
                              <Clock className="h-4 w-4" />
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  {selectedProducts.map(id => {
                    const allProducts = Object.values(orderProducts).flat();
                    const product = allProducts.find(p => p.id === id);
                    if (!product) return null;
                    return (
                      <div key={id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{product.name}</span>
                        <span className="font-medium text-gray-900">₹{product.price.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Estimated Refund</span>
                  <span className="text-lg font-bold text-primary-700">
                    ₹{selectedProducts.reduce((sum, id) => {
                      const allProducts = Object.values(orderProducts).flat();
                      const p = allProducts.find(p => p.id === id);
                      return sum + (p?.price || 0);
                    }, 0).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Refund processed within 5-7 business days after pickup</p>
              </div>

              {/* Submit */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(4)} className="flex-1">Back</Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedPickupSlot || isSubmitting}
                  className="flex-[2] gradient-primary gap-2 shadow-lg shadow-primary-200"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                  ) : (
                    <><CheckCircle className="h-4 w-4" /> Submit {requestType === 'return' ? 'Return' : 'Replacement'} Request</>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
