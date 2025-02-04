// app/dashboard/products/sizes/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Size {
 id: string;
 name: string; 
 description: string | null;
 _count: { productSizes: number };
}

export default function EditSizePage({ params }: { params: { id: string } }) {
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [formData, setFormData] = useState<Pick<Size, 'name' | 'description'>>({
   name: '',
   description: null
 });

 useEffect(() => {
   const fetchSize = async () => {
     try {
       const res = await fetch(`/api/sizes/${params.id}`);
       const data = await res.json();
       
       if (!res.ok) throw new Error(data.error);
       
       setFormData({
         name: data.name,
         description: data.description
       });
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Failed to fetch size');
     }
   };

   fetchSize();
 }, [params.id]);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setLoading(true);
   setError('');

   try {
     const res = await fetch(`/api/sizes/${params.id}`, {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(formData)
     });

     const data = await res.json();
     if (!res.ok) throw new Error(data.error);

     window.location.href = '/dashboard/products/sizes';
   } catch (err) {
     setError(err instanceof Error ? err.message : 'Failed to update size');
   } finally {
     setLoading(false);
   }
 };

 return (
   <div className="min-h-screen bg-zinc-50 pt-16">
     <div className="max-w-4xl mx-auto px-4 py-6">
       <h1 className="text-2xl font-bold text-zinc-800 mb-8">แก้ไขขนาดสินค้า</h1>
       
       <div className="bg-white rounded-xl shadow-sm p-6">
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
               value={formData.description || ''}
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
               {loading ? 'กำลังบันทึก...' : 'บันทึก'}
             </button>
           </div>
         </form>
       </div>
     </div>
   </div>
 );
}