// app/api/books/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
import { unlink } from 'fs/promises'
import path from 'path'
import { writeFile } from 'fs/promises';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: { category: true }
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    console.log('PDF File Path:', book.pdfFile) // เพื่อตรวจสอบค่า

    // ตรวจสอบและแก้ไข path ให้ถูกต้อง
    const modifiedBook = {
      ...book,
      coverImage: book.coverImage.startsWith('/') ? book.coverImage : `/${book.coverImage}`,
      pdfFile: book.pdfFile.startsWith('/') ? book.pdfFile : `/${book.pdfFile}`
    }

    return NextResponse.json(modifiedBook)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    const updateData: any = {}

    // ดึงข้อมูลเดิม
    const oldBook = await prisma.book.findUnique({
      where: { id: params.id }
    })
    if (!oldBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    // อัพเดทข้อมูลพื้นฐาน
    const basicFields = ['title', 'author', 'description', 'categoryId']
    basicFields.forEach(field => {
      const value = formData.get(field)
      if (value) updateData[field] = value
    })

    // จัดการไฟล์รูปปก
    const coverImage = formData.get('coverImage') as File
    if (coverImage) {
      const filename = Date.now() + '-' + coverImage.name.replace(/\s+/g, '-')
      await writeFile(
        path.join(process.cwd(), 'public/ebook/ebookCover', filename),
        Buffer.from(await coverImage.arrayBuffer())
      )
      updateData.coverImage = `/ebook/ebookCover/${filename}`
      
      // ลบไฟล์เก่า
      const oldPath = path.join(process.cwd(), 'public', oldBook.coverImage)
      await unlink(oldPath).catch(() => {})
    }

    // จัดการไฟล์ PDF
    const pdfFile = formData.get('pdfFile') as File
    if (pdfFile) {
      const filename = Date.now() + '-' + pdfFile.name.replace(/\s+/g, '-')
      await writeFile(
        path.join(process.cwd(), 'public/ebook/ebookPdf', filename),
        Buffer.from(await pdfFile.arrayBuffer())
      )
      updateData.pdfFile = `/ebook/ebookPdf/${filename}`
      
      // ลบไฟล์เก่า
      const oldPath = path.join(process.cwd(), 'public', oldBook.pdfFile)
      await unlink(oldPath).catch(() => {})
    }

    // อัพเดทข้อมูลในฐานข้อมูล
    const book = await prisma.book.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(book)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id }
    })
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    // ลบไฟล์
    const coverPath = path.join(process.cwd(), 'public', book.coverImage)
    const pdfPath = path.join(process.cwd(), 'public', book.pdfFile)
    await unlink(coverPath).catch(() => {})
    await unlink(pdfPath).catch(() => {})

    // ลบข้อมูลจากฐานข้อมูล
    await prisma.book.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}