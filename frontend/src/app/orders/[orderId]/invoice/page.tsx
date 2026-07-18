'use client';

import { useRef } from 'react';
import { Printer, Download, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice, formatDate } from '@/lib/utils';

const invoice = {
  invoiceNumber: 'INV-2026-001',
  orderNumber: 'ORD-45689',
  date: '2026-01-15T10:30:00',
  dueDate: '2026-01-15',
  paymentMethod: 'Credit Card (Visa)',
  paymentStatus: 'Paid',
  transactionId: 'TXN-789456123',
  
  company: {
    name: 'NatureKart Pvt. Ltd.',
    address: '42, Tech Park, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    country: 'India',
    gst: '29ABCDE1234F1Z5',
    phone: '+91 1800-123-4567',
    email: 'billing@naturekart.com',
    pan: 'ABCDE1234F',
  },

  billing: {
    name: 'Rajesh Kumar',
    address: '42, MG Road, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    phone: '+91 9876543210',
    email: 'rajesh@email.com',
    gst: '29FGHI5678J1K3',
  },

  shipping: {
    name: 'Rajesh Kumar',
    address: '42, MG Road, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    phone: '+91 9876543210',
  },

  items: [
    { name: 'Wireless Noise Cancelling Headphones', sku: 'WH-1000XM5', hsn: '851830', gst: 18, qty: 1, rate: 19990, amount: 19990 },
    { name: 'Premium Cotton T-Shirt (Pack of 3)', sku: 'CT-3PK-001', hsn: '620520', gst: 12, qty: 2, rate: 1299, amount: 2598 },
  ],

  shippingCharge: 0,
  discount: 0,
  gstSummary: [
    { rate: '18%', taxable: 19990, cgst: 1799.10, sgst: 1799.10, total: 3598.20 },
    { rate: '12%', taxable: 2598, cgst: 155.88, sgst: 155.88, total: 311.76 },
  ],

  totalBeforeTax: 22588,
  totalGst: 3909.96,
  total: 22588,
  amountInWords: 'Twenty Two Thousand Five Hundred Eighty Eight Rupees Only',
};

export default function InvoicePage() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Action Bar - Hidden when printing */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white print:hidden">
        <div className="container-custom py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/orders/${invoice.orderNumber}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <div>
              <p className="text-sm font-semibold text-gray-900">Invoice #{invoice.invoiceNumber}</p>
              <p className="text-xs text-gray-500">Order #{invoice.orderNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" /> Print / PDF
            </Button>
            <Button size="sm" className="gap-2 gradient-primary" onClick={handlePrint}>
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="container-custom py-8 print:py-0">
        <div ref={printRef} className="mx-auto max-w-[210mm] rounded-xl border border-gray-200 bg-white p-8 sm:p-12 print:border-0 print:shadow-none print:p-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                  <span className="text-lg font-bold text-white">NK</span>
                </div>
                <span className="text-xl font-bold gradient-text">NatureKart</span>
              </div>
              <div className="mt-3 text-xs text-gray-600 space-y-0.5">
                <p>{invoice.company.address}</p>
                <p>{invoice.company.city}, {invoice.company.state} - {invoice.company.pincode}</p>
                <p>GST: {invoice.company.gst} | PAN: {invoice.company.pan}</p>
                <p>Phone: {invoice.company.phone}</p>
                <p>Email: {invoice.company.email}</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">TAX INVOICE</h1>
              <div className="mt-2 text-xs text-gray-600 space-y-0.5">
                <p><span className="font-medium text-gray-700">Invoice #:</span> {invoice.invoiceNumber}</p>
                <p><span className="font-medium text-gray-700">Order #:</span> {invoice.orderNumber}</p>
                <p><span className="font-medium text-gray-700">Date:</span> {formatDate(invoice.date)}</p>
                <p><span className="font-medium text-gray-700">Due Date:</span> {invoice.dueDate}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Addresses */}
          <div className="grid grid-cols-2 gap-8 text-xs">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Bill To:</p>
              <div className="text-gray-600 space-y-0.5">
                <p className="font-medium text-gray-800">{invoice.billing.name}</p>
                <p>{invoice.billing.address}</p>
                <p>{invoice.billing.city}, {invoice.billing.state} - {invoice.billing.pincode}</p>
                <p>Phone: {invoice.billing.phone}</p>
                <p>Email: {invoice.billing.email}</p>
                {invoice.billing.gst && <p>GST: {invoice.billing.gst}</p>}
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Ship To:</p>
              <div className="text-gray-600 space-y-0.5">
                <p className="font-medium text-gray-800">{invoice.shipping.name}</p>
                <p>{invoice.shipping.address}</p>
                <p>{invoice.shipping.city}, {invoice.shipping.state} - {invoice.shipping.pincode}</p>
                <p>Phone: {invoice.shipping.phone}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Items Table */}
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2.5 px-3 font-semibold text-gray-700">#</th>
                <th className="text-left py-2.5 px-3 font-semibold text-gray-700">Item</th>
                <th className="text-left py-2.5 px-3 font-semibold text-gray-700">HSN/SAC</th>
                <th className="text-center py-2.5 px-3 font-semibold text-gray-700">Qty</th>
                <th className="text-right py-2.5 px-3 font-semibold text-gray-700">Rate</th>
                <th className="text-right py-2.5 px-3 font-semibold text-gray-700">GST%</th>
                <th className="text-right py-2.5 px-3 font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2.5 px-3 text-gray-600">{i + 1}</td>
                  <td className="py-2.5 px-3">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-gray-500">SKU: {item.sku}</p>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">{item.hsn}</td>
                  <td className="py-2.5 px-3 text-center text-gray-900">{item.qty}</td>
                  <td className="py-2.5 px-3 text-right text-gray-900">{formatPrice(item.rate)}</td>
                  <td className="py-2.5 px-3 text-right text-gray-600">{item.gst}%</td>
                  <td className="py-2.5 px-3 text-right font-medium text-gray-900">{formatPrice(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Separator className="my-4" />

          {/* Summary */}
          <div className="grid grid-cols-2 gap-8 text-xs">
            {/* GST Breakup */}
            <div>
              <p className="font-semibold text-gray-900 mb-2">Tax Breakup</p>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-1.5 px-2 font-medium text-gray-600">Rate</th>
                    <th className="text-right py-1.5 px-2 font-medium text-gray-600">Taxable</th>
                    <th className="text-right py-1.5 px-2 font-medium text-gray-600">CGST</th>
                    <th className="text-right py-1.5 px-2 font-medium text-gray-600">SGST</th>
                    <th className="text-right py-1.5 px-2 font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.gstSummary.map((gst, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-1.5 px-2 text-gray-700">{gst.rate}</td>
                      <td className="py-1.5 px-2 text-right text-gray-700">{formatPrice(gst.taxable)}</td>
                      <td className="py-1.5 px-2 text-right text-gray-700">{formatPrice(gst.cgst)}</td>
                      <td className="py-1.5 px-2 text-right text-gray-700">{formatPrice(gst.sgst)}</td>
                      <td className="py-1.5 px-2 text-right font-medium text-gray-900">{formatPrice(gst.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 space-y-1 text-gray-600">
                <p><span className="font-medium text-gray-700">Amount in Words:</span></p>
                <p className="italic">{invoice.amountInWords}</p>
              </div>
            </div>

            {/* Total Calculation */}
            <div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="text-gray-900">{formatPrice(invoice.totalBeforeTax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total GST</span>
                  <span className="text-gray-900">{formatPrice(invoice.totalGst)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(invoice.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Payment Status</span>
                  <span className="text-green-600 font-medium">{invoice.paymentStatus}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Payment Method</span>
                  <span>{invoice.paymentMethod}</span>
                </div>
                {invoice.transactionId && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Transaction ID</span>
                    <span>{invoice.transactionId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Footer */}
          <div className="flex items-start justify-between text-[10px] text-gray-400">
            <div className="space-y-0.5">
              <p>Registered Office: {invoice.company.address}, {invoice.company.city}, {invoice.company.state} - {invoice.company.pincode}</p>
              <p>This is a computer-generated invoice and does not require a physical signature.</p>
            </div>
            <div className="text-right">
              <p>Authorized Signatory</p>
              <div className="mt-8 border-t border-gray-300 pt-1">For NatureKart Pvt. Ltd.</div>
            </div>
          </div>

          {/* Print-only note */}
          <div className="mt-4 text-center text-[10px] text-gray-400 print:block hidden">
            <p>Invoice #{invoice.invoiceNumber} | Generated on {formatDate(new Date().toISOString())}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
