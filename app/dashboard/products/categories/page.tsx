// app/dashboard/products/categories/page.tsx
import Link from 'next/link';
import prisma from '@/app/lib/db';
import { IoMdAdd } from 'react-icons/io';
import { BsBox } from 'react-icons/bs';
import CategoryRow from '../components/CategoryRow';

export default async function CategoriesPage() {
  const categories = await prisma.storeCategory.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className="min-h-screen bg-zinc-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-zinc-800">จัดการหมวดหมู่สินค้า</h1>
            <p className="text-sm text-zinc-600">
              หมวดหมู่ทั้งหมด {categories.length} รายการ
            </p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/dashboard/products/categories/create" 
              className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors gap-2"
            >
              <IoMdAdd size={20} />
              เพิ่มหมวดหมู่
            </Link>
            <Link
              href="/dashboard/products"
              className="inline-flex items-center px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors gap-2"
            >
              <BsBox size={20} />
              จัดการสินค้า
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-zinc-200">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead>
              <tr className="bg-zinc-50/75">
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  ชื่อหมวดหมู่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  รายละเอียด
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  จำนวนสินค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-200">
              {categories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                    ไม่พบข้อมูลหมวดหมู่
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}