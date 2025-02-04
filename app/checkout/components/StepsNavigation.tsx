// app/checkout/components/StepsNavigation.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Step {
  name: string;
  href: string;
  current?: boolean;
}

interface Props {
  currentStep: string;
  orderId?: string; // เพิ่ม orderId property
}

export default function StepsNavigation({ currentStep, orderId }: Props) {
  const router = useRouter();

  const handleStepClick = (stepName: string) => {
    if (stepName === 'CHECKOUT DETAILS' && currentStep === 'PAYMENT') {
      // บันทึกข้อมูลตะกร้าก่อนย้อนกลับ
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        localStorage.setItem('tempCart', cartData); // เก็บข้อมูลตะกร้าชั่วคราว
      }
      router.push(`/checkout?verify=true&orderId=${orderId}`);
    }
  };

  return (
    <nav className="flex justify-center mb-8">
      <ol className="flex items-center space-x-4">
        <li className="flex items-center">
          <button
            onClick={() => handleStepClick('SHOPPING CART')}
            className={`px-4 py-2 text-sm font-medium rounded-lg
              ${currentStep === 'SHOPPING CART'
                ? 'bg-violet-600 text-white'
                : 'text-gray-500'}`}
          >
            SHOPPING CART
          </button>
          <span className="mx-2 text-gray-300">›</span>
        </li>

        <li className="flex items-center">
          <button
            onClick={() => handleStepClick('CHECKOUT DETAILS')}
            className={`px-4 py-2 text-sm font-medium rounded-lg
              ${currentStep === 'CHECKOUT DETAILS'
                ? 'bg-violet-600 text-white'
                : currentStep === 'PAYMENT' 
                  ? 'text-gray-500 hover:text-violet-600 cursor-pointer'
                  : 'text-gray-500'}`}
          >
            CHECKOUT DETAILS
          </button>
          <span className="mx-2 text-gray-300">›</span>
        </li>

        <li className="flex items-center">
          <span 
            className={`px-4 py-2 text-sm font-medium rounded-lg
              ${currentStep === 'PAYMENT'
                ? 'bg-violet-600 text-white'
                : 'text-gray-500'}`}
          >
            PAYMENT
          </span>
          <span className="mx-2 text-gray-300">›</span>
        </li>

        <li>
          <span 
            className="px-4 py-2 text-sm font-medium rounded-lg text-gray-500"
          >
            COMPLETE
          </span>
        </li>
      </ol>
    </nav>
  );
}