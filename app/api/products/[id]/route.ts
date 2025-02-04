// app/api/products/[id]/route.ts
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import prisma from '@/app/lib/db';
import { type Product, type ProductImage } from '@/app/types';
import { ProductStatus } from '@prisma/client';

async function saveProductImage(image: File): Promise<string> {
 const bytes = await image.arrayBuffer();
 const buffer = Buffer.from(bytes);

 const timestamp = new Date().getTime();
 const fileExtension = path.extname(image.name) || '.jpg';
 const fileName = `${timestamp}${fileExtension}`;
 
 const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
 await mkdir(uploadDir, { recursive: true });
 
 const filePath = path.join(uploadDir, fileName);
 await writeFile(filePath, buffer);
 
 return `/uploads/products/${fileName}`;
}

async function deleteProductImage(imagePath: string) {
 const fullPath = path.join(process.cwd(), 'public', imagePath);
 await unlink(fullPath).catch(err => 
   console.error('Failed to delete product image:', err)
 );
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
 ) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { 
        category: true,
        images: {
          orderBy: {
            sortOrder: 'asc'
          }
        },
        sizes: {
          include: {
            size: true
          },
          orderBy: {
            size: {
              name: 'asc' 
            }
          }
        }
      }
    });
 
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }
 
    return Response.json({
      ...product,
      price: Number(product.price)
    });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
 }
 
 export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
 ) {
  try {
    const formData = await request.formData();
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: { images: true, sizes: true }
    });
 
    if (!existingProduct) {
      return Response.json({ error: 'Product not found' }, { status: 404 }); 
    }
 
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const price = formData.get('price') ? Number(formData.get('price')) : null;
    const status = formData.get('status')?.toString();
    const sizes = JSON.parse(formData.get('sizes') as string);
    const newImages = formData.getAll('images') as File[];
 
    if (!name || !description || !price || !sizes.length) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
 
    // Update sizes
    await prisma.productSize.deleteMany({
      where: { productId: params.id }
    });
 
    await prisma.$transaction(
      sizes.map((size: {sizeId: string, stock: number}) => 
        prisma.productSize.create({
          data: {
            productId: params.id,
            sizeId: size.sizeId,
            stock: size.stock
          }
        })
      )
    );
 
    // Handle images
    const existingImagesJson = formData.get('existingImages')?.toString();
    const remainingImages: ProductImage[] = existingImagesJson ? JSON.parse(existingImagesJson) : [];
    
    const imagesToDelete = existingProduct.images.filter(
      image => !remainingImages.find(img => img.id === image.id)
    );
 
    for (const image of imagesToDelete) {
      await deleteProductImage(image.url);
      await prisma.productImage.delete({
        where: { id: image.id }
      });
    }
 
    if (newImages.length > 0) {
      await Promise.all(
        newImages.map(async (image, index) => {
          const url = await saveProductImage(image);
          return prisma.productImage.create({
            data: {
              url,
              alt: `${name} image ${remainingImages.length + index + 1}`,
              isCover: remainingImages.length === 0 && index === 0,
              sortOrder: remainingImages.length + index,
              productId: params.id
            }
          });
        })
      );
    }
 
    const totalStock = sizes.reduce((sum: number, size: {stock: number}) => sum + size.stock, 0);
 
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        stock: totalStock,
        status: formData.get('status') as ProductStatus || existingProduct.status,
        categoryId: existingProduct.categoryId
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        category: true,
        sizes: {
          include: {
            size: true
          }
        }
      }
    });
 
    revalidatePath('/dashboard/products');
    revalidatePath(`/dashboard/products/${params.id}`);
    revalidatePath('/products');
 
    return Response.json({
      ...updatedProduct,
      price: Number(updatedProduct.price)
    });
 
  } catch (error) {
    console.error('Update error:', error);
    return Response.json({ 
      error: 'Failed to update product'
    }, { status: 500 });
  }
 }

 export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { 
        images: true,
        sizes: true,
        orderItems: true,
        cartItems: true
      }
    });

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      // 1. ลบ CartItems ก่อน เพราะมี composite foreign key ไปยัง Product และ ProductSize
      await tx.cartItem.deleteMany({
        where: { productId: params.id }
      });

      // 2. ลบ OrderItems
      await tx.orderItem.deleteMany({
        where: { productId: params.id }
      });

      // 3. ลบ ProductSizes
      await tx.productSize.deleteMany({
        where: { productId: params.id }
      });

      // 4. ลบ ProductImages
      await tx.productImage.deleteMany({
        where: { productId: params.id }
      });

      // 5. สุดท้ายค่อยลบ Product
      await tx.product.delete({
        where: { id: params.id }
      });
    });

    // ลบไฟล์รูปภาพ
    for (const image of product.images) {
      try {
        await deleteProductImage(image.url);
      } catch (err) {
        console.error('Failed to delete product image:', err);
      }
    }

    revalidatePath('/dashboard/products');
    revalidatePath('/products');

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Delete product error:', error);
    return Response.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}