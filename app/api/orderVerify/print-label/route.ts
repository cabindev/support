// app/api/orderVerify/print-label/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['PAID', 'VERIFIED']
        }
      },
      select: {
        id: true,
        shippingInfo: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const shippingLabels = orders
      .filter(order => order.shippingInfo) // กรองเฉพาะ orders ที่มีข้อมูลจัดส่ง
      .map(order => ({
        id: order.id,
        ...order.shippingInfo
      }));

    return NextResponse.json(shippingLabels);
  } catch (error) {
    console.error('Error fetching shipping labels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipping labels' },
      { status: 500 }
    );
  }
}