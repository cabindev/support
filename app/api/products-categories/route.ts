// app/api/products-categories/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.storeCategory.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return Response.json(categories);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch product categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();
    
    const category = await prisma.storeCategory.create({
      data: {
        name,
        description
      }
    });

    return Response.json(category, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create product category' }, { status: 500 });
  }
}