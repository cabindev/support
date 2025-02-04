// app/dashboard/products/components/ProductRow.tsx
'use client'

import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';
import { Product } from '@/app/types';

interface ProductRowProps {
 product: Product;
}

export default function ProductRow({ product }: ProductRowProps) {
 const [loading, setLoading] = useState(false);

 const handleDelete = async () => {
   if (!confirm('ต้องการลบสินค้านี้ใช่หรือไม่?')) return;
   
   setLoading(true);
   try {
     const res = await fetch(`/api/products/${product.id}`, {
       method: 'DELETE'
     });
     if (!res.ok) throw new Error('Failed to delete product');
     window.location.reload();
   } catch (error) {
     console.error('Error deleting product:', error);
     alert('Failed to delete product');
   } finally {
     setLoading(false);
   }
 };

 const daysDifference = differenceInDays(new Date(), new Date(product.createdAt));
 const isNew = daysDifference <= 7;
 const formattedDate = format(new Date(product.createdAt), 'dd/MM/yyyy');

 const getStockStatus = () => {
   const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
   
   if (totalStock === 0) {
     return {
       label: 'Out of stock',
       className: 'bg-red-100 text-red-800'
     };
   }
   if (totalStock <= 10) {
     return {
       label: `Low stock (${totalStock})`,
       className: 'bg-yellow-100 text-yellow-800'  
     };
   }
   return {
     label: `In stock (${totalStock})`,
     className: 'bg-green-100 text-green-800'
   };
 };

 const stockStatus = getStockStatus();

 return (
   <tr className="hover:bg-zinc-50 transition-colors">
     <td className="px-6 py-4 whitespace-nowrap">
       <div className="h-12 w-12 rounded-lg overflow-hidden bg-zinc-100">
         {product.images.length > 0 ? (
           <img 
             src={product.images[0].url} 
             alt={product.images[0].alt || product.name}
             className="h-full w-full object-cover"
           />
         ) : (
           <div className="h-full w-full flex items-center justify-center text-zinc-400">
             No image
           </div>
         )}
       </div>
     </td>

     <td className="px-6 py-4 whitespace-nowrap">
       <div className="flex items-center gap-2">
         <span className="font-medium text-zinc-800">{product.name}</span>
         {isNew && (
           <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
             New
           </span>
         )}
       </div>
       <div className="text-sm text-zinc-500 mt-0.5">
         Added {formattedDate}
       </div>
     </td>

     <td className="px-6 py-4 whitespace-nowrap text-zinc-600">
       {product.category.name}
     </td>

     <td className="px-6 py-4 whitespace-nowrap text-zinc-600">
       ฿{product.price.toLocaleString()}
     </td>

     <td className="px-6 py-4 whitespace-nowrap">
       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.className}`}>
         {stockStatus.label}
       </span>
     </td>
     
     <td className="px-6 py-4 whitespace-nowrap">
       <div className="flex flex-wrap gap-1 max-w-[200px]">
         {product.sizes.map(size => (
           <span key={size.id} className="px-2 py-1 text-xs rounded-md bg-zinc-100 text-zinc-600">
             {size.size.name} ({size.stock})
           </span>
         ))}
       </div>
     </td>

     <td className="px-6 py-4 whitespace-nowrap">
       <div className="flex gap-3">
         <Link
           href={`/dashboard/products/${product.id}/edit`}
           className="p-2 text-zinc-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
           title="Edit product"
         >
           <FiEdit size={18} />
         </Link>
         <button
           onClick={handleDelete}
           disabled={loading}
           className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           title="Delete product"
         >
           <RiDeleteBin6Line size={18} />
         </button>
       </div>
     </td>
   </tr>
 );
}