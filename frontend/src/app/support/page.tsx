'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Plus, MessageCircle, ChevronRight, Clock, CheckCircle, AlertCircle, X, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDate, timeAgo } from '@/lib/utils';

const tickets = [
  { id: 'TKT-001', subject: 'Order not delivered yet', status: 'Open', priority: 'High', lastUpdate: '2026-01-18T10:30:00', messages: 4 },
  { id: 'TKT-002', subject: 'Wrong item received', status: 'In Progress', priority: 'Medium', lastUpdate: '2026-01-17T14:20:00', messages: 6 },
  { id: 'TKT-003', subject: 'Refund not processed', status: 'Resolved', priority: 'Low', lastUpdate: '2026-01-15T09:00:00', messages: 3 },
  { id: 'TKT-004', subject: 'Product damaged on delivery', status: 'Closed', priority: 'Medium', lastUpdate: '2026-01-12T16:45:00', messages: 8 },
];

const statusStyles: Record<string, string> = {
  Open: 'bg-yellow-100 text-yellow-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved: 'bg-green-100 text-green-700',
  Closed: 'bg-gray-100 text-gray-700',
};

const priorityStyles: Record<string, string> = {
  High: 'text-red-600',
  Medium: 'text-orange-600',
  Low: 'text-gray-600',
};

export default function SupportPage() {
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setShowCreateTicket(false);
      setSubmitted(false);
      setSubject('');
      setMessage('');
      setOrderId('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                <Headphones className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
                <p className="text-sm text-gray-500">We're here to help you 24/7</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={() => setShowCreateTicket(!showCreateTicket)}>
                <Plus className="h-4 w-4" /> New Ticket
              </Button>
              <Link href="/support/chat">
                <Button className="gap-2 gradient-primary">
                  <MessageCircle className="h-4 w-4" /> Live Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
            <Link href="/support/chat">
              <Button variant="outline" className="w-full justify-start gap-2"><MessageCircle className="h-4 w-4" /> Start Live Chat</Button>
            </Link>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setShowCreateTicket(true)}>
              <Plus className="h-4 w-4" /> Create Ticket
            </Button>
            <Link href="/returns">
              <Button variant="outline" className="w-full justify-start gap-2"><AlertCircle className="h-4 w-4" /> Return / Replace</Button>
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Contact Us</h3>
            <Separator />
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-medium text-gray-700">Email</p>
              <p className="text-primary-600">support@naturekart.com</p>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-medium text-gray-700">Phone</p>
              <p className="text-primary-600">+91 1800-123-4567</p>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-medium text-gray-700">WhatsApp</p>
              <p className="text-primary-600">+91 98765 43210</p>
            </div>
            <Separator />
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full gap-2 text-green-600 border-green-200 hover:bg-green-50">
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>

        {/* Tickets */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">My Tickets ({tickets.length})</h2>

          {tickets.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-gray-200 bg-white">
              <Headphones className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No tickets yet</h3>
              <p className="mt-2 text-sm text-gray-500">Create a ticket and we'll get back to you</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Link
                    href={`/support/${ticket.id}`}
                    className="block rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">{ticket.subject}</h3>
                          <Badge className={`text-xs ${statusStyles[ticket.status]}`}>{ticket.status}</Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {timeAgo(ticket.lastUpdate)}
                          </span>
                          <span className={priorityStyles[ticket.priority]}>{ticket.priority} priority</span>
                          <span>{ticket.messages} messages</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Create Ticket Form */}
          <AnimatePresence>
            {showCreateTicket && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">Ticket Created!</h3>
                    <p className="mt-2 text-sm text-gray-500">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-900">Create New Ticket</h3>
                    <Separator />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <Input placeholder="Brief description of your issue" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order ID (optional)</label>
                      <Input placeholder="e.g., ORD-45689" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        placeholder="Describe your issue in detail..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateTicket(false)}>Cancel</Button>
                      <Button type="submit" disabled={isSubmitting} className="gap-2 gradient-primary">
                        {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="h-4 w-4" /> Submit Ticket</>}
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
