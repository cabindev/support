// app/api/products/route.ts
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';
import prisma from '@/app/lib/db';
import { ProductStatus } from '@/app/types';

async function saveFile(file: File, filename: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // สร้างโฟลเดอร์ถ้ายังไม่มี
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  await mkdir(uploadDir, { recursive: true });

  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  return `/uploads/products/${filename}`;
}


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const categoryId = formData.get('categoryId') as string;
  
    const status = ProductStatus[formData.get('status') as keyof typeof ProductStatus] || ProductStatus.NORMAL;

    const images = formData.getAll('images') as File[];
    const sizes = JSON.parse(formData.get('sizes') as string);

    if (!name || !description || !price || !categoryId || !sizes.length) {
      return Response.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Calculate total stock from sizes
    const totalStock = sizes.reduce((sum: number, size: { stock: number }) => sum + size.stock, 0);

    // Create product with sizes and calculated total stock
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock: totalStock,
        status,
        categoryId,
        sizes: {
          create: sizes.map((size: {sizeId: string, stock: number}) => ({
            size: {
              connect: { id: size.sizeId }
            },
            stock: size.stock
          }))
        }
      }
    });

    // Handle images
    if (images.length > 0) {
      const imagePromises = images.map(async (image, index) => {
        const filename = `${Date.now()}-${image.name}`;
        const url = await saveFile(image, filename);
        
        return prisma.productImage.create({
          data: {
            url,
            alt: `${product.name} image ${index + 1}`,
            isCover: index === 0,
            sortOrder: index,
            productId: product.id
          }
        });
      });

      await Promise.all(imagePromises);
    }

    const productWithDetails = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        category: true,
        sizes: {
          include: { size: true }
        }
      }
    });

    return Response.json({
      ...productWithDetails,
      price: Number(productWithDetails?.price)
    }, { status: 201 });

  } catch (error) {
    console.error('Create product error:', error);
    return Response.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างสินค้า' },
      { status: 500 }
    );
  }
}