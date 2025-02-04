// app/products/components/ProductCard.tsx
'use client'

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductStatus } from '@/app/types';

interface ProductCardProps {
 product: Product;
}

const getBadgeConfig = (status: ProductStatus) => {
 switch (status) {
   case ProductStatus.PREORDER:
     return { color: 'bg-yellow-100 text-yellow-800', text: 'Pre-Order' };
   case ProductStatus.NEW:
     return { color: 'bg-green-100 text-green-800', text: 'New' };
   default:
     return null;
 }
};

export default function ProductCard({ product }: ProductCardProps) {
 const [isHovered, setIsHovered] = useState(false);
 
 const coverImage = product.images[0];
 const secondImage = product.images[1];
 
 const frontImage = coverImage?.url || '/images/no-image.jpg';
 const backImage = secondImage?.url || coverImage?.url || '/images/no-image.jpg';

 const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
 const badge = getBadgeConfig(product.status);

 return (
   <Link 
     href={`/products/${product.id}`}
     className="block group"
     onMouseEnter={() => setIsHovered(true)}
     onMouseLeave={() => setIsHovered(false)}
   >
     <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
       <div className="relative aspect-square">
         <Image
           src={isHovered ? backImage : frontImage}
           alt={coverImage?.alt || product.name}
           fill
           sizes="(max-width: 768px) 50vw, 33vw"
           className="object-cover transition-transform duration-300 group-hover:scale-105"
           priority={product.status === ProductStatus.NEW}
         />
         
         {badge && (
           <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
             {badge.text}
           </div>
         )}
         
         {totalStock <= 0 && (
           <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
             สินค้าหมด
           </div>
         )}
       </div>
       
       <div className="p-4">
         <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
         <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
           {product.name}
         </h3>
         <div className="flex justify-between items-center">
           <p className="text-lg font-bold text-gray-900">
             ฿{product.price.toLocaleString()}
           </p>
           {totalStock > 0 && product.status === ProductStatus.NORMAL && (
             <p className="text-sm text-gray-500">
               เหลือ {totalStock} ชิ้น
             </p>
           )}
           {product.status === ProductStatus.PREORDER && (
             <p className="text-sm text-blue-600">
               สั่งจองล่วงหน้า
             </p>
           )}
         </div>
       </div>
     </div>
   </Link>
 );
}