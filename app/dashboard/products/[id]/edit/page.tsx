// app/dashboard/products/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';
import { 
  AdminProduct, 
  ProductStatus, 
  SizeStock 
} from '@/app/types/admin';

export default function EditProductPage({
 params
}: {
 params: { id: string }
}) {
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [product, setProduct] = useState<AdminProduct | null>(null);
 const [files, setFiles] = useState<FileList | null>(null);
 const [preview, setPreview] = useState<string[]>([]);
 const [removedImages, setRemovedImages] = useState<string[]>([]);
 const [totalStock, setTotalStock] = useState(0);
 const [selectedSizes, setSelectedSizes] = useState<SizeStock[]>([]);
 const [error, setError] = useState('');

 useEffect(() => {
   fetch(`/api/products/${params.id}`)
     .then(res => res.json())
     .then(data => {
       setProduct({
         ...data,
         price: Number(data.price)
       });
       setTotalStock(data.stock);
       setSelectedSizes(data.sizes.map((size: any) => ({
         sizeId: size.sizeId,
         stock: size.stock
       })));
     })
     .catch(err => {
       console.error('Failed to fetch product:', err);
       setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
     });
 }, [params.id]);

 useEffect(() => {
   if (!files) return;
   const objectUrls = Array.from(files).map(file => URL.createObjectURL(file));
   setPreview(objectUrls);
   return () => objectUrls.forEach(URL.revokeObjectURL);
 }, [files]);

 const handleRemoveImage = (imageId: string) => {
   setRemovedImages(prev => [...prev, imageId]);
 };

 const handleSizeStockChange = (sizeId: string, value: string) => {
   const stock = parseInt(value) || 0;
   setSelectedSizes(prev => {
     const updated = prev.map(s => 
       s.sizeId === sizeId ? { ...s, stock } : s
     );
     const total = updated.reduce((sum, size) => sum + size.stock, 0);
     setTotalStock(total);
     return updated;
   });
 };

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
   e.preventDefault();
   setLoading(true);
   setError('');

   try {
     const formData = new FormData(e.currentTarget);
     formData.append('sizes', JSON.stringify(selectedSizes));
     formData.append('totalStock', totalStock.toString());

     const remainingImages = product?.images.filter(img => !removedImages.includes(img.id)) || [];
     formData.append('existingImages', JSON.stringify(remainingImages));

     if (files) {
       const compressedFiles = await Promise.all(
         Array.from(files).map(async file => {
           const options = {
             maxSizeMB: 1,
             maxWidthOrHeight: 1024,
             useWebWorker: true
           };
           try {
             const compressedFile = await imageCompression(file, options);
             return compressedFile;
           } catch (error) {
             console.error(`Failed to compress ${file.name}:`, error);
             return file;
           }
         })
       );

       compressedFiles.forEach(file => {
         formData.append('images', file);
       });
     }

     const res = await fetch(`/api/products/${params.id}`, {
       method: 'PUT',
       body: formData
     });

     if (!res.ok) {
       const error = await res.json();
       throw new Error(error.error || 'Failed to update product');
     }

     router.push('/dashboard/products');
     router.refresh();
   } catch (error) {
     console.error('Error:', error);
     setError(error instanceof Error ? error.message : 'Failed to update product');
   } finally {
     setLoading(false);
   }
 }

 if (!product) {
   return <div className="p-6">กำลังโหลด...</div>;
 }

 return (
   <div className="container mx-auto p-6 bg-zinc-50 min-h-screen pt-20">
     <div className="max-w-4xl mx-auto">
       <h1 className="text-3xl text-red-600 font-bold mb-8">แก้ไขสินค้า</h1>
       
       <div className="bg-white rounded-2xl shadow-sm p-8">
         {error && (
           <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
             {error}
           </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-6">
           {/* Basic info */}
           <div className="space-y-6 pb-6 border-b">
             <h2 className="text-xl font-semibold">ข้อมูลพื้นฐาน</h2>
             
             <div>
               <label className="block text-sm font-medium text-zinc-700 mb-2">
                 ชื่อสินค้า
               </label>
               <input 
                 type="text"
                 name="name"
                 defaultValue={product.name}
                 required
                 className="w-full px-3 py-2 rounded-lg border"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-zinc-700 mb-2">
                 ราคา (บาท)
               </label>
               <input
                 type="number"
                 name="price"
                 defaultValue={product.price}
                 min="0"
                 required
                 className="w-full px-3 py-2 rounded-lg border"
               />
             </div>
           </div>

           {/* Stock management */}
           <div className="space-y-6 pb-6 border-b">
             <h2 className="text-xl font-semibold">จัดการสต็อกสินค้า</h2>

             <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
             {product.sizes?.map(size => (
                <div key={size.id} className="flex items-center gap-4">
                  <span className="flex-1 font-medium">{size.size.name}</span>
                  <input
                    type="number"
                    min="0" 
                    value={selectedSizes.find(s => s.sizeId === size.sizeId)?.stock || 0}
                    onChange={(e) => handleSizeStockChange(size.sizeId, e.target.value)}
                    className="w-32 px-3 py-2 rounded-lg border"
                  />
                </div>
              ))}
               <div className="pt-3 border-t">
                 <div className="flex justify-between text-sm">
                   <span>จำนวนทั้งหมด:</span>
                   <span className="font-medium">{totalStock}</span>
                 </div>
               </div>
             </div>
           </div>

           {/* Status */}
           <div className="space-y-6 pb-6 border-b">
             <h2 className="text-xl font-semibold">สถานะสินค้า</h2>
             <div className="flex items-center gap-4">
               {Object.values(ProductStatus).map((status) => (
                 <label key={status} className="inline-flex items-center">
                   <input
                     type="radio"
                     name="status"
                     value={status}
                     defaultChecked={status === product.status}
                     className="form-radio text-violet-600"
                   />
                   <span className="ml-2">{status}</span>
                 </label>
               ))}
             </div>
           </div>

           {/* Description */}
           <div className="space-y-6 pb-6 border-b">
             <h2 className="text-xl font-semibold">รายละเอียดสินค้า</h2>
             <textarea
               name="description"
               defaultValue={product.description}
               required
               rows={4}
               className="w-full px-3 py-2 rounded-lg border"
             />
           </div>

           {/* Images */}
           <div className="space-y-6">
             <h2 className="text-xl font-semibold">รูปภาพสินค้า</h2>

             {/* Existing Images */}
             <div className="grid grid-cols-4 gap-4">
               {product.images
                 .filter(image => !removedImages.includes(image.id))
                 .map((image) => (
                   <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden group">
                     <img
                       src={image.url}
                       alt={image.alt || ''}
                       className="object-cover w-full h-full"
                     />
                     <button
                       type="button"
                       onClick={() => handleRemoveImage(image.id)}
                       className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100"
                     >
                       ×
                     </button>
                     {image.isCover && (
                       <div className="absolute bottom-2 left-2 bg-violet-500 text-white text-xs px-2 py-1 rounded-full">
                         รูปปก
                       </div>
                     )}
                   </div>
                 ))}
             </div>

             {/* New Images */}
             <div>
               <input
                 type="file"
                 onChange={e => setFiles(e.target.files)}
                 multiple
                 accept="image/*"
                 className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-violet-50 file:text-violet-700"
               />
             </div>

             {preview.length > 0 && (
               <div className="grid grid-cols-4 gap-4">
                 {preview.map((url, index) => (
                   <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                     <img src={url} alt="" className="object-cover w-full h-full" />
                   </div>
                 ))}
               </div>
             )}
           </div>

           {/* Submit */}
           <div className="flex justify-end gap-4 pt-6">
             <Link
               href="/dashboard/products"
               className="px-6 py-2 border rounded-lg hover:bg-zinc-50"
             >
               ยกเลิก
             </Link>
             <button
               type="submit"
               disabled={loading}
               className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-zinc-400"
             >
               {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
             </button>
           </div>
         </form>
       </div>
     </div>
   </div>
 );
}