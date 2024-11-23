// app/ebook/[id]/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { Button, Spin, message } from 'antd'
import dynamic from 'next/dynamic'
import * as pdfjsLib from 'pdfjs-dist'

// Set worker URL
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

// Import FlipBook component
const CustomFlipBook = dynamic(() => import('@/app/components/CustomFlipBook'), {
  ssr: false,
  loading: () => <Spin size="large" />
})

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  pdfFile: string
  category: {
    name: string
  }
}

export default function BookViewer({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null)
  const [pdfPages, setPdfPages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingPdf, setLoadingPdf] = useState(false)

  useEffect(() => {
    fetchBook()
  }, [params.id])

  const fetchBook = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/books/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch book')
      
      const data = await res.json()
      setBook(data)

      if (data.pdfFile) {
        await loadPdf(data.pdfFile)
      } else {
        throw new Error('No PDF file found')
      }
      
    } catch (error) {
      console.error('Error:', error)
      message.error('ไม่สามารถโหลดหนังสือได้')
    } finally {
      setLoading(false)
    }
  }

  const loadPdf = async (pdfUrl: string) => {
    setLoadingPdf(true)
    try {
      const fullUrl = pdfUrl.startsWith('http') 
        ? pdfUrl 
        : `${window.location.origin}${pdfUrl}`

      console.log('Loading PDF from:', fullUrl)

      const loadingTask = pdfjsLib.getDocument(fullUrl)
      const pdf = await loadingTask.promise
      
      console.log('PDF loaded, pages:', pdf.numPages)

      const pages = []
      
      // Add cover page
      if (book?.coverImage) {
        pages.push(book.coverImage)
      }
      
      // Convert PDF pages to images
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1.5 })
        
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) continue

        canvas.height = viewport.height
        canvas.width = viewport.width
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise
        
        pages.push(canvas.toDataURL())
        console.log(`Page ${i} converted`)
      }
      
      setPdfPages(pages)

    } catch (error) {
      console.error('Error loading PDF:', error)
      message.error('ไม่สามารถโหลด PDF ได้')
    } finally {
      setLoadingPdf(false)
    }
  }

  if (loading || loadingPdf) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip={loadingPdf ? "กำลังโหลด PDF..." : "กำลังโหลด..."} />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl text-red-600 mb-4">ไม่พบหนังสือ</h2>
          <Button onClick={() => window.history.back()}>กลับ</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        {book && (
          <div className="flex items-center gap-6">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-48 h-auto rounded-lg shadow-lg"
            />
            <div>
              <h1 className="text-2xl font-bold">{book.title}</h1>
              <p className="text-gray-600">โดย {book.author}</p>
              <p className="text-gray-500">หมวดหมู่: {book.category?.name}</p>
            </div>
          </div>
        )}
      </div>

      {loadingPdf ? (
        <div className="text-center py-8">
          <Spin size="large" tip="กำลังโหลด PDF..." />
        </div>
      ) : pdfPages.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <CustomFlipBook 
            pages={pdfPages}
            width={800}
            height={600}
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-red-600">ไม่สามารถโหลด PDF ได้</p>
          <Button 
            onClick={() => book && loadPdf(book.pdfFile)} 
            className="mt-4"
          >
            ลองโหลดใหม่อีกครั้ง
          </Button>
        </div>
      )}
    </div>
  )
}