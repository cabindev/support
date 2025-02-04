// app/dashboard/products/sizes/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CreateSizePage() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [formData, setFormData] = useState({
   name: searchParams.get('name') || '',
   description: searchParams.get('description') || ''
 });

 useEffect(() => {
   if (searchParams.get('name')) handleSubmit();
 }, []);

 async function handleSubmit(e?: React.FormEvent) {
   if (e) e.preventDefault();
   if (!formData.name.trim()) return;
   
   setLoading(true);
   setError('');

   try {
     const res = await fetch('/api/sizes', {
       method: 'POST',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(formData)
     });

     if (!res.ok) {
       const result = await res.json();
       throw new Error(result.error);
     }

     router.push('/dashboard/products/sizes');
     router.refresh();
   } catch (error) {
     setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาด');
   } finally {
     setLoading(false);
   }
 }

 return (
   <div className="container mx-auto p-6 bg-zinc-50 min-h-screen pt-16">
     <div className="max-w-4xl mx-auto">
       <h1 className="text-3xl font-bold text-zinc-800 mb-8">เพิ่มขนาดสินค้า</h1>
       
       <div className="bg-white rounded-2xl shadow-sm p-8">
         {error && (
           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
             {error}
           </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-6">
           <div>
             <label className="block text-sm font-medium text-zinc-700 mb-2">
               ชื่อขนาด
             </label>
             <input 
               type="text" 
               value={formData.name}
               onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
               required
               className="w-full px-3 py-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 shadow-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-zinc-700 mb-2">
               รายละเอียด
             </label>
             <textarea 
               value={formData.description}
               onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
               rows={4}
               className="w-full px-3 py-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 shadow-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
             />
           </div>

           <div className="flex justify-end pt-6">
             <Link
               href="/dashboard/products/sizes"
               className="rounded-lg px-4 py-2 border border-zinc-300 text-zinc-700 font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 mr-4"
             >
               ยกเลิก
             </Link>
             <button
               type="submit"
               disabled={loading}
               className="rounded-lg px-4 py-2 bg-violet-600 text-white font-medium hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
             >
               {loading ? 'กำลังบันทึก...' : 'เพิ่มขนาด'}
             </button>
           </div>
         </form>
       </div>
     </div>
   </div>
 );
}

