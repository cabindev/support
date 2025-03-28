// app/admin/products/create-products-category/page.tsx
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProductCategoryPage() {
 const router = useRouter();
 const [loading, setLoading] = useState(false);

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
   e.preventDefault();
   setLoading(true);

   try {
     const formData = new FormData(e.currentTarget);
     const data = {
       name: formData.get('name'),
       description: formData.get('description')
     };

     const res = await fetch('/api/products-categories', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(data)
     });

     if (!res.ok) throw new Error('Failed to create category');

     router.push('/dashboard/products');
     router.refresh();
   } catch (error) {
     console.error('Error:', error);
     alert('Failed to create category');
   } finally {
     setLoading(false);
   }
 }

 return (
   <div className="min-h-screen bg-zinc-50 pt-16">
     <div className="max-w-2xl mx-auto px-4 py-6">
       <h1 className="text-2xl font-bold text-zinc-800 mb-6">เพิ่มหมวดหมู่สินค้าใหม่</h1>
       <div className="bg-white rounded-xl shadow-sm p-6">
         <form onSubmit={handleSubmit} className="space-y-6">
           <div>
             <label className="block text-sm font-medium text-zinc-700 mb-2">
               ชื่อหมวดหมู่
             </label>
             <input 
               type="text" 
               name="name" 
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
               rows={4}
               className="w-full px-3 py-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 shadow-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
             />
           </div>

           <div className="flex justify-end gap-4 pt-4">
             <button
               type="button"
               onClick={() => router.back()}
               className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
             >
               ยกเลิก
             </button>
             <button
               type="submit"
               disabled={loading}
               className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-zinc-400 disabled:cursor-not-allowed"
             >
               {loading ? 'กำลังบันทึก...' : 'เพิ่มหมวดหมู่'}
             </button>
           </div>
         </form>
       </div>
     </div>
   </div>
 );
}