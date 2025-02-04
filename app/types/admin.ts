// app/types/admin.ts
export interface ProductImage {
    id: string;
    url: string;
    alt?: string;
    isCover: boolean;
  }
  
  export interface Size {
    id: string;
    sizeId: string;
    size: {
      id: string;
      name: string;
    };
    stock: number;
  }
  
  export interface AdminProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    status: ProductStatus;
    categoryId: string;
    sizes: Size[];
    images: ProductImage[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export enum ProductStatus {
    NORMAL = 'NORMAL',
    PREORDER = 'PREORDER',
    NEW = 'NEW'
  }
  
  export interface SizeStock {
    sizeId: string;
    stock: number;
  }