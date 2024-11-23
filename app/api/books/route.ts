// app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { mkdir } from 'fs/promises'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // ตรวจสอบข้อมูลที่จำเป็น
    const title = formData.get('title')
    const author = formData.get('author')
    const description = formData.get('description')
    const categoryId = formData.get('categoryId')
    const coverImage = formData.get('coverImage') as File | null
    const pdfFile = formData.get('pdfFile') as File | null

    if (!title || !author || !description || !categoryId || !coverImage || !pdfFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // สร้างโฟลเดอร์ถ้ายังไม่มี
    const coverDir = path.join(process.cwd(), 'public/ebook/ebookCover')
    const pdfDir = path.join(process.cwd(), 'public/ebook/ebookPdf')
    
    await mkdir(coverDir, { recursive: true })
    await mkdir(pdfDir, { recursive: true })

    // จัดการไฟล์
    const coverFileName = `${Date.now()}-${coverImage.name.replace(/\s+/g, '-')}`
    const pdfFileName = `${Date.now()}-${pdfFile.name.replace(/\s+/g, '-')}`
    
    // บันทึกไฟล์
    await writeFile(
      path.join(coverDir, coverFileName),
      Buffer.from(await coverImage.arrayBuffer())
    )
    
    await writeFile(
      path.join(pdfDir, pdfFileName),
      Buffer.from(await pdfFile.arrayBuffer())
    )
    
    // สร้างข้อมูลหนังสือ
    const book = await prisma.book.create({
      data: {
        title: title as string,
        author: author as string,
        description: description as string,
        coverImage: `/ebook/ebookCover/${coverFileName}`,
        pdfFile: `/ebook/ebookPdf/${pdfFileName}`,
        categoryId: categoryId as string
      }
    })

    return NextResponse.json(book)
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: { category: true }
    })
    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}