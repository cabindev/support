// app/api/payments/upload-slip/route.ts
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';
import prisma from '@/app/lib/db';

async function saveSlip(file: File, orderId: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // สร้างโฟลเดอร์ถ้ายังไม่มี
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'slips');
  await mkdir(uploadDir, { recursive: true });

  const timestamp = Date.now();
  const filename = `${orderId}-${timestamp}-${file.name}`;
  
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);

  const url = `/uploads/slips/${filename}`;
  return url;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const slip = formData.get('slip') as File;
    const orderId = formData.get('orderId') as string;

    if (!slip || !orderId) {
      return Response.json(
        { error: 'กรุณาแนบสลิปและระบุเลขคำสั่งซื้อ' },
        { status: 400 }
      );
    }

    // ตรวจสอบ order ก่อน
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { paymentSlip: true }
    });

    if (!order) {
      return Response.json(
        { error: 'ไม่พบคำสั่งซื้อ' },
        { status: 404 }
      );
    }

    if (order.paymentSlip) {
      return Response.json(
        { error: 'มีการอัพโหลดสลิปแล้ว' },
        { status: 400 }
      );
    }

    // Save slip image
    const url = await saveSlip(slip, orderId);

    // ใช้ transaction เพื่อความปลอดภัย
    const result = await prisma.$transaction(async (prisma) => {
      const paymentSlip = await prisma.paymentSlip.create({
        data: {
          orderId,
          originalUrl: url,
          verified: false
        }
      });

      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' }
      });

      return paymentSlip;
    });

    return Response.json(result, { status: 201 });

  } catch (error) {
    console.error('Upload slip error:', error);
    return Response.json(
      { error: 'เกิดข้อผิดพลาดในการอัพโหลดสลิป' },
      { status: 500 }
    );
  }
}