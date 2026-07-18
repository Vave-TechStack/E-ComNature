'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Phone, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

const initialMessages = [
  { id: 1, from: 'support', text: 'Hello! Welcome to NatureKart Support. How can I help you today?', time: '10:30 AM' },
];

const autoReplies: Record<string, string> = {
  'order': 'I can help you with your order! Could you please share your order ID so I can check the status?',
  'return': 'I understand you want to return an item. You can initiate a return from your orders page, or I can guide you through the process. What seems to be the issue?',
  'refund': 'Regarding refunds, they are typically processed within 5-7 business days after the returned item is received at our warehouse.',
  'shipping': 'Standard delivery takes 5-7 business days. Express delivery is 2-3 business days. Free shipping on orders above ₹499!',
  'default': 'Thank you for your message. One of our support agents will be with you shortly. For urgent issues, please call us at +91 1800-123-4567.',
};

export default function LiveChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), from: 'user', text: input.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Auto-reply simulation
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 2000));
    setIsTyping(false);

    const userText = input.toLowerCase();
    let replyText = autoReplies.default;
    for (const [key, reply] of Object.entries(autoReplies)) {
      if (userText.includes(key)) {
        replyText = reply;
        break;
      }
    }

    const supportMsg = { id: Date.now() + 1, from: 'support', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, supportMsg]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container-custom py-3 flex items-center gap-3">
          <Link href="/support">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary-100 text-primary-700">EN</AvatarFallback>
              </Avatar>
              <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">NatureKart Support</p>
              <p className={`text-xs ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                {isOnline ? 'Online' : 'Away'} • Typically replies in 5 minutes
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <a href="tel:+9118001234567"><Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4" /></Button></a>
            <a href="mailto:support@naturekart.com"><Button variant="ghost" size="icon" className="h-8 w-8"><Mail className="h-4 w-4" /></Button></a>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] sm:max-w-[60%]`}>
                <div className={`rounded-2xl px-4 py-2.5 ${
                  msg.from === 'user' ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 rounded-bl-sm'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
                <p className={`mt-0.5 text-[10px] text-gray-400 px-1 ${msg.from === 'user' ? 'text-right' : ''}`}>
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex justify-start"
              >
                <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3 rounded-bl-sm">
                  <div className="flex items-center gap-1">
                    <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="h-2 w-2 rounded-full bg-gray-400" />
                    <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="h-2 w-2 rounded-full bg-gray-400" />
                    <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="h-2 w-2 rounded-full bg-gray-400" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container-custom py-3 max-w-3xl mx-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 h-11"
            />
            <Button onClick={handleSend} disabled={!input.trim()} className="h-11 w-11 p-0 gradient-primary">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1.5 text-[10px] text-gray-400 text-center">
            By chatting you agree to our Terms of Service. Typical response time: 5 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
