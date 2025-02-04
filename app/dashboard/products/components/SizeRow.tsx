// app/dashboard/products/components/SizeRow.tsx
'use client'
import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Size {
 id: string;
 name: string;
 description: string | null;
 _count: { productSizes: number };
}

export default function SizeRow({ size }: { size: Size }) {
 const [loading, setLoading] = useState(false);
 const router = useRouter();

 const handleDelete = async () => {
  if (!confirm('ต้องการลบขนาดนี้ใช่หรือไม่?')) return;
  
  setLoading(true);
  try {
    const res = await fetch(`/api/sizes/${size.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to delete size');
    }

    if (data.success) {
      window.location.href = '/dashboard/products/sizes';
    }
  } catch (error) {
    console.error('Delete error:', error);
    alert(error instanceof Error ? error.message : 'Failed to delete size');
  } finally {
    setLoading(false);
  }
};

 return (
   <tr className="hover:bg-zinc-50 transition-colors">
     <td className="px-6 py-4">
       <div className="text-sm font-medium text-zinc-900">{size.name}</div>
     </td>
     <td className="px-6 py-4">
       <div className="text-sm text-zinc-500">{size.description}</div>
     </td>
     <td className="px-6 py-4">
       <div className="text-sm text-zinc-500">{size._count.productSizes}</div>
     </td>
     <td className="px-6 py-4 whitespace-nowrap">
       <div className="flex gap-3">
         <Link
           href={`/dashboard/products/sizes/${size.id}/edit`}
           className="p-2 text-zinc-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
           title="Edit size"
         >
           <FiEdit size={18} />
         </Link>
         <button
           onClick={handleDelete}
           disabled={loading}
           className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           title="Delete size"
         >
           <RiDeleteBin6Line size={18} />
         </button>
       </div>
     </td>
   </tr>
 );
}