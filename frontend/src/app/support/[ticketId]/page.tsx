'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Paperclip, Clock, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials, timeAgo } from '@/lib/utils';

const ticketData = {
  id: 'TKT-001',
  subject: 'Order not delivered yet',
  status: 'In Progress',
  priority: 'High',
  createdAt: '2026-01-18T10:30:00',
  orderId: 'ORD-45689',
  messages: [
    { id: 1, from: 'user', name: 'Rajesh Kumar', message: 'My order #ORD-45689 was supposed to be delivered yesterday but it still shows "Out for Delivery". Can you please check?', time: '2026-01-18T10:30:00', isSupport: false },
    { id: 2, from: 'support', name: 'Priya (Support)', message: 'Hi Rajesh! I apologize for the delay. Let me check your order status. It appears there was a slight delay due to high volume in your area. Your package is out for delivery today and should arrive by 6 PM.', time: '2026-01-18T11:15:00', isSupport: true },
    { id: 3, from: 'user', name: 'Rajesh Kumar', message: 'Thank you for checking. I still haven\'t received it yet. It\'s almost 7 PM now. Can you escalate this?', time: '2026-01-18T18:30:00', isSupport: false },
    { id: 4, from: 'support', name: 'Priya (Support)', message: 'I\'ve escalated this to our delivery team. They will contact you within 30 minutes. I apologize for the inconvenience.', time: '2026-01-18T19:00:00', isSupport: true },
  ],
};

export default function TicketDetailPage() {
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSending(false);
    setReply('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container-custom py-4">
          <Link href="/support" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3">
            <ArrowLeft className="h-4 w-4" /> Back to Tickets
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{ticketData.subject}</h1>
              <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                <span>{ticketData.id}</span>
                <Badge className="bg-yellow-100 text-yellow-700">{ticketData.status}</Badge>
                <span className="text-red-600 font-medium">{ticketData.priority} priority</span>
                {ticketData.orderId && <span>Order: {ticketData.orderId}</span>}
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2"><CheckCircle className="h-4 w-4" /> Mark as Resolved</Button>
          </div>
        </div>
      </div>

      <div className="container-custom py-6 max-w-3xl mx-auto space-y-6">
        {/* Messages */}
        <div className="space-y-4">
          {ticketData.messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex gap-3 ${msg.isSupport ? '' : 'flex-row-reverse'}`}
            >
              <Avatar className={`h-8 w-8 ${msg.isSupport ? '' : ''}`}>
                <AvatarFallback className={msg.isSupport ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}>
                  {getInitials(msg.name)}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[80%] ${msg.isSupport ? '' : 'text-right'}`}>
                <div className={`rounded-xl px-4 py-3 ${
                  msg.isSupport
                    ? 'bg-white border border-gray-200'
                    : 'gradient-primary text-white'
                }`}>
                  <p className={`text-xs font-medium mb-1 ${msg.isSupport ? 'text-gray-500' : 'text-white/80'}`}>
                    {msg.name}
                  </p>
                  <p className={`text-sm ${msg.isSupport ? 'text-gray-700' : 'text-white'}`}>{msg.message}</p>
                </div>
                <p className={`mt-1 text-[10px] text-gray-400 ${msg.isSupport ? '' : ''}`}>{timeAgo(msg.time)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <Separator />

        {/* Reply Input */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <textarea
            placeholder="Type your reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
          <div className="mt-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" className="gap-2 text-gray-500"><Paperclip className="h-4 w-4" /> Attach</Button>
            <Button onClick={handleSendReply} disabled={!reply.trim() || isSending} className="gap-2 gradient-primary">
              {isSending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><Send className="h-4 w-4" /> Send Reply</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
