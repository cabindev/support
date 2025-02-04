// app/index.ts
import { 
  type Product as PrismaProduct, 
  type ProductImage as PrismaProductImage, 
  type StoreCategory as PrismaStoreCategory, 
  type Size as PrismaSize,
  type ProductSize as PrismaProductSize,
  type Order as PrismaOrder,
  type OrderItem as PrismaOrderItem,
  type PaymentSlip as PrismaPaymentSlip,
  type ShippingAddress as PrismaShippingAddress, 
  type BankAccount as PrismaBankAccount,
  OrderStatus
} from '@prisma/client';
 
export enum ProductStatus {
  NORMAL = 'NORMAL',
  PREORDER = 'PREORDER',
  NEW = 'NEW'
}

 // Shop Models Types
 export type Size = {
  id: string;
  name: string;
  description: string | null;
  productSizes: ProductSize[];
  createdAt: Date;
  updatedAt: Date;
 }
 
 export type ProductSize = {
  id: string;
  productId: string;
  sizeId: string; 
  size: Size;
  stock: number;
  preorders: number;
  createdAt: Date;
  updatedAt: Date;
 }
 
 export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: ProductStatus;
  categoryId: string;
  category: StoreCategory;
  images: ProductImage[];
  sizes: ProductSize[];
  createdAt: Date;
  updatedAt: Date;
 }
 
 export type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  isCover: boolean;
  sortOrder: number;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
 }
 
 export type StoreCategory = {
  id: string;
  name: string;
  description: string | null;
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;
 }
 
 // Order Types
 export type Order = {
  id: string;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingInfo: ShippingAddress;
  paymentSlip?: PaymentSlip;
  createdAt: Date;
  updatedAt: Date;
 }
 
 export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
 }
 
 export type ShippingAddress = {
  id: string;
  orderId: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  createdAt: Date;
  updatedAt: Date;
 }
 
 export type PaymentSlip = {
  id: string;
  orderId: string;
  originalUrl: string;
  compressedUrl: string;
  verified: boolean;
  verifiedAt?: Date;
  verifiedBy?: number;
  verifier?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
 }
 
 export type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  promptpay: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
 }
 
 // Region Types
 export type RegionData = {
  district: string;
  amphoe: string;
  province: string;
  zipcode: number;
  district_code: number;
  amphoe_code: number;
  province_code: number;
  type: string;
 }
 
 // Extended Types with Relations
 export interface ProductWithRelations extends PrismaProduct {
  category: PrismaStoreCategory;
  images: PrismaProductImage[];
  sizes: (PrismaProductSize & {
    size: PrismaSize;
  })[];
  _count: {
    orderItems: number;
  };
 }
 
 export interface OrderWithRelations extends PrismaOrder {
  items: (PrismaOrderItem & {
    product: ProductWithRelations;
  })[];
  shippingInfo: PrismaShippingAddress;
  paymentSlip?: PrismaPaymentSlip;
 }
 
 export interface SerializedProduct extends Product {
  orderCount?: number;
  totalStock?: number;
  stockStatus?: {
    label: string;
    className: string;
  };
  shippingFee?: number;
  estimatedDelivery?: string;
 }
 // app/types/checkout.ts
export interface BankInfo {
  name: string;
  branch: string;
  accountNumber: string;
  accountName: string;
  promptpay: string;
 }
 
 export interface ShippingFormData {
  firstName: string;
  lastName: string;
  address: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  phone: string;
  email: string;
 }
 
 export interface PaymentFormData {
  paymentMethod: string;
  slipImage?: File;
 }
 
 
 export interface CheckoutFormData extends ShippingFormData, PaymentFormData {}
 
 // Utility Functions
 export function serializeProduct(product: ProductWithRelations): SerializedProduct {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    stock: product.stock,
    status: product.status as ProductStatus,
    categoryId: product.categoryId,
    category: {
      id: product.category.id,
      name: product.category.name,
      description: product.category.description,
      createdAt: product.category.createdAt,
      updatedAt: product.category.updatedAt
    },
    images: product.images.map(image => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      isCover: image.isCover,
      sortOrder: image.sortOrder,
      productId: image.productId,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt
    })),
    sizes: product.sizes.map(size => ({
      id: size.id,
      productId: size.productId,
      sizeId: size.sizeId,
      stock: size.stock,
      preorders: size.preorders,
      size: {
        id: size.size.id,
        name: size.size.name,
        description: size.size.description,
        productSizes: [],
        createdAt: size.size.createdAt,
        updatedAt: size.size.updatedAt
      },
      createdAt: size.createdAt,
      updatedAt: size.updatedAt
    })),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    orderCount: product._count.orderItems,
    stockStatus: calculateStockStatus(product.stock),
    shippingFee: 40,
    estimatedDelivery: '3-5 วันทำการ'
  };
 }
 
 export function calculateStockStatus(stock: number) {
  if (stock === 0) {
    return {
      label: 'Out of Stock',
      className: 'text-red-600'
    };
  }
  if (stock <= 5) {
    return {
      label: 'Low Stock',
      className: 'text-orange-600'
    };
  }
  return {
    label: 'In Stock',
    className: 'text-green-600'
  };
 }