// components/AddToCartForm.tsx
import { useState } from 'react';
import { ProductWithRelations } from '@/app/types';

interface AddToCartFormProps {
  product: ProductWithRelations;
}

export default function AddToCartForm({ product }: AddToCartFormProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSize) {
      alert('กรุณาเลือกขนาด');
      return;
    }

    const selectedSizeData = product.sizes.find(s => s.size.id === selectedSize);
    if (!selectedSizeData || selectedSizeData.stock < quantity) {
      alert('สินค้าในสต็อกไม่เพียงพอ');
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          sizeId: selectedSize,
          quantity,
          price: product.price
        })
      });

      if (!res.ok) throw new Error('Failed to add to cart');
      
      // Redirect to cart page on success
      window.location.href = '/cart';
    } catch (error) {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          จำนวน
        </label>
        <input 
          type="number"
          min="1"
          max={Math.max(...product.sizes.map(s => s.stock))}
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          className="w-24 px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ขนาด
        </label>
        <div className="grid grid-cols-2 gap-2">
          {product.sizes.map(({ size, stock }) => (
            <label 
              key={size.id}
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer
                ${stock > 0 ? 'hover:border-violet-500' : 'opacity-50 cursor-not-allowed'}
                ${selectedSize === size.id ? 'border-violet-500 bg-violet-50' : ''}`}
            >
              <div className="flex items-center">
                <input 
                  type="radio"
                  name="size"
                  value={size.id}
                  disabled={stock === 0}
                  checked={selectedSize === size.id}
                  onChange={e => setSelectedSize(e.target.value)}
                  className="text-violet-600"
                  required
                />
                <span className="ml-2">{size.name}</span>
              </div>
              <span className="text-sm text-gray-500">{stock} ชิ้น</span>
            </label>
          ))}
        </div>
      </div>

      <button 
        type="submit"
        className="w-full py-4 px-6 rounded-lg bg-violet-600 text-white font-medium
          hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500
          focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed
          transition-colors duration-200 text-lg"
        disabled={!selectedSize || product.stock === 0}
      >
        เพิ่มลงตะกร้า
      </button>
    </form>
  );
}