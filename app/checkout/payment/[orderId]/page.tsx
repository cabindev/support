// checkout/payment/[orderId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import StepsNavigation from '../../components/StepsNavigation';
import { toast, Toaster } from 'react-hot-toast';
import { OrderData, bankInfo } from '@/app/checkout/types/checkout';

interface OrderSummary {
  id: string;
  totalAmount: number;
  items: Array<{
    productName: string;
    sizeName: string;
    quantity: number;
    price: number;
  }>;
  shippingInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
    district: string;
    amphoe: string;
    province: string;
    zipcode: string;
  };
}

export default function PaymentPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  useEffect(() => {
    fetchOrderSummary();
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [params.orderId]);

  const fetchOrderSummary = async () => {
    try {
      const res = await fetch(`/api/orders/${params.orderId}`);
      if (!res.ok) throw new Error('Failed to fetch order');
      const data = await res.json();
      setOrderSummary(data);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลการสั่งซื้อได้');
      console.error('Fetch order error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }

      try {
        const options = {
          maxSizeMB: 0.128,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: 'image/jpeg'
        };

        setPreviewUrl(URL.createObjectURL(file));
        const compressedFile = await imageCompression(file, options);
        setSelectedFile(compressedFile);
        setError('');
      } catch (err) {
        console.error('Compression error:', err);
        setError('เกิดข้อผิดพลาดในการประมวลผลรูปภาพ');
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('กรุณาเลือกไฟล์สลิปการโอนเงิน');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('slip', selectedFile);
      formData.append('orderId', params.orderId);

      const res = await fetch('/api/payments/upload-slip', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'การอัพโหลดล้มเหลว');
      }

      router.push(`/checkout/complete/${params.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-12 pt-24">
        <Toaster position="top-right" />
        <StepsNavigation currentStep="PAYMENT" orderId={params.orderId} />
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-600" />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 pt-24">
      <Toaster position="top-right" />
      <StepsNavigation currentStep="PAYMENT" orderId={params.orderId} />

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-6">สรุปรายการสั่งซื้อ</h2>
            {orderSummary && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {orderSummary.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.productName} ({item.sizeName}) × {item.quantity}
                      </span>
                      <span>฿{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>มูลค่าสินค้า</span>
                    <span>฿{orderSummary.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>ราคาสินค้าได้รวมค่าจัดส่งแล้ว</span>
                    <span className="text-sm text-violet-600">ฟรี</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2 border-t">
                    <span>ยอดที่ต้องชำระ</span>
                    <span>฿{orderSummary.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <h3 className="font-medium">ที่อยู่จัดส่ง</h3>
                  <div className="text-sm text-gray-600">
                    <p>{orderSummary.shippingInfo.name}</p>
                    <p>{orderSummary.shippingInfo.phone}</p>
                    <p>{orderSummary.shippingInfo.address}</p>
                    <p>
                      {orderSummary.shippingInfo.district} {orderSummary.shippingInfo.amphoe}
                      <br />
                      {orderSummary.shippingInfo.province} {orderSummary.shippingInfo.zipcode}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Upload */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-6">ช่องทางการชำระเงิน</h2>

            <div className="space-y-6">
              <div className="p-4 border rounded-lg space-y-4">
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

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    อัพโหลดสลิปการโอนเงิน
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    รูปภาพจะถูกบีบอัดให้มีขนาดไม่เกิน 128KB โดยอัตโนมัติ
                  </p>
                </div>

                {previewUrl && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      ตัวอย่างรูปภาพ
                      {selectedFile && (
                        <span className="ml-2 text-gray-400">
                          (ขนาดหลังบีบอัด: {(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      )}
                    </p>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mt-2 max-h-60 rounded-lg"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium
                    ${uploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-violet-600 hover:bg-violet-700'
                    }`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      กำลังอัพโหลด...
                    </span>
                  ) : (
                    'อัพโหลดสลิป'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}