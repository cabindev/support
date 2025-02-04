// app/dashboard/products/orders/print-only/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface ShippingLabel {
  id: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
}

export default function PrintOnlyPage() {
  const [labels, setLabels] = useState<ShippingLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchShippingLabels();
  }, []);

  const fetchShippingLabels = async () => {
    try {
      const res = await fetch("/api/orders/shipping-labels");
      if (!res.ok) throw new Error("Failed to fetch shipping labels");
      const data = await res.json();
      setLabels(data);
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลได้");
      console.error("Failed to fetch labels:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchShippingLabels}
          className="text-violet-600 hover:underline"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Preview Controls - จะถูกซ่อนตอนพิมพ์ */}
      <div className="print:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">
            พิมพ์ที่อยู่จัดส่ง ({labels.length} รายการ)
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              พิมพ์
            </button>
            <Link
              href="/dashboard/products/orders"
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              กลับ
            </Link>
          </div>
        </div>
      </div>

      {/* Shipping Labels */}
      <div className="pt-16 print:pt-0">
        {labels.map((label, index) => (
          <div key={label.id} className="shipping-label">
            {/* Label Content */}
            <div className="label-inner">
              {/* Logo & Header */}
              <div className="logo-section">
                <div className="flex items-center">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="logo-image"
                  />
                  {/* ย้าย SDN THAILAND มาอยู่ข้าง logo อันเดียว */}
                  <span className="text-sm ml-2">SDN THAILAND</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="content-section">
                <div className="recipient-info">
                  <div className="text-lg font-bold">ผู้รับ: {label.name}</div>
                  <div className="text-base mt-1">โทร: {label.phone}</div>
                </div>

                <div className="mt-3">
                  <div className="text-base">ที่อยู่:</div>
                  <div className="ml-3 text-base">
                    {label.address}
                    <br />
                    {label.district} {label.amphoe}
                    <br />
                    {label.province} {label.zipcode}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="footer-section">
                <div className="text-xs text-gray-500">#{label.id}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @page {
          size: 150mm 100mm; /* กว้าง 15cm x สูง 10cm */
          margin: 0;
        }

        @media print {
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .shipping-label {
            width: 150mm;
            height: 100mm;
            page-break-after: always;
            position: relative;
          }

          .label-inner {
            padding: 10mm;
            height: 100%;
            position: relative;
            font-family: "Sarabun", sans-serif;
          }

          .logo-section {
            display: flex;
            align-items: center;
            margin-bottom: 8mm;
          }

          .logo-image {
            width: 40px;
            height: 40px;
            object-fit: contain;
          }

          .content-section {
            margin-bottom: 8mm;
          }

          .recipient-info {
            margin-bottom: 4mm;
          }

          .footer-section {
            position: absolute;
            bottom: 5mm;
            left: 10mm;
          }
        }

        /* Preview Styles */
        @media screen {
          .shipping-label {
            width: 150mm;
            height: 100mm;
            margin: 20px auto;
            border: 1px solid #ccc;
            background: white;
          }

          .label-inner {
            padding: 10mm;
            height: 100%;
            position: relative;
          }
        }
      `}</style>
    </div>
  );
}
