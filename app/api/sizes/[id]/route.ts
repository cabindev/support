// app/api/sizes/[id]/route.ts
import prisma from '@/app/lib/db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
 try {
   const size = await prisma.size.findUnique({
     where: { id: params.id },
     include: {
       _count: { select: { productSizes: true } }
     }
   });

   if (!size) {
     return NextResponse.json({ error: 'Size not found' }, { status: 404 });
   }

   return NextResponse.json(size);
 } catch (error) {
   return NextResponse.json({ error: 'Failed to fetch size' }, { status: 500 });
 }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
 try {
   const body = await request.json();
   
   if (!body.name?.trim()) {
     return NextResponse.json({ error: 'Name is required' }, { status: 400 });
   }

   const size = await prisma.size.update({
     where: { id: params.id },
     data: {
       name: body.name.trim(),
       description: body.description?.trim() || null
     }
   });

   revalidatePath('/admin/products/sizes');
   return NextResponse.json(size);
 } catch (error: any) {
   if (error.code === 'P2002') {
     return NextResponse.json({ error: 'Size name already exists' }, { status: 400 });
   }
   return NextResponse.json({ error: 'Failed to update size' }, { status: 500 });
 }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
 try {
   const size = await prisma.size.findUnique({
     where: { id: params.id },
     include: {
       _count: { select: { productSizes: true } }
     }
   });

   if (!size) {
     return NextResponse.json({ error: 'Size not found' }, { status: 404 });
   }

   if (size._count.productSizes > 0) {
     return NextResponse.json({ 
       error: 'Cannot delete size that is being used by products' 
     }, { status: 400 });
   }

   await prisma.size.delete({
     where: { id: params.id }
   });

   revalidatePath('/admin/products/sizes');
   return NextResponse.json({ success: true }, { status: 200 });

 } catch (error) {
   return NextResponse.json({ error: 'Failed to delete size' }, { status: 500 });
 }
}