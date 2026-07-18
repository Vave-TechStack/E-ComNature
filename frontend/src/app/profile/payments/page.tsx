'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Plus, Trash2, Shield, Wallet, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SavedCard {
  id: number;
  last4: string;
  brand: string;
  expiry: string;
  holderName: string;
  isDefault: boolean;
  type: 'credit' | 'debit';
}

interface SavedUPI {
  id: number;
  upiId: string;
  isDefault: boolean;
}

const savedCards: SavedCard[] = [
  { id: 1, last4: '4532', brand: 'Visa', expiry: '12/27', holderName: 'Rajesh Kumar', isDefault: true, type: 'credit' },
  { id: 2, last4: '8876', brand: 'Mastercard', expiry: '08/26', holderName: 'Rajesh Kumar', isDefault: false, type: 'debit' },
  { id: 3, last4: '2190', brand: 'RuPay', expiry: '03/28', holderName: 'Rajesh Kumar', isDefault: false, type: 'credit' },
];

const savedUPIs: SavedUPI[] = [
  { id: 1, upiId: 'rajesh.kumar@okhdfcbank', isDefault: true },
  { id: 2, upiId: 'rajesh.kumar@paytm', isDefault: false },
];

const cardBrandColors: Record<string, string> = {
  Visa: 'from-blue-600 to-blue-800',
  Mastercard: 'from-orange-500 to-red-600',
  RuPay: 'from-emerald-500 to-teal-600',
  Amex: 'from-purple-600 to-indigo-700',
};

export default function PaymentsPage() {
  const [cards, setCards] = useState(savedCards);
  const [upis, setUpis] = useState(savedUPIs);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showUPIForm, setShowUPIForm] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', holderName: '', isDefault: false });
  const [upiForm, setUpiForm] = useState({ upiId: '', isDefault: false });

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    const last4 = cardForm.number.slice(-4);
    const brand = cardForm.number.startsWith('4') ? 'Visa' :
      cardForm.number.startsWith('5') ? 'Mastercard' : 'RuPay';
    const newCard: SavedCard = {
      id: Date.now(), last4, brand, expiry: cardForm.expiry,
      holderName: cardForm.holderName, isDefault: cardForm.isDefault, type: 'credit',
    };
    if (cardForm.isDefault) setCards(cards.map(c => ({ ...c, isDefault: false })));
    setCards([...cards, newCard]);
    setCardForm({ number: '', expiry: '', cvv: '', holderName: '', isDefault: false });
    setShowCardForm(false);
  };

  const addUPI = (e: React.FormEvent) => {
    e.preventDefault();
    const newUPI: SavedUPI = { id: Date.now(), upiId: upiForm.upiId, isDefault: upiForm.isDefault };
    if (upiForm.isDefault) setUpis(upis.map(u => ({ ...u, isDefault: false })));
    setUpis([...upis, newUPI]);
    setUpiForm({ upiId: '', isDefault: false });
    setShowUPIForm(false);
  };

  const deleteCard = (id: number) => setCards(cards.filter(c => c.id !== id));
  const deleteUPI = (id: number) => setUpis(upis.filter(u => u.id !== id));

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div className="space-y-8">
      {/* Saved Cards Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Saved Cards</h2>
            <p className="text-sm text-gray-500">{cards.length} card{cards.length !== 1 ? 's' : ''} saved</p>
          </div>
          <Button size="sm" className="gap-2 gradient-primary" onClick={() => setShowCardForm(true)}>
            <Plus className="h-4 w-4" /> Add Card
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'relative overflow-hidden rounded-xl p-4 text-white shadow-md',
                'bg-gradient-to-br',
                cardBrandColors[card.brand] || 'from-gray-700 to-gray-900'
              )}
            >
              {card.isDefault && (
                <Badge className="absolute right-3 top-3 bg-white/20 text-white border-0 backdrop-blur-sm">
                  Default
                </Badge>
              )}
              <div className="flex justify-between items-start mb-6">
                <CreditCard className="h-6 w-6 opacity-80" />
                <button
                  onClick={() => deleteCard(card.id)}
                  className="rounded-full p-1 hover:bg-white/10 transition-colors"
                  aria-label={`Delete ${card.brand} ending in ${card.last4}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-lg tracking-wider font-mono">
                •••• •••• •••• {card.last4}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs opacity-80">
                <div>
                  <p>Card Holder</p>
                  <p className="font-medium text-sm opacity-100">{card.holderName}</p>
                </div>
                <div className="text-right">
                  <p>Expires</p>
                  <p className="font-medium text-sm opacity-100">{card.expiry}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <Shield className="h-3 w-3 opacity-60" />
                <span className="text-[10px] opacity-60">{card.type === 'credit' ? 'Credit Card' : 'Debit Card'}</span>
                <span className="ml-auto text-xs font-semibold">{card.brand}</span>
              </div>
            </motion.div>
          ))}

          {/* Empty card state */}
          {cards.length === 0 && (
            <div className="col-span-full flex flex-col items-center py-12 text-center">
              <CreditCard className="h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No saved cards yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Card Form */}
      <AnimatePresence>
        {showCardForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={addCard} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Add New Card</h3>
                <Button type="button" variant="ghost" size="icon" onClick={() => setShowCardForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <Input
                    value={cardForm.number}
                    onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    required
                    maxLength={19}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
                  <Input
                    value={cardForm.holderName}
                    onChange={(e) => setCardForm({ ...cardForm, holderName: e.target.value })}
                    placeholder="Rajesh Kumar"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                    <Input
                      value={cardForm.expiry}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (val.length > 2) setCardForm({ ...cardForm, expiry: val.slice(0, 2) + '/' + val.slice(2) });
                        else setCardForm({ ...cardForm, expiry: val });
                      }}
                      placeholder="MM/YY"
                      required
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <Input
                      type="password"
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                      placeholder="•••"
                      required
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cardForm.isDefault}
                  onChange={(e) => setCardForm({ ...cardForm, isDefault: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Set as default payment method
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowCardForm(false)}>Cancel</Button>
                <Button type="submit" className="gradient-primary">Add Card</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved UPI Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Saved UPI IDs</h2>
            <p className="text-sm text-gray-500">{upis.length} UPI ID{upis.length !== 1 ? 's' : ''} saved</p>
          </div>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowUPIForm(true)}>
            <Plus className="h-4 w-4" /> Add UPI
          </Button>
        </div>

        <div className="space-y-3">
          {upis.map((upi) => (
            <motion.div
              key={upi.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{upi.upiId}</p>
                  {upi.isDefault && <Badge className="mt-0.5 bg-green-100 text-green-700 border-0 text-[10px]">Default</Badge>}
                </div>
              </div>
              <button
                onClick={() => deleteUPI(upi.id)}
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                aria-label={`Delete UPI ${upi.upiId}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
          {upis.length === 0 && (
            <div className="flex flex-col items-center py-8 text-center">
              <Smartphone className="h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No UPI IDs saved yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Add UPI Form */}
      <AnimatePresence>
        {showUPIForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={addUPI} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Add UPI ID</h3>
                <Button type="button" variant="ghost" size="icon" onClick={() => setShowUPIForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <Input
                  value={upiForm.upiId}
                  onChange={(e) => setUpiForm({ ...upiForm, upiId: e.target.value })}
                  placeholder="username@okhdfcbank"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">Enter your UPI ID (e.g., name@bankname)</p>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={upiForm.isDefault}
                  onChange={(e) => setUpiForm({ ...upiForm, isDefault: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Set as default payment method
              </label>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowUPIForm(false)}>Cancel</Button>
                <Button type="submit" className="gradient-primary">Add UPI</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">NatureKart Wallet</h2>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg">
              <Wallet className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-3xl font-bold text-gray-900">₹1,250.00</p>
              <p className="mt-1 text-xs text-gray-400">
                <span className="text-green-600 font-medium">+₹500</span> from cashback this month
              </p>
            </div>
            <Button className="gradient-primary">Add Money</Button>
            <Button variant="outline">Withdraw</Button>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">Your payment info is secure</p>
          <p className="text-xs text-blue-700 mt-0.5">
            We use 256-bit encryption and never store full card numbers. All transactions are PCI-DSS compliant.
          </p>
        </div>
      </div>
    </div>
  );
}
