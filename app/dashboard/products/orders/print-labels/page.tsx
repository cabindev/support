// app/dashboard/products/orders/print-labels/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PrintLabelsPage() {
  const handlePrint = () => {
    window.open('/products/print-only', '_blank');
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-zinc-800">พิมพ์ที่อยู่จัดส่ง</h1>
              <p className="text-zinc-600 mt-1">พิมพ์ที่อยู่จัดส่งสำหรับออเดอร์ที่รอจัดส่ง</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                พิมพ์ที่อยู่
              </button>
              <Link
                href="/products/print-only"
                className="px-4 py-2 text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                กลับหน้าแดชบอร์ด
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}