// app/checkout/success/page.tsx
import Link from 'next/link';

// Simple Check Circle SVG component
function CheckCircleIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-20 h-20 text-green-500 mx-auto mb-6"
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" 
        clipRule="evenodd" 
      />
    </svg>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="container mx-auto px-4 py-12 pt-24">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
        <CheckCircleIcon />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          สั่งซื้อสำเร็จ
        </h1>
        
        <p className="text-gray-600 mb-8">
          ขอบคุณสำหรับการสั่งซื้อ เราได้รับคำสั่งซื้อของคุณแล้ว 
          กรุณาชำระเงินภายใน 24 ชั่วโมง
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="font-medium text-gray-900 mb-4">รายละเอียดการชำระเงิน</h2>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p>รหัสคำสั่งซื้อ: #ORDER123456</p>
            <p>จำนวนเงินที่ต้องชำระ: ฿820.00</p>
            
            <div className="pt-2 mt-2 border-t">
              <p className="font-medium text-gray-900">ธนาคารกรุงไทย สาขากระทรวงสาธารณสุข</p>
              <p>เลขที่บัญชี: 1420040707</p>
              <p>ชื่อบัญชี: นายยงยุทธ ยอดจารย์</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders" 
            className="inline-flex justify-center items-center px-6 py-2 border border-violet-600 
              text-violet-600 font-medium rounded-lg hover:bg-violet-50 transition-colors"
          >
            ดูรายการสั่งซื้อ
          </Link>

          <Link
            href="/"
            className="inline-flex justify-center items-center px-6 py-2 bg-violet-600 
              text-white font-medium rounded-lg hover:bg-violet-700 transition-colors"
          >
            กลับหน้าหลัก
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>หากมีข้อสงสัยกรุณาติดต่อ</p>
          <p>โทร: 085-938-7714</p>
          <p>อีเมล: support@example.com</p>
        </div>
      </div>
    </main>
  );
}