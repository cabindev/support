// app/dashboard/products/page.tsx
import Link from 'next/link';
import prisma from '@/app/lib/db';
import { IoMdAdd } from 'react-icons/io';
import { MdCategory } from 'react-icons/md';
import { BsRulers } from 'react-icons/bs';
import ProductRow from './components/ProductRow';
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
   <div className="min-h-screen bg-zinc-50 pt-20">
     <div className="max-w-7xl mx-auto px-4 py-6">
       <div className="flex justify-between items-center mb-6">
         <div className="space-y-1">
           <h1 className="text-2xl font-bold text-zinc-800">จัดการสินค้า</h1>
           <p className="text-sm text-zinc-600">สินค้าทั้งหมด {products.length} รายการ</p>
         </div>
         <div className="flex gap-3">
           <Link 
             href="/dashboard/products/create" 
             className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors gap-2"
           >
             <IoMdAdd size={20} />เพิ่มสินค้า
           </Link>
           <Link
             href="/dashboard/products/categories"
             className="inline-flex items-center px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors gap-2"
           >
             <MdCategory size={20} />จัดการหมวดหมู่
           </Link>
           <Link
             href="/dashboard/products/sizes"
             className="inline-flex items-center px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors gap-2"
           >
             <BsRulers size={20} />จัดการขนาด
           </Link>
         </div>
       </div>

       <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-zinc-200">
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
                   <ProductRow 
                     key={product.id} 
                     product={product}
                   />
                 ))
               )}
             </tbody>
           </table>
         </div>
       </div>
     </div>
   </div>
 );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;