// app/api/payments/[orderId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const slip = await prisma.paymentSlip.findUnique({
      where: { orderId: params.orderId },
      include: {
        verifier: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!slip) {
      return NextResponse.json(
        { error: 'Payment slip not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(slip);
  } catch (error) {
    console.error('Get slip error:', error);
    return NextResponse.json(
      { error: 'Failed to get payment slip' },
      { status: 500 }
    );
  }
}