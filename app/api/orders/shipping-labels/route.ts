// app/api/orders/shipping-labels/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['PAID', 'VERIFIED']
        },
        shippingInfo: {
          isNot: null
        }
      },
      select: {
        id: true,
        shippingInfo: {
          select: {
            name: true,
            phone: true,
            address: true,
            district: true,
            amphoe: true,
            province: true,
            zipcode: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data format
    const shippingLabels = orders.map(order => ({
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