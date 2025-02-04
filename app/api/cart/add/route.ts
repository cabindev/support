// app/api/cart/add/route.ts
import prisma from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productId = formData.get('productId') as string;
    const sizeId = formData.get('sizeId') as string;
    const quantity = Number(formData.get('quantity'));
    const price = Number(formData.get('price'));

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!productId || !sizeId || !quantity || !price) {
      console.log('Missing data:', { productId, sizeId, quantity, price });
      return Response.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    // ตรวจสอบสต็อก
    const productSize = await prisma.productSize.findUnique({
      where: {
        productId_sizeId: {
          productId,
          sizeId
        }
      }
    });

    if (!productSize || productSize.stock < quantity) {
      return Response.json({ error: 'สินค้าในสต็อกไม่เพียงพอ' }, { status: 400 });
    }

    // สร้าง order และ order item
    const order = await prisma.order.create({
      data: {
        userId: 1, // TODO: Get from session
        totalAmount: price * quantity,
        status: 'PENDING',
        shippingInfo: {},
        items: {
          create: {
            productId,
            quantity,
            price
          }
        }
      },
      include: {
        items: true
      }
    });

    return Response.json(order);

  } catch (error) {
    console.error('Add to cart error:', error);
    return Response.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}