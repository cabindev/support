// types/checkout.ts

// Product & Cart Interfaces
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  size: {
    id: string;
    name: string;
  };
}

export interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
}

// Region & Shipping Interfaces
export interface RegionData {
  district: string;
  amphoe: string;
  province: string;
  zipcode: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
}

// Order & Payment Interfaces
export interface OrderData {
  totalAmount: number;
  items: Array<{
    productId: string;
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
  status: string;
  paymentMethod: string;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'VERIFIED' | 'CANCELLED';
  createdAt: string;
  shippingInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    district: string;
    amphoe: string;
    province: string;
    zipcode: string;
  };
  paymentSlip?: {
    originalUrl: string;
    verified: boolean;
    verifiedAt?: string;
  };
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

export interface PaymentSlip {
  id: string;
  orderId: string;
  originalUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: number;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Constants
export const steps = [
  { name: 'SHOPPING CART', href: '/cart' },
  { name: 'CHECKOUT DETAILS', href: '/checkout' },
  { name: 'PAYMENT', href: '#' },
  { name: 'COMPLETE', href: '#' }
];

export const bankInfo = {
  name: 'ธนาคารไทยพาณิชย์ จำกัด (มหาชน)',
  branch: 'สาขาเซ็นทรัลพลาซ่า แกรนด์ พระราม 9',
  accountNumber: '0662276102',
  accountName: 'น.ส.ธัญญพัฒน์ พงษ์ประดิษฐ์'
};