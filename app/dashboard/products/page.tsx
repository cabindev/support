// app/dashboard/products/page.tsx
import Link from 'next/link';
import prisma from '@/app/lib/db';
import { IoMdAdd } from 'react-icons/io';
import { MdCategory } from 'react-icons/md';
import { BsRulers } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { serializeProduct } from '@/app/types';
import { type Product as PrismaProduct, type ProductImage as PrismaProductImage, type Size as PrismaSize, type StoreCategory as PrismaStoreCategory, type ProductSize as PrismaProductSize } from '@prisma/client';

interface ProductWithRelations extends PrismaProduct {
 category: PrismaStoreCategory;
 images: PrismaProductImage[];
 sizes: (PrismaProductSize & { 
   size: PrismaSize 
 })[];
 _count: {
   orderItems: number;
 };
}

type StockStatus = {
 label: string;
 className: string;
}

function getStockStatus(totalStock: number): StockStatus {
 if (totalStock === 0) {
   return { 
     label: 'Out of stock',
     className: 'bg-red-50 text-red-600 border-red-200'
   };
 }
 if (totalStock <= 10) {
   return { 
     label: `Low stock (${totalStock})`,
     className: 'bg-yellow-50 text-yellow-600 border-yellow-200'
   };
 }
 return { 
   label: `In stock (${totalStock})`,
   className: 'bg-green-50 text-green-600 border-green-200'
 };
}

export default async function ProductsPage() {
 const prismaProducts = await prisma.product.findMany({
   include: {
     category: true,
     images: {
       orderBy: { 
         sortOrder: 'asc' 
       }
     },
     sizes: {
       include: { 
         size: true 
       }
     },
     _count: {
       select: { 
         orderItems: true 
       }
     }
   },
   orderBy: { 
     createdAt: 'desc' 
   }
 }) as ProductWithRelations[];

 const products = prismaProducts.map((product) => {
   const serialized = serializeProduct(product);
   const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);

   return {
     ...serialized,
     orderCount: product._count.orderItems,
     totalStock,
     stockStatus: getStockStatus(totalStock)
   };
 });

 return (
   <div className="min-h-screen bg-zinc-50 pt-16 pb-12">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       {/* Header Section */}
       <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 pt-4">
         <div className="space-y-1">
           <h1 className="text-xl sm:text-2xl font-bold text-zinc-800">จัดการสินค้า</h1>
           <p className="text-sm text-zinc-600">สินค้าทั้งหมด {products.length} รายการ</p>
         </div>

         {/* Action Buttons */}
         <div className="grid grid-cols-3 sm:flex gap-2">
           <Link 
             href="/dashboard/products/create" 
             className="inline-flex items-center justify-center px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors gap-1.5 text-sm"
           >
             <IoMdAdd size={18} />
             <span className="hidden sm:inline">เพิ่มสินค้า</span>
             <span className="sm:hidden">เพิ่ม</span>
           </Link>
           <Link
             href="/dashboard/products/categories"
             className="inline-flex items-center justify-center px-3 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors gap-1.5 text-sm"
           >
             <MdCategory size={18} />
             <span className="hidden sm:inline">จัดการหมวดหมู่</span>
             <span className="sm:hidden">หมวดหมู่</span>
           </Link>
           <Link
             href="/dashboard/products/sizes"
             className="inline-flex items-center justify-center px-3 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors gap-1.5 text-sm"
           >
             <BsRulers size={18} />
             <span className="hidden sm:inline">จัดการขนาด</span>
             <span className="sm:hidden">ขนาด</span>
           </Link>
         </div>
       </div>

       {/* Products List */}
       <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-zinc-200">
         {/* Mobile View */}
         <div className="block sm:hidden">
           {products.length === 0 ? (
             <div className="p-6 text-center text-zinc-500">ไม่พบข้อมูลสินค้า</div>
           ) : (
             <div className="divide-y divide-zinc-200">
               {products.map((product) => (
                 <div key={product.id} className="p-4 space-y-3">
                   <div className="flex items-center gap-3">
                     {/* Product Image */}
                     <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                       {product.images[0] ? (
                         <img 
                           src={product.images[0].url}
                           alt={product.name}
                           className="w-full h-full object-cover"
                         />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-zinc-400">
                           No image
                         </div>
                       )}
                     </div>

                     {/* Product Info */}
                     <div className="flex-1 min-w-0">
                       <h3 className="text-sm font-medium text-zinc-900 truncate">
                         {product.name}
                       </h3>
                       <p className="text-sm text-zinc-500 mt-0.5">{product.category.name}</p>
                       <p className="text-sm font-medium mt-0.5">฿{product.price.toLocaleString()}</p>
                     </div>
                   </div>

                   {/* Sizes */}
                   <div className="flex flex-wrap gap-1.5">
                     {product.sizes.map((size) => (
                       <span 
                         key={size.id}
                         className="px-2 py-1 bg-zinc-100 rounded text-xs text-zinc-700"
                       >
                         {size.size.name} ({size.stock})
                       </span>
                     ))}
                   </div>

                   {/* Status and Actions */}
                   <div className="flex items-center justify-between pt-2">
                     <span 
                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stockStatus.className}`}
                     >
                       {product.stockStatus.label}
                     </span>
                     <Link
                       href={`/dashboard/products/${product.id}/edit`}
                       className="inline-flex items-center px-3 py-1.5 text-sm text-violet-600 hover:bg-violet-50 rounded-lg transition-colors gap-1.5"
                     >
                       <FiEdit2 size={16} />
                       <span>แก้ไข</span>
                     </Link>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </div>

         {/* Desktop Table */}
         <div className="hidden sm:block">
           <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-zinc-200">
               <thead>
                 <tr className="bg-zinc-50/75">
                   <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">รูปภาพ</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">ชื่อสินค้า</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">หมวดหมู่</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">ราคา</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">สถานะ</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">ขนาดที่มี</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">จัดการ</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-zinc-200">
                 {products.length === 0 ? (
                   <tr>
                     <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">ไม่พบข้อมูลสินค้า</td>
                   </tr>
                 ) : (
                   products.map((product) => (
                     <tr key={product.id} className="hover:bg-zinc-50/50">
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="h-12 w-12 rounded-lg overflow-hidden bg-zinc-100">
                           {product.images[0] ? (
                             <img 
                               src={product.images[0].url}
                               alt={product.name}
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
                         <div className="text-sm font-medium text-zinc-900">{product.name}</div>
                         <div className="text-sm text-zinc-500">Added {new Date(product.createdAt).toLocaleDateString()}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                         {product.category.name}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                         ฿{product.price.toLocaleString()}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span 
                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stockStatus.className}`}
                         >
                           {product.stockStatus.label}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex flex-wrap gap-1 max-w-[200px]">
                           {product.sizes.map(size => (
                             <span 
                               key={size.id}
                               className="px-2 py-1 text-xs rounded-md bg-zinc-100 text-zinc-600"
                             >
                               {size.size.name} ({size.stock})
                             </span>
                           ))}
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <Link
                           href={`/dashboard/products/${product.id}/edit`}
                           className="text-violet-600 hover:text-violet-900"
                         >
                           แก้ไข
                         </Link>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;