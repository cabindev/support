// products/components/ProductDetails.tsx
'use client';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductImages from './Product-images';
import CartDrawer from '@/app/components/cart/CartDrawer';
import { type Product, type CartItem, ProductStatus } from '@/app/types/product';

interface Props {
 product: Product;
}

export function ProductDetails({ product }: Props) {
 const router = useRouter();
 
 const [cartItems, setCartItems] = useState<CartItem[]>([]);
 const [selectedSize, setSelectedSize] = useState('');
 const [quantity, setQuantity] = useState(1);
 const [isCartOpen, setIsCartOpen] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const selectedSizeData = product.sizes.find(s => s.size.id === selectedSize);
 const maxStock = selectedSizeData?.stock ?? 0;

 // Fetch cart items on mount
 useEffect(() => {
   fetchCart();
 }, []);

 // Update quantity if needed
 useEffect(() => {
   if (quantity > maxStock) {
     setQuantity(maxStock);
   }
 }, [selectedSize, maxStock, quantity]);

 // Cart operations
 const fetchCart = async () => {
   try {
     const res = await fetch('/api/cart');
     if (!res.ok) throw new Error('Failed to fetch cart');
     const data = await res.json();
     setCartItems(data);
   } catch (err) {
     console.error('Error fetching cart:', err);
   }
 };

 const handleAddToCart = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!selectedSize) {
     setError('กรุณาเลือกขนาด');
     return;
   }

   setIsLoading(true);
   setError(null);

   try {
     const res = await fetch('/api/cart', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         productId: product.id,
         sizeId: selectedSize,
         quantity,
         price: product.price
       })
     });

     if (!res.ok) throw new Error();

     const { id } = await res.json();
     const newItem: CartItem = {
       id,
       quantity,
       product: {
         id: product.id,
         name: product.name,
         price: product.price,
         image: product.images[0]?.url || '/images/no-image.jpg',
         size: selectedSizeData!.size
       }
     };

     setCartItems(prev => [...prev, newItem]);
     setIsCartOpen(true);
     
   } catch (err) {
     setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
   } finally {
     setIsLoading(false);
   }
 };

 const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
   if (newQuantity < 1) return;
   
   try {
     const res = await fetch(`/api/cart/${itemId}`, {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ quantity: newQuantity })
     });

     if (!res.ok) throw new Error();

     setCartItems(prev => prev.map(item => 
       item.id === itemId ? { ...item, quantity: newQuantity } : item
     ));
     
   } catch (err) {
     console.error('Error updating quantity:', err);
   }
 };

 const handleRemoveItem = async (itemId: string) => {
   try {
     const res = await fetch(`/api/cart/${itemId}`, {
       method: 'DELETE'
     });

     if (!res.ok) throw new Error();

     setCartItems(prev => prev.filter(item => item.id !== itemId));
   } catch (err) {
     console.error('Error removing item:', err);
   }
 };

 return (
   <div className="bg-white rounded-xl shadow-sm p-8">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
       <ProductImages 
         images={product.images.map(img => img.url)}
         name={product.name}
       />

       <div className="space-y-8">
         {/* Header */}
         <div>
           <div className="flex items-center gap-2 mb-3">
             <span className="inline-flex px-3 py-1 rounded-full text-sm 
               bg-violet-100 text-violet-800 font-medium">
               {product.category.name}
             </span>
             
             {product.status !== ProductStatus.NORMAL && (
               <span className={`inline-flex px-3 py-1 rounded-full text-sm 
                 font-medium ${
                   product.status === ProductStatus.PREORDER 
                     ? 'bg-yellow-100 text-yellow-800'
                     : 'bg-green-100 text-green-800'
                 }`}
               >
                 {product.status === ProductStatus.PREORDER ? 'พรีออเดอร์' : 'สินค้าใหม่'}
               </span>
             )}
           </div>

           <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
           <p className="text-3xl font-bold text-violet-600">
             ฿{product.price.toLocaleString()}
           </p>
         </div>

         {/* Add to Cart Form */}
         <form onSubmit={handleAddToCart} className="space-y-6">
           {/* Size Selection */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               ขนาด
             </label>
             <div className="grid grid-cols-2 gap-2">
               {product.sizes.map(({ size, stock }) => (
                 <label
                   key={size.id}
                   className={`flex items-center justify-between p-3 border rounded-lg
                     ${stock > 0 ? 'cursor-pointer hover:border-violet-500' : 'opacity-50'}
                     ${selectedSize === size.id ? 'border-violet-500 bg-violet-50' : ''}
                   `}
                 >
                   <div className="flex items-center">
                     <input
                       type="radio"
                       name="size"
                       value={size.id}
                       disabled={stock === 0}
                       checked={selectedSize === size.id}
                       onChange={(e) => setSelectedSize(e.target.value)}
                       className="text-violet-600"
                       required
                     />
                     <span className="ml-2">{size.name}</span>
                   </div>
                   <span className={`text-sm ${
                     stock === 0 ? 'text-red-500' :
                     stock <= 5 ? 'text-orange-500 font-medium' :
                     'text-gray-500'
                   }`}>
                     {stock === 0 ? 'สินค้าหมด' : `${stock} ชิ้น`}
                   </span>
                 </label>
               ))}
             </div>
           </div>

           {/* Quantity */}
           {selectedSize && (
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 จำนวน
               </label>
               <input
                 type="number"
                 min="1"
                 max={maxStock}
                 value={quantity}
                 onChange={(e) => setQuantity(Number(e.target.value))}
                 className="w-24 px-3 py-2 border rounded-lg"
                 required
               />
             </div>
           )}

           {/* Description */}
           <div className="prose prose-gray max-w-none">
             <h2 className="text-xl font-semibold text-gray-900 mb-3">
               รายละเอียดสินค้า
             </h2>
             <p className="text-gray-600 leading-relaxed">
               {product.description}
             </p>
           </div>

           {error && (
             <p className="text-sm text-red-600">{error}</p>
           )}

           <button
             type="submit"
             disabled={isLoading || !selectedSize}
             className="w-full py-4 px-6 bg-violet-600 text-white font-medium rounded-lg
               hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
           >
             {isLoading ? 'กำลังเพิ่ม...' : 'เพิ่มลงตะกร้า'}
           </button>
         </form>
       </div>
     </div>

     <CartDrawer
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      items={cartItems}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
    />
   </div>
 );
}