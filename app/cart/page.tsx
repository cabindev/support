// app/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Types
interface ProductSize {
  id: string;
  name: string;
}

interface ProductImage {
  url: string;
  alt?: string;
}

interface CartProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  size: ProductSize;
  quantity: number;
}

interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
}

interface CartSummary {
  total: number;
}

type CartActionState = {
  isDeleting: string | null;
  isUpdating: string | null;
}

type UpdateQuantityFn = (itemId: string, newQuantity: number) => Promise<void>;
type RemoveItemFn = (itemId: string) => Promise<void>;

export default function CartPage() {
  const router = useRouter();

  // State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<CartActionState>({
    isDeleting: null,
    isUpdating: null
  });

  // Effects
  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  // Methods
  const calculateTotal = () => {
    if (cartItems.length === 0) {
      setSummary({ total: 0 });
      return;
    }

    const total = cartItems.reduce((sum, item) => {
      const price = Number(item.product.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    setSummary({ total });
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cart');
      
      if (!res.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await res.json();
      setCartItems(data);
      
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลตะกร้าสินค้าได้');
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity: UpdateQuantityFn = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setActionState(prev => ({
        ...prev,
        isUpdating: itemId
      }));

      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update quantity');
      }

      setCartItems(items =>
        items.map(item =>
          item.id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

    } catch (error) {
      alert('ไม่สามารถอัพเดตจำนวนสินค้าได้ กรุณาลองใหม่อีกครั้ง');
      await fetchCart();
    } finally {
      setActionState(prev => ({
        ...prev,
        isUpdating: null
      }));
    }
  };

  const removeItem: RemoveItemFn = async (itemId) => {
    try {
      setActionState(prev => ({
        ...prev,
        isDeleting: itemId
      }));

      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to remove item');
      }

      setCartItems(items => items.filter(item => item.id !== itemId));

    } catch (error) {
      alert('ไม่สามารถลบสินค้าได้ กรุณาลองใหม่อีกครั้ง');
      await fetchCart();
    } finally {
      setActionState(prev => ({
        ...prev,
        isDeleting: null
      }));
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-600" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchCart}
          className="text-violet-600 hover:underline"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  // Render empty cart
  if (cartItems.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12 pt-24">
        <h1 className="text-2xl font-bold mb-8">ตะกร้าสินค้า</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">ไม่มีสินค้าในตะกร้า</p>
          <Link 
            href="/products" 
            className="text-violet-600 hover:underline"
          >
            เลือกซื้อสินค้า
          </Link>
        </div>
      </main>
    );
  }

  // Main render
  return (
    <main className="container mx-auto px-4 py-12 pt-24">
      <h1 className="text-2xl font-bold mb-8">ตะกร้าสินค้า</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 relative">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg" />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">
                    ไซส์: {item.product.size.name}
                  </p>
                  <p className="text-violet-600 font-medium">
                    ฿{item.product.price.toLocaleString()}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={actionState.isUpdating === item.id || item.quantity <= 1}
                        className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x">
                        {actionState.isUpdating === item.id ? '...' : item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={actionState.isUpdating === item.id}
                        className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={actionState.isDeleting === item.id}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {actionState.isDeleting === item.id ? 'กำลังลบ...' : 'ลบ'}
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right font-medium">
                  ฿{(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
          <h2 className="text-lg font-medium mb-4">สรุปคำสั่งซื้อ</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>มูลค่าสินค้า</span>
              <span>฿{summary.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>ราคาสินค้าได้รวมค่าจัดส่งแล้ว</span>
              <span className="text-sm text-violet-600">ฟรี</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-3 border-t">
              <span>ยอดรวมทั้งหมด</span>
              <span>฿{summary.total.toLocaleString()}</span>
            </div>
          </div>

          <Link 
            href="/checkout"
            className="block w-full py-3 bg-violet-600 text-white text-center rounded-lg
              hover:bg-violet-700 transition-colors font-medium"
          >
            ดำเนินการชำระเงิน...
          </Link>
        </div>
      </div>
    </main>
  );
}