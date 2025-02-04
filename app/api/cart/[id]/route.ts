// app/api/cart/[id]/route.ts
import prisma from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
   ) {
    try {
      const { quantity } = await request.json();
      
      // หา cart item ที่จะอัพเดท พร้อม include sizeId
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: params.id },
        include: {
          product: true,
          productSize: {
            select: {
              sizeId: true
            }
          }
        }
      });

      if (!cartItem) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        );
      }

      // ตรวจสอบและอัพเดทสต็อก
      const productSize = await prisma.productSize.findUnique({
        where: {
          productId_sizeId: {
            productId: cartItem.productId,
            sizeId: cartItem.productSize.sizeId // ใช้ sizeId จาก productSize relation
          }
        }
      });

      if (!productSize || productSize.stock < quantity) {
        return NextResponse.json(
          { error: 'สินค้าในสต็อกไม่เพียงพอ' },
          { status: 400 }
        );
      }

      // คำนวณการเปลี่ยนแปลงสต็อก
      const stockDiff = cartItem.quantity - quantity;
      
      // อัพเดทสต็อก
      await prisma.productSize.update({
        where: {
          productId_sizeId: {
            productId: cartItem.productId,
            sizeId: cartItem.productSize.sizeId
          }
        },
        data: {
          stock: {
            increment: stockDiff
          }
        }
      });

      // อัพเดท cart item
      const updatedItem = await prisma.cartItem.update({
        where: { id: params.id },
        data: { quantity }
      });
   
      return NextResponse.json(updatedItem);
    } catch (error) {
      return NextResponse.json(
        { error: 'Error updating item' },
        { status: 500 }
      );
    }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // include productSize เพื่อให้ได้ sizeId
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.id },
      include: {
        product: true,
        productSize: {
          select: {
            sizeId: true
          }
        }
      }
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // คืนสต็อก
    await prisma.productSize.update({
      where: {
        productId_sizeId: {
          productId: cartItem.productId,
          sizeId: cartItem.productSize.sizeId
        }
      },
      data: {
        stock: {
          increment: cartItem.quantity
        }
      }
    });

    // ลบ cart item
    await prisma.cartItem.delete({
      where: { id: params.id }
    });

    // ตรวจสอบว่าเหลือสินค้าในตะกร้าหรือไม่
    const remainingItems = await prisma.cartItem.count({
      where: { cartId: cartItem.cartId }
    });

    // ถ้าไม่มีสินค้าเหลือในตะกร้า ให้ลบตะกร้าทิ้ง
    if (remainingItems === 0) {
      await prisma.cart.delete({
        where: { id: cartItem.cartId }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete cart item error:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}