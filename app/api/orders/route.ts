// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { Prisma, PaymentMethod } from '@prisma/client';

// Types
interface OrderItem {
 productId: string;
 quantity: number; 
 price: number | Prisma.Decimal;
}

interface ShippingInfo {
 name: string;
 phone: string;
 email: string;
 address: string;
 district: string;
 amphoe: string;
 province: string;
 zipcode: string;
}

interface OrderInput {
 totalAmount: number;
 items: OrderItem[];
 shippingInfo: ShippingInfo;
 paymentMethod: string;
}

export async function POST(request: Request) {
 try {
   const data = await request.json() as OrderInput;
   console.log('Received data:', data);

   const { totalAmount, items, shippingInfo, paymentMethod } = data;

   // แปลงค่า paymentMethod เป็น enum
   const paymentMethodEnum: PaymentMethod = 
     paymentMethod === 'promptpay' ? PaymentMethod.PROMPTPAY : PaymentMethod.BANK_TRANSFER;

   // ใช้ transaction เพื่อให้การทำงานทั้งหมดสำเร็จพร้อมกัน
   const order = await prisma.$transaction(async (tx) => {
     // สร้างคำสั่งซื้อ
     const newOrder = await tx.order.create({
       data: {
         totalAmount: new Prisma.Decimal(totalAmount),
         paymentMethod: paymentMethodEnum,
         shippingInfo: {
           create: {
             name: shippingInfo.name,
             phone: shippingInfo.phone,
             email: shippingInfo.email,
             address: shippingInfo.address,
             district: shippingInfo.district,
             amphoe: shippingInfo.amphoe,
             province: shippingInfo.province,
             zipcode: shippingInfo.zipcode
           }
         },
         items: {
           create: items.map((item: OrderItem) => ({
             productId: item.productId,
             quantity: item.quantity,
             price: new Prisma.Decimal(item.price)
           }))
         }
       },
       include: {
         items: true,
         shippingInfo: true
       }
     });

     // อัพเดทจำนวนสินค้าคงเหลือ
     for (const item of items) {
       await tx.product.update({
         where: { id: item.productId },
         data: {
           stock: {
             decrement: item.quantity // ลดจำนวนสินค้าตามที่สั่งซื้อ
           }
         }
       });
     }

     return newOrder;
   });

   // ล้างตะกร้าสินค้า
   const cart = await prisma.cart.findFirst({
     orderBy: { createdAt: 'desc' }
   });

   if (cart) {
     await prisma.cartItem.deleteMany({
       where: { cartId: cart.id }
     });
   }

   return NextResponse.json({
     success: true,
     orderId: order.id
   });

 } catch (error) {
   console.error('Create order error:', error);
   return NextResponse.json(
     { error: 'Failed to create order' },
     { status: 500 }
   );
 }
}