// app/dashboard/products/components/CategoryRow.tsx
'use client'

import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Link from 'next/link';
import { useState } from 'react';

type CategoryRowProps = {
  category: {
    id: string;
    name: string;
    description?: string | null;
    _count: {
      products: number;
    };
  };
}

export default function CategoryRow({ category }: CategoryRowProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (category._count.products > 0) {
      alert('ไม่สามารถลบหมวดหมู่ที่มีสินค้าอยู่ได้');
      return;
    }

    if (!confirm('ต้องการลบหมวดหมู่นี้ใช่หรือไม่?')) return;
    
    setLoading(true);
    try {
      await fetch(`/api/products-categories/${category.id}`, {
        method: 'DELETE'
      });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-800">
        {category.name}
      </td>
      <td className="px-6 py-4 text-zinc-600">
        {category.description || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 py-1 rounded-full text-sm bg-violet-100 text-violet-800">
          {category._count.products}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-3">
          <Link
            href={`/dashboard/products/categories/${category.id}/edit`}
            className="p-2 text-zinc-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
          >
            <FiEdit size={18} />
          </Link>
          <button
            onClick={handleDelete}
            disabled={loading || category._count.products > 0}
            className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RiDeleteBin6Line size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}