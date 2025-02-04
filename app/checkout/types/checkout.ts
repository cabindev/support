// app/checkout/types.ts
export interface CartProduct {
    id: string;
    name: string;
    price: number;
    image?: string;
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
  
  export interface OrderData {
    totalAmount: number;
    items: {
      productId: string;
      quantity: number;
      price: number;
    }[];
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
    status: 'PENDING';
    paymentMethod: 'BANK_TRANSFER';
  }
  
  export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  
  export const bankInfo = {
    name: 'ธนาคารไทยพาณิชย์ จำกัด (มหาชน)',
    branch: 'สาขาเซ็นทรัลพลาซ่า แกรนด์ พระราม 9',
    accountNumber: '0662276102',
    accountName: 'น.ส.ธัญญพัฒน์ พงษ์ประดิษฐ์'
   };