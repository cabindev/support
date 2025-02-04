// app/checkout/complete/[orderId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Loading from '@/app/components/Loading';

const steps = [
  { name: 'SHOPPING CART', href: '/cart' },
  { name: 'CHECKOUT DETAILS', href: '/checkout' },
  { name: 'PAYMENT', href: '#' },
  { name: 'COMPLETE', href: '#', current: true }
];

interface OrderDetails {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  paymentSlip?: {
    createdAt: Date;
  };
}

export default function CompletePage({ params }: { params: { orderId: string }}) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${params.orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.orderId]);
 
  if (loading) return <Loading />;
  if (!order) return null;

  return (
    <main className="container mx-auto px-4 py-12 pt-24">
      {/* Steps */}
      <nav className="mb-8">
        <ol className="flex items-center justify-center text-sm">
          {steps.map((step, i) => (
            <li key={step.name} className="flex items-center">
              <span className={`font-medium ${
                step.current ? 'text-violet-600' : 'text-gray-500'
              }`}>
                {step.name}
              </span>
              {i < steps.length - 1 && (
                <span className="mx-2 text-gray-400">›</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-green-500" 
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            แจ้งชำระเงินสำเร็จ
          </h1>
          
          <p className="text-gray-600 mb-8">
            เราได้รับการแจ้งชำระเงินของคุณแล้ว กำลังตรวจสอบการชำระเงิน<br/>
            เราจะแจ้งให้ทราบเมื่อตรวจสอบเสร็จสิ้น
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-medium text-gray-900 mb-4">รายละเอียดคำสั่งซื้อ</h2>
            <div className="space-y-2 text-gray-600">
              <p>เลขที่คำสั่งซื้อ: {order.id}</p>
              <p>วันที่สั่งซื้อ: {new Date(order.createdAt).toLocaleString()}</p>
              <p>ยอดชำระ: ฿{order.totalAmount.toLocaleString()}</p>
              <p>วันที่แจ้งชำระเงิน: {order.paymentSlip ? 
                new Date(order.paymentSlip.createdAt).toLocaleString() : '-'}</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/orders/${order.id}`}
              className="px-6 py-2 border border-violet-600 text-violet-600 
                rounded-lg hover:bg-violet-50 transition-colors"
            >
              ดูรายละเอียดคำสั่งซื้อ
            </Link>

            <Link
              href="/products"
              className="px-6 py-2 bg-violet-600 text-white 
                rounded-lg hover:bg-violet-700 transition-colors"
            >
              กลับหน้าหลัก
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-sm text-gray-500 space-y-1">
            <p>หากมีข้อสงสัยกรุณาติดต่อ</p>
            <p>น.ส.ธัญญพัฒน์ พงษ์ประดิษฐ์</p>
            <p>โทร: 089-171-9220</p>
            {/* <p>อีเมล: evo_reaction@hotmail.com</p> */}
          </div>
        </div>
      </div>
    </main>
  );
}