// app/products/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Order {
   id: string;
   totalAmount: number | null;
   status: 'PENDING' | 'PAID' | 'VERIFIED' | 'CANCELLED';
   createdAt: string | null;
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
   paymentSlip?: {
     originalUrl: string;
     verified: boolean;
     verifiedAt?: string;
   };
}

function getStatusText(status: Order['status']) {
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

function getStatusColor(status: Order['status']) {
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

export default function AdminOrdersPage() {
 const router = useRouter();
 const [orders, setOrders] = useState<Order[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [currentPage, setCurrentPage] = useState(1);
 const [searchTerm, setSearchTerm] = useState('');
 const itemsPerPage = 10;

 useEffect(() => {
   fetchOrders();
 }, []);

 async function fetchOrders() {
   try {
     setLoading(true);
     const res = await fetch('/api/orderVerify');
     if (!res.ok) throw new Error('Failed to fetch orders');
     const data = await res.json();
     setOrders(data);
   } catch (error) {
     setError('ไม่สามารถโหลดข้อมูลได้');
     console.error('Failed to fetch orders:', error);
   } finally {
     setLoading(false);
   }
 }

 // Filter orders based on search term
 const filteredOrders = orders.filter(order => {
   const searchLower = searchTerm.toLowerCase();
   return (
     order.shippingInfo?.name?.toLowerCase().includes(searchLower) ||
     order.id.toLowerCase().includes(searchLower) ||
     order.shippingInfo?.phone?.includes(searchTerm) ||
     order.shippingInfo?.email?.toLowerCase().includes(searchLower)
   );
 });

 // Calculate pagination
 const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
 const startIndex = (currentPage - 1) * itemsPerPage;
 const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

 // Loading state
 if (loading) {
   return (
     <div className="flex justify-center items-center min-h-screen">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-600" />
     </div>
   );
 }

 // Error state
 if (error) {
   return (
     <div className="flex flex-col items-center justify-center min-h-screen">
       <p className="text-red-500 mb-4">{error}</p>
       <button 
         onClick={fetchOrders}
         className="text-violet-600 hover:underline"
       >
         ลองใหม่อีกครั้ง
       </button>
     </div>
   );
 }

 return (
   <div className="container mx-auto px-4 py-8 pt-24">
     <div className="flex justify-between items-center mb-6">
       <h1 className="text-2xl font-bold">รายการคำสั่งซื้อ</h1>
       <Link 
         href="/dashboard" 
         className="text-violet-600 hover:underline"
       >
         กลับหน้าแดชบอร์ด
       </Link>
     </div>

     {/* Search and Filter Section */}
     <div className="mb-6">
       <div className="max-w-md">
         <div className="relative">
           <input
             type="text"
             placeholder="ค้นหาด้วยชื่อ, เบอร์โทร, อีเมล หรือเลขที่คำสั่งซื้อ"
             value={searchTerm}
             onChange={(e) => {
               setSearchTerm(e.target.value);
               setCurrentPage(1);
             }}
             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
           />
           <svg
             className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24"
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
             />
           </svg>
         </div>
       </div>
     </div>

     {/* Orders Table */}
     <div className="bg-white rounded-lg shadow overflow-hidden">
       <div className="overflow-x-auto">
         <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 เลขที่คำสั่งซื้อ
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 ลูกค้า
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 ติดต่อ
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 ยอดรวม
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 สถานะ
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 วันที่
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 สลิป
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 จัดการ
               </th>
             </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             {paginatedOrders.map((order) => (
               <tr key={order.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                   {order.id}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {order.shippingInfo?.name || 'ไม่มีข้อมูล'}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   <div>
                     <p>{order.shippingInfo?.phone || '-'}</p>
                     <p className="text-xs">{order.shippingInfo?.email || '-'}</p>
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   ฿{Number(order.totalAmount || 0).toLocaleString()}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                     {getStatusText(order.status)}
                   </span>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {order.createdAt ? new Date(order.createdAt).toLocaleString('th-TH') : 'ไม่มีข้อมูล'}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm">
                   {order.paymentSlip?.originalUrl ? (
                     <button 
                       onClick={() => window.open(order.paymentSlip?.originalUrl, '_blank')}
                       className="text-violet-600 hover:text-violet-900"
                     >
                       ดูสลิป
                     </button>
                   ) : (
                     <span className="text-gray-400">ไม่มีสลิป</span>
                   )}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm">
                   <button
                     onClick={() => router.push(`/products/orders/${order.id}`)}
                     className="text-violet-600 hover:text-violet-900"
                   >
                     ตรวจสอบ
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </div>

     {/* No Results Message */}
     {filteredOrders.length === 0 && (
       <div className="text-center py-8 text-gray-500">
         ไม่พบรายการที่ค้นหา
       </div>
     )}

     {/* Pagination */}
     {totalPages > 1 && (
       <div className="mt-6 flex justify-center items-center gap-2">
         <button
           onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
           disabled={currentPage === 1}
           className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
         >
           ก่อนหน้า
         </button>
         
         {[...Array(totalPages)].map((_, i) => (
           <button
             key={i + 1}
             onClick={() => setCurrentPage(i + 1)}
             className={`px-3 py-1 rounded border ${
               currentPage === i + 1
                 ? 'bg-violet-600 text-white'
                 : 'hover:bg-gray-100'
             }`}
           >
             {i + 1}
           </button>
         ))}

         <button
           onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
           disabled={currentPage === totalPages}
           className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
         >
           ถัดไป
         </button>

         <span className="text-sm text-gray-500 ml-4">
           หน้า {currentPage} จาก {totalPages}
         </span>
       </div>
     )}
   </div>
 );
}