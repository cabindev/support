// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET() {
 try {
   const cart = await prisma.cart.findFirst({
     orderBy: { createdAt: 'desc' },
     include: {
       items: {
         include: {
           product: {
             include: {
               images: true
             }
           },
           productSize: {
             include: {
               size: true
             }
           }
         }
       }
     }
   });

   if (!cart) {
     return NextResponse.json([]);
   }

   const cartItems = cart.items.map(item => ({
     id: item.id,
     quantity: item.quantity,
     product: {
       id: item.product.id,
       name: item.product.name,
       price: Number(item.price),
       image: item.product.images[0]?.url,
       size: item.productSize.size
     }
   }));

   return NextResponse.json(cartItems);

 } catch (error) {
   console.error('Fetch cart error:', error);
   return NextResponse.json(
     { error: 'Failed to fetch cart' },
     { status: 500 }
   );
 }
}

export async function POST(request: Request) {
 try {
   const { productId, sizeId, quantity, price } = await request.json();

   // ตรวจสอบและอัพเดทสต็อก
   const productSize = await prisma.productSize.findUnique({
     where: {
       productId_sizeId: {
         productId,
         sizeId
       }
     }
   });

   if (!productSize || productSize.stock < quantity) {
     return NextResponse.json(
       { error: 'สินค้าในสต็อกไม่เพียงพอ' },
       { status: 400 }
     );
   }

   // อัพเดทสต็อก
   await prisma.productSize.update({
     where: {
       productId_sizeId: {
         productId,
         sizeId
       }
     },
     data: {
       stock: productSize.stock - quantity
     }
   });

   // หาหรือสร้างตะกร้า
   let cart = await prisma.cart.findFirst({
     orderBy: { createdAt: 'desc' }
   });

   if (!cart) {
     cart = await prisma.cart.create({
       data: {}
     });
   }

   // เช็คว่ามีสินค้าชิ้นนี้ในตะกร้าแล้วหรือไม่
   const existingItem = await prisma.cartItem.findFirst({
     where: {
       cartId: cart.id,
       productId,
       sizeId
     }
   });

   let cartItem;

   if (existingItem) {
     // ถ้ามีสินค้าอยู่แล้ว ให้อัพเดทจำนวน
     cartItem = await prisma.cartItem.update({
       where: { id: existingItem.id },
       data: {
         quantity: existingItem.quantity + quantity
       },
       include: {
         product: {
           include: {
             images: true
           }
         },
         productSize: {
           include: {
             size: true
           }
         }
       }
     });
   } else {
     // ถ้ายังไม่มี ให้สร้างใหม่
     cartItem = await prisma.cartItem.create({
       data: {
         cartId: cart.id,
         productId,
         sizeId,
         quantity,
         price
       },
       include: {
         product: {
           include: {
             images: true
           }
         },
         productSize: {
           include: {
             size: true
           }
         }
       }
     });
   }

   return NextResponse.json({
     id: cartItem.id,
     quantity: cartItem.quantity,
     product: {
       id: cartItem.product.id,
       name: cartItem.product.name, 
       price: Number(cartItem.price),
       image: cartItem.product.images[0]?.url,
       size: cartItem.productSize.size
     }
   });

 } catch (error) {
   console.error('Add to cart error:', error);
   return NextResponse.json(
     { error: 'Failed to add item to cart' },
     { status: 500 }
   );
 }
}