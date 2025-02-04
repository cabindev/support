// app/products/components/SortSelect.tsx
'use client'

export default function SortSelect({ defaultValue }: { defaultValue?: string }) {
  return (
    <select
      className="px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
      defaultValue={defaultValue}
      onChange={(e) => {
        const url = new URL(window.location.href);
        url.searchParams.set('sort', e.target.value);
        window.location.href = url.toString();
      }}
    >
      <option value="">เรียงตาม</option>
      <option value="price-asc">ราคาน้อยไปมาก</option>
      <option value="price-desc">ราคามากไปน้อย</option>
      <option value="newest">ใหม่ล่าสุด</option>
    </select>
  );
}