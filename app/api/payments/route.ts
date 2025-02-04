// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const orderId = formData.get('orderId') as string;
    const slipFile = formData.get('slip') as File;

    // Validate input
    if (!orderId || !slipFile) {
      return NextResponse.json(
        { error: 'กรุณาแนบสลิปและระบุเลขคำสั่งซื้อ' }, 
        { status: 400 }
      );
    }

    // Check order and existing slip
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { paymentSlip: true }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'ไม่พบคำสั่งซื้อ' }, 
        { status: 404 }
      );
    }

    if (order.paymentSlip) {
      return NextResponse.json(
        { error: 'มีการอัพโหลดสลิปแล้ว' }, 
        { status: 400 }
      );
    }

    // Create upload directories
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const uploadPath = path.join('public', 'uploads', 'slips', year.toString(), month);
    await mkdir(uploadPath, { recursive: true });

    // Save file
    const filename = `${orderId}-${Date.now()}.jpg`;
    const buffer = Buffer.from(await slipFile.arrayBuffer());
    await writeFile(path.join(uploadPath, filename), buffer);

    // Update database in transaction
    const result = await prisma.$transaction(async (tx) => {
      const slip = await tx.paymentSlip.create({
        data: {
          orderId,
          originalUrl: `/uploads/slips/${year}/${month}/${filename}`,
          status: 'PENDING',
          verified: false,
          uploadedAt: new Date()
        }
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: 'PAID' }
      });

      return slip;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพโหลดสลิป' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const slips = await prisma.paymentSlip.findMany({
      include: {
        order: {
          include: {
            shippingInfo: true
          }
        },
        verifier: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(slips);
  } catch (error) {
    console.error('Fetch slips error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment slips' },
      { status: 500 }
    );
  }
}