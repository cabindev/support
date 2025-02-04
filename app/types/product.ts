// types/product.ts
export enum ProductStatus {
  NORMAL = 'NORMAL',
  PREORDER = 'PREORDER',
  NEW = 'NEW'
}

export interface ProductSize {
  size: {
    id: string;
    name: string;
  };
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  category: {
    id: string;
    name: string;
  };
  images: ProductImage[];
  sizes: ProductSize[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    size: {
      id: string;
      name: string;
    };
  };
}