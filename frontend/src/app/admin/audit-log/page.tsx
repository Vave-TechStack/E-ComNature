'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Eye, Clock, User, Shield,
  Activity, LogIn, Edit, Trash2, Plus, Ban, CheckCircle,
  X, ArrowUpDown, ChevronLeft, ChevronRight,
  FileText, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ==================== TYPES ====================

interface AuditEntry {
  id: number;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// ==================== MOCK DATA ====================

const auditLogs: AuditEntry[] = [
  { id: 1, timestamp: '2026-01-16T10:45:00Z', actor: 'admin@naturekart.com', actorRole: 'Super Admin', action: 'User Login', resource: 'Authentication', resourceId: 'admin@naturekart.com', details: 'Successful login from Chrome 120 on Windows 11', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', status: 'success', severity: 'low' },
  { id: 2, timestamp: '2026-01-16T10:30:00Z', actor: 'admin@naturekart.com', actorRole: 'Super Admin', action: 'Order Status Change', resource: 'Order', resourceId: 'ORD-45695', details: 'Changed status from Processing to Shipped', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0', status: 'success', severity: 'medium' },
  { id: 3, timestamp: '2026-01-16T10:15:00Z', actor: 'moderator@naturekart.com', actorRole: 'Moderator', action: 'Product Updated', resource: 'Product', resourceId: 'HNY-FRH-500', details: 'Updated price from ₹699 to ₹649. Changed stock from 100 to 120.', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0', status: 'success', severity: 'medium' },
  { id: 4, timestamp: '2026-01-16T09:50:00Z', actor: 'system', actorRole: 'System', action: 'Failed Login Attempt', resource: 'Authentication', resourceId: 'unknown@email.com', details: 'Failed login attempt with incorrect password (3rd attempt)', ipAddress: '45.33.32.156', userAgent: 'Unknown', status: 'failure', severity: 'high' },
  { id: 5, timestamp: '2026-01-16T09:30:00Z', actor: 'rajesh@email.com', actorRole: 'Customer', action: 'Account Locked', resource: 'User Account', resourceId: 'rajesh@email.com', details: 'Account locked due to 5 failed login attempts. Automated security measure.', ipAddress: '45.33.32.156', userAgent: 'Chrome Mobile', status: 'failure', severity: 'critical' },
  { id: 6, timestamp: '2026-01-16T09:00:00Z', actor: 'admin@naturekart.com', actorRole: 'Super Admin', action: 'User Impersonated', resource: 'User Account', resourceId: 'rajesh@email.com', details: 'Admin impersonated customer account for troubleshooting. IP logged.', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0', status: 'success', severity: 'high' },
  { id: 7, timestamp: '2026-01-16T08:45:00Z', actor: 'admin@naturekart.com', actorRole: 'Super Admin', action: 'Coupon Created', resource: 'Coupon', resourceId: 'WELCOME20', details: 'Created new coupon: 20% off on first order. Valid until 28 Feb 2026.', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0', status: 'success', severity: 'low' },
  { id: 8, timestamp: '2026-01-16T08:30:00Z', actor: 'moderator@naturekart.com', actorRole: 'Moderator', action: 'Review Moderated', resource: 'Product Review', resourceId: 'REV-0042', details: 'Approved pending review for A2 Ghee (500ml). Rating: 5 stars.', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0', status: 'success', severity: 'low' },
  { id: 9, timestamp: '2026-01-16T08:00:00Z', actor: 'system', actorRole: 'System', action: 'Stock Alert', resource: 'Inventory', resourceId: 'HNY-FRH-500', details: 'Stock level below threshold: 3 units remaining (threshold: 30)', ipAddress: 'System', userAgent: 'System', status: 'warning', severity: 'high' },
  { id: 10, timestamp: '2026-01-15T23:00:00Z', actor: 'system', actorRole: 'System', action: 'Daily Backup', resource: 'Database', resourceId: 'Full Backup', details: 'Daily automated backup completed successfully. Size: 2.4 GB. Duration: 12 min.', ipAddress: 'System', userAgent: 'System', status: 'success', severity: 'low' },
  { id: 11, timestamp: '2026-01-15T22:30:00Z', actor: 'admin@naturekart.com', actorRole: 'Super Admin', action: 'Category Deleted', resource: 'Category', resourceId: 'Organic Snacks', details: 'Deleted category "Organic Snacks" and reassigned 12 products to "Pickles & Snacks"', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0', status: 'success', severity: 'high' },
  { id: 12, timestamp: '2026-01-15T21:00:00Z', actor: 'moderator@naturekart.com', actorRole: 'Moderator', action: 'Refund Processed', resource: 'Order', resourceId: 'ORD-45692', details: 'Processed full refund of ₹8,999 for return request. Payment via UPI refund.', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0', status: 'success', severity: 'medium' },
];

const actionTypes = ['All Actions', 'User Login', 'Order Status Change', 'Product Updated', 'Account Locked', 'Coupon Created', 'Review Moderated', 'Stock Alert', 'Daily Backup', 'Category Deleted', 'Refund Processed', 'User Impersonated', 'Failed Login Attempt'];
const severityLevels = ['All Severities', 'Low', 'Medium', 'High', 'Critical'];
const actorRoles = ['All Roles', 'Super Admin', 'Moderator', 'Customer', 'System'];

const actionIcons: Record<string, typeof Shield> = {
  'User Login': LogIn, 'User Impersonated': LogIn, 'Failed Login Attempt': LogIn,
  'Account Locked': Ban, 'Order Status Change': Activity,
  'Product Updated': Edit, 'Coupon Created': Plus,
  'Review Moderated': CheckCircle, 'Stock Alert': AlertTriangle,
  'Daily Backup': Shield, 'Category Deleted': Trash2,
  'Refund Processed': FileText,
};

const statusColors: Record<string, string> = {
  success: 'bg-green-100 text-green-700',
  failure: 'bg-red-100 text-red-700',
  warning: 'bg-amber-100 text-amber-700',
};

const severityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

// ==================== COMPONENT ====================

export default function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [severityFilter, setSeverityFilter] = useState('All Severities');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [sortBy, setSortBy] = useState<'timestamp' | 'actor'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const perPage = 8;

  // Filter logs
  let filtered = auditLogs.filter((log) => {
    if (search && !log.actor.toLowerCase().includes(search.toLowerCase()) &&
        !log.resourceId.toLowerCase().includes(search.toLowerCase()) &&
        !log.action.toLowerCase().includes(search.toLowerCase())) return false;
    if (actionFilter !== 'All Actions' && log.action !== actionFilter) return false;
    if (severityFilter !== 'All Severities' && log.severity !== severityFilter.toLowerCase()) return false;
    if (roleFilter !== 'All Roles' && log.actorRole !== roleFilter) return false;
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    const dir = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'timestamp') return dir * (new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return dir * a.actor.localeCompare(b.actor);
  });

  // Paginate
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginatedLogs = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleSort = (field: 'timestamp' | 'actor') => {
    if (sortBy === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
  };

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Actor', 'Role', 'Action', 'Resource', 'Resource ID', 'Details', 'IP', 'Status', 'Severity'].join(','),
      ...filtered.map(log => [
        log.timestamp, log.actor, log.actorRole, log.action, log.resource,
        log.resourceId, `"${log.details.replace(/"/g, '""')}"`, log.ipAddress, log.status, log.severity
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-5 w-5 text-primary-600" />
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Security</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-sm text-gray-500">Track all administrative actions and security events</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary-50 text-primary-700 border-primary-200 text-xs">
            {filtered.length} entries
          </Badge>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by actor, action, or resource..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="pl-10 border-gray-200"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 min-w-[140px]"
        >
          {actionTypes.map(a => <option key={a}>{a}</option>)}
        </select>
        <select
          value={severityFilter}
          onChange={(e) => { setSeverityFilter(e.target.value); setCurrentPage(1); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 min-w-[130px]"
        >
          {severityLevels.map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 min-w-[130px]"
        >
          {actorRoles.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left py-3 px-4 font-medium text-gray-500 w-96">
                  <button onClick={() => toggleSort('timestamp')} className="flex items-center gap-1 hover:text-gray-700">
                    <Clock className="h-3.5 w-3.5" />
                    Timestamp
                    {sortBy === 'timestamp' && <ArrowUpDown className="h-3 w-3" />}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  <button onClick={() => toggleSort('actor')} className="flex items-center gap-1 hover:text-gray-700">
                    <User className="h-3.5 w-3.5" /> Actor
                    {sortBy === 'actor' && <ArrowUpDown className="h-3 w-3" />}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Resource</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">IP Address</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Severity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {paginatedLogs.map((log) => {
                  const Icon = actionIcons[log.action] || Shield;
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedEntry(log)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-gray-400 shrink-0" />
                          <span className="text-gray-600 text-xs">
                            {new Date(log.timestamp).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50">
                            <User className="h-3.5 w-3.5 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{log.actor}</p>
                            <p className="text-[10px] text-gray-400">{log.actorRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Icon className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-900">{log.action}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900">{log.resource}</p>
                        <p className="text-xs text-gray-400 font-mono">{log.resourceId}</p>
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-xs text-gray-500 font-mono bg-gray-50 px-1.5 py-0.5 rounded">{log.ipAddress}</code>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={cn('text-[10px]', statusColors[log.status])}>
                          {log.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={cn('text-[10px]', severityColors[log.severity])}>
                          {log.severity}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setSelectedEntry(log); }}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 border-2 border-gray-100 mb-3">
              <Shield className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900">No audit entries found</p>
            <p className="text-xs text-gray-500 mt-0.5">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'h-8 w-8 rounded-lg text-sm font-medium transition-all',
                        currentPage === page ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="text-gray-400 px-1">...</span>}
              </div>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedEntry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
              onClick={() => setSelectedEntry(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl"
            >
              <div className="flex h-full flex-col">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                      <Shield className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Audit Entry Details</h3>
                      <p className="text-xs text-gray-500">ID: #{String(selectedEntry.id).padStart(5, '0')}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedEntry(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Status & Severity */}
                  <div className="flex gap-3">
                    <Badge className={cn('text-xs', statusColors[selectedEntry.status])}>
                      {selectedEntry.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={cn('text-xs', severityColors[selectedEntry.severity])}>
                      {selectedEntry.severity.toUpperCase()} SEVERITY
                    </Badge>
                  </div>

                  {/* Action */}
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Action Performed</p>
                    <p className="text-lg font-bold text-gray-900">{selectedEntry.action}</p>
                  </div>

                  {/* Details */}
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                    <div className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-blue-700 mb-1">Details</p>
                        <p className="text-sm text-gray-900">{selectedEntry.details}</p>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-xs text-gray-500 mb-1">Actor</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{selectedEntry.actor}</p>
                      <p className="text-xs text-gray-400">{selectedEntry.actorRole}</p>
                    </div>
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-xs text-gray-500 mb-1">Timestamp</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(selectedEntry.timestamp).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-xs text-gray-500 mb-1">Resource</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedEntry.resource}</p>
                      <p className="text-xs text-gray-400 font-mono">{selectedEntry.resourceId}</p>
                    </div>
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-xs text-gray-500 mb-1">IP Address</p>
                      <code className="text-sm font-semibold text-gray-900 font-mono">{selectedEntry.ipAddress}</code>
                    </div>
                  </div>

                  {/* User Agent */}
                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-xs text-gray-500 mb-1">User Agent</p>
                    <p className="text-xs text-gray-700 break-all">{selectedEntry.userAgent}</p>
                  </div>

                  {/* Security Note */}
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 p-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700">
                      This entry is part of the immutable audit trail and cannot be modified or deleted.
                      All timestamps are in IST (UTC+05:30).
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
