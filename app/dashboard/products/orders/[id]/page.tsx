// app/dashboard/products/orders/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ShippingLabel from '../../components/ShippingLabel';

interface OrderDetails {
 id: string;
 totalAmount: number;
 status: 'PENDING' | 'PAID' | 'VERIFIED' | 'CANCELLED';
 createdAt: string;
 shippingInfo?: {
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
 paymentSlip?: {
   originalUrl: string;
   verified: boolean;
   verifiedAt?: string;
 };
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

function getStatusColor(status: OrderDetails['status']) {
 switch (status) {
   case 'PENDING':
     return 'bg-yellow-100 text-yellow-800';
   case 'PAID':
     return 'bg-blue-100 text-blue-800';
   case 'VERIFIED':
     return 'bg-green-100 text-green-800';
   case 'CANCELLED':
     return 'bg-red-100 text-red-800';
   default:
     return 'bg-gray-100 text-gray-800';
 }
}

export default function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
 const router = useRouter();
 const [order, setOrder] = useState<OrderDetails | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [verifying, setVerifying] = useState(false);

 useEffect(() => {
   fetchOrderDetails();
 }, [params.id]);

 async function fetchOrderDetails() {
   try {
     setLoading(true);
     const res = await fetch(`/api/orderVerify/${params.id}`);
     if (!res.ok) throw new Error('Failed to fetch order details');
     const data = await res.json();
     setOrder(data);
   } catch (error) {
     setError('ไม่สามารถโหลดข้อมูลได้');
     console.error('Failed to fetch order details:', error);
   } finally {
     setLoading(false);
   }
 }

 async function handleVerify(verified: boolean) {
   try {
     setVerifying(true);
     const res = await fetch(`/api/orderVerify/${params.id}`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ verified })
     });

     if (!res.ok) throw new Error('Failed to verify order');

     await fetchOrderDetails();
     alert(verified ? 'ยืนยันการชำระเงินเรียบร้อย' : 'ปฏิเสธการชำระเงิน');
   } catch (error) {
     console.error('Verify error:', error);
     alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
   } finally {
     setVerifying(false);
   }
 }

 if (loading) {
   return (
     <div className="flex justify-center items-center min-h-screen">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-600" />
     </div>
   );
 }

 if (error) {
   return (
     <div className="flex flex-col items-center justify-center min-h-screen">
       <p className="text-red-500 mb-4">{error}</p>
       <button 
         onClick={fetchOrderDetails}
         className="text-violet-600 hover:underline"
       >
         ลองใหม่อีกครั้ง
       </button>
     </div>
   );
 }

 if (!order) {
   return (
     <div className="text-center py-12">
       <p className="text-gray-500 mb-4">ไม่พบข้อมูลคำสั่งซื้อ</p>
       <Link href="/dashboard/products/orders" className="text-violet-600 hover:underline">
         กลับไปหน้ารายการคำสั่งซื้อ
       </Link>
     </div>
   );
 }

 return (
   <div className="container mx-auto px-4 py-8 pt-24">
     <div className="max-w-4xl mx-auto">
       <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold">รายละเอียดคำสั่งซื้อ #{order.id}</h1>
         <Link 
           href="/dashboard/products/orders"
           className="text-violet-600 hover:underline"
         >
           กลับไปรายการคำสั่งซื้อ
         </Link>
       </div>

       {order.shippingInfo && (
         <div className="mb-6">
           <ShippingLabel 
             orderId={order.id}
             shippingInfo={order.shippingInfo}
           />
         </div>
       )}

       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
         {/* Order Status */}
         <div className="p-6 border-b">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm text-gray-500">สถานะ</p>
               <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                 {getStatusText(order.status)}
               </span>
             </div>
             <div className="text-right">
               <p className="text-sm text-gray-500">วันที่สั่งซื้อ</p>
               <p className="mt-1 font-medium">
                 {new Date(order.createdAt).toLocaleString('th-TH')}
               </p>
             </div>
           </div>
         </div>

         {/* Customer Info */}
         <div className="p-6 border-b">
           <h2 className="text-lg font-medium mb-4">ข้อมูลการจัดส่ง</h2>
           {order.shippingInfo ? (
             <div className="space-y-2">
               <p><span className="text-gray-500">ชื่อผู้รับ:</span> {order.shippingInfo.name}</p>
               <p><span className="text-gray-500">โทรศัพท์:</span> {order.shippingInfo.phone}</p>
               <p><span className="text-gray-500">อีเมล:</span> {order.shippingInfo.email}</p>
               <p><span className="text-gray-500">ที่อยู่:</span> {order.shippingInfo.address}</p>
               <p>
                 <span className="text-gray-500">ที่อยู่เพิ่มเติม:</span>{' '}
                 {order.shippingInfo.district} {order.shippingInfo.amphoe}{' '}
                 {order.shippingInfo.province} {order.shippingInfo.zipcode}
               </p>
             </div>
           ) : (
             <p className="text-gray-500">ไม่มีข้อมูลการจัดส่ง</p>
           )}
         </div>

         {/* Order Items */}
         <div className="p-6 border-b">
           <h2 className="text-lg font-medium mb-4">รายการสินค้า</h2>
           <div className="divide-y">
             {order.items.map((item, index) => (
               <div key={index} className="py-4 flex justify-between">
                 <div>
                   <p className="font-medium">{item.product.name}</p>
                   <p className="text-sm text-gray-500">
                     ฿{Number(item.product.price).toLocaleString()} x {item.quantity}
                   </p>
                 </div>
                 <p className="font-medium">
                   ฿{(Number(item.product.price) * item.quantity).toLocaleString()}
                 </p>
               </div>
             ))}
           </div>
           <div className="mt-4 pt-4 border-t">
             <div className="flex justify-between text-lg font-medium">
               <span>ยอดรวมทั้งสิ้น</span>
               <span>฿{Number(order.totalAmount).toLocaleString()}</span>
             </div>
           </div>
         </div>

         {/* Payment Slip */}
         {order.paymentSlip && (
           <div className="p-6">
             <h2 className="text-lg font-medium mb-4">สลิปการโอนเงิน</h2>
             
             <div className="mb-6">
               <div className="relative w-full h-96 mb-4 border rounded-lg overflow-hidden">
                 <Image
                   src={order.paymentSlip.originalUrl}
                   alt="Payment slip"
                   fill
                   className="object-contain"
                 />
               </div>

               {order.paymentSlip.verified ? (
                 <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                   <p>ยืนยันการชำระเงินแล้ว</p>
                   {order.paymentSlip.verifiedAt && (
                     <p className="text-sm mt-1">
                       เมื่อ: {new Date(order.paymentSlip.verifiedAt).toLocaleString('th-TH')}
                     </p>
                   )}
                 </div>
               ) : (
                 <div className="flex gap-4">
                   <button
                     onClick={() => handleVerify(true)}
                     disabled={verifying}
                     className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                   >
                     {verifying ? 'กำลังดำเนินการ...' : 'ยืนยันการชำระเงิน'}
                   </button>
                   <button
                     onClick={() => handleVerify(false)}
                     disabled={verifying}
                     className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                   >
                     ปฏิเสธการชำระเงิน
                   </button>
                 </div>
               )}
             </div>

             <a 
               href={order.paymentSlip.originalUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center text-violet-600 hover:underline"
             >
               <svg 
                 className="w-4 h-4 mr-2" 
                 fill="none" 
                 stroke="currentColor" 
                 viewBox="0 0 24 24"
               >
                 <path 
                   strokeLinecap="round" 
                   strokeLinejoin="round" 
                   strokeWidth={2} 
                   d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                 />
               </svg>
               ดูสลิปขนาดเต็ม
             </a>
           </div>
         )}
       </div>
     </div>
   </div>
 );
}