// app/api/payments/verify/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, verifiedBy } = await request.json();

    const result = await prisma.$transaction(async (tx) => {
      // อัพเดทสถานะสลิป
      const slip = await tx.paymentSlip.update({
        where: { id: params.id },
        data: {
          status,
          verified: status === 'APPROVED',
          verifiedAt: new Date(),
          verifiedBy
        }
      });

      // อัพเดทสถานะ order
      await tx.order.update({
        where: { id: slip.orderId },
        data: {
          status: status === 'APPROVED' ? 'VERIFIED' : 'PENDING'
        }
      });

      return slip;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Verify slip error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment slip' },
      { status: 500 }
    );
  }
}