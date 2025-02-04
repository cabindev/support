// app/admin/products/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';

type Category = {
 id: string;
 name: string;
}

type Size = {
 id: string;
 name: string;
 description: string | null;
}

type SizeStock = {
 sizeId: string;
 stock: number;
}

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5;

export default function CreateProductPage() {
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [categories, setCategories] = useState<Category[]>([]);
 const [sizes, setSizes] = useState<Size[]>([]);
 const [totalStock, setTotalStock] = useState(0);
 const [selectedSizes, setSelectedSizes] = useState<SizeStock[]>([]);
 const [allocatedStock, setAllocatedStock] = useState(0);
 const [files, setFiles] = useState<FileList | null>(null);
 const [preview, setPreview] = useState<string[]>([]);
 const [filesToRemove, setFilesToRemove] = useState<number[]>([]);
 const [error, setError] = useState<string>('');

 useEffect(() => {
   Promise.all([
     fetch('/api/products-categories').then(res => res.json()),
     fetch('/api/sizes').then(res => res.json())
   ])
   .then(([categoryData, sizeData]) => {
     setCategories(categoryData);
     setSizes(sizeData);
   })
   .catch(err => console.error('Failed to fetch data:', err));
 }, []);

 useEffect(() => {
   if (!files) return;
   const objectUrls = Array.from(files).map(file => URL.createObjectURL(file));
   setPreview(objectUrls);
   return () => objectUrls.forEach(URL.revokeObjectURL);
 }, [files]);

 const validateFiles = (fileList: FileList): boolean => {
   if (fileList.length > MAX_IMAGES) {
     setError(`สามารถอัพโหลดรูปได้สูงสุด ${MAX_IMAGES} รูป`);
     return false;
   }

   for (let i = 0; i < fileList.length; i++) {
     const file = fileList[i];
     if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
       setError(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน ${MAX_FILE_SIZE}MB`);
       return false;
     }
     if (!file.type.startsWith('image/')) {
       setError(`ไฟล์ ${file.name} ไม่ใช่รูปภาพ`);
       return false;
     }
   }
   
   setError('');
   return true;
 };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const files = e.target.files;
   if (!files) return;

   if (validateFiles(files)) {
     setFiles(files);
     setFilesToRemove([]);
   } else {
     e.target.value = '';
     setFiles(null);
     setPreview([]);
   }
 };

 const handleRemoveImage = (indexToRemove: number) => {
   if (!files) return;
   setFilesToRemove(prev => [...prev, indexToRemove]);
   const dt = new DataTransfer();
   Array.from(files)
     .filter((_, index) => index !== indexToRemove)
     .forEach(file => dt.items.add(file));
   setFiles(dt.files);
 };

 const handleTotalStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const total = parseInt(e.target.value) || 0;
   setTotalStock(total);
   setSelectedSizes([]);
   setAllocatedStock(0);
 };

 const handleSizeStockChange = (sizeId: string, value: string) => {
   const stock = parseInt(value) || 0;
   
   const updatedSizes = selectedSizes.filter(s => s.sizeId !== sizeId);
   if (stock > 0) {
     updatedSizes.push({ sizeId, stock });
   }
   
   const newAllocated = updatedSizes.reduce((sum, size) => sum + size.stock, 0);
   if (newAllocated <= totalStock) {
     setSelectedSizes(updatedSizes);
     setAllocatedStock(newAllocated);
   }
 };

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
   e.preventDefault();
   setLoading(true);
   setError('');

   try {
     const formData = new FormData(e.currentTarget);
     const name = formData.get('name');
     const description = formData.get('description');
     const price = formData.get('price');
     const categoryId = formData.get('categoryId');
     const status = formData.get('status');

     if (!name || !description || !price || !categoryId || !status) {
       throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
     }

     if (!files?.length) throw new Error('กรุณาเลือกรูปภาพอย่างน้อย 1 รูป');
     if (!selectedSizes.length) throw new Error('กรุณาเลือกขนาดสินค้าอย่างน้อย 1 ขนาด');
     if (allocatedStock !== totalStock) throw new Error('กรุณาแบ่งจำนวนสินค้าให้ครบตามจำนวนทั้งหมด');

     formData.append('sizes', JSON.stringify(selectedSizes));
     formData.append('totalStock', totalStock.toString());

     if (files) {
       const compressedFiles = await Promise.all(
         Array.from(files)
           .filter((_, index) => !filesToRemove.includes(index))
           .map(async file => {
             const options = {
               maxSizeMB: 1,
               maxWidthOrHeight: 1024,
               useWebWorker: true
             };
             try {
               const compressedFile = await imageCompression(file, options);
               return new File([compressedFile], file.name, {
                 type: compressedFile.type
               });
             } catch (error) {
               console.error(`Failed to compress ${file.name}:`, error);
               return file;
             }
           })
       );

       compressedFiles.forEach((file, index) => {
         formData.append('images', file);
         if (index === 0) formData.append('isCover', 'true');
       });
     }

     const res = await fetch('/api/products', {
       method: 'POST',
       body: formData
     });

     if (!res.ok) {
       const errorData = await res.json();
       throw new Error(errorData.error || 'Failed to create product');
     }

     router.push('/admin/products');
   } catch (error) {
     console.error('Error:', error);
     setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างสินค้า');
   } finally {
     setLoading(false);
   }
 }

 return (
   <div className="container mx-auto p-6 bg-zinc-50 min-h-screen pt-16">
     <div className="max-w-4xl mx-auto">
       <h1 className="text-3xl font-bold text-zinc-800 mb-8">เพิ่มสินค้าใหม่</h1>
       
       <div className="bg-white rounded-2xl shadow-sm p-8">
         {error && (
           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
             {error}
           </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-6">
           {/* Basic info section */}
           <div className="space-y-6 pb-6 border-b">
             <h2 className="text-xl font-semibold">ข้อมูลพื้นฐาน</h2>
             
             <div>
               <label className="block text-sm font-medium text-zinc-700 mb-2">
                 ชื่อสินค้า
               </label>
               <input 
                 type="text"
                 name="name"
                 required 
                 className="w-full px-3 py-2 rounded-lg border"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-zinc-700 mb-2">
                 หมวดหมู่
               </label>
               <select 
                 name="categoryId"
                 required
                 className="w-full px-3 py-2 rounded-lg border"
               >
                 <option value="">เลือกหมวดหมู่</option>
                 {categories.map(cat => (
                   <option key={cat.id} value={cat.id}>{cat.name}</option>
                 ))}
               </select>
             </div>

             <div>
               <label className="block text-sm font-medium text-zinc-700 mb-2">
                 ราคา (บาท)
               </label>
               <input
                 type="number"
                 name="price"
                 required
                 min="0"
                 className="w-full px-3 py-2 rounded-lg border"
               />
             </div>
           </div>

           {/* Stock management section */}
           <div className="space-y-6 pb-6 border-b">
             <h2 className="text-xl font-semibold">จัดการสต็อกสินค้า</h2>

             <div>
               <label className="block text-sm font-medium text-zinc-700 mb-2">
                 จำนวนสินค้าทั้งหมด
               </label>
               <input
                 type="number"
                 min="0"
                 value={totalStock}
                 onChange={handleTotalStockChange}
                 className="w-full px-3 py-2 rounded-lg border"
                 placeholder="ระบุจำนวนสินค้าทั้งหมด"
               />
             </div>

             {totalStock > 0 && (
               <div>
                 <label className="block text-sm font-medium text-zinc-700 mb-2">
                   แบ่งตามขนาด
                 </label>
                 <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                   {sizes.map(size => (
                     <div key={size.id} className="flex items-center gap-4">
                       <span className="flex-1 font-medium">{size.name}</span>
                       <input
                         type="number"
                         min="0"
                         max={totalStock - (allocatedStock - (selectedSizes.find(s => s.sizeId === size.id)?.stock || 0))}
                         value={selectedSizes.find(s => s.sizeId === size.id)?.stock || ''}
                         onChange={(e) => handleSizeStockChange(size.id, e.target.value)}
                         className="w-32 px-3 py-2 rounded-lg border"
                         placeholder="จำนวน"
                       />
                     </div>
                   ))}
                   <div className="pt-3 border-t">
                     <div className="flex justify-between text-sm">
                       <span>จำนวนที่แบ่งแล้ว:</span>
                       <span className={allocatedStock === totalStock ? 'text-green-600' : 'text-orange-600'}>
                         {allocatedStock}/{totalStock}
                       </span>
                     </div>
                   </div>
                 </div>
               </div>
             )}
           </div>

           {/* Status section */}
           <div className="space-y-6 pb-6 border-b">
             <h2 className="text-xl font-semibold">สถานะสินค้า</h2>
             <div className="flex items-center gap-4">
               <label className="inline-flex items-center">
                 <input
                   type="radio"
                   name="status"
                   value="NORMAL"
                   defaultChecked
                   className="form-radio text-violet-600"
                 />
                 <span className="ml-2">ปกติ</span>
               </label>
               <label className="inline-flex items-center">
                 <input
                   type="radio"
                   name="status"
                   value="PREORDER"
                   className="form-radio text-violet-600"
                 />
                 <span className="ml-2">พรีออเดอร์</span>
               </label>
               <label className="inline-flex items-center">
                 <input
                   type="radio"
                   name="status"
                   value="NEW"
                   className="form-radio text-violet-600"
                 />
                 <span className="ml-2">สินค้าใหม่</span>
               </label>
             </div>
           </div>

           {/* Description section */}
           <div className="space-y-6 pb-6 border-b">
             <h2 className="text-xl font-semibold">รายละเอียดสินค้า</h2>
             <textarea
               name="description"
               rows={4}
               required
               className="w-full px-3 py-2 rounded-lg border"
               placeholder="อธิบายรายละเอียดสินค้า"
             />
           </div>

           {/* Images section */}
           <div className="space-y-6">
             <h2 className="text-xl font-semibold">รูปภาพสินค้า</h2>
             
             <div>
               <input
                 type="file"
                 onChange={handleFileChange}
                 multiple
                 accept="image/*"
                 className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-violet-50 file:text-violet-700"
               />
               <p className="mt-1 text-sm text-zinc-500">
                 รูปแรกจะเป็นรูปปกสินค้า (สูงสุด 5 รูป, ไม่เกิน 5MB ต่อรูป)
               </p>
             </div>

             {preview.length > 0 && (
               <div className="grid grid-cols-4 gap-4">
                 {preview.map((url, index) => (
                   <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                     <img src={url} alt="" className="object-cover w-full h-full" />
                     <button
                       type="button"
                       onClick={() => handleRemoveImage(index)}
                       className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100" 
                     >
                       ×
                     </button>
                     {index === 0 && (
                       <div className="absolute bottom-2 left-2 bg-violet-500 text-white text-xs px-2 py-1 rounded-full">
                         รูปปก
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             )}
           </div>

           {/* Submit buttons */}
           <div className="flex justify-end gap-4 pt-6">
             <Link
               href="/dashboard/products"
               className="px-6 py-2 border rounded-lg hover:bg-zinc-50"
             >
               ยกเลิก
             </Link>
             <button
               type="submit"
               disabled={loading || allocatedStock !== totalStock}
               className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-zinc-400"
             >
               {loading ? 'กำลังบันทึก...' : 'เพิ่มสินค้า'}
             </button>
           </div>
         </form>
       </div>
     </div>
   </div>
 );
}