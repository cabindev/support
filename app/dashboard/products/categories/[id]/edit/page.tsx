// app/dashboard/products/categories/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoChevronBack } from "react-icons/io5";

type Category = {
 id: string;
 name: string;
 description?: string | null;
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [category, setCategory] = useState<Category | null>(null);

 useEffect(() => {
   fetch(`/api/products-categories/${params.id}`)
     .then(res => res.json())
     .then(setCategory)
     .catch(err => {
       console.error('Failed to fetch category:', err);
       alert('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้');
     });
 }, [params.id]);

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
   e.preventDefault();
   setLoading(true);

   try {
     const formData = new FormData(e.currentTarget);
     const data = {
       name: formData.get('name'),
       description: formData.get('description')
     };

     const res = await fetch(`/api/products-categories/${params.id}`, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(data)
     });

     if (!res.ok) throw new Error('Failed to update category');

     router.push('/dashboard/products/categories');
     router.refresh();
   } catch (error) {
     console.error('Error:', error);
     alert('ไม่สามารถแก้ไขข้อมูลหมวดหมู่ได้');
   } finally {
     setLoading(false);
   }
 }

 if (!category) {
   return (
     <div className="min-h-screen bg-zinc-50 pt-16">
       <div className="max-w-2xl mx-auto px-4 py-6">
         กำลังโหลด...
       </div>
     </div>
   );
 }

 return (
   <div className="min-h-screen bg-zinc-50 pt-16">
     <div className="max-w-2xl mx-auto px-4 py-6">
       {/* Header */}
       <div className="flex items-center gap-4 mb-6">
         <Link
           href="/dashboard/products/categories"
           className="p-2 text-zinc-500 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
         >
           <IoChevronBack size={20} />
         </Link>
         <div>
           <h1 className="text-2xl font-bold text-zinc-800">แก้ไขหมวดหมู่</h1>
           <p className="text-sm text-zinc-600">แก้ไขข้อมูลหมวดหมู่สินค้า</p>
         </div>
       </div>

       {/* Form */}
       <div className="bg-white rounded-xl shadow-sm p-6">
         <form onSubmit={handleSubmit} className="space-y-6">
           <div>
             <label className="block text-sm font-medium text-zinc-700 mb-2">
               ชื่อหมวดหมู่
             </label>
             <input 
               type="text" 
               name="name" 
               defaultValue={category.name}
               required
               className="w-full px-3 py-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 shadow-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-zinc-700 mb-2">
               รายละเอียด
             </label>
             <textarea 
               name="description" 
               defaultValue={category.description || ''}
               rows={4}
               className="w-full px-3 py-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 shadow-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
             />
           </div>

           <div className="flex justify-end gap-4 pt-4">
             <Link
               href="/dashboard/products/categories"
               className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
             >
               ยกเลิก
             </Link>
             <button
               type="submit"
               disabled={loading}
               className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-zinc-400 disabled:cursor-not-allowed"
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