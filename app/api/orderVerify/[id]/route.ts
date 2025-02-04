// app/api/orderVerify/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        shippingInfo: true,
        paymentSlip: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { verified } = await request.json();

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: verified ? 'VERIFIED' : 'PENDING',
        paymentSlip: {
          update: {
            verified,
            verifiedAt: verified ? new Date() : null,
            verifiedBy: verified ? 1 : null // TODO: ใส่ ID ของ admin จริงๆ
          }
        }
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}