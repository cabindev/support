// app/ebook/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { Card, Row, Col, Button } from 'antd'
import Link from 'next/link'

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  description: string
  category: {
    name: string
  }
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const res = await fetch('/api/books')
    const data = await res.json()
    setBooks(data)
  }

  return (
    <div className="container mx-auto p-4">
      <Row gutter={[16, 16]}>
        {books.map((book) => (
          <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
            <Card
              hoverable
              cover={
                <div className="h-[300px] relative">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              }
            >
              <Card.Meta
                title={book.title}
                description={book.author}
              />
              <div className="mt-4">
                {/* เพิ่มปุ่มเปิดอ่าน */}
                <Link href={`/ebook/${book.id}`}>
                  <Button type="primary" block>
                    เปิดอ่าน
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}