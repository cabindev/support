//app/orders/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderDetails {
  id: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'VERIFIED' | 'CANCELLED';
  createdAt: string;
  shippingInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
    district: string;
    amphoe: string;
    province: string;
    zipcode: string;
  };
  items: {
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [params.id]);

  async function fetchOrderDetails() {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch order details');
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center py-12">กำลังโหลด...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!order) return <div className="text-center py-12">ไม่พบข้อมูลคำสั่งซื้อ</div>;

  return (
    <main className="container mx-auto px-4 py-12 pt-24">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Order Info */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">รายละเอียดคำสั่งซื้อ</h1>
            <Link href="/products" className="text-violet-600 hover:underline">
              กลับหน้าหลัก
            </Link>
          </div>

          <div className="mb-8">
            <p>เลขที่คำสั่งซื้อ: {order.id}</p>
            <p>วันที่สั่งซื้อ: {new Date(order.createdAt).toLocaleString()}</p>
            <p>สถานะ: {getStatusText(order.status)}</p>
          </div>

          {/* Customer Info */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-2">ข้อมูลการจัดส่ง</h2>
            <div className="space-y-1">
              <p>ชื่อผู้รับ: {order.shippingInfo.name}</p>
              <p>โทรศัพท์: {order.shippingInfo.phone}</p>
              <p>อีเมล: {order.shippingInfo.email}</p>
              <p>ที่อยู่: {order.shippingInfo.address}</p>
              <p>
                {order.shippingInfo.district} {order.shippingInfo.amphoe}{' '}
                {order.shippingInfo.province} {order.shippingInfo.zipcode}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-2">รายการสินค้า</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">จำนวน: {item.quantity}</p>
                  </div>
                  <p>฿{(item.quantity * Number(item.product.price)).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-medium">
              <span>ยอดรวมทั้งสิ้น</span>
              <span>฿{Number(order.totalAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function getStatusText(status: OrderDetails['status']) {
  switch (status) {
    case 'PENDING':
      return 'รอการชำระเงิน';
    case 'PAID':
      return 'รอตรวจสอบการชำระเงิน';
    case 'VERIFIED':
      return 'ชำระเงินเรียบร้อย';
    case 'CANCELLED':
      return 'ยกเลิก';
    default:
      return status;
  }
}