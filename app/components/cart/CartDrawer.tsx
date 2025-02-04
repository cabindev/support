// app/components/cart/CartDrawer.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { CartDrawerProps } from '@/app/types/shared';


export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onRemoveItem,
  onUpdateQuantity
}: CartDrawerProps) {
 const router = useRouter();
 const [isRemoving, setIsRemoving] = useState<string | null>(null);

 // Calculate total
 const total = items.reduce((sum, item) => 
   sum + (item.product.price * item.quantity), 0
 );

 // Handle remove item
 const handleRemoveItem = async (itemId: string) => {
   try {
     setIsRemoving(itemId);
     await onRemoveItem(itemId);
   } finally {
     setIsRemoving(null);
   }
 };

 return (
   <>
     {/* Backdrop */}
     {isOpen && (
       <div 
         className="fixed inset-0 bg-black/50 z-40"
         onClick={onClose}
       />
     )}

     {/* Drawer */}
     <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-gray-50 shadow-xl 
       transform transition-transform duration-300 ease-out z-50
       ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
     >
       <div className="h-full flex flex-col">
         {/* Header */}
         <div className="p-4 bg-white border-b">
           <div className="flex items-center justify-between">
             <h2 className="text-lg font-medium">ตะกร้าสินค้า</h2>
             <button 
               onClick={onClose}
               className="p-2 text-gray-400 hover:text-gray-500 rounded-lg 
                 hover:bg-gray-100 transition-colors"
             >
               <span className="sr-only">ปิด</span>
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                   d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
           </div>
         </div>

         {/* Cart Items */}
         <div className="flex-1 overflow-y-auto p-4">
           <div className="space-y-4">
             {items.map((item) => (
               <div 
                 key={item.id} 
                 className="flex gap-4 p-4 bg-white rounded-lg shadow-sm"
               >
                 {/* Product Image */}
                 <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden">
                   <Image
                     src={item.product.image}
                     alt={item.product.name}
                     fill
                     className="object-cover"
                   />
                 </div>

                 {/* Product Details */}
                 <div className="flex-1">
                   <div className="flex justify-between">
                     <div>
                       <h3 className="font-medium text-gray-900">
                         {item.product.name}
                       </h3>
                       <p className="text-sm text-gray-500">
                         ไซส์: {item.product.size.name}
                       </p>
                       <p className="text-sm text-gray-500 mt-1">
                         จำนวน: {item.quantity}
                       </p>
                     </div>
                     <div className="text-right">
                       <p className="font-medium text-violet-600">
                         ฿{item.product.price.toLocaleString()}
                       </p>
                       <button
                         onClick={() => handleRemoveItem(item.id)}
                         disabled={isRemoving === item.id}
                         className="text-sm text-red-600 hover:text-red-700 mt-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         {isRemoving === item.id ? 'กำลังลบ...' : 'ลบ'}
                       </button>
                     </div>
                   </div>

                   {/* Item Total */}
                   <p className="text-right text-sm text-gray-600 mt-2">
                     รวม: ฿{(item.product.price * item.quantity).toLocaleString()}
                   </p>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Summary */}
         <div className="p-4 bg-white border-t">
           <div className="space-y-3 mb-4">
             <div className="flex justify-between text-gray-600">
               <span>มูลค่าสินค้า</span>
               <span>฿{total.toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-gray-600">
               <span>ราคาสินค้าได้รวมค่าจัดส่งแล้ว</span>
               <span className="text-sm text-violet-600">ฟรี</span>
             </div>
             <div className="flex justify-between text-lg font-medium pt-3 border-t">
               <span>ยอดรวมทั้งหมด</span>
               <span>฿{total.toLocaleString()}</span>
             </div>
           </div>

           {/* Actions */}
           <div className="grid grid-cols-2 gap-3">
             <button
               onClick={() => {
                 onClose();
                 router.push('/products');
               }}
               className="px-4 py-3 text-center border border-violet-600 
                 text-violet-600 rounded-lg hover:bg-violet-50 font-medium
                 transition-colors duration-200"
             >
               เลือกสินค้าต่อ
             </button>
             <button
               onClick={() => {
                 router.push('/checkout');
                 onClose();
               }}
               className="px-4 py-3 text-center bg-violet-600 text-white 
                 rounded-lg hover:bg-violet-700 font-medium
                 transition-colors duration-200"
             >
               ชำระเงิน
             </button>
           </div>
         </div>
       </div>
     </div>
   </>
 );
}