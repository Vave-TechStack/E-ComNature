'use client';

import { motion } from 'framer-motion';
import { Award, Gift, TrendingUp, Star, Trophy, Zap, ArrowRight, Ticket, ShoppingBag, Tag, Percent, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatPrice, cn } from '@/lib/utils';

interface RewardTier {
  name: string;
  points: number;
  icon: string;
  color: string;
  benefits: string[];
}

const tiers: RewardTier[] = [
  { name: 'Silver', points: 0, icon: '🥈', color: 'from-gray-300 to-gray-400', benefits: ['Free standard shipping', 'Birthday voucher ₹200'] },
  { name: 'Gold', points: 5000, icon: '🥇', color: 'from-yellow-400 to-yellow-600', benefits: ['Free express shipping', 'Birthday voucher ₹500', '5% extra cashback'] },
  { name: 'Platinum', points: 15000, icon: '💎', color: 'from-cyan-400 to-blue-600', benefits: ['Free same-day shipping', 'Birthday voucher ₹1000', '10% extra cashback', 'Priority customer support'] },
  { name: 'Elite', points: 50000, icon: '👑', color: 'from-purple-400 to-purple-700', benefits: ['All Platinum benefits', 'Exclusive sale early access', 'Personal shopping assistant', 'Free premium gifts'] },
];

const pointsHistory = [
  { id: 1, action: 'Order #ORD-45689', points: 1250, type: 'earned', date: '2026-01-15' },
  { id: 2, action: 'Product Review - Headphones', points: 100, type: 'earned', date: '2026-01-14' },
  { id: 3, action: 'Referral Bonus - Ananya S.', points: 500, type: 'earned', date: '2026-01-12' },
  { id: 4, action: 'Birthday Bonus', points: 500, type: 'earned', date: '2026-01-10' },
  { id: 5, action: 'Coupon Redemption - ₹200 off', points: -500, type: 'redeemed', date: '2026-01-08' },
  { id: 6, action: 'Flash Sale Bonus Points', points: 250, type: 'earned', date: '2026-01-05' },
  { id: 7, action: 'Order #ORD-45685', points: 890, type: 'earned', date: '2026-01-03' },
  { id: 8, action: 'Cashback Reward', points: 150, type: 'earned', date: '2026-01-01' },
];

const availableRewards = [
  { id: 1, name: '₹200 Off Coupon', points: 500, icon: Ticket, popular: true },
  { id: 2, name: 'Free Shipping Voucher', points: 300, icon: ShoppingBag, popular: false },
  { id: 3, name: '₹500 Off on Honey & Millets', points: 1200, icon: Tag, popular: true },
  { id: 4, name: '10% Discount Coupon', points: 2000, icon: Percent, popular: false },
  { id: 5, name: 'Premium Gift Hamper', points: 5000, icon: Gift, popular: false },
];

export default function RewardsPage() {
  const currentPoints = 8750;
  const lifetimePoints = 12450;
  const nextTier = tiers.findLast((t) => t.points <= currentPoints) || tiers[0];
  const nextTierIndex = tiers.indexOf(nextTier);
  const progressToNext = nextTierIndex < tiers.length - 1
    ? ((currentPoints - nextTier.points) / (tiers[nextTierIndex + 1].points - nextTier.points)) * 100
    : 100;

  return (
    <div className="space-y-8">
      {/* Points Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium text-white/80">Reward Points</span>
              </div>
              <p className="mt-2 text-5xl font-bold tracking-tight">{currentPoints.toLocaleString()}</p>
              <p className="mt-1 text-sm text-white/70">Lifetime earnings: {lifetimePoints.toLocaleString()} points</p>
            </div>
            <div className="text-center">
              <span className="text-4xl">{nextTier.icon}</span>
              <p className="mt-1 text-xs font-medium text-white/80">{nextTier.name} Member</p>
            </div>
          </div>

          {/* Tier Progress */}
          {nextTierIndex < tiers.length - 1 && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-white/80 mb-2">
                <span>{nextTier.name}</span>
                <span className="font-medium">{tiers[nextTierIndex + 1].name}</span>
              </div>
              <Progress value={progressToNext} className="h-2.5 bg-white/20 [&>div]:bg-yellow-400" />
              <p className="mt-1 text-xs text-white/60">
                {(tiers[nextTierIndex + 1].points - currentPoints).toLocaleString()} more points to reach {tiers[nextTierIndex + 1].name}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Benefit Tiers */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Membership Tiers & Benefits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tiers.map((tier, index) => {
            const unlocked = currentPoints >= tier.points;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'relative rounded-xl border-2 p-4 transition-all duration-300',
                  unlocked
                    ? 'border-primary-200 bg-primary-50/50 shadow-sm'
                    : 'border-gray-200 bg-white opacity-70'
                )}
              >
                {unlocked && (
                  <Badge className="absolute right-3 top-3 bg-green-100 text-green-700 border-0 text-[10px]">
                    Unlocked
                  </Badge>
                )}
                <span className="text-2xl">{tier.icon}</span>
                <h4 className="mt-2 text-sm font-semibold text-gray-900">{tier.name}</h4>
                <p className="text-xs text-gray-500">{tier.points.toLocaleString()} points</p>
                <ul className="mt-2 space-y-1">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <CheckIcon className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Available Rewards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Redeem Your Points</h3>
          <Button variant="outline" size="sm" className="gap-2">
            <Gift className="h-4 w-4" /> All Rewards
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableRewards.map((reward, index) => {
            const canRedeem = currentPoints >= reward.points;
            const Icon = reward.icon;
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'relative rounded-xl border p-4 transition-all duration-200',
                  canRedeem
                    ? 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md cursor-pointer'
                    : 'border-gray-100 bg-gray-50 opacity-60'
                )}
              >
                {reward.popular && (
                  <Badge className="absolute right-3 top-3 bg-primary-100 text-primary-700 border-0 text-[10px]">
                    Popular
                  </Badge>
                )}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <h4 className="mt-3 text-sm font-medium text-gray-900">{reward.name}</h4>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-800">{reward.points.toLocaleString()} pts</span>
                  </div>
                  <Button
                    size="sm"
                    variant={canRedeem ? 'default' : 'outline'}
                    disabled={!canRedeem}
                    className={cn('h-8', canRedeem && 'gradient-primary')}
                  >
                    Redeem
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Ways to Earn */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          Ways to Earn Points
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: ShoppingBag, label: 'Every Purchase', detail: '5 points per ₹100 spent' },
            { icon: Star, label: 'Write Reviews', detail: '100 points per review' },
            { icon: Zap, label: 'Flash Sales', detail: '2x points on Flash Sale items' },
            { icon: Trophy, label: 'Refer Friends', detail: '500 points per referral' },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Points History</h3>
          <Button variant="ghost" size="sm" className="gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
          {pointsHistory.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  entry.type === 'earned' ? 'bg-green-50' : 'bg-red-50'
                )}>
                  {entry.type === 'earned'
                    ? <TrendingUp className="h-4 w-4 text-green-600" />
                    : <Gift className="h-4 w-4 text-red-500" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <span className={cn(
                'text-sm font-semibold',
                entry.type === 'earned' ? 'text-green-600' : 'text-red-500'
              )}>
                {entry.type === 'earned' ? '+' : '-'}{entry.points.toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-purple-200 bg-purple-50 p-4">
        <Leaf className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-purple-900">Points never expire!</p>
          <p className="text-xs text-purple-700 mt-0.5">
            Your reward points stay active as long as you make at least one purchase every 12 months.
            Redeem them for discounts, free shipping, and exclusive rewards.
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
