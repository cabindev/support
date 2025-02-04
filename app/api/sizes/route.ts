// app/api/sizes/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET() {
  try {
    const sizes = await prisma.size.findMany({
      orderBy: { name: 'asc' }
    });
    return Response.json(sizes);
  } catch (error) {
    console.error('Fetch sizes error:', error);
    return Response.json({ error: 'Failed to fetch sizes' }, { status: 500 });
  }
}


export async function POST(request: Request) {
 try {
   const { name, description } = await request.json();
   
   if (!name?.trim()) {
     return Response.json({ error: 'กรุณากรอกชื่อขนาด' }, { status: 400 });
   }

   const size = await prisma.size.create({
     data: { 
       name: name.trim(),
       description: description?.trim() || null
     }
   });

   return Response.json(size, { status: 201 });
 } catch (error: any) {
   if (error.code === 'P2002') {
     return Response.json({ error: 'มีขนาดนี้อยู่แล้ว' }, { status: 400 });
   }
   console.error('Create size error:', error);
   return Response.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
 }
}