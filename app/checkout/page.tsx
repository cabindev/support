// app/checkout/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { data as regionData } from '@/app/data/regions';
import Image from 'next/image';
import StepsNavigation from './components/StepsNavigation';
import {
  CartItem,
  RegionData,
  ShippingInfo,
  OrderData,
  bankInfo
} from '../checkout/types/checkout';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressRef = useRef<HTMLDivElement>(null);

  const orderId = searchParams.get('orderId');
  const isVerifying = searchParams.get('verify') === 'true';

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [filteredRegions, setFilteredRegions] = useState<RegionData[]>([]);
  const [showRegions, setShowRegions] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    loadSavedData();
    fetchCart();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressRef.current && !addressRef.current.contains(event.target as Node)) {
        setShowRegions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => 
      sum + (item.quantity * Number(item.product.price)), 0);
  };

  const isValidShippingInfo = (info: any): info is ShippingInfo => {
    return info?.firstName && info?.lastName && info?.phone && 
           info?.email && info?.address;
  };

  const isValidRegionData = (region: any): region is RegionData => {
    return region?.district && region?.amphoe && 
           region?.province && region?.zipcode;
  };

  const loadSavedData = () => {
    try {
      const savedShippingInfo = localStorage.getItem('shippingInfo');
      const savedRegion = localStorage.getItem('selectedRegion');
      
      if (savedShippingInfo) {
        const parsedInfo = JSON.parse(savedShippingInfo);
        if (isValidShippingInfo(parsedInfo)) {
          setShippingInfo(parsedInfo);
        }
      }

      if (savedRegion) {
        const parsedRegion = JSON.parse(savedRegion);
        if (isValidRegionData(parsedRegion)) {
          setSelectedRegion(parsedRegion);
          setSearchTerm(parsedRegion.district);
        }
      }
    } catch (err) {
      console.error('Error loading from localStorage:', err);
      toast.error('ไม่สามารถโหลดข้อมูลที่บันทึกไว้ได้');
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      
      // ถ้าเป็นการตรวจสอบข้อมูล ให้ใช้ข้อมูลจาก tempCart
      if (isVerifying) {
        const tempCartData = localStorage.getItem('tempCart');
        if (tempCartData) {
          setCartItems(JSON.parse(tempCartData));
          setLoading(false);
          return;
        }
      }
  
      // ถ้าไม่ใช่การตรวจสอบ หรือไม่มี tempCart ให้ดึงข้อมูลจาก API ตามปกติ
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Failed to fetch cart');
      
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid cart data');
      
      setCartItems(data);
      localStorage.setItem('cart', JSON.stringify(data));
    } catch (err) {
      console.error('Fetch cart error:', err);
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setError('ไม่สามารถโหลดข้อมูลตะกร้าสินค้าได้');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedInfo = { ...shippingInfo, [name]: value };
    setShippingInfo(updatedInfo);
    localStorage.setItem('shippingInfo', JSON.stringify(updatedInfo));
  };

  const handleRegionSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const searchLower = value.toLowerCase();
      const filtered = regionData
        .filter(region => 
          region.district.toLowerCase().includes(searchLower) ||
          region.amphoe.toLowerCase().includes(searchLower) ||
          region.province.toLowerCase().includes(searchLower)
        )
        .slice(0, 10)
        .map(region => ({
          ...region,
          zipcode: Number(region.zipcode)
        }));
      setFilteredRegions(filtered);
      setShowRegions(true);
    } else {
      setFilteredRegions([]);
      setShowRegions(false);
    }
  };

  const handleRegionSelect = (region: RegionData) => {
    setSelectedRegion(region);
    setSearchTerm(region.district);
    setShowRegions(false);
    localStorage.setItem('selectedRegion', JSON.stringify(region));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRegion || !isValidShippingInfo(shippingInfo)) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setSubmitting(true);

    try {
      if (isVerifying && orderId) {
        // ถ้าเป็นการตรวจสอบข้อมูล ให้กลับไปที่หน้า payment
        router.push(`/checkout/payment/${orderId}`);
      } else {
        // สร้าง order ใหม่
        const orderData: OrderData = {
          totalAmount: calculateTotal(),
          items: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: Number(item.product.price)
          })),
          shippingInfo: {
            name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            phone: shippingInfo.phone,
            email: shippingInfo.email,
            address: shippingInfo.address,
            district: selectedRegion.district,
            amphoe: selectedRegion.amphoe,
            province: selectedRegion.province,
            zipcode: selectedRegion.zipcode.toString()
          },
          status: 'PENDING',
          paymentMethod: 'BANK_TRANSFER'
        };

        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to create order');
        }

        const { orderId } = await res.json();
        
        // เคลียร์ตะกร้าเฉพาะเมื่อสร้าง order ใหม่
        await fetch('/api/cart/clear', { method: 'DELETE' });
        router.push(`/checkout/payment/${orderId}`);
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-12 pt-24">
        <Toaster position="top-right" />
        <StepsNavigation currentStep="CHECKOUT DETAILS" />
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-600" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-12 pt-24">
        <Toaster position="top-right" />
        <StepsNavigation currentStep="CHECKOUT DETAILS" />
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchCart}
            className="text-violet-600 hover:underline"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </main>
    );
  }

  if (!cartItems.length && !isVerifying) {
    return (
      <main className="container mx-auto px-4 py-12 pt-24">
        <Toaster position="top-right" />
        <StepsNavigation currentStep="CHECKOUT DETAILS" />
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">กรุณาเลือกสินค้าก่อนดำเนินการต่อ</p>
          <Link href="/products" className="text-violet-600 hover:underline">
            เลือกซื้อสินค้า
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 pt-24">
      <Toaster position="top-right" />
      <StepsNavigation currentStep="CHECKOUT DETAILS" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-6">
            {isVerifying ? 'ตรวจสอบข้อมูลการจัดส่ง' : 'ข้อมูลการจัดส่ง'}
          </h2>
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={shippingInfo.firstName}
                  onChange={handleShippingInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={shippingInfo.lastName}
                  onChange={handleShippingInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  pattern="[0-9]{10}"
                  required
                  value={shippingInfo.phone}
                  onChange={handleShippingInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมล <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={shippingInfo.email}
                  onChange={handleShippingInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ที่อยู่ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                required
                value={shippingInfo.address}
                onChange={handleShippingInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Region Selection */}
            <div className="relative" ref={addressRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ตำบล/แขวง - อำเภอ/เขต - จังหวัด <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={searchTerm}
                onChange={(e) => handleRegionSearch(e.target.value)}
                placeholder="พิมพ์ชื่อตำบล/แขวง - อำเภอ/เขต - หรือจังหวัด"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              {showRegions && filteredRegions.length > 0 && (
               <div className="absolute z-10 w-full mt-1 bg-white border 
                 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                 {filteredRegions.map((region, index) => (
                   <button
                     key={index}
                     type="button"
                     onClick={() => handleRegionSelect(region)}
                     className="w-full px-4 py-2 text-left hover:bg-violet-50
                       focus:outline-none"
                   >
                     <div className="flex flex-col">
                       <span className="font-medium">{region.district}</span>
                       <span className="text-sm text-gray-500">
                         {region.amphoe}, {region.province}
                       </span>
                     </div>
                   </button>
                 ))}
               </div>
             )}
           </div>

           {/* Selected Region Info */}
           {selectedRegion && (
             <div className="grid grid-cols-3 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   อำเภอ/เขต
                 </label>
                 <input
                   type="text"
                   readOnly
                   value={selectedRegion.amphoe}
                   className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   จังหวัด
                 </label>
                 <input
                   type="text"
                   readOnly
                   value={selectedRegion.province}
                   className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   รหัสไปรษณีย์
                 </label>
                 <input
                   type="text"
                   readOnly
                   value={selectedRegion.zipcode}
                   className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                 />
               </div>
             </div>
           )}
         </form>
       </div>

       {/* Payment & Summary */}
       <div className="bg-white rounded-lg shadow-sm p-6">
         <h2 className="text-lg font-medium mb-6">ช่องทางการชำระเงิน</h2>
         
         <div className="p-4 border rounded-lg space-y-4">
           {/* Bank Transfer Info */}
           <div className="space-y-3">
             <h3 className="font-medium">โอนเงินผ่านธนาคาร</h3>
             
             <div className="flex items-start gap-4">
               <Image 
                 src="/images/SCB.jpg"
                 alt="SCB Bank"
                 width={60}
                 height={60}
                 className="object-contain"
               />
               
               <div className="space-y-2 text-gray-600">
                 <p>{bankInfo.name}</p>
                 <p>{bankInfo.branch}</p>
                 <p>ชื่อบัญชี: {bankInfo.accountName}</p>
                 <div className="flex items-center gap-2">
                   <span>เลขที่บัญชี:</span>
                   <code className="bg-gray-100 px-2 py-1 rounded">
                     {bankInfo.accountNumber}
                   </code>
                   <button
                     onClick={() => {
                       navigator.clipboard.writeText(bankInfo.accountNumber)
                         .then(() => toast.success('คัดลอกเลขบัญชีแล้ว'))
                         .catch(() => toast.error('ไม่สามารถคัดลอกได้'));
                     }}
                     className="text-violet-600 hover:underline"
                   >
                     คัดลอก
                   </button>
                 </div>
               </div>
             </div>
           </div>

           {/* Order Summary */}
           <div className="border-t pt-4 space-y-2">
             <h3 className="font-medium mb-2">สรุปรายการสั่งซื้อ</h3>
             {cartItems.map(item => (
               <div key={item.id} className="flex justify-between text-sm">
                 <span>
                   {item.product.name} ({item.product.size.name}) × {item.quantity}
                 </span>
                 <span>฿{(item.product.price * item.quantity).toLocaleString()}</span>
               </div>
             ))}
           </div>

           <div className="border-t pt-4 space-y-2">
             <div className="flex justify-between">
               <span>มูลค่าสินค้า</span>
               <span>฿{calculateTotal().toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-gray-600">
               <span>ราคาสินค้าได้รวมค่าจัดส่งแล้ว</span>
               <span className="text-sm text-violet-600">ฟรี</span>
             </div>
             <div className="flex justify-between font-medium text-lg pt-2 border-t">
               <span>ยอดรวมทั้งหมด</span>
               <span>฿{calculateTotal().toLocaleString()}</span>
             </div>
           </div>
         </div>

         {/* Submit Button */}
         <button
           type="submit"
           form="checkout-form"
           disabled={submitting}
           className="w-full mt-6 py-3 bg-violet-600 text-white rounded-lg
             hover:bg-violet-700 focus:ring-2 focus:ring-violet-500
             disabled:bg-gray-400 disabled:cursor-not-allowed
             transition-colors duration-200"
         >
           {submitting 
             ? 'กำลังดำเนินการ...' 
             : isVerifying 
               ? 'กลับไปหน้าชำระเงิน'
               : 'ดำเนินการต่อ'
           }
         </button>
       </div>
     </div>
   </main>
 );
}